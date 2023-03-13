
import Trie "mo:base/Trie";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Bool "mo:base/Bool";
import Buffer "mo:base/Buffer";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Types "../types";
import AID "./Account";
import OT "./opsTypes";

module {

    type MatchPlayerStats = Types.MatchPlayerStats;


    public func isInDetails (details : [(Text, Types.DetailValue)], v : Text) : Bool {
        for( d in details.vals() ) {
            if( d.0 == v ) {
                return true;
            };
        };
        false;
    };

    public func arrayToBuffer<X>(array : [X]) : Buffer.Buffer<X> {
        let buff : Buffer.Buffer<X> = Buffer.Buffer(array.size() + 2);

        for (a in array.vals()) {
            buff.add(a);
        };
        buff;
    };

    public func key(x : Principal) : Trie.Key<Principal> {
        return { key = x; hash = Principal.hash(x) }
    };

    public func keyText(x : Text) : Trie.Key<Text> {
        return { key = x; hash = Text.hash(x) }
    };

    public func isAllowed(p : Principal, allowList : ?[Principal]) : Bool {

        if(Principal.isAnonymous(p)) {
            return false;
        };

        switch(allowList) {
            case (null) { return true; };
            case (?aL) {
                for (a in aL.vals()) {
                    if (Principal.equal(a, p)) return true;
                };
                false;
            };
            
        };
    };

    public func isAuthorized(p : Principal, authorized : [Principal]) : Bool {

        if(Principal.isAnonymous(p)) {
            return false;
        };

        for (a in authorized.vals()) {
            if (Principal.equal(a, p)) return true;
        };
        false;
    };

    public func compareMatchPlayerStats(
        x : MatchPlayerStats, 
        y : MatchPlayerStats) : 
        { #less; #equal; #greater } {
        if (Nat.less(x.points, y.points)) { return #less }
        else if (Nat.equal(x.points, y.points)) { return #equal }
        else { return #greater }
    };
    
    public func comparePlayerStats(
        x : (Principal, Types.PlayerStats), 
        y : (Principal, Types.PlayerStats)) : 
        { #less; #equal; #greater } {
        if (Nat.less(x.1.points, y.1.points)) { return #less }
        else if (Nat.equal(x.1.points, y.1.points)) { return #equal }
        else { return #greater }
    };
    
    public func adminsToVariantArray(admins : [Principal]) : [Types.DetailValue] {
       
        var buff : Buffer.Buffer<Types.DetailValue> = Buffer.Buffer(0);

        for(v in admins.vals()) {
            buff.add(
                #Principal(v)
            );
        };

        buff.toArray();
        
    };
}