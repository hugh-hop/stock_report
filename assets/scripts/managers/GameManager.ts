
import { _decorator, director } from 'cc';
import { Constants } from '../utils/Constants';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager {
  private static _instance: GameManager | null = null;

  public static get instance(): GameManager {
    if (!GameManager._instance) {
      GameManager._instance = new GameManager();
    }
    return GameManager._instance;
  }

  public currentLevel: number = 1;
  public gameResult: {
    success: boolean;
    usedTime: number;
    stars: number;
    coins: number;
  } | null = null;

  private constructor() {}

  init(): void {
  }

  changeScene(sceneName: string): void {
    director.loadScene(sceneName);
  }

  startLevel(level: number): void {
    this.currentLevel = level;
    this.gameResult = null;
    this.changeScene(Constants.SCENE_GAME);
  }

  endLevel(success: boolean, usedTime: number = 0): void {
    this.gameResult = {
      success: success,
      usedTime: usedTime,
      stars: 0,
      coins: success ? 50 : 10
    };
    this.changeScene(Constants.SCENE_RESULT);
  }

  goToLevelSelect(): void {
    this.changeScene(Constants.SCENE_LEVEL_SELECT);
  }

  goToStart(): void {
    this.changeScene(Constants.SCENE_START);
  }

  retryLevel(): void {
    this.startLevel(this.currentLevel);
  }

  nextLevel(): void {
    this.startLevel(this.currentLevel + 1);
  }
}
