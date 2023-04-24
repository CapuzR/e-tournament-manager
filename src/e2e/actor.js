import { Actor, HttpAgent } from "@dfinity/agent";
import fetch from "isomorphic-fetch";
import canisterIds from "../../canister_ids.json";
import { idlFactory as eTMIdlFactory } from "../declarations/e_tournament_manager/e_tournament_manager.did.js";
import { idlFactory as icpLedgerIdlFactory } from "../IDLs/ledgers/icp/icp_ledger.did.js";
import { idlFactory as bRServiceIdlFactory } from "../IDLs/e-br-service/e_br_service.did.js";
import { identity, adminIdentity, tMIdentity } from "./identity.js";

export const createActor = async (canisterId, options, identity, idlFactory) => {
  const agent = new HttpAgent({ ...options?.agentOptions, identity });
  await agent.fetchRootKey();

  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options?.actorOptions,
  });
};

export const bRCanisterId = canisterIds.e_br_service.local;
export const eTMCanisterId = canisterIds.e_tournament_manager.local;
export const icpLedgerCanId = canisterIds.icp_ledger.local;

export const bR = await createActor(
  bRCanisterId, 
  {
    agentOptions: { host: "http://127.0.0.1:4943", fetch },
  }, 
  await identity,
  bRServiceIdlFactory  
  );
  
export const bRAdmin = await createActor(
  bRCanisterId, 
  {
    agentOptions: { host: "http://127.0.0.1:4943", fetch },
  }, 
  await adminIdentity,
  bRServiceIdlFactory  
  );
  
export const eTMAdmin = await createActor(
  eTMCanisterId, 
  {
    agentOptions: { host: "http://127.0.0.1:4943", fetch },
  }, 
  await adminIdentity,
  eTMIdlFactory  
  );
  
export const bRTM = await createActor(
  bRCanisterId, 
  {
    agentOptions: { host: "http://127.0.0.1:4943", fetch },
  }, 
  await tMIdentity,
  bRServiceIdlFactory  
  );

export const icpLedger = await createActor(
  icpLedgerCanId, 
  {
  agentOptions: { host: "http://127.0.0.1:4943", fetch },
  },
  await tMIdentity,
  icpLedgerIdlFactory
  );
