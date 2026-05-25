import { Mecha, GAME_CONFIG, HitSpark, Particle } from './config'
import { InputState } from './input'

export interface CombatResult {
  p1: Mecha
  p2: Mecha
  sparks: HitSpark[]
  particles: Particle[]
}

function getAttackBox(mecha: Mecha): { x: number; y: number; w: number; h: number } | null {
  if (mecha.state !== 'attack') return null

  const isHeavy = mecha.attackType === 'heavy'
  const range = isHeavy ? GAME_CONFIG.heavyAttackRange : GAME_CONFIG.attackRange
  const dir = mecha.facing === 'right' ? 1 : -1

  const activeStart = isHeavy ? 8 : 4
  const activeEnd = isHeavy ? 18 : 10
  const totalFrames = isHeavy ? GAME_CONFIG.heavyAttackFrames : GAME_CONFIG.attackFrames
  const elapsed = totalFrames - mecha.stateTimer

  if (elapsed < activeStart || elapsed > activeEnd) return null

  return {
    x: mecha.facing === 'right' ? mecha.x + mecha.width : mecha.x - range,
    y: mecha.y + 8,
    w: range,
    h: mecha.height - 16,
  }
}

function boxOverlap(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number }
): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
}

function handleMovement(mecha: Mecha, input: InputState, opponent: Mecha): Mecha {
  const m = { ...mecha }

  if (m.state === 'hurt' || m.state === 'ko') return m

  if (input.defend) {
    m.state = 'defend'
    m.velocityX = 0
    return m
  }

  if (m.state === 'attack') return m

  if (input.attack && m.hitCooldown <= 0) {
    m.state = 'attack'
    m.attackType = 'normal'
    m.stateTimer = GAME_CONFIG.attackFrames
    m.hitCooldown = GAME_CONFIG.hitCooldownFrames
    m.velocityX = 0
    return m
  }

  if (input.heavyAttack && m.hitCooldown <= 0 && m.energy >= GAME_CONFIG.heavyAttackEnergyCost) {
    m.state = 'attack'
    m.attackType = 'heavy'
    m.stateTimer = GAME_CONFIG.heavyAttackFrames
    m.hitCooldown = GAME_CONFIG.hitCooldownFrames
    m.energy -= GAME_CONFIG.heavyAttackEnergyCost
    m.velocityX = 0
    return m
  }

  let moving = false
  if (input.left) {
    m.velocityX = -GAME_CONFIG.moveSpeed
    moving = true
  } else if (input.right) {
    m.velocityX = GAME_CONFIG.moveSpeed
    moving = true
  } else {
    m.velocityX = 0
  }

  if (input.up && m.isGrounded) {
    m.velocityY = GAME_CONFIG.jumpForce
    m.isGrounded = false
  }

  if (m.isGrounded) {
    m.state = moving ? 'walk' : 'idle'
  } else {
    m.state = 'jump'
  }

  const centerM = m.x + m.width / 2
  const centerO = opponent.x + opponent.width / 2
  m.facing = centerM < centerO ? 'right' : 'left'

  return m
}

