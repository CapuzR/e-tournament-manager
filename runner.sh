E_TOURNAMENT_MANAGER_PATH=$ELEMENTUM_PATH"/general/e-tournament-manager"

cd $E_TOURNAMENT_MANAGER_PATH

if [ $E_TOURNAMENT_MANAGER_ENV = "local" ] 
then
    dfx canister create e_tournament_manager >/dev/null
fi

echo $(dfx canister id e_tournament_manager);

if [ $EXECUTION_TYPE = "multiple" ]
then
    #Puts e-asset-manager canisterId into the canister_ids.json file.
    jq '.e_asset_manager.local = "'$S_E_ASSET_MANAGER_CANID'"' $E_TOURNAMENT_MANAGER_PATH/canister_ids.json > tmp.$$.json && mv tmp.$$.json $E_TOURNAMENT_MANAGER_PATH/canister_ids.json
        
    rm -r $E_TOURNAMENT_MANAGER_PATH"/src/IDLs/e-asset-manager";
    cp -r $ELEMENTUM_PATH"/general/e-asset-manager/src/declarations/e_asset_manager" $E_TOURNAMENT_MANAGER_PATH"/src/IDLs/e-asset-manager";
    
    #Replace exports from esm to cjs format so that nodejs can be able to use it.
    #Reemplaza los exports de formato esm a cjs para que nodejs pueda utilizarlos.

    #Para e-asset-manager
    OLD='let eAssetManagerCanId : Environments = {'
    NEW='   let eAssetManagerCanId : Environments = { local : Text = "'$S_E_ASSET_MANAGER_CANID'"; staging : Text = ""; production : Text = ""; };'
    cp $E_TOURNAMENT_MANAGER_PATH"/canister-ids.mo" $E_TOURNAMENT_MANAGER_PATH"/canister-ids_temp.mo"
    DPATH=$E_TOURNAMENT_MANAGER_PATH"/canister-ids_temp.mo"
    BPATH=$E_TOURNAMENT_MANAGER_PATH
    [ ! -d $BPATH ] && mkdir -p $BPATH || :
    for f in $DPATH
    do
    if [ -f $f -a -r $f ]; then
        /bin/cp -f $f $BPATH
        sed -i "/$OLD/s/.*/$NEW/" "$f"
    else
        echo "Error: Cannot read $f"
    fi
    done

    rm $E_TOURNAMENT_MANAGER_PATH"/canister-ids.mo"
    mv $E_TOURNAMENT_MANAGER_PATH"/canister-ids_temp.mo" $E_TOURNAMENT_MANAGER_PATH"/canister-ids.mo"
    
    #Para e-asset-manager
    OLD='let eBRServiceCanId : Environments = {'
    NEW='   let eBRServiceCanId : Environments = { local : Text = "'$S_E_BR_SERVICE_CANID'"; staging : Text = ""; production : Text = ""; };'
    cp $E_TOURNAMENT_MANAGER_PATH"/canister-ids.mo" $E_TOURNAMENT_MANAGER_PATH"/canister-ids_temp.mo"
    DPATH=$E_TOURNAMENT_MANAGER_PATH"/canister-ids_temp.mo"
    BPATH=$E_TOURNAMENT_MANAGER_PATH
    [ ! -d $BPATH ] && mkdir -p $BPATH || :
    for f in $DPATH
    do
    if [ -f $f -a -r $f ]; then
        /bin/cp -f $f $BPATH
        sed -i "/$OLD/s/.*/$NEW/" "$f"
    else
        echo "Error: Cannot read $f"
    fi
    done

    rm $E_TOURNAMENT_MANAGER_PATH"/canister-ids.mo"
    mv $E_TOURNAMENT_MANAGER_PATH"/canister-ids_temp.mo" $E_TOURNAMENT_MANAGER_PATH"/canister-ids.mo"
fi

dfx build --network $E_TOURNAMENT_MANAGER_ENV e_tournament_manager >/dev/null

if [ $INSTALL_MODE = "none" ]
then
    dfx canister install --network $E_TOURNAMENT_MANAGER_ENV e_tournament_manager --argument '(
        record { 
            admins = vec {
                principal "'$ADMINS_PRINCIPAL_0'";
                principal "'$ADMINS_PRINCIPAL_1'";
                principal "'$TURN_MANAGER_PRINCIPAL_0'"
            };
            environment = "'$E_TOURNAMENT_MANAGER_ENV'"
        }
    )' >/dev/null
else
    dfx canister install --mode $INSTALL_MODE --network $E_TOURNAMENT_MANAGER_ENV e_tournament_manager --argument '(
        record {
            admins = vec {
                principal "'$ADMINS_PRINCIPAL_0'";
                principal "'$ADMINS_PRINCIPAL_1'";
                principal "'$TURN_MANAGER_PRINCIPAL_0'"
            };
            environment = "'$E_TOURNAMENT_MANAGER_ENV'"
        }
    )' >/dev/null
fi



dfx generate e_tournament_manager