import { GAME_CONFIG } from './config.js'

export function updatePhysics(mecha) {
  const m = { ...mecha }

  m.velocityY += GAME_CONFIG.gravity
  m.x += m.velocityX
  m.y += m.velocityY

  if (m.y + m.height >= GAME_CONFIG.groundY) {
    m.y = GAME_CONFIG.groundY - m.height
    m.velocityY = 0
    m.isGrounded = true
  } else {
    m.isGrounded = false
  }

  if (m.x < 0) m.x = 0
  if (m.x + m.width > GAME_CONFIG.canvasWidth) {
    m.x = GAME_CONFIG.canvasWidth - m.width
  }

  if (m.state === 'hurt') {
    m.stateTimer--
    m.velocityX *= 0.9
    if (m.stateTimer <= 0) {
      m.state = 'idle'
      m.stateTimer = 0
    }
  }

  if (m.state === 'attack') {
    m.stateTimer--
    if (m.stateTimer <= 0) {
      m.state = 'idle'
      m.stateTimer = 0
    }
  }

  if (m.state === 'ko') {
    m.velocityX = 0
  }

  if (m.hitCooldown > 0) {
    m.hitCooldown--
  }

  m.animTimer++
  if (m.animTimer >= 8) {
    m.animTimer = 0
    m.animFrame = (m.animFrame + 1) % 4
  }

  return m
}
