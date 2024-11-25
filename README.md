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

yarn run cmd gen-keystore --mnemonic 'a b c d e f g h i j k l'

yarn run cmd write-config --l3chainId 333000 --l3owner '${l3ownerAddr}'

yarn run cmd print-account --keystore '${keystore-file}' --pass passphrase --type addr | grep -E '^0x' | tr -d '\r\n'

yarn run cmd print-account --keystore '${keystore-file}' --pass passphrase --type pk | grep -E '^0x' | tr -d '\r\n'

yarn run cmd send-coin --url '${l1/l2/l3 url}' --fromkey '${keystore-file}' --frompass passphrase --to '${addr}' --ethamount 0

yarn run cmd send-coin --url '${l1/l2/l3 url}' --fromkey '${privatekey}' --frompass passphrase --to '${addr}' --ethamount 0

# fee token Start
yarn run cmd create-erc20-l1 --l1url '${l1url}' --deployer '${privatekey}' --mintaddr '${addr}' | grep -E '^0x' |  tr -d '\r\n'

yarn run cmd approve-erc20-for-bridge --l1url '${l1url}' --l2url '${l2url}' --token '${nativeTokenL1Address}' --deployer '${l3owner}' --network '${l1l2_network.json}'

yarn run cmd deposit-erc20-l1-to-l2 --l1url '${l1url}' --l2url '${l2url}' --token '${nativeTokenL1Address}' --deployer '${l3owner}' --network '${l1l2_network.json}' --amount '${deposit-amount-eth}'

yarn run cmd print-ChildERC20-l1-to-l2 --l1url '${l1url}' --l2url '${l2url}' --token '${nativeTokenL1Address}' --network '${l1l2_network.json}' | grep -E '^0x' |  tr -d '\r\n'
# fee token End

docker run --rm --entrypoint sh offchainlabs/nitro-node:v3.2.1-d81324d -c "cat /home/user/target/machines/latest/module-root.txt"

# Redis running
docker run --name sqm-redis -d redis:6.2.6
```
