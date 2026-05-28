
import { _decorator, Node, Sprite, UITransform, Vec3, tween } from 'cc';
import { GridManager } from '../managers/GridManager';

const { ccclass, property } = _decorator;

@ccclass('GridItem')
export class GridItem {
  public iconType: number = 0;
  public x: number = 0;
  public y: number = 0;
  public node: Node | null = null;
  public isEliminated: boolean = false;
  public isSelected: boolean = false;

  private _gridManager: GridManager;
  private _sprite: Sprite | null = null;

  constructor(gridManager: GridManager, x: number, y: number, iconType: number) {
    this._gridManager = gridManager;
    this.x = x;
    this.y = y;
    this.iconType = iconType;
  }

  setNode(node: Node): void {
    this.node = node;
    this._sprite = node.getComponent(Sprite);
  }

  select(): void {
    if (this.isSelected || this.isEliminated) return;
    
    this.isSelected = true;
    this._playSelectAnimation();
  }

  deselect(): void {
    this.isSelected = false;
    this._playDeselectAnimation();
  }

  eliminate(): void {
    if (this.isEliminated) return;
    
    this.isEliminated = true;
    this._playEliminateAnimation();
  }

  hint(): void {
    this._playHintAnimation();
  }

  reset(): void {
    this.isSelected = false;
    this.isEliminated = false;
    if (this.node) {
      this.node.setScale(1, 1, 1);
      this.node.active = true;
    }
  }

  private _playSelectAnimation(): void {
    if (!this.node) return;
    
    tween(this.node)
      .to(0.1, { scale: new Vec3(1.1, 1.1, 1) })
      .start();
  }

  private _playDeselectAnimation(): void {
    if (!this.node) return;
    
    tween(this.node)
      .to(0.1, { scale: new Vec3(1, 1, 1) })
      .start();
  }

  private _playEliminateAnimation(): void {
    if (!this.node) return;
    
    tween(this.node)
      .to(0.2, { scale: new Vec3(0, 0, 0) })
      .call(() =&gt; {
        if (this.node) {
          this.node.active = false;
        }
      })
      .start();
  }

  private _playHintAnimation(): void {
    if (!this.node) return;
    
    tween(this.node)
      .to(0.2, { scale: new Vec3(1.2, 1.2, 1) })
      .to(0.2, { scale: new Vec3(1, 1, 1) })
      .to(0.2, { scale: new Vec3(1.2, 1.2, 1) })
      .to(0.2, { scale: new Vec3(1, 1, 1) })
      .start();
  }
}
