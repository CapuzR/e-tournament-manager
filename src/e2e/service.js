
import { Principal } from "@dfinity/principal";
import { createActor, icpLedgerCanId } from "./actor";
import { idlFactory as icpLedgerIdlFactory } from "../IDLs/ledgers/icp/icp_ledger.did.js";
import { fromHex } from './Utils/buffer';

const defaultCreateMatchArgs = {
    externalMatchId: (Math.floor(Math.random() * 100001)).toString(),
    tokenSymbol: "ICP",
    minBet: 1,
    maxBet: 10000,
    maxNumPlayers: 2,
    rounds: 3,
    details: [],
};

export const getEndMatchResults = ({
    winnerInitialBalance, //5,02
    looserInitialBalance, //3,02
    winnerNumOfTx,
    looserNumOfTx,
    winnerBet, //1,51
    looserBet //1.01
}) => {
    //Estos stats
    const numOfPlayers = 2;
    const networkFee = 10000;
    const bRFeeRate = 0.01;

    const pot = winnerBet + looserBet; //2,52
    // console.log("pot", pot);
    const netFeeSum = // 0,0004
    (numOfPlayers*networkFee) + 
    (networkFee) +
    (networkFee);
    const matchBaseAmount = pot - netFeeSum;
    console.log("matchBaseAmount", matchBaseAmount);
    const paidToBr = (pot - netFeeSum)*bRFeeRate; // 0,025196
    console.log("paidToBr", paidToBr);

    const paidToWinner = pot - paidToBr - netFeeSum; // 2.494404
    console.log("paidToWinner", paidToWinner);

    const winnerCurentBalance = winnerInitialBalance + paidToWinner - winnerBet - winnerNumOfTx*networkFee;
    // console.log("p1CurentBalance", p1CurentBalance);

    const looserCurentBalance = looserInitialBalance - looserBet - looserNumOfTx*networkFee;
    // console.log("p2CurentBalance", p2CurentBalance);

    const results = { 
        winnerCurentBalance: winnerCurentBalance, 
        looserCurentBalance: looserCurentBalance, 
        paidToBr: paidToBr,
        winnerEarns: paidToWinner,
        looserLoses: looserBet,
    };

    return results;
};
export const balance = async (identity) => {

    const icpLedgerActor = await createActor(
        icpLedgerCanId, 
        {
            agentOptions: { host: "http://127.0.0.1:4943", fetch },
        },
        await identity,
        icpLedgerIdlFactory
    );

    return await icpLedgerActor.icrc1_balance_of(
        {
            owner: (await identity).getPrincipal(),
            subaccount: []
        }
    );

};

export const balanceByPrincipal = async (identity, principal) => {

    const icpLedgerActor = await createActor(
        icpLedgerCanId, 
        {
        agentOptions: { host: "http://127.0.0.1:4943", fetch },
        },
        await identity,
        icpLedgerIdlFactory
    );

    return await icpLedgerActor.icrc1_balance_of(
        {
            owner: Principal.fromText(principal),
            subaccount: []
        }
    );

};

export const transfer = async (accountId, identity, amount) => {
    
    const icpLedgerActor = await createActor(
        icpLedgerCanId,
        {
            agentOptions: { host: "http://127.0.0.1:4943", fetch },
        },
        identity,
        icpLedgerIdlFactory
    );

    return await icpLedgerActor.transfer(
        {
            to : [...new Uint8Array(fromHex(accountId))],
            fee : { e8s : 10000 },
            from_subaccount : [],
            created_at_time : [],
            memo : 0,
            amount : { e8s : amount },
        }
    );
};