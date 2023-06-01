import Result "mo:base/Result";

module {

    type Environments = {
        local : Text;
        staging : Text;
        production : Text;
    };

    type Error = {
        #NonExistentCanister;
    };

    let eBRFrontendCanId : Environments = {
        local : Text = "";
        staging : Text = "";
        production : Text = "";
    };
   let eBRServiceCanId : Environments = { local : Text = "bkyz2-fmaaa-aaaaa-qaaaq-cai"; staging : Text = ""; production : Text = ""; };
    let eAdminFrontendCanId : Environments = {
        local : Text = "";
        staging : Text = "";
        production : Text = "";
    };
   let eAssetManagerCanId : Environments = { local : Text = "be2us-64aaa-aaaaa-qaabq-cai"; staging : Text = ""; production : Text = ""; };
    let eTournamentManagerCanId : Environments = {
        local : Text = "";
        staging : Text = "";
        production : Text = "";
    };
    let eProfileCanId : Environments = {
        local : Text = "";
        staging : Text = "";
        production : Text = "";
    };
    let eWebappCanId : Environments = {
        local : Text = "";
        staging : Text = "";
        production : Text = "";
    };
    let faucetFrontendCanId : Environments = {
        local : Text = "";
        staging : Text = "";
        production : Text = "";
    };
    let faucetBackendCanId : Environments = {
        local : Text = "";
        staging : Text = "";
        production : Text = "";
    };
    let icpLedger : Environments = {
        local : Text = "ryjl3-tyaaa-aaaaa-aaaba-cai";
        staging : Text = "vttjj-zyaaa-aaaal-aabba-cai";
        production : Text = "vttjj-zyaaa-aaaal-aabba-cai";
    };

    public func getCanId (canisterName : Text, environment : Text) : Result.Result<Text, Error> {

        if (canisterName == "eBRFrontendCanId") {
            if(environment == "local") {
                return #ok(eBRFrontendCanId.local);
            } else if (environment == "staging") {
                return #ok(eBRFrontendCanId.staging);
            } else {
                return #ok(eBRFrontendCanId.production);
            };
        }
        else if (canisterName == "eBRServiceCanId") {
            if(environment == "local") {
                return #ok(eBRServiceCanId.local);
            } else if (environment == "staging") {
                return #ok(eBRServiceCanId.staging);
            } else {
                return #ok(eBRServiceCanId.production);
            };
        }
        else if (canisterName == "eAdminFrontendCanId") {
            if(environment == "local") {
                return #ok(eAdminFrontendCanId.local);
            } else if (environment == "staging") {
                return #ok(eAdminFrontendCanId.staging);
            } else {
                return #ok(eAdminFrontendCanId.production);
            };
        }
        else if (canisterName == "eAssetManagerCanId") {
            if(environment == "local") {
                return #ok(eAssetManagerCanId.local);
            } else if (environment == "staging") {
                return #ok(eAssetManagerCanId.staging);
            } else {
                return #ok(eAssetManagerCanId.production);
            };
        }
        else if (canisterName == "eTournamentManagerCanId") {
            if(environment == "local") {
                return #ok(eTournamentManagerCanId.local);
            } else if (environment == "staging") {
                return #ok(eTournamentManagerCanId.staging);
            } else {
                return #ok(eTournamentManagerCanId.production);
            };
        }
        else if (canisterName == "eProfileCanId") {
            if(environment == "local") {
                return #ok(eProfileCanId.local);
            } else if (environment == "staging") {
                return #ok(eProfileCanId.staging);
            } else {
                return #ok(eProfileCanId.production);
            };
        }
        else if (canisterName == "eWebappCanId") {
            if(environment == "local") {
                return #ok(eWebappCanId.local);
            } else if (environment == "staging") {
                return #ok(eWebappCanId.staging);
            } else {
                return #ok(eWebappCanId.production);
            };
        }
        else if (canisterName == "faucetFrontendCanId") {
            if(environment == "local") {
                return #ok(faucetFrontendCanId.local);
            } else if (environment == "staging") {
                return #ok(faucetFrontendCanId.staging);
            } else {
                return #ok(faucetFrontendCanId.production);
            };
        }
        else if (canisterName == "faucetBackendCanId") {
            if(environment == "local") {
                return #ok(faucetBackendCanId.local);
            } else if (environment == "staging") {
                return #ok(faucetBackendCanId.staging);
            } else {
                return #ok(faucetBackendCanId.production);
            };
        }
        else if (canisterName == "icpLedgerCanId") {
            if(environment == "local") {
                return #ok(icpLedger.local);
            } else if (environment == "staging") {
                return #ok(icpLedger.staging);
            } else {
                return #ok(icpLedger.production);
            };
        }
        else {
            return #err(#NonExistentCanister);
        };
    };

};