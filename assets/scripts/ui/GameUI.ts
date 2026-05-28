
import { _decorator, Component, Node, Button, Label, Prefab, instantiate, Camera, input, Input, EventTouch, Color } from 'cc';
import { GameManager } from '../managers/GameManager';
import { DataManager } from '../managers/DataManager';
import { LevelManager } from '../managers/LevelManager';
import { GridManager } from '../managers/GridManager';
import { GridItem } from '../game/GridItem';
import { AdManager } from '../managers/AdManager';
import { AudioManager } from '../managers/AudioManager';
import { Constants } from '../utils/Constants';

const { ccclass, property } = _decorator;

@ccclass('GameUI')
export class GameUI extends Component {
  @property(Button)
  backButton: Button | null = null;

  @property(Label)
  levelLabel: Label | null = null;

  @property(Label)
  timeLabel: Label | null = null;

  @property(Label)
  targetLabel: Label | null = null;

  @property(Label)
  coinsLabel: Label | null = null;

  @property(Node)
  gridContainer: Node | null = null;

  @property(Prefab)
  gridItemPrefab: Prefab | null = null;

  @property(Button)
  hintButton: Button | null = null;

  @property(Button)
  removeButton: Button | null = null;

  @property(Button)
  addTimeButton: Button | null = null;

  @property(Label)
  hintCountLabel: Label | null = null;

  @property(Label)
  removeCountLabel: Label | null = null;

  @property(Label)
  addTimeCountLabel: Label | null = null;

  private _gameManager: GameManager;
  private _dataManager: DataManager;
  private _levelManager: LevelManager;
  private _gridManager: GridManager;
  private _adManager: AdManager;
  private _audioManager: AudioManager;

  private _currentLevel: number = 0;
  private _timeLeft: number = 0;
  private _timeLimit: number = 0;
  private _isPaused: boolean = false;
  private _timer: number = 0;
  private _startTime: number = 0;

  onLoad(): void {
    this._gameManager = GameManager.instance;
    this._dataManager = DataManager.instance;
    this._levelManager = LevelManager.instance;
    this._gridManager = new GridManager();
    this._adManager = AdManager.instance;
    this._audioManager = AudioManager.instance;

    if (this.backButton) {
      this.backButton.node.on(Button.EventType.CLICK, this._onBackClick, this);
    }

    if (this.hintButton) {
      this.hintButton.node.on(Button.EventType.CLICK, this._onHintClick, this);
    }

    if (this.removeButton) {
      this.removeButton.node.on(Button.EventType.CLICK, this._onRemoveClick, this);
    }

    if (this.addTimeButton) {
      this.addTimeButton.node.on(Button.EventType.CLICK, this._onAddTimeClick, this);
    }

    input.on(Input.EventType.TOUCH_START, this._onTouchStart, this);

    this._startGame();
  }

  onDestroy(): void {
    input.off(Input.EventType.TOUCH_START, this._onTouchStart, this);
    this._stopTimer();
  }

  update(dt: number): void {
    if (!this._isPaused &amp;&amp; this._timeLeft &gt; 0) {
      this._timer += dt;
      this._timeLeft = Math.max(0, this._timeLimit - this._timer);
      this._updateTimeUI();

      if (this._timeLeft &lt;= 0) {
        this._onGameOver(false);
      }
    }
  }

  private _startGame(): void {
    this._currentLevel = this._gameManager.currentLevel;
    const config = this._levelManager.getLevelConfig(this._currentLevel);
    this._timeLimit = config.timeLimit;
    this._timeLeft = this._timeLimit;
    this._timer = 0;
    this._startTime = Date.now();
    this._isPaused = false;

    if (this.gridContainer &amp;&amp; this.gridItemPrefab) {
      this._gridManager.init(
        this.gridContainer,
        this.gridItemPrefab,
        config.gridSize,
        config.iconCount,
        config.targetPairs
      );
    }

    this._updateUI();
  }

  private _onBackClick(): void {
    this._gameManager.goToLevelSelect();
  }