export function resolveCombat(
  p1: Mecha,
  p2: Mecha,
  input1: InputState,
  input2: InputState
): CombatResult {
  let m1 = handleMovement(p1, input1, p2)
  let m2 = handleMovement(p2, input2, p1)

  const sparks: HitSpark[] = []
  const particles: Particle[] = []

  const attackBox1 = getAttackBox(m1)
  const attackBox2 = getAttackBox(m2)

  const body1 = { x: m1.x, y: m1.y, w: m1.width, h: m1.height }
  const body2 = { x: m2.x, y: m2.y, w: m2.width, h: m2.height }

  if (attackBox1 && boxOverlap(attackBox1, body2) && m2.state !== 'ko') {
    if (m2.state === 'defend') {
      const dmg = Math.floor(
        (m1.attackType === 'heavy' ? GAME_CONFIG.heavyAttackDamage : GAME_CONFIG.normalAttackDamage) *
          (1 - GAME_CONFIG.defenseReduction)
      )
      m2 = { ...m2, hp: Math.max(0, m2.hp - dmg) }
      m2.energy = Math.min(m2.maxEnergy, m2.energy + GAME_CONFIG.energyGainOnBlock)
      sparks.push({
        x: m2.x + (m1.facing === 'right' ? 0 : m2.width),
        y: m2.y + m2.height / 2,
        frame: 0,
        maxFrames: 8,
        type: 'block',
      })
      const dir = m1.facing === 'right' ? 1 : -1
      m2.velocityX = dir * 2
    } else {
      const dmg = m1.attackType === 'heavy' ? GAME_CONFIG.heavyAttackDamage : GAME_CONFIG.normalAttackDamage
      m2 = {
        ...m2,
        hp: Math.max(0, m2.hp - dmg),
        state: 'hurt',
        stateTimer: GAME_CONFIG.hurtStunFrames,
      }
      m1.energy = Math.min(m1.maxEnergy, m1.energy + GAME_CONFIG.energyGainOnHit)
      m1.comboCount++
      sparks.push({
        x: m2.x + (m1.facing === 'right' ? 0 : m2.width),
        y: m2.y + m2.height / 2,
        frame: 0,
        maxFrames: 12,
        type: 'hit',
      })
      const dir = m1.facing === 'right' ? 1 : -1
      const force = m1.attackType === 'heavy' ? GAME_CONFIG.heavyKnockbackForce : GAME_CONFIG.knockbackForce
      m2.velocityX = dir * force
      m2.velocityY = -3

      for (let i = 0; i < 6; i++) {
        particles.push({
          x: m2.x + m2.width / 2,
          y: m2.y + m2.height / 2,
          vx: (Math.random() - 0.5) * 4 + dir * 2,
          vy: (Math.random() - 0.5) * 4,
          life: 15 + Math.random() * 10,
          maxLife: 25,
          color: m1.attackType === 'heavy' ? '#ffd700' : '#ffffff',
          size: m1.attackType === 'heavy' ? 3 : 2,
        })
      }
    }
  }

  if (attackBox2 && boxOverlap(attackBox2, body1) && m1.state !== 'ko') {
    if (m1.state === 'defend') {
      const dmg = Math.floor(
        (m2.attackType === 'heavy' ? GAME_CONFIG.heavyAttackDamage : GAME_CONFIG.normalAttackDamage) *
          (1 - GAME_CONFIG.defenseReduction)
      )
      m1 = { ...m1, hp: Math.max(0, m1.hp - dmg) }
      m1.energy = Math.min(m1.maxEnergy, m1.energy + GAME_CONFIG.energyGainOnBlock)
      sparks.push({
        x: m1.x + (m2.facing === 'right' ? 0 : m1.width),
        y: m1.y + m1.height / 2,
        frame: 0,
        maxFrames: 8,
        type: 'block',
      })
      const dir = m2.facing === 'right' ? 1 : -1
      m1.velocityX = dir * 2
    } else {
      const dmg = m2.attackType === 'heavy' ? GAME_CONFIG.heavyAttackDamage : GAME_CONFIG.normalAttackDamage
      m1 = {
        ...m1,
        hp: Math.max(0, m1.hp - dmg),
        state: 'hurt',
        stateTimer: GAME_CONFIG.hurtStunFrames,
      }
      m2.energy = Math.min(m2.maxEnergy, m2.energy + GAME_CONFIG.energyGainOnHit)
      m2.comboCount++
      sparks.push({
        x: m1.x + (m2.facing === 'right' ? 0 : m1.width),
        y: m1.y + m1.height / 2,
        frame: 0,
        maxFrames: 12,
        type: 'hit',
      })
      const dir = m2.facing === 'right' ? 1 : -1
      const force = m2.attackType === 'heavy' ? GAME_CONFIG.heavyKnockbackForce : GAME_CONFIG.knockbackForce
      m1.velocityX = dir * force
      m1.velocityY = -3

      for (let i = 0; i < 6; i++) {
        particles.push({
          x: m1.x + m1.width / 2,
          y: m1.y + m1.height / 2,
          vx: (Math.random() - 0.5) * 4 + dir * 2,
          vy: (Math.random() - 0.5) * 4,
          life: 15 + Math.random() * 10,
          maxLife: 25,
          color: m2.attackType === 'heavy' ? '#ffd700' : '#ffffff',
          size: m2.attackType === 'heavy' ? 3 : 2,
        })
      }
    }
  }

  if (m1.hp <= 0 && m1.state !== 'ko') {
    m1.state = 'ko'
    m1.velocityX = m2.facing === 'right' ? -3 : 3
    m1.velocityY = -5
  }
  if (m2.hp <= 0 && m2.state !== 'ko') {
    m2.state = 'ko'
    m2.velocityX = m1.facing === 'right' ? 3 : -3
    m2.velocityY = -5
  }

  if (m1.state !== 'attack' && m1.state !== 'hurt' && m1.state !== 'ko') {
    m1.comboCount = 0
  }
  if (m2.state !== 'attack' && m2.state !== 'hurt' && m2.state !== 'ko') {
    m2.comboCount = 0
  }

  m1.energy = Math.min(m1.maxEnergy, m1.energy + 0.05)
  m2.energy = Math.min(m2.maxEnergy, m2.energy + 0.05)

  return { p1: m1, p2: m2, sparks, particles }
}
