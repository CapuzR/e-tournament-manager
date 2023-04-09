import Buffer "mo:base/Buffer";
import Result "mo:base/Result";
import Option "mo:base/Option";

module {

    public type AuthArgs = {
        #Admin : RequestArgs;
        #Auth : RequestArgs;
        #AllowedUsers : RequestArgs;
        #GameServer : RequestArgs;
    };

    public type Error = {
        #NotAuthorized;
        #NonExistentRole;
    };

    public type RequestArgs = {
        #Add : [Principal];
        #GetAll;
        #IsIn : Principal;
        #IsCallerIn;
        #Remove : Principal;
        #RemoveAll;
    };

    public type InitArgs = {
        admins : [Principal];
        auth : [Principal];
        allowedUsers : ?[Principal];
        gameServers : [Principal];
        environment : Text;
    };

    public type State = {
        var admins : [Principal];
        var auth : [Principal];
        var allowedUsers : ?[Principal];
        var gameServers : [Principal];
    };

    public type StateSuccess = {
        admins : [Principal];
        auth : [Principal];
        allowedUsers : ?[Principal];
        gameServers : [Principal];
    };

    public func init (args : InitArgs) : State {

        let {
            admins;
            auth;
            allowedUsers;
            gameServers;
        } = args;

        {
            var admins;
            var auth;
            var allowedUsers;
            var gameServers;
        };

    };
    
    public func manageAuth (authArgs: AuthArgs, caller : Principal, authState : State) :  ?[Principal] {

        switch (authArgs) {
            case (#Admin(requestArgs)) {
                switch (requestArgs) {
                    case (#RemoveAll) {
                        return null;
                    };
                    case (_) {
                        switch (manageRequest(requestArgs, authState.admins, caller)) {
                            case (null) {
                                return null;
                            };
                            case (?res) {
                                authState.admins := res;
                                return ?res;
                            };
                        };
                    };
                };
            };
            case (#Auth(requestArgs)) {
                switch (requestArgs) {
                    case (#RemoveAll) {
                        return null;
                    };
                    case (_) {
                        switch (manageRequest(requestArgs, authState.auth, caller)) {
                            case (null) {
                                return null;
                            };
                            case (?res) {
                                authState.auth := res;
                                return ?res;
                            };
                        };
                    };
                };
            };
            case (#AllowedUsers(requestArgs)) {
                switch (manageRequest(requestArgs, Option.get(authState.allowedUsers, []), caller)) {
                    case (null) {
                        return null;
                    };
                    case (res) {
                        authState.allowedUsers := res;
                        return res;
                    };
                };
            };
            case (#GameServer(requestArgs)) {
                switch (requestArgs) {
                    case (#RemoveAll) {
                        return null;
                    };
                    case (_) {
                        switch (manageRequest(requestArgs, authState.gameServers, caller)) {
                            case (null) {
                                return null;
                            };
                            case (?res) {
                                authState.gameServers := res;
                                return ?res;
                            };
                        };
                    };
                };
            };
        };
    };
    
    private func manageRequest (requestArgs: RequestArgs, authArr : [Principal], caller : Principal) : ?[Principal] {

        switch (requestArgs) {
            case ( #Add(principalsArr) ) {
                add(principalsArr, authArr);
            };
            case (#GetAll) {
                getAll(authArr);
            };
            case ( #IsIn(principal) ) {
                isIn(principal, authArr);
            };
            case ( #IsCallerIn ) {
                isIn(caller, authArr);
            };
            case ( #Remove(principal) ) {
                remove(principal, authArr);
            };
            case ( #RemoveAll ) {
                removeAll();
            };
        };
    };
    
    public func isAuthorized (principal: Principal, authArr : [Principal]) : Bool {
        _isIn(principal, authArr)
    };

    private func remove (principal: Principal, authArr : [Principal]) : ?[Principal] {
        let authBuff : Buffer.Buffer<Principal> = Buffer.fromArray(authArr);
        switch(Buffer.indexOf<Principal>(principal, authBuff, func (p1 : Principal, p2 : Principal) { p1 == p2 })) {
            case (null) {};
            case (?index) {
                ignore authBuff.remove(index);
            };
        };
        ?Buffer.toArray(authBuff);
    };
    
    private func getAll (authArr : [Principal]) : ?[Principal] {
        ?authArr;
    };
    
    private func removeAll () : ?[Principal] {
        null;
    };
    
    private func isIn (principal: Principal, authArr : [Principal]) : ?[Principal] {
        if(_isIn(principal, authArr)) {
            return ?[principal];
        } else {
            return null;
        }
    };

    private func add (principalsArr: [Principal], authArr : [Principal]) : ?[Principal] {
        let principalsBuff : Buffer.Buffer<Principal> = Buffer.Buffer(1);
        let authBuff : Buffer.Buffer<Principal> = Buffer.fromArray(authArr);
        
        for (principal in principalsArr.vals()) {
            if(not _isIn(principal, authArr)) {
                principalsBuff.add(principal);
            };
        };

        authBuff.append(principalsBuff);
        return ?Buffer.toArray(authBuff);

    };

    private func _isIn (principal: Principal, authArr : [Principal]) : Bool {
        let authBuff : Buffer.Buffer<Principal> = Buffer.fromArray(authArr);
        Buffer.contains<Principal>(authBuff, principal, func (p1 : Principal, p2 : Principal) { p1 == p2 })
    };

}