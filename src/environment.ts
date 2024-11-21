import * as path from 'path';

///// Directory /////
const outputPath = 'output';
const accountOutputPath = outputPath + '/account';
const configOutputPath = outputPath + '/config';
const projectRoot = path.resolve(__dirname, '../');
export const OutputDir = path.join(projectRoot, outputPath);
export const AccountOutputDir = path.join(projectRoot, accountOutputPath);
export const ValJWTDir = path.join(projectRoot, configOutputPath, 'val_jwt.hex');
export const CommonConfigDir = path.join(projectRoot, configOutputPath, 'l3common_config.json');
export const SequencerConfigDir = path.join(projectRoot, configOutputPath, 'l3seq_config.json');
export const BatchPosterConfigDir = path.join(projectRoot, configOutputPath, 'l3bp_config.json');
export const ValidatorConfigDir = path.join(projectRoot, configOutputPath, 'l3val_config.json');
export const RelayerConfigDir = path.join(projectRoot, configOutputPath, 'l3relay_config.json');
export const FullnodeConfigDir = path.join(projectRoot, configOutputPath, 'l3full_config.json');
export const ArchiveConfigDir = path.join(projectRoot, configOutputPath, 'l3archive_config.json');

export const valJWT = `0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`;

///// Account /////
export const passphrase = 'passphrase';
export const roles: Record<number, string> = {
  5: 'owner-01',
  11: 'sequencer-01',
  21: 'batch-poster-01',
  22: 'batch-poster-02',
  23: 'batch-poster-03',
  24: 'batch-poster-04',
  31: 'validator-01',
  32: 'validator-02',
  33: 'validator-03',
  34: 'validator-04',
  99: 'funnel',
};

///// Domain /////

///// Config /////
export const CommonConfig = {
  chainId: 12345,
  chainInfoFile: 'l3chain_info.json',
  chainName: 'local',
  httpAddr: '0.0.0.0',
  httpApi: ['net', 'web3', 'eth', 'arb'],
  httpCorsDomain: '*',
  httpPort: 8547,
  wsAddr: '0.0.0.0',
  wsApi: ['net', 'web3', 'eth', 'arb'],
  wsPort: 8545,
  nodeStakerEnable: false,
  nodeFeedOutputPort: 9642,
  parentChainConnectionUrl: 'l2_url',
  parentChainId: 412346,
  persistentChain: 'local',
  validationWasmAllowedWasmModuleRoots: ['/home/user/nitro-legacy/machines', '/home/user/target/machines'],
};

export const SequencerConfig = {
  maxAcceptableTimestampDelta: '730h0m0s',
  maxTxDataSize: 85000,
  delayedSequencerEnable: true,
  delayedSequencerFinalizeDistance: 20,
  delayedSequencerUseMergeFinality: true,
  feedOutputEnable: true,
  seqCoordinatorEnable: true,
  seqCoordinatorUrl: 'my url (domain)',
  seqCoordinatorRedisUrl: 'redis url (domain)',
};

export const BatchPosterConfig = {
  batchPosterEnable: true,
  redisSignerKey: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  waitForL1Finality: true,
  l1BlockBound: 'ignore',
  maxDelay: '30s',
  maxSize: 90000,
  parentChainWalletAccount: 'address',
  parentChainWalletPassword: 'pass',
  parentChainWalletPathname: 'keystore (volume path)',
  redisUrl: 'redis url (domain)',
};

export const ValidatorConfig = {
  blockValidatorEnable: false,
  validationServerJwtSecret: 'val_jwt.hex (volume path)',
  validationServerUrl: 'validator_node url',
  stakerEnable: true,
  stakerStrategy: 'MakeNodes',
  makeAssertionInterval: '10s',
  stakerParentChainWalletAccount: 'address',
  stakerParentChainWalletPassword: 'pass',
  stakerParentChainWalletPathname: 'keystore (volume path)',
  stakerRedisUrl: 'redis url (domain)',
  stakerInterval: '1m0s',
};

export const RelayerConfig = {
  forwardingTarget: 'main sequencer url (domain)',
  secondaryForwardingTarget: ['sub sequencer url (domain)'],
  feedInputUrl: 'main sequencer url (domain)',
  feedInputSecondaryUrl: ['sub sequencer url (domain)'],
  feedOutputEnable: true,
};

export const FullnodeConfig = {
  forwardingTarget: 'relayer url (domain)',
  feedInputUrl: 'relayer url (domain)',
  feedOutputEnable: true,
};

export const ArchiveConfig = {
  cachingArchive: true,
  forwardingTarget: 'relayer url (domain)',
  feedInputUrl: 'relayer url (domain)',
  feedOutputEnable: true,
};