  private _onTouchStart(event: EventTouch): void {
    if (!this.gridContainer) return;

    const touch = event.getUILocation();
    const camera = this.gridContainer.scene!.getComponentInChildren(Camera);
    if (!camera) return;

    const nodes = camera.scene!.graphicRoot?.components;
    if (!nodes) return;

    for (let y = 0; y &lt; this._gridManager.gridSize; y++) {
      for (let x = 0; x &lt; this._gridManager.gridSize; x++) {
        const item = this._gridManager.grid[y][x];
        if (item.node) {
          const uiTransform = item.node.getComponent('cc.UITransform');
          if (uiTransform) {
            const rect = uiTransform.getBoundingBoxToWorld();
            if (rect.contains(touch)) {
              this._gridManager.selectItem(item);
              this._checkGameState();
              return;
            }
          }
        }
      }
    }
  }

  private _checkGameState(): void {
    if (this._gridManager.checkWin()) {
      this._onGameOver(true);
    }
  }

  private _onGameOver(success: boolean): void {
    this._isPaused = true;
    const usedTime = (Date.now() - this._startTime) / 1000;

    if (success) {
      const stars = this._levelManager.calculateStars(this._currentLevel, usedTime);
      this._dataManager.setStars(this._currentLevel, stars);
      this._dataManager.addCoins(50);
    }

    this._gameManager.endLevel(success, usedTime);
  }

  private _onHintClick(): void {
    if (this._dataManager.useProp('tips')) {
      this._gridManager.showHint();
      this._updateUI();
    } else {
      this._adManager.showRewardedVideo(Constants.AD_TYPE_HINT, (success: boolean) =&gt; {
        if (success) {
          this._dataManager.addProp('tips', 1);
          this._gridManager.showHint();
          this._updateUI();
        }
      });
    }
  }

  private _onRemoveClick(): void {
    if (this._dataManager.useProp('remove')) {
      this._gridManager.removeRandomItem();
      this._checkGameState();
      this._updateUI();
    } else {
      this._adManager.showRewardedVideo('remove', (success: boolean) =&gt; {
        if (success) {
          this._dataManager.addProp('remove', 1);
          this._gridManager.removeRandomItem();
          this._checkGameState();
          this._updateUI();
        }
      });
    }
  }

  private _onAddTimeClick(): void {
    if (this._dataManager.useProp('addtime')) {
      this._timeLimit += 30;
      this._timeLeft += 30;
      this._updateUI();
    } else {
      this._adManager.showRewardedVideo('addtime', (success: boolean) =&gt; {
        if (success) {
          this._dataManager.addProp('addtime', 1);
          this._timeLimit += 30;
          this._timeLeft += 30;
          this._updateUI();
        }
      });
    }
  }

  private _updateUI(): void {
    if (this.levelLabel) {
      this.levelLabel.string = `第 ${this._currentLevel} 关`;
    }

    if (this.coinsLabel) {
      this.coinsLabel.string = this._dataManager.coins.toString();
    }

    if (this.targetLabel) {
      const config = this._levelManager.getLevelConfig(this._currentLevel);
      this.targetLabel.string = `目标: ${this._gridManager.eliminatedPairs}/${config.targetPairs}`;
    }

    if (this.hintCountLabel) {
      this.hintCountLabel.string = `×${this._dataManager.props.tips}`;
    }

    if (this.removeCountLabel) {
      this.removeCountLabel.string = `×${this._dataManager.props.remove}`;
    }

    if (this.addTimeCountLabel) {
      this.addTimeCountLabel.string = `×${this._dataManager.props.addtime}`;
    }

    this._updateTimeUI();
  }

  private _updateTimeUI(): void {
    if (this.timeLabel) {
      const minutes = Math.floor(this._timeLeft / 60);
      const seconds = Math.floor(this._timeLeft % 60);
      this.timeLabel.string = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      if (this._timeLeft &lt;= 10) {
        this.timeLabel.color = new Color(255, 0, 0);
      } else {
        this.timeLabel.color = new Color(255, 255, 255);
      }
    }
  }

  private _stopTimer(): void {
    this._isPaused = true;
  }
}
