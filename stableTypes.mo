
module {

    public type Status = {
        #OnHold;
        #Active;
        #Finished;
        #Canceled;
    };
    
    public type Tournament = {
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

    type ExternalCollection = {
        id : Text;
        name : Text;
    };
    
    public type TournamentPlayerStats = {
        points : {
            internalResults : ?Nat;
            externalResults : ?Nat;
        };
        earned : Nat;
        lost : Nat;
        matchesWon : Nat;
        matchesLost : Nat;
    };
}