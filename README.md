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

yarn run cmd redis-read --redisUrl redis://0.0.0.0:9379 --key coordinator.priorities

yarn run cmd redis-write --redisUrl redis://0.0.0.0:9379 --seqList '[ws://0.0.0.0:8548]'

# get DEPLOYER_PRIVKEY
yarn run cmd print-account --keystore '${keystore-file}' --pass passphrase --type pk | grep -E '^0x' | tr -d '\r\n'
# get OWNER_ADDRESS
yarn run cmd print-account --keystore '${keystore-file}' --pass passphrase --type addr | grep -E '^0x' | tr -d '\r\n'
# get SEQUENCER_ADDRESS
yarn run cmd print-account --keystore '${keystore-file}' --pass passphrase --type addr | grep -E '^0x' | tr -d '\r\n'
# get WASM_MODULE_ROOT
docker run --rm --entrypoint sh offchainlabs/nitro-node:v3.2.1-d81324d -c "cat /home/user/target/machines/latest/module-root.txt"
```
