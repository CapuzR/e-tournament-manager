import { _payBet } from "../Utils/payment.js";

    const network =
        process.env.DFX_NETWORK ||
        (process.env.NODE_ENV === "production" ? "ic" : "local");

    export async function createActor(connectOptions, actorOptions) {
        // if (network == "ic") {
            const connected = await window.ic.plug.isConnected();
            if (!connected) {
                await window.ic.plug.requestConnect(connectOptions);
            };
        // } else {
        //     console.log("local");
        //     console.log(connectOptions);
        //     await window.ic.plug.requestConnect(connectOptions);
        // };
        // console.log(actorOptions);
        return await window.ic.plug.createActor(actorOptions);
    };