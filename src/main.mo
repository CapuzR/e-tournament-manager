import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Buffer "mo:base/Buffer";
import Debug "mo:base/Debug";
import Error "mo:base/Error";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import List "mo:base/List";
import None "mo:base/None";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Trie "mo:base/Trie";
import TrieMap "mo:base/TrieMap";
import Source "mo:uuid/async/SourceV4";
import UUID "mo:uuid/UUID";

import IT "./initTypes";
import OT "./opsTypes";
import FullRels "./Rels/fullRels";
import Rels "./Rels/Rels";
import ST "./stableTypes";
import U "./utils";
import AID "./utils/Account";
import Hex "./utils/Hex";

import CanIds "../canister-ids";

shared ({ caller = owner }) actor class (
  initOptions : IT.InitArgs,
) = eTournamentManager {

  stable let environment : Text = initOptions.environment;

  stable var admins : [Principal] = initOptions.admins;

  stable var tournaments : Trie.Trie<Text, ST.Tournament> = Trie.empty();

  stable var stTournamentPlayerStats : [(Text, Principal, ST.TournamentPlayerStats)] = [];
  let tournamentPlayerStats = FullRels.Rels<Text, Principal, ST.TournamentPlayerStats>(
    (Text.hash, Principal.hash),
    (Text.equal, Principal.equal),
    stTournamentPlayerStats,
  );

  //This could be replaced with a Trie2D for multiple tournaments at the same time.
  var initPlayersStats : Trie.Trie<Principal, IT.PlayerStats> = Trie.empty();

  public query func getAllTournaments() : async Result.Result<[OT.TournamentSuccess], OT.TournamentError> {

    let tournamentBuff : Buffer.Buffer<OT.TournamentSuccess> = Buffer.Buffer(0);

    for ((id, tournament) in Trie.iter(tournaments)) {

      let tournamentSuccess : OT.TournamentSuccess = {
        id = id;
        name = tournament.name;
        reward = tournament.reward;
        status = tournament.status;
        points = tournament.points;
        description = tournament.description;
        startDate = tournament.startDate;
        endDate = tournament.endDate;
        internalCollections = tournament.internalCollections;
        externalCollections = tournament.externalCollections;
        boostsSetAt = tournament.boostsSetAt;
        boostsSetPer = tournament.boostsSetPer;
        game = tournament.game;
        dynamicExplanation = tournament.dynamicExplanation;
      };
      tournamentBuff.add(tournamentSuccess);
    };

    #ok(Buffer.toArray(tournamentBuff));
  };

  public query ({ caller }) func getTournament(tournamentId : Text) : async Result.Result<OT.TournamentSuccess, OT.TournamentError> {

    if (not U.isAdmin(caller, admins)) {
      return #err(#NotAuthorized);
    };

    _getTournament(tournamentId);
  };

  public shared ({ caller }) func updateTournament(tournamentArgs : OT.TournamentArgs, tournamentId : Text) : async Result.Result<(), OT.TournamentError> {

    if (not U.isAdmin(caller, admins)) {
      return #err(#NotAuthorized);
    };

    let tournamentRes = _getTournament(tournamentId);

    switch (tournamentRes) {
      case (#err(e)) {
        switch (e) {
          case (#NonExistentTournament) {
            #err(#NonExistentTournament);
          };
        };
      };
      case (#ok(tournament)) {

        let updatedTournmanet : ST.Tournament = {
          name = tournamentArgs.name;
          reward = tournamentArgs.reward;
          status = tournamentArgs.status;
          points = tournamentArgs.points;
          description = tournamentArgs.description;
          startDate = tournamentArgs.startDate;
          endDate = tournamentArgs.endDate;
          internalCollections = tournamentArgs.internalCollections;
          externalCollections = tournamentArgs.externalCollections;
          boostsSetAt = tournamentArgs.boostsSetAt;
          boostsSetPer = tournamentArgs.boostsSetPer;
          game = tournamentArgs.game;
          dynamicExplanation = tournamentArgs.dynamicExplanation;
        };

        tournaments := Trie.replace(
          tournaments,
          U.keyText(tournamentId),
          Text.equal,
          ?updatedTournmanet,
        ).0;

        #ok(());
      };
    };
  };

  public shared ({ caller }) func addTournament(tournamentArgs : OT.TournamentArgs) : async Result.Result<(), OT.TournamentError> {

    if (not U.isAdmin(caller, admins)) {
      return #err(#NotAuthorized);
    };

    let g = Source.Source();
    let tournamentId = UUID.toText(await g.new());

    switch (_addTournament(tournamentArgs, tournamentId)) {
      case (#err(e)) {
        #err(e);
      };
      case (#ok) {
        ignore await _initTournament();
        #ok();
      };
    };
  };

  public shared ({ caller }) func deleteTournament(tournamentId : Text) : async Result.Result<(), OT.TournamentError> {

    if (not U.isAdmin(caller, admins)) {
      return #err(#NotAuthorized);
    };

    _deleteTournament(tournamentId);
  };

  public shared ({ caller }) func endTournament(tournamentId : Text) : async Result.Result<(), OT.Error> {

    if (not U.isAdmin(caller, admins)) {
      return #err(#NotAuthorized);
    };

    var fullStatsRes = await _getHotLeaderboard(tournamentId);

    switch (fullStatsRes) {
      case (#ok(fullStats)) {

        for (stats in fullStats.vals()) {
          tournamentPlayerStats.put(stats);
        };

        ignore _changeStatus(tournamentId, #Finished);

        #ok(());
      };
      case (#err(e)) {
        #err(e);
      };
    };
  };

  private func _getHotLeaderboard(tournamentId : Text) : async Result.Result<[(Text, Principal, ST.TournamentPlayerStats)], OT.Error> {
    
    let tournamentRes = _getTournament(tournamentId);
    let tempTournamentPlayerStats : Buffer.Buffer<(Text, Principal, ST.TournamentPlayerStats)> = Buffer.Buffer(1);

    switch (tournamentRes) {
      case (#ok(tournament)) {
        let internalStatsRes = await getInternalStats();
        switch (internalStatsRes) {
          case (#ok(internalStats)) {
            var fullStats : [OT.PlayerStatsSuccess] = [{
              points = {
                internalResults = ?0;
                externalResults = ?0;
              };
              earned = 0;
              lost = 0;
              matchesWon = 0;
              matchesLost = 0;
              principal = Principal.fromText("2vxsx-fae");
            }];

            if (tournament.externalCollections.size() != 0) {
              fullStats := await getFullStats(
                internalStats,
                tournament.points,
                tournament.externalCollections,
              );
            } else {
              fullStats := internalStats;
            };

            for (stats in fullStats.vals()) {

              tempTournamentPlayerStats.add(
                tournamentId,
                stats.principal,
                {
                  points = stats.points;
                  earned = stats.earned;
                  lost = stats.lost;
                  matchesWon = stats.matchesWon;
                  matchesLost = stats.matchesLost;
                },
              );
            };

            #ok(Buffer.toArray(tempTournamentPlayerStats));
          };
          case (#err(e)) {
            #err(e);
          };
        };
      };
      case (#err(e)) {
        #err(e);
      };
    };
  };

  public shared({ caller }) func getLeaderboard(
    tournamentId : Text,
  ) : async Result.Result<{ rewards : Text; leaderboard : [OT.PlayerStatsSuccess] }, OT.TournamentError> {

    let tournamentRes = _getTournament(tournamentId);

    switch (tournamentRes) {
      case (#err(e)) {
        switch (e) {
          case (#NonExistentTournament) {
            #err(#NonExistentTournament);
          };
        };
      };
      case (#ok(tournament)) {

        let tournamentPlayerStatsBuff : Buffer.Buffer<OT.PlayerStatsSuccess> = Buffer.Buffer(1);
        
        switch(tournament.status) {
          case (#OnHold) {
            return #err(#TournamentHasntStarted);
          };
          case (#Canceled) {
            return #err(#TournamentHasBeingCanceled);
          };
          case (#Active) {

            var tournamentPlayerStatsEntries = await _getHotLeaderboard(tournamentId);

            switch (tournamentPlayerStatsEntries) {
              case (#ok(fullStats)) {
                for (pS in fullStats.vals()) {
                  tournamentPlayerStatsBuff.add({
                    pS.2 with principal = pS.1;
                  });
                };
              };
              case (#err(e)) {
                return #err(e);
              };
            };
          };
          case (#Finished) {
            let tournamentPlayerStatsEntries : [(Principal, ST.TournamentPlayerStats)] = tournamentPlayerStats.get0(tournamentId);

            for (pS in tournamentPlayerStatsEntries.vals()) {
              tournamentPlayerStatsBuff.add({
                pS.1 with principal = pS.0;
              });
            };
          };
        };

        #ok({
          rewards = tournament.reward;
          leaderboard = Buffer.toArray(tournamentPlayerStatsBuff);
        });

      };
    };

  };

  public shared ({ caller }) func addNewAdmin(principals : [Principal]) : async Result.Result<(), OT.Error> {

    if (not U.isAdmin(caller, admins)) {
      return #err(#NotAuthorized);
    };

    let adminsBuff : Buffer.Buffer<Principal> = Buffer.Buffer(0);

    for (admin in admins.vals()) {
      adminsBuff.add(admin);
    };

    for (principal in principals.vals()) {
      adminsBuff.add(principal);
    };

    admins := Buffer.toArray(adminsBuff);
    return #ok(());

  };

  private func _deleteTournament(tournamentId : Text) : Result.Result<(), OT.TournamentError> {

    let tournamentRes = _getTournament(tournamentId);
    switch (tournamentRes) {
      case (#err(e)) {
        switch (e) {
          case (#NonExistentTournament) {
            #err(#NonExistentTournament);
          };
        };
      };
      case (#ok(oldTournament)) {
        tournaments := Trie.replace(
          tournaments,
          U.keyText(tournamentId),
          Text.equal,
          null,
        ).0;
        //LOL HACE FALTA REL????
        #ok(());
      };
    };
  };

  private func _changeStatus(tournamentId : Text, status : OT.Status) : Result.Result<(), OT.TournamentError> {

    let tournamentRes = _getTournament(tournamentId);

    switch (tournamentRes) {
      case (#err(e)) {
        switch (e) {
          case (#NonExistentTournament) {
            #err(#NonExistentTournament);
          };
        };
      };
      case (#ok(tournament)) {

        var updatedTournament : ST.Tournament = {
          tournament with status = status;
        };

        tournaments := Trie.replace(
          tournaments,
          U.keyText(tournamentId),
          Text.equal,
          ?updatedTournament,
        ).0;

        #ok(());
      };
    };
  };

  private func _initTournament() : async Result.Result<(), OT.TournamentError> {

    var initialStatsRes = await getPlayersStats();

    switch (initialStatsRes) {
      case (#ok(initialStats)) {
        if (initialStats.size() != 0) {
          label l for (playerStats in initialStats.vals()) {

            let (playersInitStats, exist) = Trie.put(
              initPlayersStats,
              U.key(playerStats.0),
              Principal.equal,
              playerStats.1,
            );

            switch (exist) {
              case (null) {
                initPlayersStats := playersInitStats;
                continue l;
              };
              case (?initStatsPlayers) {
                continue l;
              };
            };
          };
          //When we have timer this will be necessary
          // _changeStatus(tournamentId, #Active);
          return #ok(());
        } else {
          return #err(#EmptyStats);
        };
      };
      case (#err(e)) {
        #err(e);
      };
    };

    
  };

  private func _addTournament(tournamentArgs : OT.TournamentArgs, tournamentId : Text) : Result.Result<(), OT.TournamentError> {

    let tournament : ST.Tournament = {
      name = tournamentArgs.name;
      points = tournamentArgs.points;
      reward = tournamentArgs.reward;
      status = tournamentArgs.status;
      description = tournamentArgs.description;
      startDate = tournamentArgs.startDate;
      endDate = tournamentArgs.endDate;
      internalCollections = tournamentArgs.internalCollections;
      externalCollections = tournamentArgs.externalCollections;
      boostsSetAt = tournamentArgs.boostsSetAt;
      boostsSetPer = tournamentArgs.boostsSetPer;
      game = tournamentArgs.game;
      dynamicExplanation = tournamentArgs.dynamicExplanation;
    };

    let (newTournaments, exists) = Trie.put(
      tournaments,
      U.keyText(tournamentId),
      Text.equal,
      tournament,
    );

    switch (exists) {
      case null {
        tournaments := newTournaments;
        #ok(());
      };
      case (?cc) {
        #err(#TournamentAlreadyExists);
      };
    };
  };

  private func _getTournament(tournamentId : Text) : Result.Result<OT.TournamentSuccess, OT.GetTournamentError> {

    let tournamentRes = Trie.find(
      tournaments,
      U.keyText(tournamentId),
      Text.equal,
    );

    switch (tournamentRes) {
      case null {
        #err(#NonExistentTournament);
      };
      case (?tournament) {
        return #ok({
          tournament with id = tournamentId;
        });
      };
    };

  };

  private func getPlayersStats() : async Result.Result<[(Principal, IT.PlayerStats)], OT.Error> {
    switch (CanIds.getCanId("eBRServiceCanId", environment)) {
      case (#ok(eBRServiceCanId)) {
        let bountyRushService = actor (eBRServiceCanId) : actor {
          getPStatsOrderedByPoints : query () -> async ([(Principal, IT.PlayerStats)]);
        };
            
        var playerPointsResult = await bountyRushService.getPStatsOrderedByPoints();

        #ok(playerPointsResult);
      };
      case (#err(e)) {
          #err(#NonExistentCanister);
      };
    };
  };

  private func getInternalStats() : async Result.Result<[OT.PlayerStatsSuccess], OT.Error> {

    var endStatsRes = await getPlayersStats();
    switch (endStatsRes) {
      case (#ok(endStats)) {
        let internalResultsBuff : Buffer.Buffer<OT.PlayerStatsSuccess> = Buffer.Buffer(1);

        for (eS in endStats.vals()) {
          let initPSRes = Trie.find(
            initPlayersStats,
            U.key(eS.0),
            Principal.equal,
          );

          switch (initPSRes) {
            case (null) {
              internalResultsBuff.add({
                eS.1 with principal = eS.0;
                points = {
                  internalResults = ?eS.1.points;
                  externalResults = null;
                };
              });
            };
            case (?initPS) {
              var points = 0;
              if (eS.1.points <= initPS.points or eS.1.points == 0) {
                points := 0;
              } else {
                points := eS.1.points - initPS.points;
              };
              let res : OT.PlayerStatsSuccess = {
                principal = eS.0;
                earned = eS.1.earned - initPS.earned;
                lost = eS.1.lost - initPS.lost;
                matchesLost = eS.1.matchesLost - initPS.matchesLost;
                matchesWon = eS.1.matchesWon - initPS.matchesWon;
                points = {
                  internalResults = ?points;
                  externalResults = null;
                };
              };
              internalResultsBuff.add(res);
            };
          };
        };

        let internalResults = Array.sort(Buffer.toArray(internalResultsBuff), U.compareInternalPlayerStats);

        #ok(internalResults);
      };
      case (#err(e)) {
        #err(e);
      };
    };
  };

  //Only works with default subAccount.
  private func isHolder(userPrincipal : Principal, collectionPrincipal : Principal) : async Bool {

    let holderActor = actor (Principal.toText(collectionPrincipal)) : actor {
      tokens : query (OT.AccountIdentifier) -> async Result.Result<[OT.TokenIndex], OT.CommonError>;
    };

    let accountId = AID.accountIdentifier(userPrincipal, AID.defaultSubaccount());
    var accountIdText = Hex.encode(Blob.toArray(accountId));
    let tokensRes = await holderActor.tokens(accountIdText);

    switch (tokensRes) {
      case (#err(err)) {
        return false;
      };
      case (#ok(tokens)) {
        if (tokens.size() == 0) {
          return false;
        } else {
          return true;
        };
      };
    };
  };

  private func getFullStats(
    internalStats : [OT.PlayerStatsSuccess],
    tournamentAddedPoints : Nat,
    tournamentExternalCollections : [OT.ExternalCollection],
  ) : async [OT.PlayerStatsSuccess] {

    let fullStatsBuff : Buffer.Buffer<OT.PlayerStatsSuccess> = Buffer.Buffer(1);
    //código funciona para 1 sola colección
    for (playerStats in internalStats.vals()) {
      switch (playerStats.points.internalResults) {
        case (null) {};
        case (?internalResults) {
          for (extCollection in tournamentExternalCollections.vals()) {
            if (await isHolder(playerStats.principal, Principal.fromText(extCollection.id))) {
              fullStatsBuff.add({
                playerStats with points = {
                  internalResults = ?internalResults;
                  externalResults = ?(internalResults + tournamentAddedPoints);
                };
              });
            } else {
              fullStatsBuff.add({
                playerStats with points = {
                  internalResults = ?internalResults;
                  externalResults = ?internalResults;
                };
              });
            };
          };
        };
      };
    };

    Buffer.toArray(fullStatsBuff);

  };

  private func getAllTournamentPlayerStats() : [(Text, Principal, ST.TournamentPlayerStats)] {
    tournamentPlayerStats.getAll();
  };

  system func preupgrade() {
    stTournamentPlayerStats := getAllTournamentPlayerStats();
  };

  system func postupgrade() {
    stTournamentPlayerStats := [];
  };

};
