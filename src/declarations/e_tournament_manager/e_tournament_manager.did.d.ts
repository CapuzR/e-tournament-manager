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
export type RequestArgs = { 'Add' : Array<Principal> } |
  { 'IsIn' : Principal } |
  { 'Remove' : Principal } |
  { 'RemoveAll' : null } |
  { 'GetAll' : null } |
  { 'IsCallerIn' : null };
export type Result = { 'ok' : null } |
  { 'err' : TournamentError };
export type Result_1 = { 'ok' : [] | [Array<Principal>] } |
  { 'err' : Error };
export type Result_2 = { 'ok' : TournamentSuccess } |
  { 'err' : TournamentError };
export type Result_3 = {
    'ok' : { 'leaderboard' : Array<PlayerStatsSuccess>, 'rewards' : string }
  } |
  { 'err' : TournamentError };
export type Result_4 = { 'ok' : Array<TournamentSuccess> } |
  { 'err' : TournamentError };
export type Result_5 = { 'ok' : null } |
  { 'err' : Error__1 };
export type Result_6 = { 'ok' : string } |
  { 'err' : TournamentError };
export type Status = { 'OnHold' : null } |
  { 'Active' : null } |
  { 'Finished' : null } |
  { 'Canceled' : null };
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
export interface anon_class_30_1 {
  'addTournament' : ActorMethod<[TournamentArgs], Result_6>,
  'deleteTournament' : ActorMethod<[string], Result>,
  'endTournament' : ActorMethod<[string], Result_5>,
  'getAllTournaments' : ActorMethod<[], Result_4>,
  'getLeaderboard' : ActorMethod<[string], Result_3>,
  'getTournament' : ActorMethod<[string], Result_2>,
  'manageAuth' : ActorMethod<[AuthArgs], Result_1>,
  'updateTournament' : ActorMethod<[TournamentArgs, string], Result>,
}
export interface _SERVICE extends anon_class_30_1 {}
