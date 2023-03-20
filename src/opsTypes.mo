
module {

    public type Status = {
        #OnHold;
        #Active;
        #Finished;
        #Canceled;
    };

    public type TournamentArgs = {
        name : Text;
        points: Nat;
        reward: Text;
        status: Status;
        description : Text;
        startDate : Text;
        endDate : Text;
        internalCollections : [InternalCollection];
        externalCollections : [ExternalCollection];
        boostsSetAt : Text;
        boostsSetPer : Text;
        game : Text;
        dynamicExplanation : Text;
    };
    
    public type TournamentSuccess = {
        id : Text;
        name : Text;
        points: Nat;
        reward: Text;
        status: Status;
        description : Text;
        startDate : Text;
        endDate : Text;
        internalCollections : [InternalCollection];
        externalCollections : [ExternalCollection];
        boostsSetAt : Text;
        boostsSetPer : Text;
        game : Text;
        dynamicExplanation : Text;
    };
    
    type InternalCollection = {
        id : Text;
        name : Text;
    };

    public type ExternalCollection = {
        id : Text;
        name : Text;
    };

    public type PlayerStats = {
        points : Nat;
        earned : Nat;
        lost : Nat;
        matchesWon : Nat;
        matchesLost : Nat;
    };
    
    public type PlayerStatsSuccess = {
        principal : Principal;
        points : {
            internalResults : ?Nat;
            externalResults : ?Nat;
        };
        earned : Nat;
        lost : Nat;
        matchesWon : Nat;
        matchesLost : Nat;
    };
    
    public type TournamentError = {
        #NonExistentTournament;
        #TournamentAlreadyExists;
        #Unknown : Text;
        #NotAuthorized;
        #EmptyStats;
        #InitStatAlreadyExists;
        #NonExistentCanister;
    };

    public type GetTournamentError = {
        #NonExistentTournament;
    };

    public type UpdateTournamentError = {
        #TournamentAlreadyExists;
        #NotAuthorized;
    };

    public type Error = {
        #NotAuthorized;
        #NonExistentTournament;
        #NonExistentCanister;
    };

    public type CardCollectionError = {
        #NonExistentCardCollection;
        #CardCollectionAlreadyExists;
        #Unknown : Text;
        #NotAuthorized;
    };

        public type CardSuccess = {
        id : Text;
        index : Nat;
        luck : ?Nat;
        url : Text;
        thumbnail : Text;
        collectionName : Text;
        mimeType : Text;
        action : ?Text;
        target : ?Text;
        amount : ?Nat;
    };

        public type CardCollectionSuccess = {
        collectionId : Text;
        name : Text;
        description : Text;
        kind : Text;
        loreContext: Text;
        standard : Text;
        haveMultipleAC : Bool;
        cards : [CardSuccess];
    };

    //EXT Standard types

    
    public type AccountIdentifier = Text;
    public type TokenIndex = Nat32;

    public type TokenIdentifier = Text;

    public type CommonError = {
      #InvalidToken: TokenIdentifier;
      #Other : Text;
    };

    
     public type Result_1 = {
        #ok : [TokenIndex];
        #err : CommonError;
     };
}