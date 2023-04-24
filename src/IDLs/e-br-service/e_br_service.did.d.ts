import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type AccountIdentifier = { 'principal' : Principal } |
  { 'blob' : Uint8Array | number[] } |
  { 'text' : string };
export type AuthArgs = { 'Auth' : RequestArgs } |
  { 'Admin' : RequestArgs } |
  { 'GameServers' : RequestArgs } |
  { 'AllowedUsers' : RequestArgs };
export type BetOptions = { 'Call' : null } |
  { 'Fold' : null } |
  { 'AllInRaise' : { 'amountBet' : bigint } } |
  { 'Raise' : { 'amountBet' : bigint } } |
  { 'Check' : null } |
  { 'AllInCall' : { 'amountBet' : bigint } };
export type BlockHeight = bigint;
export interface ContractInfo {
  'heapSize' : bigint,
  'maxLiveSize' : bigint,
  'cycles' : bigint,
  'details' : Array<[string, DetailValue]>,
  'memorySize' : bigint,
}
export type DetailValue = { 'I64' : bigint } |
  { 'U64' : bigint } |
  { 'Vec' : Array<DetailValue> } |
  { 'Slice' : Uint8Array | number[] } |
  { 'Text' : string } |
  { 'True' : null } |
  { 'False' : null } |
  { 'Float' : number } |
  { 'Principal' : Principal };
export interface Details {
  'meta' : Uint8Array | number[],
  'description' : string,
}
export interface EndMatchPlayerStats {
  'principal' : Principal,
  'position' : bigint,
  'points' : bigint,
}
export type Error = { 'InvalidAccount' : string } |
  { 'TxTooOld' : { 'allowed_window_nanos' : bigint } } |
  { 'InvalidDetails' : null } |
  { 'NotPlayersTurn' : null } |
  { 'InvalidAmount' : null } |
  { 'TransferError' : null } |
  { 'NotInMatch' : null } |
  { 'AlreadyJoined' : null } |
  { 'NotFound' : null } |
  { 'NotAuthorized' : null } |
  { 'InvalidAID' : null } |
  { 'BadFee' : { 'expected_fee' : Tokens } } |
  { 'InvalidToken' : null } |
  { 'BadParameters' : null } |
  { 'AlreadyVerified' : string } |
  { 'AlreadyExists' : null } |
  { 'AlreadyPlaying' : null } |
  { 'InvalidInvoiceId' : null } |
  { 'Unknown' : string } |
  { 'TxDuplicate' : { 'duplicate_of' : BlockHeight } } |
  { 'NonExistentCanister' : null } |
  { 'NotYetPaid' : string } |
  { 'NonExistentItem' : null } |
  { 'TxCreatedInFuture' : null } |
  { 'Expired' : null } |
  { 'InsufficientFunds' : { 'balance' : Tokens } };
export interface ErrorLog {
  'player' : Principal,
  'kind' : ErrorLogType,
  'createdOn' : Time,
  'invoiceId' : string,
  'error' : Error__1,
  'matchId' : string,
}
export type ErrorLogType = { 'TransferToMatch' : null } |
  { 'PayToWinner' : null } |
  { 'EPaymentMismatch' : null } |
  { 'UpdateInvoice' : string } |
  { 'PayToElementum' : null } |
  { 'CheckPayment' : null };
export interface ErrorQty {
  'updateInvoicePWError' : bigint,
  'transferToMatchError' : bigint,
  'checkPaymentError' : bigint,
  'payToElementumError' : bigint,
  'payToWinnerError' : bigint,
  'updateInvoiceTMError' : bigint,
}
export type Error__1 = { 'InvalidAccount' : string } |
  { 'TxTooOld' : { 'allowed_window_nanos' : bigint } } |
  { 'InvalidDetails' : null } |
  { 'NotPlayersTurn' : null } |
  { 'InvalidAmount' : null } |
  { 'TransferError' : null } |
  { 'NotInMatch' : null } |
  { 'AlreadyJoined' : null } |
  { 'NotFound' : null } |
  { 'NotAuthorized' : null } |
  { 'InvalidAID' : null } |
  { 'BadFee' : { 'expected_fee' : Tokens } } |
  { 'InvalidToken' : null } |
  { 'BadParameters' : null } |
  { 'AlreadyVerified' : string } |
  { 'AlreadyExists' : null } |
  { 'AlreadyPlaying' : null } |
  { 'InvalidInvoiceId' : null } |
  { 'Unknown' : string } |
  { 'TxDuplicate' : { 'duplicate_of' : BlockHeight } } |
  { 'NonExistentCanister' : null } |
  { 'NotYetPaid' : string } |
  { 'NonExistentItem' : null } |
  { 'TxCreatedInFuture' : null } |
  { 'Expired' : null } |
  { 'InsufficientFunds' : { 'balance' : Tokens } };
