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
            admins = opt vec {
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
            admins = opt vec {
                principal "'$ADMINS_PRINCIPAL_0'";
                principal "'$ADMINS_PRINCIPAL_1'";
                principal "'$TURN_MANAGER_PRINCIPAL_0'"
            };
            environment = "'$E_TOURNAMENT_MANAGER_ENV'"
        }
    )' >/dev/null
fi



dfx generate e_tournament_manager

            # auth = null;
            # gameServers = null;
            # allowedUsers = null;
# dfx canister install --mode upgrade --network staging e_tournament_manager --argument '(
#         record {
#             admins = opt vec {
#                 principal "ircn7-g7maa-v2zab-fgz7m-ofkss-eeskj-msyir-alras-riu7w-k5wrm-xqe";
#                 principal "wnkwv-wdqb5-7wlzr-azfpw-5e5n5-dyxrf-uug7x-qxb55-mkmpa-5jqik-tqe";
#                 principal "cygpo-4nsne-nbahj-py2bk-i7mw7-b4wht-iywa5-kdgxz-wvlxy-q64zn-qqe";
#                 principal "l375p-dl5gr-4jcf7-5eir6-yssvr-owlxl-o2jnf-7mv5l-656lh-d2goc-tae"
#             };
#             environment = "staging"
#         }
#     )'

# 3. Subir y probar módulo de Tournaments. LISTO
# 4. Subir y probar módulo de Assets.
# 5. Generar script para tener las cartas correctas en el AssetManager.