import { IConfig } from './interface';

export const Account = '043490748814';      // your account id
export const Region = 'us-west-2';          // source region

export const StackProps = {
  env: {
    account: Account,
    region: Region,
  }
};

export const Config: IConfig = [
  {
    source: {
      account: Account,
      region: Region,
      repository: 'card-service',
    },
    target: {
      region: 'ap-northeast-2',
      repository: 'card-service',
      branches: ['mainline'],
    }
  },
  {
    source: {
      account: Account,
      region: Region,
      repository: 'rule-service',
    },
    target: {
      region: 'ap-northeast-2',
      repository: 'rule-service',
      branches: ['mainline'],
    }
  },
  {
    source: {
      account: Account,
      region: Region,
      repository: 'ecs-pipeline',
    },
    target: {
      region: 'ap-northeast-2',
      repository: 'ecs-pipeline',
      branches: ['mainline'],
    }
  },
];