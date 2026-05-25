export interface Mecha {
  x: number
  y: number
  width: number
  height: number
  velocityX: number
  velocityY: number
  hp: number
  maxHp: number
  energy: number
  maxEnergy: number
  facing: 'left' | 'right'
  state: 'idle' | 'walk' | 'jump' | 'attack' | 'defend' | 'hurt' | 'ko'
  stateTimer: number
  attackType: 'normal' | 'heavy'
  isGrounded: boolean
  comboCount: number
  animFrame: number
  animTimer: number
  hitCooldown: number
  color: string
  accentColor: string
  name: string
}

export type GameState = 'ready' | 'fight' | 'ko' | 'result'

export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

export interface HitSpark {
  x: number
  y: number
  frame: number
  maxFrames: number
  type: 'hit' | 'block'
}

export const GAME_CONFIG = {
  canvasWidth: 640,
  canvasHeight: 360,
  pixelScale: 2,
  gravity: 0.5,
  groundY: 280,
  maxHp: 100,
  normalAttackDamage: 8,
  heavyAttackDamage: 18,
  defenseReduction: 0.6,
  moveSpeed: 2.5,
  jumpForce: -7,
  roundTime: 99,
  hurtStunFrames: 20,
  attackFrames: 15,
  heavyAttackFrames: 25,
  hitCooldownFrames: 5,
  attackRange: 28,
  heavyAttackRange: 35,
  knockbackForce: 4,
  heavyKnockbackForce: 7,
  energyGainOnHit: 15,
  energyGainOnBlock: 5,
  heavyAttackEnergyCost: 30,
  maxEnergy: 100,
} as const

export function createMecha(
  x: number,
  facing: 'left' | 'right',
  color: string,
  accentColor: string,
  name: string
): Mecha {
  return {
    x,
    y: GAME_CONFIG.groundY - 48,
    width: 32,
    height: 48,
    velocityX: 0,
    velocityY: 0,
    hp: GAME_CONFIG.maxHp,
    maxHp: GAME_CONFIG.maxHp,
    energy: 50,
    maxEnergy: GAME_CONFIG.maxEnergy,
    facing,
    state: 'idle',
    stateTimer: 0,
    attackType: 'normal',
    isGrounded: true,
    comboCount: 0,
    animFrame: 0,
    animTimer: 0,
    hitCooldown: 0,
    color,
    accentColor,
    name,
  }
}
