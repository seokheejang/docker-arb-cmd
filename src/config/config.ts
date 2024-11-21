import * as fs from 'fs';
import * as path from 'path';
import {
  ValJWTDir,
  valJWT,
  CommonConfigDir,
  SequencerConfigDir,
  BatchPosterConfigDir,
  ValidatorConfigDir,
  RelayerConfigDir,
  FullnodeConfigDir,
  ArchiveConfigDir,
  CommonConfig,
  SequencerConfig,
  BatchPosterConfig,
  ValidatorConfig,
  RelayerConfig,
  FullnodeConfig,
  ArchiveConfig,
} from '../environment';

/**
 * 선행 조건
 *  1. l3_chain_info.json 파일 존재
 *
 * @param argv
 */
export function writeConfigs(argv: any) {
  const dir = path.dirname(ValJWTDir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(ValJWTDir, valJWT);

  // @
  const valJwtSecret = '/home/volume/' + 'val_jwt.hex';

  const commonConfig = {
    chain: {
      id: CommonConfig.chainId,
      'info-files': [CommonConfig.chainInfoFile],
      name: CommonConfig.chainName,
    },
    http: {
      addr: CommonConfig.httpAddr,
      api: CommonConfig.httpApi,
      corsdomain: CommonConfig.httpCorsDomain,
      port: CommonConfig.httpPort,
      vhosts: '*',
    },
    ws: {
      addr: CommonConfig.wsAddr,
      api: CommonConfig.wsApi,
      port: CommonConfig.wsPort,
    },
    node: {
      staker: {
        enable: CommonConfig.nodeStakerEnable,
      },
      feed: {
        output: {
          port: CommonConfig.nodeFeedOutputPort,
        },
      },
    },
    'parent-chain': {
      connection: {
        url: CommonConfig.parentChainConnectionUrl,
      },
      id: CommonConfig.parentChainId,
    },
    persistent: {
      chain: CommonConfig.persistentChain,
    },
    validation: {
      wasm: {
        'allowed-wasm-module-roots': CommonConfig.validationWasmAllowedWasmModuleRoots,
      },
    },
  };
  fs.writeFileSync(CommonConfigDir, JSON.stringify(commonConfig));
  console.log('Config written to', CommonConfigDir);

  const sequencerConf = {
    ...commonConfig,
    execution: {
      sequencer: {
        'max-acceptable-timestamp-delta': SequencerConfig.maxAcceptableTimestampDelta,
        'max-tx-data-size': SequencerConfig.maxTxDataSize,
      },
    },
    node: {
      'delayed-sequencer': {
        enable: SequencerConfig.delayedSequencerEnable,
        'finalize-distance': SequencerConfig.delayedSequencerFinalizeDistance,
        'use-merge-finality': SequencerConfig.delayedSequencerUseMergeFinality,
      },
      feed: {
        output: {
          enable: SequencerConfig.feedOutputEnable,
        },
      },
      'seq-coordinator': {
        enable: SequencerConfig.seqCoordinatorEnable,
        'my-url': SequencerConfig.seqCoordinatorUrl,
        'redis-url': SequencerConfig.seqCoordinatorRedisUrl,
      },
    },
  };
  fs.writeFileSync(SequencerConfigDir, JSON.stringify(sequencerConf));
  console.log('Config written to', SequencerConfigDir);

  const batchPosterConf = {
    ...commonConfig,
    node: {
      batchPoster: {
        enable: BatchPosterConfig.batchPosterEnable,
        'data-poster': {
          'redis-signer': {
            'signing-key': BatchPosterConfig.redisSignerKey,
          },
          'wait-for-l1-finality': BatchPosterConfig.waitForL1Finality,
        },
        'l1-block-bound': BatchPosterConfig.l1BlockBound,
        'max-delay': BatchPosterConfig.maxDelay,
        'max-size': BatchPosterConfig.maxSize,
        'parent-chain-wallet': {
          account: BatchPosterConfig.parentChainWalletAccount,
          password: BatchPosterConfig.parentChainWalletPassword,
          pathname: BatchPosterConfig.parentChainWalletPathname,
        },
        'redis-url': BatchPosterConfig.redisUrl,
      },
    },
  };
  fs.writeFileSync(BatchPosterConfigDir, JSON.stringify(batchPosterConf));
  console.log('Config written to', BatchPosterConfigDir);

  const validatorConf = {
    ...commonConfig,
    node: {
      'block-validator': {
        enable: ValidatorConfig.blockValidatorEnable,
        'validation-server': {
          jwtsecret: ValidatorConfig.validationServerJwtSecret,
          url: ValidatorConfig.validationServerUrl,
        },
      },
      staker: {
        enable: ValidatorConfig.stakerEnable,
        strategy: ValidatorConfig.stakerStrategy,
        'make-assertion-interval': ValidatorConfig.makeAssertionInterval,
        'parent-chain-wallet': {
          account: ValidatorConfig.stakerParentChainWalletAccount,
          password: ValidatorConfig.stakerParentChainWalletPassword,
          pathname: ValidatorConfig.stakerParentChainWalletPathname,
        },
        'redis-url': ValidatorConfig.stakerRedisUrl,
        'staker-interval': ValidatorConfig.stakerInterval,
      },
    },
  };
  fs.writeFileSync(ValidatorConfigDir, JSON.stringify(validatorConf));
  console.log('Config written to', ValidatorConfigDir);

  const relayerConf = {
    ...commonConfig,
    execution: {
      'forwarding-target': RelayerConfig.forwardingTarget,
      'secondary-forwarding-target': RelayerConfig.secondaryForwardingTarget,
    },
    node: {
      feed: {
        input: {
          url: RelayerConfig.feedInputUrl,
          'secondary-url': RelayerConfig.feedInputSecondaryUrl,
        },
        output: {
          enable: RelayerConfig.feedOutputEnable,
        },
      },
    },
  };
  fs.writeFileSync(RelayerConfigDir, JSON.stringify(relayerConf));
  console.log('Config written to', RelayerConfigDir);

  const fullnodeConf = {
    ...commonConfig,
    execution: {
      'forwarding-target': FullnodeConfig.forwardingTarget,
    },
    node: {
      feed: {
        input: {
          url: FullnodeConfig.feedInputUrl,
        },
        output: {
          enable: FullnodeConfig.feedOutputEnable,
        },
      },
    },
  };
  fs.writeFileSync(FullnodeConfigDir, JSON.stringify(fullnodeConf));
  console.log('Config written to', FullnodeConfigDir);

  const archiveConf = {
    ...commonConfig,
    execution: {
      caching: {
        archive: ArchiveConfig.cachingArchive,
      },
      'forwarding-target': ArchiveConfig.forwardingTarget,
    },
    node: {
      feed: {
        input: {
          url: ArchiveConfig.feedInputUrl,
        },
        output: {
          enable: ArchiveConfig.feedOutputEnable,
        },
      },
    },
  };
  fs.writeFileSync(ArchiveConfigDir, JSON.stringify(archiveConf));
  console.log('Config written to', ArchiveConfigDir);
}
