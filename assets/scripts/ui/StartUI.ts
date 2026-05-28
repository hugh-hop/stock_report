
import { _decorator, Component, Node, Button, Label } from 'cc';
import { GameManager } from '../managers/GameManager';
import { DataManager } from '../managers/DataManager';
import { AdManager } from '../managers/AdManager';
import { AudioManager } from '../managers/AudioManager';
import { Constants } from '../utils/Constants';

const { ccclass, property } = _decorator;

@ccclass('StartUI')
export class StartUI extends Component {
  @property(Button)
  startButton: Button | null = null;

  @property(Button)
  dailyGiftButton: Button | null = null;

  @property(Button)
  musicButton: Button | null = null;

  @property(Button)
  soundButton: Button | null = null;

  @property(Label)
  coinsLabel: Label | null = null;

  @property(Node)
  dailyGiftPanel: Node | null = null;

  private _dataManager: DataManager;
  private _gameManager: GameManager;
  private _adManager: AdManager;
  private _audioManager: AudioManager;

  onLoad(): void {
    this._dataManager = DataManager.instance;
    this._gameManager = GameManager.instance;
    this._adManager = AdManager.instance;
    this._audioManager = AudioManager.instance;

    if (this.startButton) {
      this.startButton.node.on(Button.EventType.CLICK, this._onStartClick, this);
    }

    if (this.dailyGiftButton) {
      this.dailyGiftButton.node.on(Button.EventType.CLICK, this._onDailyGiftClick, this);
    }

    if (this.musicButton) {
      this.musicButton.node.on(Button.EventType.CLICK, this._onMusicClick, this);
    }

    if (this.soundButton) {
      this.soundButton.node.on(Button.EventType.CLICK, this._onSoundClick, this);
    }

    this._updateUI();
    this._checkDailyGift();
  }

  private _onStartClick(): void {
    this._gameManager.goToLevelSelect();
  }

  private _onDailyGiftClick(): void {
    if (this.dailyGiftPanel) {
      this.dailyGiftPanel.active = true;
    }
  }

  private _onMusicClick(): void {
    this._audioManager.toggleMusic();
    this._updateUI();
  }

  private _onSoundClick(): void {
    this._audioManager.toggleSound();
    this._updateUI();
  }

  private _checkDailyGift(): void {
    const today = new Date().toDateString();
    const lastGiftDate = localStorage.getItem('lastGiftDate');

    if (lastGiftDate !== today) {
      if (this.dailyGiftPanel) {
        this.dailyGiftPanel.active = true;
      }
    }
  }

  public onClaimGiftClick(): void {
    this._adManager.showRewardedVideo(Constants.AD_TYPE_DAILY_GIFT, (success: boolean) =&gt; {
      if (success) {
        this._dataManager.addCoins(100);
        this._dataManager.addProp('tips', 2);
        this._dataManager.addProp('addtime', 1);

        localStorage.setItem('lastGiftDate', new Date().toDateString());

        if (this.dailyGiftPanel) {
          this.dailyGiftPanel.active = false;
        }

        this._updateUI();
      }
    });
  }

  public onSkipGiftClick(): void {
    if (this.dailyGiftPanel) {
      this.dailyGiftPanel.active = false;
    }
  }

  private _updateUI(): void {
    if (this.coinsLabel) {
      this.coinsLabel.string = this._dataManager.coins.toString();
    }
  }
}
