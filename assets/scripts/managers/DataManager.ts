
import { _decorator, sys } from 'cc';
import { Constants } from '../utils/Constants';

const { ccclass, property } = _decorator;

@ccclass('DataManager')
export class DataManager {
  private static _instance: DataManager | null = null;

  public static get instance(): DataManager {
    if (!DataManager._instance) {
      DataManager._instance = new DataManager();
    }
    return DataManager._instance;
  }

  public highestLevel: number = 1;
  public coins: number = 100;
  public props = {
    tips: 3,
    remove: 1,
    addtime: 2
  };
  public stars: Record&lt;number, number&gt; = {};
  public achievements: Record&lt;string, boolean&gt; = {};
  public lastLoginDate: string = '';
  public loginDays: number = 0;

  private constructor() {
    this.load();
  }

  load(): void {
    this.highestLevel = this.getStorageItem(Constants.STORAGE_KEY_HIGHEST_LEVEL, 1);
    this.coins = this.getStorageItem(Constants.STORAGE_KEY_COINS, 100);
    this.props.tips = this.getStorageItem(Constants.STORAGE_KEY_PROPS_TIPS, 3);
    this.props.remove = this.getStorageItem(Constants.STORAGE_KEY_PROPS_REMOVE, 1);
    this.props.addtime = this.getStorageItem(Constants.STORAGE_KEY_PROPS_ADDTIME, 2);
    this.lastLoginDate = this.getStorageItem(Constants.STORAGE_KEY_LAST_LOGIN_DATE, '');
    this.loginDays = this.getStorageItem(Constants.STORAGE_KEY_LOGIN_DAYS, 0);
    this.achievements = this.getStorageItem(Constants.STORAGE_KEY_ACHIEVEMENTS, {});
    
    for (let i = 1; i &lt;= 999; i++) {
      const stars = this.getStorageItem(Constants.STORAGE_KEY_STARS_PREFIX + i, 0);
      if (stars &gt; 0) {
        this.stars[i] = stars;
      }
    }
    
    this.checkDailyLogin();
  }

  save(): void {
    sys.localStorage.setItem(Constants.STORAGE_KEY_HIGHEST_LEVEL, this.highestLevel.toString());
    sys.localStorage.setItem(Constants.STORAGE_KEY_COINS, this.coins.toString());
    sys.localStorage.setItem(Constants.STORAGE_KEY_PROPS_TIPS, this.props.tips.toString());
    sys.localStorage.setItem(Constants.STORAGE_KEY_PROPS_REMOVE, this.props.remove.toString());
    sys.localStorage.setItem(Constants.STORAGE_KEY_PROPS_ADDTIME, this.props.addtime.toString());
    sys.localStorage.setItem(Constants.STORAGE_KEY_LAST_LOGIN_DATE, this.lastLoginDate);
    sys.localStorage.setItem(Constants.STORAGE_KEY_LOGIN_DAYS, this.loginDays.toString());
    sys.localStorage.setItem(Constants.STORAGE_KEY_ACHIEVEMENTS, JSON.stringify(this.achievements));
    
    for (const level in this.stars) {
      if (this.stars.hasOwnProperty(level)) {
        sys.localStorage.setItem(Constants.STORAGE_KEY_STARS_PREFIX + level, this.stars[level].toString());
      }
    }
  }

  getStars(level: number): number {
    return this.stars[level] || 0;
  }

  setStars(level: number, stars: number): void {
    if (!this.stars[level] || stars &gt; this.stars[level]) {
      this.stars[level] = stars;
    }
    if (level &gt; this.highestLevel) {
      this.highestLevel = level;
    }
    this.save();
  }

  addCoins(amount: number): void {
    this.coins += amount;
    this.save();
  }

  useProp(type: string): boolean {
    switch (type) {
      case 'tips':
        if (this.props.tips &gt; 0) {
          this.props.tips--;
          this.save();
          return true;
        }
        break;
      case 'remove':
        if (this.props.remove &gt; 0) {
          this.props.remove--;
          this.save();
          return true;
        }
        break;
      case 'addtime':
        if (this.props.addtime &gt; 0) {
          this.props.addtime--;
          this.save();
          return true;
        }
        break;
    }
    return false;
  }

  addProp(type: string, count: number = 1): void {
    switch (type) {
      case 'tips':
        this.props.tips += count;
        break;
      case 'remove':
        this.props.remove += count;
        break;
      case 'addtime':
        this.props.addtime += count;
        break;
    }
    this.save();
  }

  unlockAchievement(achievementId: string): boolean {
    if (!this.achievements[achievementId]) {
      this.achievements[achievementId] = true;
      this.save();
      return true;
    }
    return false;
  }

  private getStorageItem(key: string, defaultValue: any): any {
    const value = sys.localStorage.getItem(key);
    if (value === null || value === undefined) {
      return defaultValue;
    }
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  private checkDailyLogin(): void {
    const today = new Date().toISOString().split('T')[0];
    if (this.lastLoginDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (this.lastLoginDate === yesterdayStr) {
        this.loginDays++;
      } else {
        this.loginDays = 1;
      }
      
      this.lastLoginDate = today;
      this.save();
    }
  }
}
