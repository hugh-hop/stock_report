
import { _decorator, Node, instantiate, Prefab, Vec3 } from 'cc';
import { GridItem } from '../game/GridItem';

const { ccclass, property } = _decorator;

@ccclass('GridManager')
export class GridManager {
  public gridSize: number = 4;
  public grid: GridItem[][] = [];
  public selectedItem: GridItem | null = null;
  public targetPairs: number = 0;
  public eliminatedPairs: number = 0;

  private _itemPrefab: Prefab | null = null;
  private _gridContainer: Node | null = null;
  private _iconTypes: number = 4;
  private _itemSize: number = 80;
  private _spacing: number = 10;

  constructor() {}

  init(gridContainer: Node, itemPrefab: Prefab, gridSize: number, iconTypes: number, targetPairs: number): void {
    this._gridContainer = gridContainer;
    this._itemPrefab = itemPrefab;
    this.gridSize = gridSize;
    this._iconTypes = iconTypes;
    this.targetPairs = targetPairs;
    this.eliminatedPairs = 0;
    this.selectedItem = null;
    
    this.generateGrid();
  }

  generateGrid(): void {
    this.grid = [];
    this.eliminatedPairs = 0;
    this.selectedItem = null;
    
    if (this._gridContainer) {
      this._gridContainer.removeAllChildren();
    }

    const totalItems = this.gridSize * this.gridSize;
    const pairsNeeded = Math.ceil(totalItems / 2);
    const icons: number[] = [];
    
    for (let i = 0; i &lt; pairsNeeded; i++) {
      const iconType = i % this._iconTypes;
      icons.push(iconType);
      icons.push(iconType);
    }
    
    while (icons.length &lt; totalItems) {
      const iconType = Math.floor(Math.random() * this._iconTypes);
      icons.push(iconType);
      icons.push(iconType);
    }
    
    this._shuffleArray(icons);
    
    const startX = -(this.gridSize * (this._itemSize + this._spacing)) / 2 + (this._itemSize + this._spacing) / 2;
    const startY = (this.gridSize * (this._itemSize + this._spacing)) / 2 - (this._itemSize + this._spacing) / 2;
    
    let iconIndex = 0;
    for (let y = 0; y &lt; this.gridSize; y++) {
      this.grid[y] = [];
      for (let x = 0; x &lt; this.gridSize; x++) {
        const iconType = icons[iconIndex++];
        const gridItem = new GridItem(this, x, y, iconType);
        
        if (this._gridContainer &amp;&amp; this._itemPrefab) {
          const itemNode = instantiate(this._itemPrefab);
          itemNode.setPosition(
            startX + x * (this._itemSize + this._spacing),
            startY - y * (this._itemSize + this._spacing),
            0
          );
          gridItem.setNode(itemNode);
          this._gridContainer.addChild(itemNode);
        }
        
        this.grid[y][x] = gridItem;
      }
    }
  }

  selectItem(item: GridItem): void {
    if (item.isEliminated) return;
    
    if (this.selectedItem === null) {
      item.select();
      this.selectedItem = item;
    } else if (this.selectedItem === item) {
      item.deselect();
      this.selectedItem = null;
    } else {
      if (this.tryEliminate(this.selectedItem, item)) {
        
      } else {
        this.selectedItem.deselect();
        item.select();
        this.selectedItem = item;
      }
    }
  }

  tryEliminate(item1: GridItem, item2: GridItem): boolean {
    if (item1.iconType !== item2.iconType) {
      return false;
    }
    
    if (!this._isAdjacent(item1, item2)) {
      return false;
    }
    
    item1.eliminate();
    item2.eliminate();
    this.eliminatedPairs++;
    this.selectedItem = null;
    
    return true;
  }

  checkWin(): boolean {
    return this.eliminatedPairs &gt;= this.targetPairs;
  }

  findHint(): [GridItem, GridItem] | null {
    for (let y = 0; y &lt; this.gridSize; y++) {
      for (let x = 0; x &lt; this.gridSize; x++) {
        const item = this.grid[y][x];
        if (item.isEliminated) continue;
        
        const adjacentItems = this._getAdjacentItems(item);
        for (const adjItem of adjacentItems) {
          if (!adjItem.isEliminated &amp;&amp; adjItem.iconType === item.iconType) {
            return [item, adjItem];
          }
        }
      }
    }
    return null;
  }

  showHint(): void {
    const hint = this.findHint();
    if (hint) {
      hint[0].hint();
      hint[1].hint();
    }
  }

  removeRandomItem(): void {
    const availableItems: GridItem[] = [];
    for (let y = 0; y &lt; this.gridSize; y++) {
      for (let x = 0; x &lt; this.gridSize; x++) {
        if (!this.grid[y][x].isEliminated) {
          availableItems.push(this.grid[y][x]);
        }
      }
    }
    
    if (availableItems.length &gt; 0) {
      const randomIndex = Math.floor(Math.random() * availableItems.length);
      availableItems[randomIndex].eliminate();
    }
  }

  reset(): void {
    this.selectedItem = null;
    for (let y = 0; y &lt; this.gridSize; y++) {
      for (let x = 0; x &lt; this.gridSize; x++) {
        this.grid[y][x].reset();
      }
    }
  }

  private _isAdjacent(item1: GridItem, item2: GridItem): boolean {
    const dx = Math.abs(item1.x - item2.x);
    const dy = Math.abs(item1.y - item2.y);
    return (dx === 1 &amp;&amp; dy === 0) || (dx === 0 &amp;&amp; dy === 1) || (dx === 1 &amp;&amp; dy === 1);
  }

  private _getAdjacentItems(item: GridItem): GridItem[] {
    const adjacent: GridItem[] = [];
    const directions = [
      { dx: -1, dy: 0 }, { dx: 1, dy: 0 },
      { dx: 0, dy: -1 }, { dx: 0, dy: 1 },
      { dx: -1, dy: -1 }, { dx: 1, dy: -1 },
      { dx: -1, dy: 1 }, { dx: 1, dy: 1 }
    ];
    
    for (const dir of directions) {
      const nx = item.x + dir.dx;
      const ny = item.y + dir.dy;
      
      if (nx &gt;= 0 &amp;&amp; nx &lt; this.gridSize &amp;&amp; ny &gt;= 0 &amp;&amp; ny &lt; this.gridSize) {
        adjacent.push(this.grid[ny][nx]);
      }
    }
    
    return adjacent;
  }

  private _shuffleArray(array: any[]): void {
    for (let i = array.length - 1; i &gt; 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
