
import { _decorator, Component, Node, Button, Label } from 'cc';
import { GameManager } from '../managers/GameManager';
import { DataManager } from '../managers/DataManager';
import { LevelManager } from '../managers/LevelManager';
import { AdManager } from '../managers/AdManager';
import { SocialManager } from '../managers/SocialManager';
import { Constants } from '../utils/Constants';

const { ccclass, property } = _decorator;

@ccclass('ResultUI')
export class ResultUI extends Component {
  @property(Node)
  successPanel: Node | null = null;

  @property(Node)
  failurePanel: Node | null = null;

  @property(Label)
  levelLabel: Label | null = null;

  @property(Label)
  timeLabel: Label | null = null;

  @property(Label)
  coinsLabel: Label | null = null;

  @property(Node)
  starsContainer: Node | null = null;

  @property(Button)
  doubleRewardButton: Button | null = null;

  @property(Button)
  claimRewardButton: Button | null = null;

  @property(Button)
  nextLevelButton: Button | null = null;

  @property(Button)
  retryButton: Button | null = null;

  @property(Button)
  reviveButton: Button | null = null;

  @property(Button)
  shareButton: Button | null = null;

  @property(Button)
  backButton: Button | null = null;

  private _gameManager: GameManager;
  private _dataManager: DataManager;
  private _levelManager: LevelManager;
  private _adManager: AdManager;
  private _socialManager: SocialManager;

  private _isSuccess: boolean = false;
  private _usedTime: number = 0;
  private _stars: number = 0;
  private _rewardClaimed: boolean = false;
  private _baseCoins: number = 0;

  onLoad(): void {
    this._gameManager = GameManager.instance;
    this._dataManager = DataManager.instance;
    this._levelManager = LevelManager.instance;
    this._adManager = AdManager.instance;
    this._socialManager = SocialManager.instance;

    if (this.doubleRewardButton) {
      this.doubleRewardButton.node.on(Button.EventType.CLICK, this._onDoubleRewardClick, this);
    }

    if (this.claimRewardButton) {
      this.claimRewardButton.node.on(Button.EventType.CLICK, this._onClaimRewardClick, this);
    }

    if (this.nextLevelButton) {
      this.nextLevelButton.node.on(Button.EventType.CLICK, this._onNextLevelClick, this);
    }

    if (this.retryButton) {
      this.retryButton.node.on(Button.EventType.CLICK, this._onRetryClick, this);
    }

    if (this.reviveButton) {
      this.reviveButton.node.on(Button.EventType.CLICK, this._onReviveClick, this);
    }

    if (this.shareButton) {
      this.shareButton.node.on(Button.EventType.CLICK, this._onShareClick, this);
    }

    if (this.backButton) {
      this.backButton.node.on(Button.EventType.CLICK, this._onBackClick, this);
    }

    this._initUI();
  }

  private _initUI(): void {
    if (!this._gameManager.gameResult) return;

    this._isSuccess = this._gameManager.gameResult.success;
    this._usedTime = this._gameManager.gameResult.usedTime;
    this._baseCoins = this._isSuccess ? 50 : 10;

    if (this.successPanel) {
      this.successPanel.active = this._isSuccess;
    }

    if (this.failurePanel) {
      this.failurePanel.active = !this._isSuccess;
    }

    if (this.levelLabel) {
      this.levelLabel.string = `第 ${this._gameManager.currentLevel} 关`;
    }

    if (this.timeLabel) {
      const minutes = Math.floor(this._usedTime / 60);
      const seconds = Math.floor(this._usedTime % 60);
      this.timeLabel.string = `用时: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    if (this._isSuccess) {
      this._stars = this._levelManager.calculateStars(this._gameManager.currentLevel, this._usedTime);
      this._updateStars();
    }

    this._updateCoinsUI();
  }

  private _updateStars(): void {
    if (this.starsContainer) {
      const starNodes = this.starsContainer.children;
      for (let i = 0; i &lt; starNodes.length; i++) {
        starNodes[i].active = i &lt; this._stars;
      }
    }
  }

  private _updateCoinsUI(): void {
    if (this.coinsLabel) {
      const coins = this._rewardClaimed ? this._baseCoins * 2 : this._baseCoins;
      this.coinsLabel.string = `+${coins}`;
    }
  }

  private _onDoubleRewardClick(): void {
    this._adManager.showRewardedVideo(Constants.AD_TYPE_DOUBLE_REWARD, (success: boolean) =&gt; {
      if (success) {
        this._dataManager.addCoins(this._baseCoins * 2);
        this._rewardClaimed = true;
        this._updateCoinsUI();
        
        if (this.doubleRewardButton) {
          this.doubleRewardButton.node.active = false;
        }
        if (this.claimRewardButton) {
          this.claimRewardButton.node.active = false;
        }
      }
    });
  }

  private _onClaimRewardClick(): void {
    this._dataManager.addCoins(this._baseCoins);
    this._rewardClaimed = true;
    this._updateCoinsUI();
    
    if (this.doubleRewardButton) {
      this.doubleRewardButton.node.active = false;
    }
    if (this.claimRewardButton) {
      this.claimRewardButton.node.active = false;
    }
  }

  private _onNextLevelClick(): void {
    if (!this._rewardClaimed) {
      this._dataManager.addCoins(this._baseCoins);
    }
    this._gameManager.nextLevel();
  }

  private _onRetryClick(): void {
    this._gameManager.retryLevel();
  }

  private _onReviveClick(): void {
    this._adManager.showRewardedVideo(Constants.AD_TYPE_REVIVE, (success: boolean) =&gt; {
      if (success) {
        this._gameManager.retryLevel();
      }
    });
  }

  private _onShareClick(): void {
    this._socialManager.share(
      this._gameManager.currentLevel,
      this._isSuccess,
      this._stars
    );
  }

  private _onBackClick(): void {
    if (!this._rewardClaimed &amp;&amp; this._isSuccess) {
      this._dataManager.addCoins(this._baseCoins);
    }
    this._gameManager.goToLevelSelect();
  }
}
