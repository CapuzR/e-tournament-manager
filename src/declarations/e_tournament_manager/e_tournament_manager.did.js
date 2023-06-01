export const idlFactory = ({ IDL }) => {
  const InitArgs = IDL.Record({
    'allowedUsers' : IDL.Opt(IDL.Vec(IDL.Principal)),
    'auth' : IDL.Opt(IDL.Vec(IDL.Principal)),
    'admins' : IDL.Opt(IDL.Vec(IDL.Principal)),
    'environment' : IDL.Text,
    'gameServers' : IDL.Opt(IDL.Vec(IDL.Principal)),
  });
  const Status = IDL.Variant({
    'OnHold' : IDL.Null,
    'Active' : IDL.Null,
    'Finished' : IDL.Null,
    'Canceled' : IDL.Null,
  });
  const InternalCollection = IDL.Record({ 'id' : IDL.Text, 'name' : IDL.Text });
  const ExternalCollection = IDL.Record({ 'id' : IDL.Text, 'name' : IDL.Text });
  const TournamentArgs = IDL.Record({
    'status' : Status,
    'reward' : IDL.Text,
    'endDate' : IDL.Text,
    'dynamicExplanation' : IDL.Text,
    'game' : IDL.Text,
    'name' : IDL.Text,
    'internalCollections' : IDL.Vec(InternalCollection),
    'description' : IDL.Text,
    'boostsSetPer' : IDL.Text,
    'boostsSetAt' : IDL.Text,
    'points' : IDL.Nat,
    'externalCollections' : IDL.Vec(ExternalCollection),
    'startDate' : IDL.Text,
  });
  const TournamentError = IDL.Variant({
    'TournamentAlreadyExists' : IDL.Null,
    'NonExistentTournament' : IDL.Null,
    'NotAuthorized' : IDL.Null,
    'TournamentHasBeingCanceled' : IDL.Null,
    'InitStatAlreadyExists' : IDL.Null,
    'TournamentHasntStarted' : IDL.Null,
    'Unknown' : IDL.Text,
    'NonExistentCanister' : IDL.Null,
    'EmptyStats' : IDL.Null,
  });
  const Result_10 = IDL.Variant({ 'ok' : IDL.Text, 'err' : TournamentError });
  const ProposalError = IDL.Variant({
    'NoneProposals' : IDL.Null,
    'NotFoundProposal' : IDL.Null,
    'Unknow' : IDL.Text,
    'AlreadyExistsProposal' : IDL.Null,
    'NotOwner' : IDL.Null,
    'NotAccepted' : IDL.Null,
    'NotHolder' : IDL.Null,
  });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Text, 'err' : ProposalError });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : ProposalError });
  const Result_2 = IDL.Variant({ 'ok' : IDL.Null, 'err' : TournamentError });
  const Error__1 = IDL.Variant({
    'NonExistentTournament' : IDL.Null,
    'NotAuthorized' : IDL.Null,
    'NonExistentCanister' : IDL.Null,
  });
  const Result_9 = IDL.Variant({ 'ok' : IDL.Null, 'err' : Error__1 });
  const Status__1 = IDL.Variant({
    'OnHold' : IDL.Null,
    'Denied' : IDL.Null,
    'Accepted' : IDL.Null,
  });
  const ProposalSuccess = IDL.Record({
    'id' : IDL.Text,
    'status' : Status__1,
    'title' : IDL.Text,
    'isHolder' : IDL.Bool,
    'owner' : IDL.Opt(IDL.Principal),
    'vote' : IDL.Nat,
    'description' : IDL.Text,
  });
  const Result_8 = IDL.Variant({
    'ok' : IDL.Vec(ProposalSuccess),
    'err' : ProposalError,
  });
  const TournamentSuccess = IDL.Record({
    'id' : IDL.Text,
    'status' : Status,
    'reward' : IDL.Text,
    'endDate' : IDL.Text,
    'dynamicExplanation' : IDL.Text,
    'game' : IDL.Text,
    'name' : IDL.Text,
    'internalCollections' : IDL.Vec(InternalCollection),
    'description' : IDL.Text,
    'boostsSetPer' : IDL.Text,
    'boostsSetAt' : IDL.Text,
    'points' : IDL.Nat,
    'externalCollections' : IDL.Vec(ExternalCollection),
    'startDate' : IDL.Text,
  });
  const Result_7 = IDL.Variant({
    'ok' : IDL.Vec(TournamentSuccess),
    'err' : TournamentError,
  });
  const PlayerStatsSuccess = IDL.Record({
    'principal' : IDL.Principal,
    'matchesLost' : IDL.Nat,
    'lost' : IDL.Nat,
    'earned' : IDL.Nat,
    'matchesWon' : IDL.Nat,
    'points' : IDL.Record({
      'internalResults' : IDL.Opt(IDL.Nat),
      'externalResults' : IDL.Opt(IDL.Nat),
    }),
  });
  const Result_6 = IDL.Variant({
    'ok' : IDL.Record({
      'leaderboard' : IDL.Vec(PlayerStatsSuccess),
      'rewards' : IDL.Text,
    }),
    'err' : TournamentError,
  });
  const Proposal = IDL.Record({
    'status' : Status__1,
    'title' : IDL.Text,
    'isHolder' : IDL.Bool,
    'owner' : IDL.Opt(IDL.Principal),
    'vote' : IDL.Nat,
    'description' : IDL.Text,
  });
  const Result_5 = IDL.Variant({ 'ok' : Proposal, 'err' : ProposalError });
  const Result_4 = IDL.Variant({
    'ok' : TournamentSuccess,
    'err' : TournamentError,
  });
  const RequestArgs = IDL.Variant({
    'Add' : IDL.Vec(IDL.Principal),
    'IsIn' : IDL.Principal,
    'Remove' : IDL.Principal,
    'RemoveAll' : IDL.Null,
    'GetAll' : IDL.Null,
    'IsCallerIn' : IDL.Null,
  });
  const AuthArgs = IDL.Variant({
    'Auth' : RequestArgs,
    'Admin' : RequestArgs,
    'GameServers' : RequestArgs,
    'AllowedUsers' : RequestArgs,
  });
  const Error = IDL.Variant({
    'NotAuthorized' : IDL.Null,
    'NonExistentRole' : IDL.Null,
  });
  const Result_3 = IDL.Variant({
    'ok' : IDL.Opt(IDL.Vec(IDL.Principal)),
    'err' : Error,
  });
  const anon_class_35_1 = IDL.Service({
    'addTournament' : IDL.Func([TournamentArgs], [Result_10], []),
    'createProposal' : IDL.Func([IDL.Text, IDL.Text], [Result_1], []),
    'deleteProposal' : IDL.Func([IDL.Text], [Result], []),
    'deleteTournament' : IDL.Func([IDL.Text], [Result_2], []),
    'endTournament' : IDL.Func([IDL.Text], [Result_9], []),
    'getAllProposals' : IDL.Func([], [Result_8], []),
    'getAllTournaments' : IDL.Func([], [Result_7], ['query']),
    'getLeaderboard' : IDL.Func([IDL.Text], [Result_6], []),
    'getProposal' : IDL.Func([IDL.Text], [Result_5], []),
    'getTournament' : IDL.Func([IDL.Text], [Result_4], ['query']),
    'manageAuth' : IDL.Func([AuthArgs], [Result_3], []),
    'updateTournament' : IDL.Func([TournamentArgs, IDL.Text], [Result_2], []),
    'updatedProposal' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text],
        [Result_1],
        [],
      ),
    'voteUp' : IDL.Func([IDL.Text], [Result], []),
  });
  return anon_class_35_1;
};
export const init = ({ IDL }) => {
  const InitArgs = IDL.Record({
    'allowedUsers' : IDL.Opt(IDL.Vec(IDL.Principal)),
    'auth' : IDL.Opt(IDL.Vec(IDL.Principal)),
    'admins' : IDL.Opt(IDL.Vec(IDL.Principal)),
    'environment' : IDL.Text,
    'gameServers' : IDL.Opt(IDL.Vec(IDL.Principal)),
  });
  return [InitArgs];
};
