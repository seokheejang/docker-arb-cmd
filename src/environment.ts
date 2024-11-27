import * as path from 'path';

///// Directory /////
const outputPath = 'output';
const accountOutputPath = outputPath + '/account';
const configOutputPath = outputPath + '/config';
const projectRoot = path.resolve(__dirname, '../');
export const OutputDir = path.join(projectRoot, outputPath);
export const AccountOutputDir = path.join(projectRoot, accountOutputPath);
export const L3ChainConfigDir = path.join(projectRoot, configOutputPath, 'l3_chain_config.json');
export const ValJWTDir = path.join(projectRoot, configOutputPath, 'val_jwt.hex');
export const CommonConfigDir = path.join(projectRoot, configOutputPath, 'l3common_config.json');
export const SequencerConfigDir = path.join(projectRoot, configOutputPath, 'l3seq_config.json');
export const BatchPosterConfigDir = path.join(projectRoot, configOutputPath, 'l3bp_config.json');
export const ValidatorConfigDir = path.join(projectRoot, configOutputPath, 'l3val_config.json');
export const RelayerConfigDir = path.join(projectRoot, configOutputPath, 'l3relay_config.json');
export const FullnodeConfigDir = path.join(projectRoot, configOutputPath, 'l3full_config.json');
export const ArchiveConfigDir = path.join(projectRoot, configOutputPath, 'l3archive_config.json');
export const ValidationNodeConfigDir = path.join(projectRoot, configOutputPath, 'l3vn_config.json');

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
///// Contract /////
export const TOKEN = {
  name: 'dKargo',
  symbol: 'DKA',
  initialSupply: '5000000000',
};

///// Domain /////

///// Config /////
export const CommonConfig = {
  chainId: '', // input: write-config --l3chainId
  chainInfoFile: '${CommonChainInfoFile}', // 'l3_chain_info.json',
  chainName: '${CommonChainName}', // 'local',
  httpAddr: '0.0.0.0',
  httpApi: ['net', 'web3', 'eth', 'arb'],
  httpCorsDomain: '*',
  httpPort: 8547,
  wsAddr: '0.0.0.0',
  wsApi: ['net', 'web3', 'eth', 'arb'],
  wsPort: 8548,
  nodeStakerEnable: false,
  parentChainConnectionUrl: '${CommonParentChainConnectionUrl}', // L2 ServiceProvider URL
  parentChainId: '${CommonParentChainId}', // 412346,
  persistentChain: '${CommonPersistentChain}', // local',
  validationWasmAllowedWasmModuleRoots: ['/home/user/nitro-legacy/machines', '/home/user/target/machines'],
};

export const SequencerConfig = {
  nodeSequencer: true,
  nodeStakerEnable: false,
  nodeFeedOutputEnable: true,
  nodeFeedOutputPort: 9642,
  nodeDelayedSequencerEnable: true,
  nodeDelayedSequencerFinalizeDistance: 20,
  nodeDelayedSequencerUseMergeFinality: '${SequencerDelayedSequencerUseMergeFinality}',
  nodeSeqCoordinatorEnable: true,
  nodeSeqCoordinatorMyUrl: '${SequencerSeqCoordinatorUrl}',
  nodeSeqCoordinatorRedisUrl: '${SequencerSeqCoordinatorRedisUrl}',
  nodeSeqCoordinatorDeleteFinalizedMsgs: '${SequencerSeqCoordinatorDeleteFinalizedMsgs}', // true, Precondition: L1 POS
  executionSequencerEnable: true,
  executionSequencerMaxAcceptableTimestampDelta: '730h0m0s',
  executionSequencerMaxTxDataSize: 85000,
};

