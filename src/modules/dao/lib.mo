import Result "mo:base/Result";
import T "./Types";
import HashMap "mo:base/HashMap";
import Trie "mo:base/Trie";


module DAO { 

    public type Proposal = T.Proposal;

    public type ProposalError = T.ProposalError;

    public type ProposalSuccess = T.ProposalSuccess;

    public func createProposal(proposal : Proposal): async () {
        return ();
    };


};