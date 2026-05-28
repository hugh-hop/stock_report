
import { _decorator } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('SocialManager')
export class SocialManager {
  private static _instance: SocialManager | null = null;

  public static get instance(): SocialManager {
    if (!SocialManager._instance) {
      SocialManager._instance = new SocialManager();
    }
    return SocialManager._instance;
  }

  private constructor() {}

  share(level: number, success: boolean, stars: number): void {
    let title = '';
    let imageUrl = '';
    let query = '';

    if (success) {
      title = `我在消除达人通关了第${level}关，获得了${stars}颗星！`;
      query = `level=${level}&amp;stars=${stars}`;
    } else {
      title = `我在消除达人第${level}关失败了，快来帮我过关！`;
      query = `level=${level}`;
    }

    if (typeof wx !== 'undefined' &amp;&amp; wx.shareAppMessage) {
      wx.shareAppMessage({
        title: title,
        imageUrl: imageUrl,
        query: query
      });
    } else {
      console.log('Simulating share:', title);
    }
  }

  async getRankList(): Promise&lt;any[]&gt; {
    if (typeof wx !== 'undefined' &amp;&amp; wx.getFriendCloudStorage) {
      return new Promise((resolve) =&gt; {
        wx.getFriendCloudStorage({
          keyList: ['highestLevel', 'totalStars'],
          success: (res: any) =&gt; {
            const rankList = res.data.map((item: any) =&gt; {
              const highestLevel = item.KVData.find((kv: any) =&gt; kv.key === 'highestLevel');
              const totalStars = item.KVData.find((kv: any) =&gt; kv.key === 'totalStars');
              return {
                nickname: item.nickname,
                avatarUrl: item.avatarUrl,
                highestLevel: highestLevel ? parseInt(highestLevel.value) : 0,
                totalStars: totalStars ? parseInt(totalStars.value) : 0
              };
            }).sort((a: any, b: any) =&gt; {
              if (b.highestLevel !== a.highestLevel) {
                return b.highestLevel - a.highestLevel;
              }
              return b.totalStars - a.totalStars;
            });
            resolve(rankList);
          },
          fail: () =&gt; {
            resolve(this._getMockRankList());
          }
        });
      });
    } else {
      return this._getMockRankList();
    }
  }

  async submitScore(level: number, stars: number): Promise&lt;void&gt; {
    if (typeof wx !== 'undefined' &amp;&amp; wx.setUserCloudStorage) {
      return new Promise((resolve) =&gt; {
        wx.setUserCloudStorage({
          KVDataList: [
            { key: 'highestLevel', value: level.toString() },
            { key: 'totalStars', value: stars.toString() }
          ],
          success: () =&gt; {
            resolve();
          },
          fail: () =&gt; {
            resolve();
          }
        });
      });
    } else {
      console.log('Simulating score submit:', { level, stars });
    }
  }

  private _getMockRankList(): any[] {
    return [
      { nickname: '玩家1', avatarUrl: '', highestLevel: 50, totalStars: 120 },
      { nickname: '玩家2', avatarUrl: '', highestLevel: 45, totalStars: 110 },
      { nickname: '玩家3', avatarUrl: '', highestLevel: 40, totalStars: 100 }
    ];
  }
}
