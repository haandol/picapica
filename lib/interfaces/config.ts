import { IConfig } from './interface';

export const Account = '';            // your account id
export const Region = 'us-west-2';    // source region

export const StackProps = {
  env: {
    account: Account,
    region: Region,
  }
};

export const Config: IConfig = [
  /*
  {
    sourceName: 'card-service',
    sourceRegion: 'us-west-2',
    targetName: 'card-service',
    targetRegion: 'ap-northeast-2',
    branches: ['mainline'],
  },
  {
    sourceName: 'rule-service',
    sourceRegion: 'us-west-2',
    targetName: 'rule-service',
    targetRegion: 'ap-northeast-2',
    branches: ['mainline'],
  },
  {
    sourceName: 'ecs-pipeline',
    sourceRegion: 'us-west-2',
    targetName: 'ecs-pipeline',
    targetRegion: 'ap-northeast-2',
    branches: ['mainline'],
  },
  */
];