export type Error__2 = { 'NotAuthorized' : null } |
  { 'NonExistentRole' : null };
export interface GroupedData {
  'externalInternalMatchIdEntries' : Array<[string, string]>,
  'allowedUsers' : [] | [Array<Principal>],
  'userInvoiceEntries' : Array<[Principal, string]>,
  'auth' : [] | [Array<Principal>],
  'matchSettings' : MatchSettings,
  'matchPlayerStatsEntries' : Array<[string, Principal, MatchPlayerStats]>,
  'matches' : Array<[string, Match]>,
  'playerStats' : Array<[Principal, PlayerStats__1]>,
  'admins' : [] | [Array<Principal>],
  'invoices' : Array<[string, Invoice]>,
  'activePlayerMatches' : Array<[Principal, string]>,
  'errorLog' : Array<ErrorLog>,
  'errorQty' : ErrorQty,
  'gameServers' : [] | [Array<Principal>],
  'matchInvoiceEntries' : Array<[string, string]>,
}
export interface InitArgs {
  'allowedUsers' : [] | [Array<Principal>],
  'auth' : [] | [Array<Principal>],
  'admins' : [] | [Array<Principal>],
  'environment' : string,
  'gameServers' : [] | [Array<Principal>],
}
export interface Invoice {
  'id' : string,
  'isPaidToPlayer' : boolean,
  'token' : TokenVerbose,
  'paidToPlayer' : bigint,
  'toPlayerPaymentBlockHeight' : BlockHeight,
  'payments' : [] | [Array<Payment>],
  'createdBy' : Principal,
  'createdOn' : Time,
  'amountPaid' : bigint,
  'playerPaymentBlockHeight' : BlockHeight,
  'updatedOn' : Time,
  'matchId' : string,
  'expiration' : Time,
  'isPaidByPlayer' : boolean,
  'details' : [] | [Details],
  'paidByPlayer' : bigint,
  'matchPlayerAID' : AccountIdentifier,
  'paidToPlayerVerifiedAtTime' : [] | [Time],
  'amount' : bigint,
  'paidByPlayerVerifiedAtTime' : [] | [Time],
}
export interface Match {
  'id' : string,
  'pot' : bigint,
  'accumulatedBet' : bigint,
  'status' : MatchStatus,
  'currentPlayer' : [] | [Principal],
  'currentRound' : bigint,
  'createdBy' : Principal,
  'createdOn' : bigint,
  'minBet' : bigint,
  'roundOpener' : Principal,
  'tokenSymbol' : TokenSymbol,
  'updatedOn' : bigint,
  'details' : [] | [Details],
  'maxNumPlayers' : bigint,
  'maxBet' : bigint,
  'currentBet' : bigint,
  'rounds' : bigint,
  'joinedPlayersQty' : bigint,
}
export interface MatchInit {
  'minBet' : bigint,
  'tokenSymbol' : TokenSymbol,
  'details' : [] | [Details],
  'maxNumPlayers' : bigint,
  'maxBet' : bigint,
  'rounds' : bigint,
  'externalMatchId' : string,
}
export interface MatchInvoice {
  'accountId' : AccountIdentifier,
  'invoiceId' : string,
}
export interface MatchPlayerStats {
  'accumulatedBet' : bigint,
  'status' : MatchPlayerStatus,
  'joinPosition' : bigint,
  'lost' : bigint,
  'invoiceId' : string,
  'earned' : bigint,
  'matchId' : string,
  'position' : bigint,
  'points' : bigint,
  'playerPrincipal' : Principal,
}
export type MatchPlayerStatus = { 'Draw' : null } |
  { 'Fold' : null } |
  { 'Active' : null } |
  { 'MatchClosed' : null } |
  { 'Banned' : null } |
  { 'Winner' : null } |
  { 'Looser' : null } |
  { 'MultipleMatches' : null } |
  { 'TimeBanned' : null } |
  { 'Exited' : null };
export interface MatchSettings {
  'maxNumRounds' : bigint,
  'pointsPerMatch' : { 'winner' : bigint, 'looser' : bigint },
  'fees' : { 'bR' : bigint, 'network' : bigint },
  'matchMaxBet' : bigint,
  'turnMinBet' : bigint,
  'minNumRounds' : bigint,
  'maxNumPlayers' : bigint,
  'minNumPlayers' : bigint,
  'matchMinBet' : bigint,
}
export type MatchStatus = { 'OnHold' : null } |
  { 'Playing' : null } |
  { 'Finished' : null } |
  { 'Cancelled' : null };
