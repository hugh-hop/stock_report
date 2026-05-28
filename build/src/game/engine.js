import { GAME_CONFIG } from './config.js'
import { InputManager } from './input.js'
import { updatePhysics } from './physics.js'
import { resolveCombat } from './combat.js'
import { render } from './renderer.js'
import { updateParticles, updateSparks, createKoExplosion } from './effects.js'
import { resetBackground } from './backgrounds.js'

export class GameEngine {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.input = new InputManager()
    this.animFrameId = 0
    this.running = false

    this.p1 = this.createP1()
    this.p2 = this.createP2()
    this.particles = []
    this.sparks = []
    this.gameState = 'ready'
    this.roundTimer = GAME_CONFIG.roundTime
    this.readyTimer = 180
    this.koTimer = 0
    this.winner = null
    this.frameCount = 0
    this.timerAccumulator = 0
    this.onUpdate = null
  }

  createP1() {
    return {
      x: 150,
      y: GAME_CONFIG.groundY - 48,
      width: 32,
      height: 48,
      velocityX: 0,
      velocityY: 0,
      hp: GAME_CONFIG.maxHp,
      maxHp: GAME_CONFIG.maxHp,
      energy: 50,
      maxEnergy: GAME_CONFIG.maxEnergy,
      facing: 'right',
      state: 'idle',
      stateTimer: 0,
      attackType: 'normal',
      isGrounded: true,
      comboCount: 0,
      animFrame: 0,
      animTimer: 0,
      hitCooldown: 0,
      color: '#00d4ff',
      accentColor: '#0088cc',
      name: 'BLUE',
    }
  }

  createP2() {
    return {
      x: 450,
      y: GAME_CONFIG.groundY - 48,
      width: 32,
      height: 48,
      velocityX: 0,
      velocityY: 0,
      hp: GAME_CONFIG.maxHp,
      maxHp: GAME_CONFIG.maxHp,
      energy: 50,
      maxEnergy: GAME_CONFIG.maxEnergy,
      facing: 'left',
      state: 'idle',
      stateTimer: 0,
      attackType: 'normal',
      isGrounded: true,
      comboCount: 0,
      animFrame: 0,
      animTimer: 0,
      hitCooldown: 0,
      color: '#ff3366',
      accentColor: '#cc1144',
      name: 'RED',
    }
  }

  setCallback(cb) {
    this.onUpdate = cb
  }

  start() {
    resetBackground()
    this.input.init()
    this.running = true
    this.loop()
  }

  stop() {
    this.running = false
    this.input.destroy()
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId)
    }
  }

  reset() {
    this.p1 = this.createP1()
    this.p2 = this.createP2()
    this.particles = []
    this.sparks = []
    this.gameState = 'ready'
    this.roundTimer = GAME_CONFIG.roundTime
    this.readyTimer = 180
    this.koTimer = 0
    this.winner = null
    this.frameCount = 0
    this.timerAccumulator = 0
    resetBackground()
  }

  loop = () => {
    if (!this.running) return

    this.update()
    this.draw()

    this.animFrameId = requestAnimationFrame(this.loop)
  }

  update() {
    this.frameCount++
    this.input.update()

    if (this.gameState === 'ready') {
      this.readyTimer--
      if (this.readyTimer <= 0) {
        this.gameState = 'fight'
      }
      return
    }

    if (this.gameState === 'ko') {
      this.koTimer++
      this.p1 = updatePhysics(this.p1)
      this.p2 = updatePhysics(this.p2)
      this.particles = updateParticles(this.particles)
      this.sparks = updateSparks(this.sparks)

      if (this.koTimer > 120) {
        this.gameState = 'result'
      }
      return
    }

    if (this.gameState === 'result') return

    const combat = resolveCombat(this.p1, this.p2, this.input.p1, this.input.p2)
    this.p1 = combat.p1
    this.p2 = combat.p2
    this.sparks.push(...combat.sparks)
    this.particles.push(...combat.particles)

    this.p1 = updatePhysics(this.p1)
    this.p2 = updatePhysics(this.p2)

    this.particles = updateParticles(this.particles)
    this.sparks = updateSparks(this.sparks)

    this.timerAccumulator++
    if (this.timerAccumulator >= 60) {
      this.timerAccumulator = 0
      this.roundTimer--
    }

    if (this.p1.hp <= 0 || this.p2.hp <= 0) {
      this.gameState = 'ko'
      this.koTimer = 0
      if (this.p1.hp <= 0 && this.p2.hp <= 0) {
        this.winner = 0
      } else if (this.p1.hp <= 0) {
        this.winner = 2
        this.particles.push(...createKoExplosion(this.p1.x + this.p1.width / 2, this.p1.y + this.p1.height / 2, this.p1.color))
      } else {
        this.winner = 1
        this.particles.push(...createKoExplosion(this.p2.x + this.p2.width / 2, this.p2.y + this.p2.height / 2, this.p2.color))
      }
    }

    if (this.roundTimer <= 0 && this.gameState === 'fight') {
      this.gameState = 'ko'
      this.koTimer = 0
      if (this.p1.hp > this.p2.hp) {
        this.winner = 1
      } else if (this.p2.hp > this.p1.hp) {
        this.winner = 2
      } else {
        this.winner = 0
      }
    }

    if (this.onUpdate) {
      this.onUpdate(this.p1, this.p2, this.gameState, this.roundTimer, this.winner)
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, GAME_CONFIG.canvasWidth, GAME_CONFIG.canvasHeight)
    render(
      this.ctx,
      this.p1,
      this.p2,
      this.particles,
      this.sparks,
      this.gameState,
      this.roundTimer,
      this.readyTimer
    )
  }

  getWinner() {
    return this.winner
  }

  getGameState() {
    return this.gameState
  }
}
