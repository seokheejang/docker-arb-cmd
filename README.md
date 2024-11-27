# docker-arb-cmd

docker & ts arbitrum script

## Guide

### Docker

build

```shell
docker build -t docker-arb-cmd .
```

run

```shell
docker run --rm docker-arb-cmd {FUNCTION AND ARGUMENT}
```

### Local

install

```shell
yarn install
```

run

```shell
yarn run cmd {FUNCTION AND ARGUMENT}
```

Function

```shell
yarn run cmd gen-keystore

yarn run cmd gen-keystore --mnemonic '${12 word}'

yarn run cmd write-config --l3chainId '${l3chainId}' --l3owner '${l3ownerAddr}'

yarn run cmd print-account --keystore '${keystore-file}' --pass passphrase --type addr | grep -E '^0x' | tr -d '\r\n'

yarn run cmd print-account --keystore '${keystore-file}' --pass passphrase --type pk | grep -E '^0x' | tr -d '\r\n'

yarn run cmd send-coin --url '${l1/l2/l3 url}' --fromkey '${keystore-file}' --frompass passphrase --to '${addr}' --ethamount 0

yarn run cmd send-coin --url '${l1/l2/l3 url}' --fromkey '${privatekey}' --frompass passphrase --to '${addr}' --ethamount 0

# <Start> fee token
yarn run cmd create-erc20-l1 --l1url '${l1url}' --deployer '${privatekey}' --mintaddr '${addr}' | grep -E '^0x' |  tr -d '\r\n'

yarn run cmd approve-erc20-for-bridge --l1url '${l1url}' --l2url '${l2url}' --token '${nativeTokenL1Address}' --deployer '${l3owner}' --network '${l1l2_network.json}'

yarn run cmd deposit-erc20-l1-to-l2 --l1url '${l1url}' --l2url '${l2url}' --token '${nativeTokenL1Address}' --deployer '${l3owner}' --network '${l1l2_network.json}' --amount '${deposit-amount-eth}'

yarn run cmd print-ChildERC20-l1-to-l2 --l1url '${l1url}' --l2url '${l2url}' --token '${nativeTokenL1Address}' --network '${l1l2_network.json}' | grep -E '^0x' |  tr -d '\r\n'
# <End> fee token

docker run --rm --entrypoint sh offchainlabs/nitro-node:v3.2.1-d81324d -c "cat /home/user/target/machines/latest/module-root.txt"

# Redis running
docker run --name sqm-redis -p 6379:6379 -d redis:6.2.6

yarn run cmd redis-read --redisUrl redis://0.0.0.0:9379 --init true

yarn run cmd redis-read --redisUrl redis://0.0.0.0:9379 --key coordinator.priorities

yarn run cmd redis-write --redisUrl redis://0.0.0.0:9379 --seqList 'ws://0.0.0.0:8548'

# get DEPLOYER_PRIVKEY
yarn run cmd print-account --keystore '${keystore-file}' --pass passphrase --type pk | grep -E '^0x' | tr -d '\r\n'
# get OWNER_ADDRESS
yarn run cmd print-account --keystore '${keystore-file}' --pass passphrase --type addr | grep -E '^0x' | tr -d '\r\n'
# get BATCH_POSTERS
yarn run cmd print-account --keystore '${keystore-file}' --pass passphrase --type addr | grep -E '^0x' | tr -d '\r\n'
# get WASM_MODULE_ROOT
docker run --rm --entrypoint sh offchainlabs/nitro-node:v3.2.1-d81324d -c "cat /home/user/target/machines/latest/module-root.txt"

docker run --rm \
  -e PARENT_CHAIN_RPC=http://${l2url} \
  -e DEPLOYER_PRIVKEY=${l3owner-deployer} \
  -e PARENT_CHAIN_ID=${l2chainid} \
  -e CHILD_CHAIN_NAME=local \
  -e MAX_DATA_SIZE=117964 \
  -e OWNER_ADDRESS=${l3owner-deployer-address} \
  -e WASM_MODULE_ROOT=${nitro-wasm-module-root} \
  -e BATCH_POSTERS=${l3batch-posters-address-array} \
  -e AUTHORIZE_VALIDATORS=4 \
  -e CHILD_CHAIN_CONFIG_PATH="/data/config/l3_chain_config.json" \
  -e CHAIN_DEPLOYMENT_INFO="/data/config/l3deployment.json" \
  -e CHILD_CHAIN_INFO="/data/config/deployed_l3_chain_info.json" \
  -e FEE_TOKEN_ADDRESS=${l2feetoken-address} \
  -v "$(pwd)/output/config:/data/config" \
  ${nitro-contracts-rollup-docker-image} create-rollup-testnode

# sequnecer config set
# If using macOS, install GNU sed using the following command:
brew install gnu-sed
alias sed='gsed'

sed -i \
    -e 's/\${CommonChainInfoFile}/\/data\/config\/l3_chain_info.json/g' \
    -e 's/\${CommonChainName}/local/g' \
    -e 's/\${SequencerSeqCoordinatorUrl}/ws:\/\/host.docker.internal:10548/g' \
    -e 's/\${SequencerSeqCoordinatorRedisUrl}/redis:\/\/host.docker.internal:9379/g' \
    -e 's/\${SequencerSeqCoordinatorDeleteFinalizedMsgs}/false/g' \
    -e 's/\${SequencerDelayedSequencerUseMergeFinality}/false/g' \
    -e 's/\${CommonParentChainConnectionUrl}/ws:\/\/127.0.0.1:8548/g' \
    -e 's/\${CommonParentChainId}/412346/g' \
    -e 's/\${CommonPersistentChain}/local/g' \
    output/config/l3seq_config.json


# l3 sequnecer up
docker run \
  --name test-l3-seq \
  -p "0.0.0.0:18547:18547" \
  -p "0.0.0.0:18548:18548" \
  -p "0.0.0.0:19642:19642" \
  -v "$(pwd)/output/config:/data/config" \
  offchainlabs/nitro-node:v3.2.1-d81324d \
  --conf.file=/data/config/l3seq_config.json

# set-l3-price-per-unit-by-owner
yarn run cmd set-l3-price-per-unit-by-owner --l3url '${l3url}' --fromkey '${deployer}'

# bridge-native-token-to-l3
yarn run cmd bridge-native-token-to-l3 --l2url '${l2url}' --l3url '${l3url}' --amount 500000 --deployer '${l3owner}' --wait --deployment output/config/l3deployment.json

# get ROLLUP_ADDRESS
jq -r '.[0].rollup.rollup' output/config/deployed_l3_chain_info.json

# L2-L3 token bridge
docker volume create token-bridge-workspace

docker run --rm \
  -e ROLLUP_OWNER_KEY=${deployer_key} \
  -e ROLLUP_ADDRESS=${ROLLUP_ADDRESS} \
  -e PARENT_RPC=${http-l2url} \
  -e CHILD_RPC=${http-l3url} \
  -e PARENT_KEY=${deployer_key} \
  -e CHILD_KEY=${deployer_key} \
  -v "token-bridge-workspace:/workspace" \
  ${nitro-contracts-tokenbrigde-docker-image} deploy:local:token-bridge

docker run --rm \
  -v "token-bridge-workspace:/tokenbridge" \
  -v "$(pwd)/output/config:/data/config" \
  --entrypoint sh ${nitro-contracts-tokenbrigde-docker-image} \
  -c "cat /tokenbridge/network.json && cp /tokenbridge/network.json /data/config/l2l3_network.json"

# Optional
docker volume rm token-bridge-workspace

# batch-poster config set
sed -i \
    -e 's/\${CommonChainInfoFile}/\/data\/config\/l3_chain_info.json/g' \
    -e 's/\${CommonChainName}/local/g' \
    -e 's/\${BatchPosterNodeBatchPosterMaxDelay}/30s/g' \
    -e 's/\${BatchPosterNodeBatchPosterMaxSize}/85000/g' \
    -e 's/\${BatchPosterWaitForL1Finality}/false/g' \
    -e 's/\${BatchPosterParentChainWalletAccount}/${batch-poster-address}/g' \
    -e 's/\${BatchPosterParentChainWalletPassword}/passphrase/g' \
    -e 's/\${BatchPosterParentChainWalletPathname}/\/data\/account/g' \
    -e 's/\${BatchPosterRedisUrl}/redis:\/\/host.docker.internal:9379/g' \
    -e 's/\${BatchPosterSeqCoordinatorUrl}/''/g' \
    -e 's/\${CommonParentChainConnectionUrl}/${ws-l2url}/g' \
    -e 's/\${CommonParentChainId}/412346/g' \
    -e 's/\${CommonPersistentChain}/local/g' \
    output/config/l3bp_config.json

# batch-poster docker run
docker run -d \
  --name test-l3-bp \
  -p "0.0.0.0:28547:28547" \
  -p "0.0.0.0:28548:28548" \
  -v "$(pwd)/output/config:/data/config" \
  -v "$(pwd)/output/account:/data/account" \
  offchainlabs/nitro-node:v3.2.1-d81324d \
  --conf.file=/data/config/l3bp_config.json

# l2 funnel -> batch-poster(l2 account)
yarn run cmd send-coin --url '${l2url}' --fromkey '${funnel-pk}' --to '${batch-poster-address}' --ethamount 1
# send tx rollup test
yarn run cmd send-coin --url '${l3url}' --fromkey '${deployer-pk}' --to '${deployer-address}' --ethamount 0

```
