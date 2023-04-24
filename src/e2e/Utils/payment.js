import { idlFactory as ledgerIDLFactory } from "../IDLs/ledger.did.js";
import { fromHex } from '../Utils/buffer.ts';
import { canisterId as ledgerCanId } from '../../../declarations/ledger/index.js';

    const network =
        process.env.DFX_NETWORK ||
        (process.env.NODE_ENV === "production" ? "ic" : "local");
    // const ledgerCanId = network != "ic" ? ledger.local : ledger.ic;
    const host = network != "ic" ? "http://localhost:4943" : "https://icp0.io/";
    const whitelist = [ ledgerCanId ];

    const createActor = async (id, idl)=> { 
        
        if (network == "production") {
            const connected = await window.ic.plug.isConnected();
            if (!connected) {
                await window?.ic?.plug?.requestConnect({
                    whitelist,
                    host : host
                });
            };
        } else {
            await window?.ic?.plug?.requestConnect({
                whitelist : whitelist,
                host : host
            });
        };
        return await window.ic.plug.createActor({
            canisterId: id,
            interfaceFactory: idl,
        })
    };

    export async function _payBet(amountBet) {
        console.log("ledgerCanId", ledgerCanId);
        console.log("host", host);
        const ledger = await createActor(ledgerCanId, ledgerIDLFactory);
        // const ledger = await createActor({ host : host }, { canisterId : ledgerCanId, interfaceFactory: ledgerIDLFactory });
        console.log("Ledger", ledger);
        try {
            let result = await ledger.transfer(
                {
                    to : [...new Uint8Array(fromHex(localStorage.getItem("bRAccountId")))],
                    fee : { e8s : 10000 },
                    from_subaccount : [],
                    created_at_time : [],
                    memo : 0,
                    amount : { e8s : amountBet * 100000000 },
                }
            );
            console.log(result);
            return result;
        } catch(e) {
            console.log(e);
            return e;
        };
    };