export const BatchPosterConfig = {
  executionSequencerEnable: false,
  executionForwardingTarget: 'null',
  nodeStakerEnable: false,
  nodeBatchPosterEnable: true,
  nodeBatchPosterRedisSignerSigningKey: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  nodeBatchPosterWaitForL1Finality: '${BatchPosterWaitForL1Finality}',
  nodeBatchPosterL1BlockBound: 'ignore',
  nodeBatchPosterMaxDelay: '${BatchPosterNodeBatchPosterMaxDelay}', // '30s'
  nodeBatchPosterMaxSize: '${BatchPosterNodeBatchPosterMaxSize}', // 85000
  nodeBatchPosterParentChainWalletAccount: '${BatchPosterParentChainWalletAccount}', //'address',
  nodeBatchPosterParentChainWalletPassword: '${BatchPosterParentChainWalletPassword}', //'pass',
  nodeBatchPosterParentChainWalletPathname: '${BatchPosterParentChainWalletPathname}', // 'keystore (volume path)',
  nodeBatchPosterRedisUrl: '${BatchPosterRedisUrl}', // 'redis url (domain)',
  nodeSeqCoordinatorEnable: true,
  nodeSeqCoordinatorMyUrl: '${BatchPosterSeqCoordinatorUrl}', // ''
  nodeSeqCoordinatorRedisUrl: '${BatchPosterRedisUrl}', // 'redis url (domain)',
};

export const ValidatorConfig = {
  executionSequencerEnable: false,
  executionForwardingTarget: 'null',
  nodeBlockValidatorEnable: true,
  nodeBlockValidatorValidationServerJwtSecret: '${ValidatorValidationServerJwtSecret}', // 'val_jwt.hex (volume path)',
  nodeBlockValidatorValidationServerUrl: '${ValidatorValidationServerUrl}', // 'validator_node url',
  nodeStakerEnable: true,
  nodeStakerStrategy: 'MakeNodes',
  nodeStakerMakeAssertionInterval: '10s',
  nodeStakerParentChainWalletAccount: '${ValidatorStakerParentChainWalletAccount}', // 'address',
  nodeStakerParentChainWalletPassword: '${ValidatorStakerParentChainWalletPassword}', // 'pass',
  nodeStakerParentChainWalletPathname: '${ValidatorStakerParentChainWalletPathname}', // 'keystore (volume path)',
  nodeStakerRedisUrl: '${ValidatorStakerRedisUrl}', // 'redis url (domain)',
  nodeStakerInterval: '1m0s',
};

export const RelayerConfig = {
  executionForwardingTarget: '${RelayerForwardingTarget}', // main sequencer url (domain)
  executionSecondaryForwardingTarget: ['${RelayerSecondaryForwardingTarget.arr}'], // ['sub sequencer url (domain)']
  nodeFeedInputUrl: '${RelayerFeedInputUrl}', // main sequencer url (domain)
  nodeFeedInputSecondaryUrl: ['${RelayerFeedInputSecondaryUrl.arr}'], // ['sub sequencer url (domain)']
  nodeFeedOutputEnable: true,
  nodeFeedOutputPort: 9642,
};

export const FullnodeConfig = {
  executionForwardingTarget: '${FullnodeForwardingTarget}', //'relayer url (domain)'
  nodeFeedInputUrl: '${FullnodeFeedInputUrl}', // 'relayer url (domain)'
  nodeFeedOutputEnable: true,
  nodeFeedOutputPort: 9642,
};

export const ArchiveConfig = {
  executionCachingArchive: true,
  executionForwardingTarget: '${ArchiveForwardingTarget}', //relayer url (domain)'
  nodeFeedInputUrl: '${ArchiveFeedInputUrl}', // relayer url (domain)'
  nodeFeedOutputEnable: true,
  nodeFeedOutputPort: 9642,
};

export const ValidationNodeConfig = {
  authAddr: '0.0.0.0',
  authJwtSecret: '${ValidationNodeJwtSecret}', // val_jwt.hex',
  persistentChain: '${ValidationNodePersistentChain}', // local',
  validationApiAuth: true,
  validationApiPublic: false,
};
