export interface IReplication {
  source: {
    account: string;
    region: string;
    repository: string;
  },
  target: {
    account?: string;
    region: string;
    repository: string;
    branches: string[];
  }
}

export type IConfig = IReplication[];