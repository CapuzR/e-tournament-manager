import { expect, test, describe, beforeEach, afterEach } from "vitest";
import { bRCanisterId, bRAdmin, eTMAdmin, createActor, bRTM, bR } from "./actor";
import { identityFromSeed, adminIdentity } from "./identity.js";
import { idlFactory as eTMIdlFactory } from "../declarations/e_tournament_manager/e_tournament_manager.did.js";
import { idlFactory as bRServiceIdlFactory } from "../IDLs/e-br-service/e_br_service.did.js";
import bip39 from "bip39";
import {balance, transfer, getEndMatchResults } from "./service.js";
import { getAccountId } from "./Utils/account";


    let eMI;
    let p1Data;
    let p2Data;
    let p1BRActor;
    let p2BRActor;
    let p1Identity;
    let p2Identity;
    let addTRes;
    let addTRes1;

    describe('Tournaments', () => {
        beforeEach(async () => {

            let tournamentArgs = {
                status: { "Active": null },
                reward: "10",
                endDate: (Date.now() + 1800).toString(),
                dynamicExplanation: "Test",
                game: "Bounty Rush",
                name: "Test",
                internalCollections: [
                    {
                        id: "k4",
                        name: "Meninas"
                    },
                    {
                        id: "zemj",
                        name: "Interitus"
                    }
                ],
                description: "Test",
                boostsSetPer: "Test",
                boostsSetAt: "Test",
                points: 10,
                externalCollections: [
                    {
                        id: "k4",
                        name: "Meninas"
                    }],
                startDate: (Date.now()).toString(),
            };

            let tournamentArgs1 = {
                status: { "Active": null },
                reward: "10",
                endDate: (Date.now() + 1800).toString(),
                dynamicExplanation: "Test",
                game: "Bounty Rush",
                name: "Test",
                internalCollections: [
                    {
                        id: "k4",
                        name: "Meninas"
                    },
                    {
                        id: "zemj",
                        name: "Interitus"
                    }
                ],
                description: "Test",
                boostsSetPer: "Test",
                boostsSetAt: "Test",
                points: 10,
                externalCollections: [
                    {
                        id: "qcg3w-tyaaa-aaaah-qakea-cai",
                        name: "ICPunks"
                    }],
                startDate: (Date.now()).toString(),
            };

            addTRes = await eTMAdmin.addTournament(tournamentArgs);
            addTRes1 = await eTMAdmin.addTournament(tournamentArgs1);

            console.log(await balance(adminIdentity));

            eMI = (Math.floor(Math.random() * 100001)).toString();

            p1Identity = await identityFromSeed(bip39.generateMnemonic());
            p2Identity = await identityFromSeed(bip39.generateMnemonic());

            p1BRActor = await createActor(bRCanisterId, {
                agentOptions: { host: "http://127.0.0.1:4943", fetch },
            }, p1Identity, bRServiceIdlFactory);
            p2BRActor = await createActor(bRCanisterId, {
                agentOptions: { host: "http://127.0.0.1:4943", fetch },
            }, p2Identity, bRServiceIdlFactory);

            await bRAdmin.manageAuth({ AllowedUsers : { Add : [(p1Identity).getPrincipal(), (p2Identity).getPrincipal()] } });
            // await eTMAdmin.manageAuth({ AllowedUsers : { Add : [(p1Identity).getPrincipal(), (p2Identity).getPrincipal()] } });
            
            const cMArgs = {
                externalMatchId : eMI,
                tokenSymbol : "ICP",
                minBet : 1,
                maxBet : 10000,
                maxNumPlayers : 2,
                rounds : 3,
                details : [],
            };
            
            const p1DataRes = await p1BRActor.createMatch(cMArgs);
            // console.log(p1DataRes);
            p1Data = p1DataRes.ok;
            // console.log(p1Data);
            const p2DataRes = await p2BRActor.joinMatch(eMI);
            p2Data = p2DataRes.ok;
            
            await bRTM.startMatch(eMI);

            await transfer(getAccountId((p1Identity).getPrincipal()), adminIdentity, 102000000);
            await transfer(getAccountId((p2Identity).getPrincipal()), adminIdentity, 102000000);

        });
        describe('No external collections', () => {
            //TODO: Later I should validate if accountId is being generated correctly.
            test("Should create Tounament, play a match, check leaderboard and return 1 player.", async () => {

                await transfer(getAccountId((await p1Identity).getPrincipal()), adminIdentity, 200000000);
                await transfer(getAccountId((await p2Identity).getPrincipal()), adminIdentity, 400000000);
                
                const amount = 50000000;
                const amountRaise = 51000000;
                const amountCallRaise = 1000000;
                const winnerInitialBalance = Number(await balance(p1Identity));
                const looserInitialBalance = Number(await balance(p2Identity));
                const winnerTotalBet = amount + amountCallRaise + amount + amount;
                const looserTotalBet = amountRaise + amount + amount;

                //T1
                const args1 = { OpenPot : { Raise : { amountBet: amount } } };
                
                const args2 = { RegularTurn : { Raise : { amountBet: amountRaise } } };
                
                const args3 = { RegularTurn : { Call : null } };
                //T2
                const args4 = { OpenRound : { Raise : { amountBet: amount } } };
                  
                const args5 = { RegularTurn : { Call : null } };
                //T3
                const args6 = { OpenRound : { Raise : { amountBet: amount } } };
                
                const args7 = { RegularTurn : { Call : null } };


                const endMatchResultsArgs = {
                    winnerInitialBalance: winnerInitialBalance,
                    looserInitialBalance: looserInitialBalance,
                    winnerNumOfTx: 4,
                    looserNumOfTx: 3,
                    winnerBet: winnerTotalBet,
                    looserBet: looserTotalBet
                };
                
                const endMatchResults = getEndMatchResults(endMatchResultsArgs);
                console.log(endMatchResults);

                //T1
                const t1p1TransferRes = await transfer(p1Data.accountId.text, p1Identity, amount);
                expect(t1p1TransferRes.Err).toBeUndefined();
                console.log("arg1", await p1BRActor.turnExec(args1));
                
                console.log("P1 Balance after T1: ", Number(await balance(p1Identity)));
    
                const t1p2TransferRes = await transfer(p2Data.accountId.text, p2Identity, amountRaise);
                expect(t1p2TransferRes.Err).toBeUndefined();
                console.log("arg2", await p2BRActor.turnExec(args2));

                console.log("P2 Balance after T1: ", Number(await balance(p1Identity)));
                
                const t1p12TransferRes = await transfer(p1Data.accountId.text, p1Identity, amountCallRaise);
                expect(t1p12TransferRes.Err).toBeUndefined();
                console.log("arg3", await p1BRActor.turnExec(args3));
                //T2
                const t2p2TransferRes = await transfer(p2Data.accountId.text, p2Identity, amount);
                expect(t2p2TransferRes.Err).toBeUndefined();
                console.log("arg4", await p2BRActor.turnExec(args4));
    
                const t2p1TransferRes = await transfer(p1Data.accountId.text, p1Identity, amount);
                expect(t2p1TransferRes.Err).toBeUndefined();
                console.log("arg5", await p1BRActor.turnExec(args5));
                //T3
                const t3p2TransferRes = await transfer(p2Data.accountId.text, p2Identity, amount);
                expect(t3p2TransferRes.Err).toBeUndefined();
                console.log("arg6", await p2BRActor.turnExec(args6));
    
                const t3p1TransferRes = await transfer(p1Data.accountId.text, p1Identity, amount);
                expect(t3p1TransferRes.Err).toBeUndefined();
                console.log("arg7", await p1BRActor.turnExec(args7));
    
                const playersStats = [
                    {
                        principal: await p1Identity.getPrincipal(),
                        position: 1,
                        points: 16
                    },
                    {
                        principal: await p2Identity.getPrincipal(),
                        position: 2,
                        points: 7
                    }
                ];

                const expectedLeaderboard = [
                    {
                        principal: p1Identity.getPrincipal(),
                        points: {
                            internalResults: 10,
                            externalResults: 0
                        },
                        earned: 0,
                        lost: 0,
                        matchesWon: 1,
                        matchesLost: 0
                    },
                    {
                        principal: p2Identity.getPrincipal(),
                        points: {
                            internalResults: 0,
                            externalResults: 0
                        },
                        earned: 0,
                        lost: 0,
                        matchesWon: 0,
                        matchesLost: 1
                    }
                ];


                await bRTM.endMatch(eMI, playersStats, 1);
                let leaderboardRes = await eTMAdmin.getLeaderboard(addTRes.ok);
                console.log("leaderboardRes.ok.leaderboard[0]", leaderboardRes.ok.leaderboard[0]);
                if (leaderboardRes) {
                    expect(leaderboardRes).not.toBeUndefined();
                    expect(leaderboardRes).toHaveProperty('ok');
                    expect(leaderboardRes.ok).toHaveProperty('leaderboard');
                    expect(leaderboardRes.ok.leaderboard).toBeTypeOf('object');
                    expect(leaderboardRes.ok.leaderboard.length).toBe(1);
                    expect(leaderboardRes.ok.leaderboard[0].principal).toStrictEqual(expectedLeaderboard[0].principal);
                    expect(Number(leaderboardRes.ok.leaderboard[0].points.internalResults)).toBe(expectedLeaderboard[0].points.internalResults);
                    expect(Number(leaderboardRes.ok.leaderboard[0].matchesWon)).toBe(expectedLeaderboard[0].matchesWon);
                    expect(Number(leaderboardRes.ok.leaderboard[0].matchesLost)).toBe(expectedLeaderboard[0].matchesLost);
                    expect(Number(leaderboardRes.ok.leaderboard[0].earned)).toBe(endMatchResults.winnerEarns);
                }

            });
            test("Should create 2 Tounaments, play 2 matches, check leaderboard and return 2 players.", async () => {

                await transfer(getAccountId((await p1Identity).getPrincipal()), adminIdentity, 400000000);
                await transfer(getAccountId((await p2Identity).getPrincipal()), adminIdentity, 800000000);
                
                const amount = 50000000;
                const amountRaise = 51000000;
                const amountCallRaise = 1000000;
                const winnerInitialBalance = Number(await balance(p1Identity));
                const looserInitialBalance = Number(await balance(p2Identity));
                const winnerTotalBet = amount + amountCallRaise + amount + amount;
                const looserTotalBet = amountRaise + amount + amount;

                //T1
                const args1 = { OpenPot : { Raise : { amountBet: amount } } };
                
                const args2 = { RegularTurn : { Raise : { amountBet: amountRaise } } };
                
                const args3 = { RegularTurn : { Call : null } };
                //T2
                const args4 = { OpenRound : { Raise : { amountBet: amount } } };
                  
                const args5 = { RegularTurn : { Call : null } };
                //T3
                const args6 = { OpenRound : { Raise : { amountBet: amount } } };
                
                const args7 = { RegularTurn : { Call : null } };


                const endMatchResultsArgs = {
                    winnerInitialBalance: winnerInitialBalance,
                    looserInitialBalance: looserInitialBalance,
                    winnerNumOfTx: 4,
                    looserNumOfTx: 3,
                    winnerBet: winnerTotalBet,
                    looserBet: looserTotalBet
                };
                
                const endMatchResults = getEndMatchResults(endMatchResultsArgs);
                console.log(endMatchResults);

                //T1
                const t1p1TransferRes = await transfer(p1Data.accountId.text, p1Identity, amount);
                expect(t1p1TransferRes.Err).toBeUndefined();
                console.log("arg1", await p1BRActor.turnExec(args1));
                
                console.log("P1 Balance after T1: ", Number(await balance(p1Identity)));
    
                const t1p2TransferRes = await transfer(p2Data.accountId.text, p2Identity, amountRaise);
                expect(t1p2TransferRes.Err).toBeUndefined();
                console.log("arg2", await p2BRActor.turnExec(args2));

                console.log("P2 Balance after T1: ", Number(await balance(p1Identity)));
                
                const t1p12TransferRes = await transfer(p1Data.accountId.text, p1Identity, amountCallRaise);
                expect(t1p12TransferRes.Err).toBeUndefined();
                console.log("arg3", await p1BRActor.turnExec(args3));
                //T2
                const t2p2TransferRes = await transfer(p2Data.accountId.text, p2Identity, amount);
                expect(t2p2TransferRes.Err).toBeUndefined();
                console.log("arg4", await p2BRActor.turnExec(args4));
    
                const t2p1TransferRes = await transfer(p1Data.accountId.text, p1Identity, amount);
                expect(t2p1TransferRes.Err).toBeUndefined();
                console.log("arg5", await p1BRActor.turnExec(args5));
                //T3
                const t3p2TransferRes = await transfer(p2Data.accountId.text, p2Identity, amount);
                expect(t3p2TransferRes.Err).toBeUndefined();
                console.log("arg6", await p2BRActor.turnExec(args6));
    
                const t3p1TransferRes = await transfer(p1Data.accountId.text, p1Identity, amount);
                expect(t3p1TransferRes.Err).toBeUndefined();
                console.log("arg7", await p1BRActor.turnExec(args7));
    
                const playersStats = [
                    {
                        principal: await p1Identity.getPrincipal(),
                        position: 1,
                        points: 16
                    },
                    {
                        principal: await p2Identity.getPrincipal(),
                        position: 2,
                        points: 7
                    }
                ];

                await bRTM.endMatch(eMI, playersStats, 1);

                //MATCH 2
                
                let eMI1 = (Math.floor(Math.random() * 100001)).toString();

                const cMArgs = {
                    externalMatchId : eMI1,
                    tokenSymbol : "ICP",
                    minBet : 1,
                    maxBet : 10000,
                    maxNumPlayers : 2,
                    rounds : 3,
                    details : [],
                };
                
                const p3DataRes = await p2BRActor.createMatch(cMArgs);
                console.log(p3DataRes);
                let p3Data = p3DataRes.ok;
                console.log(p3Data);
                const p4DataRes = await p1BRActor.joinMatch(eMI1);
                console.log(p4DataRes);
                let p4Data = p4DataRes.ok;
                console.log(p4Data);
                
                await bRTM.startMatch(eMI1);
                
                const winnerInitialBalance1 = Number(await balance(p2Identity));
                const looserInitialBalance1 = Number(await balance(p1Identity));

                const endMatchResultsArgs1 = {
                    winnerInitialBalance: winnerInitialBalance1,
                    looserInitialBalance: looserInitialBalance1,
                    winnerNumOfTx: 4,
                    looserNumOfTx: 3,
                    winnerBet: winnerTotalBet,
                    looserBet: looserTotalBet
                };
                
                const endMatchResults1 = getEndMatchResults(endMatchResultsArgs1);

                //T1
                const t1p2TransferRes1 = await transfer(p3Data.accountId.text, p2Identity, amount);
                expect(t1p2TransferRes1.Err).toBeUndefined();
                console.log("arg11", await p2BRActor.turnExec(args1));
    
                const t1p1TransferRes1 = await transfer(p4Data.accountId.text, p1Identity, amountRaise);
                expect(t1p1TransferRes1.Err).toBeUndefined();
                console.log("arg21", await p1BRActor.turnExec(args2));
                
                const t1p22TransferRes1 = await transfer(p3Data.accountId.text, p2Identity, amountCallRaise);
                expect(t1p22TransferRes1.Err).toBeUndefined();
                console.log("arg31", await p2BRActor.turnExec(args3));
                //T2
                const t2p1TransferRes1 = await transfer(p4Data.accountId.text, p1Identity, amount);
                expect(t2p1TransferRes1.Err).toBeUndefined();
                console.log("arg41", await p1BRActor.turnExec(args4));
    
                const t2p2TransferRes1 = await transfer(p3Data.accountId.text, p2Identity, amount);
                expect(t2p2TransferRes1.Err).toBeUndefined();
                console.log("arg51", await p2BRActor.turnExec(args5));

                //T3
                const t3p1TransferRes1 = await transfer(p4Data.accountId.text, p1Identity, amount);
                expect(t3p1TransferRes1.Err).toBeUndefined();
                console.log("arg61", await p1BRActor.turnExec(args6));
    
                const t3p2TransferRes1 = await transfer(p3Data.accountId.text, p2Identity, amount);
                expect(t3p2TransferRes1.Err).toBeUndefined();
                console.log("arg71", await p2BRActor.turnExec(args7));
    
                const playersStats1 = [
                    {
                        principal: await p2Identity.getPrincipal(),
                        position: 1,
                        points: 16
                    },
                    {
                        principal: await p1Identity.getPrincipal(),
                        position: 2,
                        points: 7
                    }
                ];

                const expectedLeaderboard1 = [
                    {
                        principal: p2Identity.getPrincipal(),
                        points: {
                            internalResults: 10,
                            externalResults: 0
                        },
                        earned: endMatchResults1.winnerEarns,
                        lost: endMatchResults.looserLoses,
                        matchesWon: 1,
                        matchesLost: 1
                    },
                    {
                        principal: p1Identity.getPrincipal(),
                        points: {
                            internalResults: 7,
                            externalResults: 0
                        },
                        earned: endMatchResults.winnerEarns,
                        lost: endMatchResults1.looserLoses,
                        matchesWon: 1,
                        matchesLost: 1
                    }
                ];


                await bRTM.endMatch(eMI1, playersStats1, 1);

                //Leaderboard
                let leaderboardRes = await eTMAdmin.getLeaderboard(addTRes.ok);
                if (leaderboardRes) {
                    expect(leaderboardRes).not.toBeUndefined();
                    expect(leaderboardRes).toHaveProperty('ok');
                    expect(leaderboardRes.ok).toHaveProperty('leaderboard');
                    expect(leaderboardRes.ok.leaderboard).toBeTypeOf('object');
                    expect(leaderboardRes.ok.leaderboard.length).toBe(2);
                    expect(leaderboardRes.ok.leaderboard[0].principal).toStrictEqual(expectedLeaderboard1[0].principal);
                    expect(leaderboardRes.ok.leaderboard[1].principal).toStrictEqual(expectedLeaderboard1[1].principal);
                    expect(Number(leaderboardRes.ok.leaderboard[0].points.internalResults)).toBe(expectedLeaderboard1[0].points.internalResults);
                    expect(Number(leaderboardRes.ok.leaderboard[1].points.internalResults)).toBe(expectedLeaderboard1[1].points.internalResults);
                    expect(Number(leaderboardRes.ok.leaderboard[0].matchesWon)).toBe(expectedLeaderboard1[0].matchesWon);
                    expect(Number(leaderboardRes.ok.leaderboard[1].matchesWon)).toBe(expectedLeaderboard1[1].matchesWon);
                    expect(Number(leaderboardRes.ok.leaderboard[0].matchesLost)).toBe(expectedLeaderboard1[0].matchesLost);
                    expect(Number(leaderboardRes.ok.leaderboard[1].matchesLost)).toBe(expectedLeaderboard1[1].matchesLost);
                    expect(Number(leaderboardRes.ok.leaderboard[0].earned)).toBe(endMatchResults.winnerEarns);
                }

            });
        });
        describe.skip('Se debe hacer llamando al eTM de Staging - With external collections', () => {
            test("Should create 2 Tounaments, play 2 matches, check leaderboard and return 2 players.", async () => {

                await transfer(getAccountId((await p1Identity).getPrincipal()), adminIdentity, 400000000);
                await transfer(getAccountId((await p2Identity).getPrincipal()), adminIdentity, 800000000);
                
                const amount = 50000000;
                const amountRaise = 51000000;
                const amountCallRaise = 1000000;
                const winnerInitialBalance = Number(await balance(p1Identity));
                const looserInitialBalance = Number(await balance(p2Identity));
                const winnerTotalBet = amount + amountCallRaise + amount + amount;
                const looserTotalBet = amountRaise + amount + amount;

                //T1
                const args1 = { OpenPot : { Raise : { amountBet: amount } } };
                
                const args2 = { RegularTurn : { Raise : { amountBet: amountRaise } } };
                
                const args3 = { RegularTurn : { Call : null } };
                //T2
                const args4 = { OpenRound : { Raise : { amountBet: amount } } };
                  
                const args5 = { RegularTurn : { Call : null } };
                //T3
                const args6 = { OpenRound : { Raise : { amountBet: amount } } };
                
                const args7 = { RegularTurn : { Call : null } };


                const endMatchResultsArgs = {
                    winnerInitialBalance: winnerInitialBalance,
                    looserInitialBalance: looserInitialBalance,
                    winnerNumOfTx: 4,
                    looserNumOfTx: 3,
                    winnerBet: winnerTotalBet,
                    looserBet: looserTotalBet
                };
                
                const endMatchResults = getEndMatchResults(endMatchResultsArgs);

                //T1
                const t1p1TransferRes = await transfer(p1Data.accountId.text, p1Identity, amount);
                expect(t1p1TransferRes.Err).toBeUndefined();
                console.log("arg1", await p1BRActor.turnExec(args1));
                
                console.log("P1 Balance after T1: ", Number(await balance(p1Identity)));
    
                const t1p2TransferRes = await transfer(p2Data.accountId.text, p2Identity, amountRaise);
                expect(t1p2TransferRes.Err).toBeUndefined();
                console.log("arg2", await p2BRActor.turnExec(args2));

                console.log("P2 Balance after T1: ", Number(await balance(p1Identity)));
                
                const t1p12TransferRes = await transfer(p1Data.accountId.text, p1Identity, amountCallRaise);
                expect(t1p12TransferRes.Err).toBeUndefined();
                console.log("arg3", await p1BRActor.turnExec(args3));
                //T2
                const t2p2TransferRes = await transfer(p2Data.accountId.text, p2Identity, amount);
                expect(t2p2TransferRes.Err).toBeUndefined();
                console.log("arg4", await p2BRActor.turnExec(args4));
    
                const t2p1TransferRes = await transfer(p1Data.accountId.text, p1Identity, amount);
                expect(t2p1TransferRes.Err).toBeUndefined();
                console.log("arg5", await p1BRActor.turnExec(args5));
                //T3
                const t3p2TransferRes = await transfer(p2Data.accountId.text, p2Identity, amount);
                expect(t3p2TransferRes.Err).toBeUndefined();
                console.log("arg6", await p2BRActor.turnExec(args6));
    
                const t3p1TransferRes = await transfer(p1Data.accountId.text, p1Identity, amount);
                expect(t3p1TransferRes.Err).toBeUndefined();
                console.log("arg7", await p1BRActor.turnExec(args7));
    
                const playersStats = [
                    {
                        principal: await p1Identity.getPrincipal(),
                        position: 1,
                        points: 16
                    },
                    {
                        principal: await p2Identity.getPrincipal(),
                        position: 2,
                        points: 7
                    }
                ];

                await bRTM.endMatch(eMI, playersStats, 1);

                //MATCH 2
                
                let eMI1 = (Math.floor(Math.random() * 100001)).toString();

                const cMArgs = {
                    externalMatchId : eMI1,
                    tokenSymbol : "ICP",
                    minBet : 1,
                    maxBet : 10000,
                    maxNumPlayers : 2,
                    rounds : 3,
                    details : [],
                };
                
                const p3DataRes = await p2BRActor.createMatch(cMArgs);
                console.log(p3DataRes);
                let p3Data = p3DataRes.ok;
                console.log(p3Data);
                const p4DataRes = await p1BRActor.joinMatch(eMI1);
                console.log(p4DataRes);
                let p4Data = p4DataRes.ok;
                console.log(p4Data);
                
                await bRTM.startMatch(eMI1);
                
                const winnerInitialBalance1 = Number(await balance(p2Identity));
                const looserInitialBalance1 = Number(await balance(p1Identity));

                const endMatchResultsArgs1 = {
                    winnerInitialBalance: winnerInitialBalance1,
                    looserInitialBalance: looserInitialBalance1,
                    winnerNumOfTx: 4,
                    looserNumOfTx: 3,
                    winnerBet: winnerTotalBet,
                    looserBet: looserTotalBet
                };
                
                const endMatchResults1 = getEndMatchResults(endMatchResultsArgs1);

                //T1
                const t1p2TransferRes1 = await transfer(p3Data.accountId.text, p2Identity, amount);
                expect(t1p2TransferRes1.Err).toBeUndefined();
                console.log("arg11", await p2BRActor.turnExec(args1));
    
                const t1p1TransferRes1 = await transfer(p4Data.accountId.text, p1Identity, amountRaise);
                expect(t1p1TransferRes1.Err).toBeUndefined();
                console.log("arg21", await p1BRActor.turnExec(args2));
                
                const t1p22TransferRes1 = await transfer(p3Data.accountId.text, p2Identity, amountCallRaise);
                expect(t1p22TransferRes1.Err).toBeUndefined();
                console.log("arg31", await p2BRActor.turnExec(args3));
                //T2
                const t2p1TransferRes1 = await transfer(p4Data.accountId.text, p1Identity, amount);
                expect(t2p1TransferRes1.Err).toBeUndefined();
                console.log("arg41", await p1BRActor.turnExec(args4));
    
                const t2p2TransferRes1 = await transfer(p3Data.accountId.text, p2Identity, amount);
                expect(t2p2TransferRes1.Err).toBeUndefined();
                console.log("arg51", await p2BRActor.turnExec(args5));

                //T3
                const t3p1TransferRes1 = await transfer(p4Data.accountId.text, p1Identity, amount);
                expect(t3p1TransferRes1.Err).toBeUndefined();
                console.log("arg61", await p1BRActor.turnExec(args6));
    
                const t3p2TransferRes1 = await transfer(p3Data.accountId.text, p2Identity, amount);
                expect(t3p2TransferRes1.Err).toBeUndefined();
                console.log("arg71", await p2BRActor.turnExec(args7));
    
                const playersStats1 = [
                    {
                        principal: await p2Identity.getPrincipal(),
                        position: 1,
                        points: 16
                    },
                    {
                        principal: await p1Identity.getPrincipal(),
                        position: 2,
                        points: 7
                    }
                ];

                const expectedLeaderboard1 = [
                    {
                        principal: p2Identity.getPrincipal(),
                        points: {
                            internalResults: 10,
                            externalResults: 20
                        },
                        earned: endMatchResults1.winnerEarns,
                        lost: endMatchResults.looserLoses,
                        matchesWon: 1,
                        matchesLost: 1
                    },
                    {
                        principal: p1Identity.getPrincipal(),
                        points: {
                            internalResults: 7,
                            externalResults: 17
                        },
                        earned: endMatchResults.winnerEarns,
                        lost: endMatchResults1.looserLoses,
                        matchesWon: 1,
                        matchesLost: 1
                    }
                ];


                await bRTM.endMatch(eMI1, playersStats1, 1);


                let leaderboardRes = await eTMAdmin.getLeaderboard(addTRes1.ok);
                if (leaderboardRes) {
                    expect(leaderboardRes).not.toBeUndefined();
                    expect(leaderboardRes).toHaveProperty('ok');
                    expect(leaderboardRes.ok).toHaveProperty('leaderboard');
                    expect(leaderboardRes.ok.leaderboard).toBeTypeOf('object');
                    expect(leaderboardRes.ok.leaderboard.length).toBe(2);
                    expect(leaderboardRes.ok.leaderboard[0].principal).toStrictEqual(expectedLeaderboard1[0].principal);
                    expect(leaderboardRes.ok.leaderboard[1].principal).toStrictEqual(expectedLeaderboard1[1].principal);
                    expect(Number(leaderboardRes.ok.leaderboard[0].points.internalResults)).toBe(expectedLeaderboard1[0].points.internalResults);
                    expect(Number(leaderboardRes.ok.leaderboard[1].points.internalResults)).toBe(expectedLeaderboard1[1].points.internalResults);
                    expect(Number(leaderboardRes.ok.leaderboard[0].points.externalResults)).toBe(expectedLeaderboard1[0].points.externalResults);
                    expect(Number(leaderboardRes.ok.leaderboard[1].points.externalResults)).toBe(expectedLeaderboard1[1].points.externalResults);
                    expect(Number(leaderboardRes.ok.leaderboard[0].matchesWon)).toBe(expectedLeaderboard1[0].matchesWon);
                    expect(Number(leaderboardRes.ok.leaderboard[1].matchesWon)).toBe(expectedLeaderboard1[1].matchesWon);
                    expect(Number(leaderboardRes.ok.leaderboard[0].matchesLost)).toBe(expectedLeaderboard1[0].matchesLost);
                    expect(Number(leaderboardRes.ok.leaderboard[1].matchesLost)).toBe(expectedLeaderboard1[1].matchesLost);
                    expect(Number(leaderboardRes.ok.leaderboard[0].earned)).toBe(endMatchResults.winnerEarns);
                }

            });
        });
    });