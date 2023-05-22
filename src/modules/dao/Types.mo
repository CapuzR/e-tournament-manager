import Bool "mo:base/Bool";
import Error "mo:base/Error";
import Text "mo:base/Text";

module {

public type Status = {
    #Accepted;
    #OnHold;
    #Denied;
};

public type Proposal = {
    title : Text;
    owner: ?Principal;
    description: Text;
    vote: Nat;
    isHolder: Bool;
    status: Status;
};

public type ProposalSuccess = {
    id: Text;
    title : Text;
    owner: ?Principal;
    description: Text;
    vote: Nat;
    isHolder: Bool;
    status: Status;
};

public type ProposalError = {
    #Unknow: Text;
    #AlreadyExistsProposal;
    #NotHolder;
    #NotOwner;
    #NotAccepted;
    #NoneProposals;
    #NotFoundProposal;
};


};