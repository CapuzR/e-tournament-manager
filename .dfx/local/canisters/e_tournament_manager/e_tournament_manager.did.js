export const idlFactory = ({ IDL }) => {
  const InitArgs = IDL.Record({
    'admins' : IDL.Vec(IDL.Principal),
    'environment' : IDL.Text,
  });
  const Error = IDL.Variant({
    'NonExistentTournament' : IDL.Null,
    'NotAuthorized' : IDL.Null,
    'NonExistentCanister' : IDL.Null,
  });
  const Result_4 = IDL.Variant({ 'ok' : IDL.Null, 'err' : Error });
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
    'InitStatAlreadyExists' : IDL.Null,
    'Unknown' : IDL.Text,
    'NonExistentCanister' : IDL.Null,
    'EmptyStats' : IDL.Null,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : TournamentError });
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
  const Result_3 = IDL.Variant({
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
  const Result_2 = IDL.Variant({
    'ok' : IDL.Record({
      'leaderboard' : IDL.Vec(PlayerStatsSuccess),
      'rewards' : IDL.Text,
    }),
    'err' : TournamentError,
  });
  const Result_1 = IDL.Variant({
    'ok' : TournamentSuccess,
    'err' : TournamentError,
  });
  const anon_class_29_1 = IDL.Service({
    'addNewAdmin' : IDL.Func([IDL.Vec(IDL.Principal)], [Result_4], []),
    'addTournament' : IDL.Func([TournamentArgs], [Result], []),
    'deleteTournament' : IDL.Func([IDL.Text], [Result], []),
    'endTournament' : IDL.Func([IDL.Text], [Result_4], []),
    'getAllTournaments' : IDL.Func([], [Result_3], ['query']),
    'getLeaderboard' : IDL.Func([IDL.Text], [Result_2], ['query']),
    'getTournament' : IDL.Func([IDL.Text], [Result_1], ['query']),
    'updateTournament' : IDL.Func([TournamentArgs, IDL.Text], [Result], []),
  });
  return anon_class_29_1;
};
export const init = ({ IDL }) => {
  const InitArgs = IDL.Record({
    'admins' : IDL.Vec(IDL.Principal),
    'environment' : IDL.Text,
  });
  return [InitArgs];
};
