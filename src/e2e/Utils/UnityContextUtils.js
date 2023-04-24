import * as Connections from "../Services/Connections";
import * as bRService from "../Services/bRService";

export function AddUnityListeners(addEventListener, sendMessage, setBalance) {

    addEventListener("createMatch", async function (externalMatchId) {
        await bRService.createMatch(sendMessage, externalMatchId);
    });

    addEventListener("joinMatch", async function (externalMatchId) {
        await bRService.joinMatch(sendMessage, externalMatchId);
    });

    addEventListener("turnExec", async function (requestOption, betOption, amount) {
        await bRService.turnExec(sendMessage, requestOption, betOption, amount, setBalance);
    });
}