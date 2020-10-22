export interface IReplication {
  sourceName: string;
  sourceRegion: string;
  targetName: string;
  targetRegion: string;
  branches: string[];
}

export type IConfig = IReplication[];