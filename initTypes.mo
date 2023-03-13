
module {
    
    public type InitArgs = {
        admins : [Principal];
    };

    public type PlayerStats = {
        points : Nat;
        earned : Nat;
        lost : Nat;
        matchesWon : Nat;
        matchesLost : Nat;
    };

    public type MatchPlayerStats = {
        joinPosition : Nat; //order in which player join the match
        position : Nat; //Ordered from higher to lower points
        points : Nat;
        earned : Nat; //How many tokens the player earned in this game
        lost : Nat; //How many tokens the player lost in this game
        invoiceId : Text;
        matchId : Text;
        playerPrincipal : Principal;
        accumulatedBet : Nat;
        status : MatchPlayerStatus; 
    };

    public type EndMatchPlayerStats = {
        principal : Principal;
        position : Nat;
        points : Nat;
    };
    
    public type MatchPlayerStatus = {
        #Active;
        #Banned;
        #TimeBanned;
        #Fold;
        #Winner;
        #Exited;
        #Looser;
        #MatchClosed;
        #MultipleMatches;
    };

}