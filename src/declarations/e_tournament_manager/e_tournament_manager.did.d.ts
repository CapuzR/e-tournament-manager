import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type AuthArgs = { 'Auth' : RequestArgs } |
  { 'Admin' : RequestArgs } |
  { 'GameServers' : RequestArgs } |
  { 'AllowedUsers' : RequestArgs };
export type Error = { 'NotAuthorized' : null } |
  { 'NonExistentRole' : null };
export type Error__1 = { 'NonExistentTournament' : null } |
  { 'NotAuthorized' : null } |
  { 'NonExistentCanister' : null };
export interface ExternalCollection { 'id' : string, 'name' : string }
export interface InitArgs {
  'allowedUsers' : [] | [Array<Principal>],
  'auth' : [] | [Array<Principal>],
  'admins' : [] | [Array<Principal>],
  'environment' : string,
  'gameServers' : [] | [Array<Principal>],
}
export interface InternalCollection { 'id' : string, 'name' : string }
export interface PlayerStatsSuccess {
  'principal' : Principal,
  'matchesLost' : bigint,
  'lost' : bigint,
  'earned' : bigint,
  'matchesWon' : bigint,
  'points' : {
    'internalResults' : [] | [bigint],
    'externalResults' : [] | [bigint],
  },
}
export interface Proposal {
  'status' : Status__1,
  'title' : string,
  'isHolder' : boolean,
  'owner' : [] | [Principal],
  'vote' : bigint,
  'description' : string,
}
export type ProposalError = { 'NoneProposals' : null } |
  { 'NotFoundProposal' : null } |
  { 'Unknow' : string } |
  { 'AlreadyExistsProposal' : null } |
  { 'NotOwner' : null } |
  { 'NotAccepted' : null } |
  { 'NotHolder' : null };
export interface ProposalSuccess {
  'id' : string,
  'status' : Status__1,
  'title' : string,
  'isHolder' : boolean,
  'owner' : [] | [Principal],
  'vote' : bigint,
  'description' : string,
}
export type RequestArgs = { 'Add' : Array<Principal> } |
  { 'IsIn' : Principal } |
  { 'Remove' : Principal } |
  { 'RemoveAll' : null } |
  { 'GetAll' : null } |
  { 'IsCallerIn' : null };
export type Result = { 'ok' : null } |
  { 'err' : ProposalError };
export type Result_1 = { 'ok' : string } |
  { 'err' : ProposalError };
export type Result_10 = { 'ok' : string } |
  { 'err' : TournamentError };
export type Result_2 = { 'ok' : null } |
  { 'err' : TournamentError };
export type Result_3 = { 'ok' : [] | [Array<Principal>] } |
  { 'err' : Error };
export type Result_4 = { 'ok' : TournamentSuccess } |
  { 'err' : TournamentError };
export type Result_5 = { 'ok' : Proposal } |
  { 'err' : ProposalError };
export type Result_6 = {
    'ok' : { 'leaderboard' : Array<PlayerStatsSuccess>, 'rewards' : string }
  } |
  { 'err' : TournamentError };
export type Result_7 = { 'ok' : Array<TournamentSuccess> } |
  { 'err' : TournamentError };
export type Result_8 = { 'ok' : Array<ProposalSuccess> } |
  { 'err' : ProposalError };
export type Result_9 = { 'ok' : null } |
  { 'err' : Error__1 };
export type Status = { 'OnHold' : null } |
  { 'Active' : null } |
  { 'Finished' : null } |
  { 'Canceled' : null };
export type Status__1 = { 'OnHold' : null } |
  { 'Denied' : null } |
  { 'Accepted' : null };
export interface TournamentArgs {
  'status' : Status,
  'reward' : string,
  'endDate' : string,
  'dynamicExplanation' : string,
  'game' : string,
  'name' : string,
  'internalCollections' : Array<InternalCollection>,
  'description' : string,
  'boostsSetPer' : string,
  'boostsSetAt' : string,
  'points' : bigint,
  'externalCollections' : Array<ExternalCollection>,
  'startDate' : string,
}
export type TournamentError = { 'TournamentAlreadyExists' : null } |
  { 'NonExistentTournament' : null } |
  { 'NotAuthorized' : null } |
  { 'TournamentHasBeingCanceled' : null } |
  { 'InitStatAlreadyExists' : null } |
  { 'TournamentHasntStarted' : null } |
  { 'Unknown' : string } |
  { 'NonExistentCanister' : null } |
  { 'EmptyStats' : null };
export interface TournamentSuccess {
  'id' : string,
  'status' : Status,
  'reward' : string,
  'endDate' : string,
  'dynamicExplanation' : string,
  'game' : string,
  'name' : string,
  'internalCollections' : Array<InternalCollection>,
  'description' : string,
  'boostsSetPer' : string,
  'boostsSetAt' : string,
  'points' : bigint,
  'externalCollections' : Array<ExternalCollection>,
  'startDate' : string,
}
export interface anon_class_35_1 {
  'addTournament' : ActorMethod<[TournamentArgs], Result_10>,
  'createProposal' : ActorMethod<[string, string], Result_1>,
  'deleteProposal' : ActorMethod<[string], Result>,
  'deleteTournament' : ActorMethod<[string], Result_2>,
  'endTournament' : ActorMethod<[string], Result_9>,
  'getAllProposals' : ActorMethod<[], Result_8>,
  'getAllTournaments' : ActorMethod<[], Result_7>,
  'getLeaderboard' : ActorMethod<[string], Result_6>,
  'getProposal' : ActorMethod<[string], Result_5>,
  'getTournament' : ActorMethod<[string], Result_4>,
  'manageAuth' : ActorMethod<[AuthArgs], Result_3>,
  'updateTournament' : ActorMethod<[TournamentArgs, string], Result_2>,
  'updatedProposal' : ActorMethod<[string, string, string], Result_1>,
  'voteUp' : ActorMethod<[string], Result>,
}
export interface _SERVICE extends anon_class_35_1 {}
