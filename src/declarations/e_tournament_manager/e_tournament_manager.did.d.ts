import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type Error = { 'NonExistentTournament' : null } |
  { 'NotAuthorized' : null } |
  { 'NonExistentCanister' : null };
export interface ExternalCollection { 'id' : string, 'name' : string }
export interface InitArgs {
  'admins' : Array<Principal>,
  'environment' : string,
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
export type Result = { 'ok' : null } |
  { 'err' : TournamentError };
export type Result_1 = { 'ok' : TournamentSuccess } |
  { 'err' : TournamentError };
export type Result_2 = {
    'ok' : { 'leaderboard' : Array<PlayerStatsSuccess>, 'rewards' : string }
  } |
  { 'err' : TournamentError };
export type Result_3 = { 'ok' : Array<TournamentSuccess> } |
  { 'err' : TournamentError };
export type Result_4 = { 'ok' : null } |
  { 'err' : Error };
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
  { 'InitStatAlreadyExists' : null } |
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
export interface anon_class_29_1 {
  'addNewAdmin' : ActorMethod<[Array<Principal>], Result_4>,
  'addTournament' : ActorMethod<[TournamentArgs], Result>,
  'deleteTournament' : ActorMethod<[string], Result>,
  'endTournament' : ActorMethod<[string], Result_4>,
  'getAllTournaments' : ActorMethod<[], Result_3>,
  'getLeaderboard' : ActorMethod<[string], Result_2>,
  'getTournament' : ActorMethod<[string], Result_1>,
  'updateTournament' : ActorMethod<[TournamentArgs, string], Result>,
}
export interface _SERVICE extends anon_class_29_1 {}
