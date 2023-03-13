import Buffer "mo:base/Buffer";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Prelude "mo:base/Prelude";
import Text "mo:base/Text";
import Trie "mo:base/Trie";
import AssocList "mo:base/AssocList";

/// Binary relation representation.
///
/// https://en.wikipedia.org/wiki/Binary_relation
///
/// Properties of this implementation:
///
/// - Uses (purely functional) tries from base library.
/// - Each operation is fast (sublinear, O(log n) time).
/// - Relations permit cheap O(1)-time copies; versioned history is possible.
///
/// Use this representation to implement binary relations (e.g.,
/// CanCan videos and CanCan users) that can be represented, merged
/// and analyzed separately from the data that they relate.
///
/// The goal of this representation is to isolate common patterns for
/// relations, and reduce the boilerplate of the alternative (bespoke
/// system) design, where each kind of thing has internal collections
/// (arrays or lists or maps) of the things to which it is related.
/// That representation can be reconstituted as a view of this one.
///
module {
  public type HashPair<X, Y> =
    ( X -> Hash.Hash,
      Y -> Hash.Hash );

  public type EqualPair<X, Y> =
    ( (X, X) -> Bool,
      (Y, Y) -> Bool) ;

  /// Relation between X's and Y's.
  ///
  /// Uses two (related) hash tries, for the edges in each direction.
  /// Holds the hash and equal functions for the tries.
  public type Rel<X, Y, Z> = {
    forw : Trie.Trie2D<X, Y, Z> ;
    back : Trie.Trie2D<Y, X, Z> ;
    hash : HashPair<X, Y> ;
    equal : EqualPair<X, Y> ;
  };

  /// Relation between X's and Y's.
  ///
  /// Shared type (no hash or equal functions).
  public type RelShared<X, Y, Z> = {
    forw : Trie.Trie2D<X, Y, Z> ;
    //
    // No HO functions, and no backward direction:
    // In a serialized message form, the backward direction is redundant
    // and can be recomputed in linear time from the forw field.
    //
    // back : Trie.Trie2D<Y, X, ()> ;
  };

  public func share<X, Y, Z>( rel : Rel<X, Y, Z> ) : RelShared<X, Y, Z> {
    { forw = rel.forw ;
      // back = rel.back ;
    }
  };

  public func fromShare<X, Y, Z>( rel : RelShared<X, Y, Z>,
                               hash_ : HashPair<X, Y>,
                               equal_ : EqualPair<X, Y> ) : Rel<X, Y, Z>
  {
    { forw = rel.forw ;
      back = invert(rel.forw);
      hash = hash_ ;
      equal = equal_
    }
  };

  public func keyOf0<X, Y, Z>( rel : Rel<X, Y, Z>,  x : X) : Trie.Key<X> {
    { key = x ; hash = rel.hash.0(x) }
  };

  public func keyOf1<X, Y, Z>( rel : Rel<X, Y, Z>,  y : Y) : Trie.Key<Y> {
    { key = y ; hash = rel.hash.1(y) }
  };

  public func keyOf<X, Y, Z>( rel : Rel<X, Y, Z>, p : (X, Y, Z))
    : (Trie.Key<X>, Trie.Key<Y>)
  {
    (keyOf0(rel, p.0),
     keyOf1(rel, p.1))
  };

  public func empty<X, Y, Z>( hash_ : HashPair<X, Y>,
                           equal_ : EqualPair<X, Y>) : Rel<X, Y, Z> {
    {
      forw = Trie.empty();
      back = Trie.empty();
      hash = hash_ ;
      equal = equal_
    }
  };

  public func isMember<X, Y, Z>(rel : Rel<X, Y, Z>, x : X, y : Y) : Bool {
    switch (Trie.find<X, Trie.Trie<Y, Z>>(rel.forw, keyOf0(rel, x), rel.equal.0)) {
    case null false;
    case (?t) {
           switch (Trie.find<Y, Z>(t, keyOf1(rel, y), rel.equal.1)) {
           case null false;
           case _ true;
           }
         };
    }
  };

  public func getRelated0<X, Y, Z>(rel : Rel<X, Y, Z>, x : X) : Iter.Iter<(Y,Z)> {
    let t = Trie.find<X, Trie.Trie<Y, Z>>(rel.forw, keyOf0(rel, x), rel.equal.0);
    switch t {
      // to do -- define as Iter.empty()
      case null { object { public func next() : ?(Y,Z) { null } } };
      case (?t) { iterAll(t) };
    }
  };

  public func getRelated1<X, Y, Z>(rel : Rel<X, Y, Z>, y : Y) : Iter.Iter<(X,Z)> {
    let t = Trie.find<Y, Trie.Trie<X, Z>>(rel.back, keyOf1(rel, y), rel.equal.1);
    switch t {
      case null { object { public func next() : ?(X,Z) { null } } };
      case (?t) { iterAll(t) };
    }
  };
  
  public func getRelated<X, Y, Z>(rel : Rel<X, Y, Z>, x : X, y : Y) : ?Z {
    let t = Trie.find<Y, Trie.Trie<X, Z>>(rel.back, keyOf1(rel, y), rel.equal.1);
    switch t {
      case null { null; };
      case (?t) { 
          let t1 = Trie.find<X, Z>(t, keyOf0(rel, x), rel.equal.0);
          switch (t1) {
            case (null) {
              null;
            };
            case (?t1) {
              ?t1;
            };
          };
      };
    }
  };

  public func put<X, Y, Z>( rel : Rel<X, Y, Z>, p : (X, Y, Z)) : Rel<X, Y, Z> {
    let k = keyOf(rel, p);
    {
      forw = Trie.put2D(rel.forw, k.0, rel.equal.0, k.1, rel.equal.1, p.2) ;
      back = Trie.put2D(rel.back, k.1, rel.equal.1, k.0, rel.equal.0, p.2) ;
      hash = rel.hash ;
      equal = rel.equal ;
    }
  };

  public func delete<X, Y, Z>( rel : Rel<X, Y, Z>, p : (X, Y)) : Rel<X, Y, Z> {
    let k = (keyOf0(rel, p.0), keyOf1(rel, p.1));
    {
      forw = Trie.remove2D(rel.forw, k.0, rel.equal.0, k.1, rel.equal.1).0 ;
      back = Trie.remove2D(rel.back, k.1, rel.equal.1, k.0, rel.equal.0).0 ;
      hash = rel.hash ;
      equal = rel.equal ;
    }
  };

  public func getAllRelated<X, Y, Z>( rel : Rel<X, Y, Z> ) : [(X, Y, Z)] {
    
    let iterX : Iter.Iter<(X,Trie.Trie<Y,Z>)> = Trie.iter(rel.forw);
    let buff : Buffer.Buffer<(X, Y, Z)> = Buffer.Buffer(1);
    
    for (xV in iterX) {
      let iterY : Iter.Iter<(Y,Z)> = Trie.iter(xV.1);
      for (yV in iterY) {
        buff.add(
          (xV.0,
          yV.0,
          yV.1)
        );
      };
    };

    buff.toArray();
  };

  func invert<X, Y, Z>(rel : Trie.Trie2D<X, Y, Z>) : Trie.Trie2D<Y, X, Z> {
    Prelude.nyi() // to do -- for testing / upgrades sub-story
  };

  // helper for getRelated{0,1}
  func iterAll<K,Z>(t : Trie.Trie<K, Z>)
    : Iter.Iter<(K,Z)>
    =
    object {
    var stack = ?(t, null) : List.List<Trie.Trie<K, Z>>;
    public func next() : ?(K,Z) {
      switch stack {
      case null { null };
      case (?(trie, stack2)) {
             switch trie {
             case (#empty) {
                    stack := stack2;
                    next()
                  };
             case (#leaf({keyvals=null})) {
                    stack := stack2;
                    next()
                  };
             case (#leaf({size=c; keyvals=?((k2, z2), kvs)})) {
                    stack := ?(#leaf({size=c-1; keyvals=kvs}), stack2);
                    // switch (AssocList.find(kvs, k2.key, eq)) {
                    //   case (null) {};
                    //   case (v) {
                        ?(k2.key, z2)
                      // };
                    // };
                  };
             case (#branch(br)) {
                    stack := ?(br.left, ?(br.right, stack2));
                    next()
                  };
             }
           }
      }
    }
  };

  // func iterAllZ<K,Z>(t : Trie.Trie<K, Z>)
  //   : Z
  //   =
  //   object {
  //   var stack = ?(t, null) : List.List<Trie.Trie<K, Z>>;
  //   public func next() : ?(K,Z) {
  //     switch stack {
  //     case null { null };
  //     case (?(trie, stack2)) {
  //            switch trie {
  //            case (#empty) {
  //                   stack := stack2;
  //                   next()
  //                 };
  //            case (#leaf({keyvals=null})) {
  //                   stack := stack2;
  //                   next()
  //                 };
  //            case (#leaf({size=c; keyvals=?((k2, z2), kvs)})) {
  //                   stack := ?(#leaf({size=c-1; keyvals=kvs}), stack2);
  //                   // switch (AssocList.find(kvs, k2.key, eq)) {
  //                   //   case (null) {};
  //                   //   case (v) {
  //                       ?(k2.key, z2)
  //                     // };
  //                   // };
  //                 };
  //            case (#branch(br)) {
  //                   stack := ?(br.left, ?(br.right, stack2));
  //                   next()
  //                 };
  //            }
  //          }
  //     }
  //   }
  // };


}