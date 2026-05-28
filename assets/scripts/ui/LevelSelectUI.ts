
import { _decorator, Component, Node, Button, Label, Prefab, instantiate, Vec3 } from 'cc';
import { GameManager } from '../managers/GameManager';
import { DataManager } from '../managers/DataManager';
import { LevelManager } from '../managers/LevelManager';

const { ccclass, property } = _decorator;

@ccclass('LevelSelectUI')
export class LevelSelectUI extends Component {
  @property(Button)
  backButton: Button | null = null;

  @property(Node)
  levelsContainer: Node | null = null;

  @property(Prefab)
  levelItemPrefab: Prefab | null = null;

  @property(Label)
  highestLevelLabel: Label | null = null;

  private _dataManager: DataManager;
  private _gameManager: GameManager;
  private _levelManager: LevelManager;

  onLoad(): void {
    this._dataManager = DataManager.instance;
    this._gameManager = GameManager.instance;
    this._levelManager = LevelManager.instance;

    if (this.backButton) {
      this.backButton.node.on(Button.EventType.CLICK, this._onBackClick, this);
    }

    this._createLevelButtons();
    this._updateUI();
  }

  private _onBackClick(): void {
    this._gameManager.goToStart();
  }

  private _createLevelButtons(): void {
    if (!this.levelsContainer || !this.levelItemPrefab) return;

    this.levelsContainer.removeAllChildren();

    const maxLevel = 999;
    const columns = 4;
    const spacing = 20;
    const itemSize = 80;
    const startX = -((columns - 1) * (itemSize + spacing)) / 2;
    const startY = 100;

    for (let i = 1; i &lt;= maxLevel; i++) {
      const levelNode = instantiate(this.levelItemPrefab);
      const levelButton = levelNode.getComponent(Button);
      const levelLabel = levelNode.getComponentInChildren(Label);

      if (levelLabel) {
        levelLabel.string = i.toString();
      }

      const isUnlocked = i &lt;= this._dataManager.highestLevel;
      const hasStars = this._dataManager.getStars(i) &gt; 0;

      levelNode.active = i &lt;= this._dataManager.highestLevel + 5;

      const row = Math.floor((i - 1) / columns);
      const col = (i - 1) % columns;

      levelNode.setPosition(
        startX + col * (itemSize + spacing),
        startY - row * (itemSize + spacing),
        0
      );

      if (levelButton) {
        if (isUnlocked) {
          levelButton.node.on(Button.EventType.CLICK, () =&gt; {
            this._onLevelClick(i);
          }, this);
        } else {
          levelButton.interactable = false;
        }
      }

      this.levelsContainer.addChild(levelNode);

      this._updateLevelItemStars(levelNode, i);
    }
  }

  private _updateLevelItemStars(node: Node, level: number): void {
    const stars = this._dataManager.getStars(level);
    const starsContainer = node.getChildByName('Stars');
    if (starsContainer) {
      const starNodes = starsContainer.children;
      for (let i = 0; i &lt; starNodes.length; i++) {
        starNodes[i].active = i &lt; stars;
      }
    }
  }

  private _onLevelClick(level: number): void {
    this._gameManager.startLevel(level);
  }

  private _updateUI(): void {
    if (this.highestLevelLabel) {
      this.highestLevelLabel.string = `最高关卡: ${this._dataManager.highestLevel}`;
    }
  }
}