export interface Payment {
  'currentRound' : bigint,
  'paid' : boolean,
  'verifiedAtTime' : [] | [Time],
  'amount' : bigint,
}
export interface PlayerStats {
  'matchesLost' : bigint,
  'lost' : bigint,
  'earned' : bigint,
  'matchesWon' : bigint,
  'points' : bigint,
}
export interface PlayerStats__1 {
  'matchesLost' : bigint,
  'lost' : bigint,
  'earned' : bigint,
  'matchesWon' : bigint,
  'points' : bigint,
}
export type RequestArgs = { 'Add' : Array<Principal> } |
  { 'IsIn' : Principal } |
  { 'Remove' : Principal } |
  { 'RemoveAll' : null } |
  { 'GetAll' : null } |
  { 'IsCallerIn' : null };
export type Result = { 'ok' : null } |
  { 'err' : Error };
export type Result_1 = { 'ok' : null } |
  { 'err' : Error__1 };
export type Result_2 = { 'ok' : [] | [Array<Principal>] } |
  { 'err' : Error__2 };
export type Result_3 = { 'ok' : MatchInvoice } |
  { 'err' : Error };
export type Result_4 = { 'ok' : PlayerStats } |
  { 'err' : Error };
export type Result_5 = { 'ok' : Array<ErrorLog> } |
  { 'err' : Error };
export type Result_6 = { 'ok' : ContractInfo } |
  { 'err' : Error };
export type Result_7 = { 'ok' : GroupedData } |
  { 'err' : Error__1 };
export type Result_8 = {
    'ok' : Array<
      { 'invoiceId' : string, 'isPaid' : boolean, 'amount' : bigint }
    >
  } |
  { 'err' : Error };
export type Time = bigint;
export type TokenSymbol = string;
export interface TokenVerbose {
  'decimals' : bigint,
  'meta' : [] | [{ 'Issuer' : string }],
  'symbol' : string,
}
export interface Tokens { 'e8s' : bigint }
export type TurnInit = { 'OpenRound' : BetOptions } |
  { 'OpenPot' : BetOptions } |
  { 'RegularTurn' : BetOptions } |
  {
    'ForcedExit' : {
      'text' : string,
      'detail' : { 'LeaveGame' : null } |
        { 'MatchClosed' : null } |
        { 'Banned' : null } |
        { 'TimeLimit' : null } |
        { 'MultipleMatches' : null },
    }
  };
export type TurnInit__1 = { 'OpenRound' : BetOptions } |
  { 'OpenPot' : BetOptions } |
  { 'RegularTurn' : BetOptions } |
  {
    'ForcedExit' : {
      'text' : string,
      'detail' : { 'LeaveGame' : null } |
        { 'MatchClosed' : null } |
        { 'Banned' : null } |
        { 'TimeLimit' : null } |
        { 'MultipleMatches' : null },
    }
  };
export interface anon_class_36_1 {
  'backup' : ActorMethod<[], Result_7>,
  'backupMatches' : ActorMethod<[bigint, bigint], Result_7>,
  'checkPayments' : ActorMethod<[], Result_8>,
  'createMatch' : ActorMethod<[MatchInit], Result_3>,
  'endMatch' : ActorMethod<
    [string, Array<EndMatchPlayerStats>, bigint],
    Result
  >,
  'forcedExit' : ActorMethod<[Principal, string, TurnInit], Result>,
  'freePlayerFromMatch' : ActorMethod<[Principal], Result>,
  'freePlayers' : ActorMethod<[], Result>,
  'freePlayersFromMatch' : ActorMethod<[string], Result>,
  'fullBackup' : ActorMethod<[], Result_7>,
  'getCanisterInfo' : ActorMethod<[], ContractInfo>,
  'getDetailedCanisterInfo' : ActorMethod<[], Result_6>,
  'getLogsAndClean' : ActorMethod<[], Result_5>,
  'getPStatsOrderedByPoints' : ActorMethod<[], Array<[Principal, PlayerStats]>>,
  'getPlayerStats' : ActorMethod<[Principal], Result_4>,
  'isCallerAllowed' : ActorMethod<[], boolean>,
  'joinMatch' : ActorMethod<[string], Result_3>,
  'manageAuth' : ActorMethod<[AuthArgs], Result_2>,
  'matchForcedClose' : ActorMethod<[string, TurnInit__1], Result_1>,
  'name' : ActorMethod<[], string>,
  'startMatch' : ActorMethod<[string], Result>,
  'turnExec' : ActorMethod<[TurnInit], Result>,
  'wallet_balance' : ActorMethod<[], bigint>,
  'wallet_receive' : ActorMethod<[], { 'accepted' : bigint }>,
}
export interface _SERVICE extends anon_class_36_1 {}
