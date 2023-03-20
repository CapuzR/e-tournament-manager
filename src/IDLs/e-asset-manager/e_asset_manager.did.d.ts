import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Card {
  'url' : string,
  'thumbnail' : string,
  'collectionId' : string,
  'mimeType' : string,
  'stats' : Array<CardStats__1>,
  'index' : bigint,
  'collectionName' : string,
}
export interface CardArgs {
  'id' : string,
  'url' : string,
  'thumbnail' : string,
  'collectionId' : string,
  'mimeType' : string,
  'stats' : Array<CardStats>,
  'index' : bigint,
  'collectionName' : string,
}
export interface CardCollectionArgs {
  'filters' : Array<Filter>,
  'loreContext' : string,
  'collectionId' : string,
  'kind' : string,
  'name' : string,
  'description' : string,
  'batchUpdate' : boolean,
  'haveMultipleAC' : boolean,
  'standard' : string,
}
export type CardCollectionError = { 'CardCollectionAlreadyExists' : null } |
  { 'NotAuthorized' : null } |
  { 'Unknown' : string } |
  { 'NonExistentCardCollection' : null };
export interface CardCollectionSuccess {
  'filters' : Array<Filter>,
  'loreContext' : string,
  'collectionId' : string,
  'cards' : Array<CardSuccess>,
  'kind' : string,
  'name' : string,
  'description' : string,
  'haveMultipleAC' : boolean,
  'standard' : string,
}
export type CardError = { 'NotAuthorized' : null } |
  { 'Unknown' : string } |
  { 'CardAlreadyExists' : null } |
  { 'NonExistentCard' : null };
export type CardStats = { 'BountyRush' : Array<Property> } |
  { 'Traits' : Array<Property> } |
  { 'ElementumGeneral' : Array<Property> };
export type CardStats__1 = { 'BountyRush' : Array<Property__1> } |
  { 'Traits' : Array<Property__1> } |
  { 'ElementumGeneral' : Array<Property__1> };
export interface CardSuccess {
  'id' : string,
  'url' : string,
  'thumbnail' : string,
  'mimeType' : string,
  'stats' : Array<CardStats>,
  'index' : bigint,
  'collectionName' : string,
}
export interface Checkbox { 'options' : Array<string> }
export type Error = { 'NotAuthorized' : null };
export type FieldType = { 'TextField' : string } |
  { 'Range' : Array<bigint> } |
  { 'Checkbox' : Checkbox };
export type Filter = { 'BountyRush' : Array<FilterDetails> } |
  { 'Traits' : Array<FilterDetails> } |
  { 'ElementumGeneral' : Array<FilterDetails> };
export interface FilterDetails { 'kind' : FieldType, 'name' : string }
export interface InitOptions { 'admins' : Array<Principal> }
export interface Property { 'value' : Value, 'name' : string }
export interface Property__1 { 'value' : Value__1, 'name' : string }
export type Result = { 'ok' : null } |
  { 'err' : CardCollectionError };
export type Result_1 = { 'ok' : null } |
  { 'err' : UpdateCardError };
export type Result_2 = { 'ok' : Array<CardCollectionSuccess> } |
  { 'err' : CardCollectionError };
export type Result_3 = { 'ok' : CardCollectionSuccess } |
  { 'err' : CardCollectionError };
export type Result_4 = { 'ok' : Card } |
  { 'err' : CardError };
export type Result_5 = { 'ok' : null } |
  { 'err' : CardError };
export type Result_6 = { 'ok' : null } |
  { 'err' : Error };
export type UpdateCardError = { 'NotAuthorized' : null } |
  { 'Unknown' : string } |
  { 'NonExistentCard' : null };
export type Value = { 'Int' : bigint } |
  { 'Nat' : bigint } |
  { 'Nat16' : number } |
  { 'Nat32' : number } |
  { 'Nat64' : bigint } |
  { 'Blob' : Uint8Array | number[] } |
  { 'Bool' : boolean } |
  { 'Int8' : number } |
  { 'Nat8' : number } |
  { 'Text' : string } |
  { 'Bytes' : Uint8Array | number[] } |
  { 'Int16' : number } |
  { 'Int32' : number } |
  { 'Int64' : bigint } |
  { 'Option' : [] | [Value] } |
  { 'Float' : number } |
  { 'Principal' : Principal } |
  { 'Array' : Array<Value> } |
  { 'Class' : Array<Property> };
export type Value__1 = { 'Int' : bigint } |
  { 'Nat' : bigint } |
  { 'Nat16' : number } |
  { 'Nat32' : number } |
  { 'Nat64' : bigint } |
  { 'Blob' : Uint8Array | number[] } |
  { 'Bool' : boolean } |
  { 'Int8' : number } |
  { 'Nat8' : number } |
  { 'Text' : string } |
  { 'Bytes' : Uint8Array | number[] } |
  { 'Int16' : number } |
  { 'Int32' : number } |
  { 'Int64' : bigint } |
  { 'Option' : [] | [Value__1] } |
  { 'Float' : number } |
  { 'Principal' : Principal } |
  { 'Array' : Array<Value__1> } |
  { 'Class' : Array<Property__1> };
export interface anon_class_13_1 {
  'addCardCollection' : ActorMethod<
    [CardCollectionArgs, Array<CardArgs>],
    Result
  >,
  'addNewAdmin' : ActorMethod<[Array<Principal>], Result_6>,
  'deleteCard' : ActorMethod<[string], Result_5>,
  'deleteCardCollection' : ActorMethod<[string], Result>,
  'getAllCollections' : ActorMethod<[], Result_2>,
  'getCard' : ActorMethod<[CardArgs], Result_4>,
  'getCardCollection' : ActorMethod<[string], Result_3>,
  'getCollectionsByQuery' : ActorMethod<[string], Result_2>,
  'testQueryA' : ActorMethod<[CardCollectionArgs], undefined>,
  'testQueryB' : ActorMethod<[Array<CardArgs>], undefined>,
  'updateCard' : ActorMethod<[CardArgs], Result_1>,
  'updateCardCollection' : ActorMethod<
    [CardCollectionArgs, Array<CardArgs>],
    Result
  >,
}
export interface _SERVICE extends anon_class_13_1 {}
