
import { _decorator } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('AdManager')
export class AdManager {
  private static _instance: AdManager | null = null;

  public static get instance(): AdManager {
    if (!AdManager._instance) {
      AdManager._instance = new AdManager();
    }
    return AdManager._instance;
  }

  private _adWatchCount: number = 0;
  private _lastAdTime: number = 0;
  private readonly _AD_MIN_INTERVAL = 60 * 1000;
  private readonly _AD_MAX_DAILY = 15;

  private constructor() {
    this._loadAdData();
  }

  private _loadAdData(): void {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('adWatchDate');
    
    if (savedDate === today) {
      this._adWatchCount = parseInt(localStorage.getItem('adWatchCount') || '0');
    } else {
      this._adWatchCount = 0;
      localStorage.setItem('adWatchDate', today);
      localStorage.setItem('adWatchCount', '0');
    }
    
    this._lastAdTime = parseInt(localStorage.getItem('lastAdTime') || '0');
  }

  private _saveAdData(): void {
    localStorage.setItem('adWatchCount', this._adWatchCount.toString());
    localStorage.setItem('lastAdTime', this._lastAdTime.toString());
  }

  canShowAd(): boolean {
    const now = Date.now();
    
    if (this._adWatchCount &gt;= this._AD_MAX_DAILY) {
      return false;
    }
    
    if (now - this._lastAdTime &lt; this._AD_MIN_INTERVAL) {
      return false;
    }
    
    return true;
  }

  showRewardedVideo(adType: string, callback: (success: boolean) =&gt; void): void {
    if (!this.canShowAd()) {
      callback(false);
      return;
    }

    if (typeof wx !== 'undefined' &amp;&amp; wx.createRewardedVideoAd) {
      const rewardedVideoAd = wx.createRewardedVideoAd({
        adUnitId: 'your_ad_unit_id'
      });

      rewardedVideoAd.load()
        .then(() =&gt; rewardedVideoAd.show())
        .catch(err =&gt; {
          console.log('Ad load error:', err);
          callback(false);
        });

      rewardedVideoAd.onClose((res: any) =&gt; {
        if (res &amp;&amp; res.isEnded || res === undefined) {
          this._adWatchCount++;
          this._lastAdTime = Date.now();
          this._saveAdData();
          callback(true);
        } else {
          callback(false);
        }
      });
    } else {
      console.log('Simulating ad view for:', adType);
      setTimeout(() =&gt; {
        this._adWatchCount++;
        this._lastAdTime = Date.now();
        this._saveAdData();
        callback(true);
      }, 1000);
    }
  }
}
