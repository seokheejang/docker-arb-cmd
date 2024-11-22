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

yarn run cmd write-config

yarn run cmd print-account --keystore '${keystore-file}' --pass passphrase --type addr | grep -E '^0x' | sed 's/%$//' | tr -d '\r\n'

yarn run cmd print-account --keystore '${keystore-file}' --pass passphrase --type pk | grep -E '^0x' | tr -d '\r\n'

yarn run cmd send-coin --url '${l3url}' --fromkey '${keystore-file}' --frompass passphrase --to '${addr}' --ethamount 0

yarn run cmd send-coin --url '${l3url}' --fromkey '${privatekey}' --frompass passphrase --to '${addr}' --ethamount 0
```
