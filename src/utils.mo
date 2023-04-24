import Principal "mo:base/Principal";
import Trie "mo:base/Trie";
import Text "mo:base/Text";
import Option "mo:base/Option";
import Nat "mo:base/Nat";
import OT "./opsTypes";

module {
    
  public func isAdmin(p : Principal, admins : [Principal]) : Bool {

      if(Principal.isAnonymous(p)) {
          return false;
      };

      for (admin in admins.vals()) {
          if (Principal.equal(admin, p)) return true;
      };
      false;
  };
  
    public func compareInternalPlayerStats(
        y : OT.PlayerStatsSuccess, 
        x : OT.PlayerStatsSuccess
        ) : { #less; #equal; #greater } {
        let internalResX = Option.get(x.points.internalResults, 0);
        let internalResY = Option.get(y.points.internalResults, 0);
        if (Nat.less(internalResX, internalResY)) { return #less }
        else if (Nat.equal(internalResX, internalResY)) { return #equal }
        else { return #greater }
    };

  
    public func key(x : Principal) : Trie.Key<Principal> {
        return { key = x; hash = Principal.hash(x) }
    };

    public func keyText(x : Text) : Trie.Key<Text> {
        return { key = x; hash = Text.hash(x) }
    };

}