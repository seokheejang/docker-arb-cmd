import * as fs from 'fs';
import * as path from 'path';
import {
  ValJWTDir,
  valJWT,
  L3ChainConfigDir,
  CommonConfigDir,
  SequencerConfigDir,
  BatchPosterConfigDir,
  ValidatorConfigDir,
  RelayerConfigDir,
  FullnodeConfigDir,
  ArchiveConfigDir,
  ValidationNodeConfigDir,
  CommonConfig,
  SequencerConfig,
  BatchPosterConfig,
  ValidatorConfig,
  RelayerConfig,
  FullnodeConfig,
  ArchiveConfig,
  ValidationNodeConfig,
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

  let l3chainId;
  if (typeof argv.l3chainId === 'string' || typeof argv.l3chainId === 'number') {
    l3chainId = parseInt(argv.l3chainId, 10);
  } else {
    console.log('l3chainId is wrong', l3chainId);
    return;
  }

  /// Chain Conifg ///
  const l3ChainConfig = {
    chainId: l3chainId,
    homesteadBlock: 0,
    daoForkSupport: true,
    eip150Block: 0,
    eip150Hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    eip155Block: 0,
    eip158Block: 0,
    byzantiumBlock: 0,
    constantinopleBlock: 0,
    petersburgBlock: 0,
    istanbulBlock: 0,
    muirGlacierBlock: 0,
    berlinBlock: 0,
    londonBlock: 0,
    clique: {
      period: 0,
      epoch: 0,
    },
    arbitrum: {
      EnableArbOS: true,
      AllowDebugPrecompiles: true,
      DataAvailabilityCommittee: false,
      InitialArbOSVersion: 31,
      InitialChainOwner: argv.l3owner,
      GenesisBlockNum: 0,
    },
  };
  const l3ChainConfigJSON = JSON.stringify(l3ChainConfig);
  fs.writeFileSync(L3ChainConfigDir, l3ChainConfigJSON);

  /// Node Exec Config ///
  const commonConfig = {
    chain: {
      id: l3chainId,
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
        enable: SequencerConfig.executionSequencerEnable,
        'max-acceptable-timestamp-delta': SequencerConfig.executionSequencerMaxAcceptableTimestampDelta,
        'max-tx-data-size': SequencerConfig.executionSequencerMaxTxDataSize,
      },
    },
    node: {
      staker: {
        enable: SequencerConfig.nodeStakerEnable,
      },
      sequencer: SequencerConfig.nodeSequencer,
      'delayed-sequencer': {
        enable: SequencerConfig.nodeDelayedSequencerEnable,
        'finalize-distance': SequencerConfig.nodeDelayedSequencerFinalizeDistance,
        'use-merge-finality': SequencerConfig.nodeDelayedSequencerUseMergeFinality,
      },
      feed: {
        output: {
          enable: SequencerConfig.nodeFeedOutputEnable,
          port: SequencerConfig.nodeFeedOutputPort,
        },
      },
      'seq-coordinator': {
        enable: SequencerConfig.nodeSeqCoordinatorEnable,
        'my-url': SequencerConfig.nodeSeqCoordinatorMyUrl,
        'redis-url': SequencerConfig.nodeSeqCoordinatorRedisUrl,
        'delete-finalized-msgs': SequencerConfig.nodeSeqCoordinatorDeleteFinalizedMsgs,
      },
    },
  };
  fs.writeFileSync(SequencerConfigDir, JSON.stringify(sequencerConf));
  console.log('Config written to', SequencerConfigDir);

  const batchPosterConf = {
    ...commonConfig,
    execution: {
      sequencer: {
        enable: BatchPosterConfig.executionSequencerEnable,
      },
      'forwarding-target': BatchPosterConfig.executionForwardingTarget,
    },
    node: {
      staker: { enable: BatchPosterConfig.nodeStakerEnable },
      'batch-poster': {
        enable: BatchPosterConfig.nodeBatchPosterEnable,
        'data-poster': {
          'redis-signer': {
            'signing-key': BatchPosterConfig.nodeBatchPosterRedisSignerSigningKey,
          },
          'wait-for-l1-finality': BatchPosterConfig.nodeBatchPosterWaitForL1Finality,
        },
        'l1-block-bound': BatchPosterConfig.nodeBatchPosterL1BlockBound,
        'max-delay': BatchPosterConfig.nodeBatchPosterMaxDelay,
        'max-size': BatchPosterConfig.nodeBatchPosterMaxSize,
        'parent-chain-wallet': {
          account: BatchPosterConfig.nodeBatchPosterParentChainWalletAccount,
          password: BatchPosterConfig.nodeBatchPosterParentChainWalletPassword,
          pathname: BatchPosterConfig.nodeBatchPosterParentChainWalletPathname,
        },
        'redis-url': BatchPosterConfig.nodeBatchPosterRedisUrl,
      },
      'seq-coordinator': {
        enable: BatchPosterConfig.nodeSeqCoordinatorEnable,
        'my-url': BatchPosterConfig.nodeSeqCoordinatorMyUrl,
        'redis-url': BatchPosterConfig.nodeSeqCoordinatorRedisUrl,
      },
    },
  };
  fs.writeFileSync(BatchPosterConfigDir, JSON.stringify(batchPosterConf));
  console.log('Config written to', BatchPosterConfigDir);

  const validatorConf = {
    ...commonConfig,
    execution: {
      sequencer: {
        enable: ValidatorConfig.executionSequencerEnable,
      },
      'forwarding-target': ValidatorConfig.executionForwardingTarget,
    },
    node: {
      'block-validator': {
        enable: ValidatorConfig.nodeBlockValidatorEnable,
        'validation-server': {
          jwtsecret: ValidatorConfig.nodeBlockValidatorValidationServerJwtSecret,
          url: ValidatorConfig.nodeBlockValidatorValidationServerUrl,
        },
      },
      staker: {
        enable: ValidatorConfig.nodeStakerEnable,
        strategy: ValidatorConfig.nodeStakerStrategy,
        'make-assertion-interval': ValidatorConfig.nodeStakerMakeAssertionInterval,
        'parent-chain-wallet': {
          account: ValidatorConfig.nodeStakerParentChainWalletAccount,
          password: ValidatorConfig.nodeStakerParentChainWalletPassword,
          pathname: ValidatorConfig.nodeStakerParentChainWalletPathname,
        },
        'redis-url': ValidatorConfig.nodeStakerRedisUrl,
        'staker-interval': ValidatorConfig.nodeStakerInterval,
        'use-smart-contract-wallet': ValidatorConfig.nodeStakerUseSmartContractWallet,
        dangerous: { 'without-block-validator': ValidatorConfig.nodeStakerDangerousWithoutBlockValidator },
      },
    },
  };
  fs.writeFileSync(ValidatorConfigDir, JSON.stringify(validatorConf));
  console.log('Config written to', ValidatorConfigDir);

  const relayerConf = {
    ...commonConfig,
    execution: {
      'forwarding-target': RelayerConfig.executionForwardingTarget,
      'secondary-forwarding-target': RelayerConfig.executionSecondaryForwardingTarget,
    },
    node: {
      staker: {
        enable: RelayerConfig.nodeStakerEnable,
      },
      feed: {
        input: {
          url: RelayerConfig.nodeFeedInputUrl,
          'secondary-url': RelayerConfig.nodeFeedInputSecondaryUrl,
        },
        output: {
          enable: RelayerConfig.nodeFeedOutputEnable,
          port: RelayerConfig.nodeFeedOutputPort,
        },
      },
    },
  };
  fs.writeFileSync(RelayerConfigDir, JSON.stringify(relayerConf));
  console.log('Config written to', RelayerConfigDir);

  const fullnodeConf = {
    ...commonConfig,
    execution: {
      'forwarding-target': FullnodeConfig.executionForwardingTarget,
    },
    node: {
      staker: {
        enable: FullnodeConfig.nodeStakerEnable,
      },
      feed: {
        input: {
          url: FullnodeConfig.nodeFeedInputUrl,
        },
        output: {
          enable: FullnodeConfig.nodeFeedOutputEnable,
          port: FullnodeConfig.nodeFeedOutputPort,
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
        archive: ArchiveConfig.executionCachingArchive,
      },
      'forwarding-target': ArchiveConfig.executionForwardingTarget,
    },
    node: {
      staker: {
        enable: ArchiveConfig.nodeStakerEnable,
      },
      feed: {
        input: {
          url: ArchiveConfig.nodeFeedInputUrl,
        },
        output: {
          enable: ArchiveConfig.nodeFeedOutputEnable,
          port: ArchiveConfig.nodeFeedOutputPort,
        },
      },
    },
  };
  archiveConf.ws.api = ArchiveConfig.wsApi;

  fs.writeFileSync(ArchiveConfigDir, JSON.stringify(archiveConf));
  console.log('Config written to', ArchiveConfigDir);

  const validationNodeConf = {
    auth: {
      addr: ValidationNodeConfig.authAddr,
      jwtsecret: ValidationNodeConfig.authJwtSecret,
    },
    persistent: {
      chain: ValidationNodeConfig.persistentChain,
    },
    validation: {
      'api-auth': ValidationNodeConfig.validationApiAuth,
      'api-public': ValidationNodeConfig.validationApiPublic,
    },
  };
  fs.writeFileSync(ValidationNodeConfigDir, JSON.stringify(validationNodeConf));
  console.log('Config written to', ValidationNodeConfigDir);
}
