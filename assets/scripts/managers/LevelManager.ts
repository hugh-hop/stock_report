
import { _decorator } from 'cc';

const { ccclass, property } = _decorator;

export interface LevelConfig {
  level: number;
  gridSize: number;
  iconCount: number;
  timeLimit: number;
  targetPairs: number;
}

@ccclass('LevelManager')
export class LevelManager {
  private static _instance: LevelManager | null = null;

  public static get instance(): LevelManager {
    if (!LevelManager._instance) {
      LevelManager._instance = new LevelManager();
    }
    return LevelManager._instance;
  }

  private constructor() {}

  getLevelConfig(level: number): LevelConfig {
    if (level &lt;= 5) {
      return {
        level: level,
        gridSize: 4,
        iconCount: 4,
        timeLimit: 60,
        targetPairs: 8
      };
    } else if (level &lt;= 10) {
      return {
        level: level,
        gridSize: 4,
        iconCount: 5,
        timeLimit: 50,
        targetPairs: 10
      };
    } else if (level &lt;= 20) {
      return {
        level: level,
        gridSize: 5,
        iconCount: 6,
        timeLimit: 45,
        targetPairs: 15
      };
    } else if (level &lt;= 50) {
      return {
        level: level,
        gridSize: 5,
        iconCount: 7,
        timeLimit: 40,
        targetPairs: 18
      };
    } else {
      return {
        level: level,
        gridSize: 5,
        iconCount: 8,
        timeLimit: 35,
        targetPairs: 20
      };
    }
  }

  getGridSize(level: number): number {
    return this.getLevelConfig(level).gridSize;
  }

  getIconCount(level: number): number {
    return this.getLevelConfig(level).iconCount;
  }

  getTimeLimit(level: number): number {
    return this.getLevelConfig(level).timeLimit;
  }

  getTargetPairs(level: number): number {
    return this.getLevelConfig(level).targetPairs;
  }

  calculateStars(level: number, usedTime: number): number {
    const config = this.getLevelConfig(level);
    const timeRatio = usedTime / config.timeLimit;
    
    if (timeRatio &lt;= 0.5) {
      return 3;
    } else if (timeRatio &lt;= 0.8) {
      return 2;
    } else {
      return 1;
    }
  }
}
