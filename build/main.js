import { GAME_CONFIG } from './src/game/config.js'
import { GameEngine } from './src/game/engine.js'

const CANVAS_ID = 'gameCanvas'

let canvas = null
let ctx = null
let gameEngine = null
let currentScreen = 'start'

function initCanvas() {
  canvas = wx.createCanvas()
  canvas.id = CANVAS_ID
  const systemInfo = wx.getSystemInfoSync()
  const scale = Math.min(systemInfo.windowWidth / GAME_CONFIG.canvasWidth, systemInfo.windowHeight / GAME_CONFIG.canvasHeight)
  canvas.width = GAME_CONFIG.canvasWidth * scale
  canvas.height = GAME_CONFIG.canvasHeight * scale
  ctx = canvas.getContext('2d')
  ctx.scale(scale, scale)
}

function handleStart() {
  currentScreen = 'battle'
  gameEngine = new GameEngine(canvas)
  gameEngine.setCallback((p1, p2, gameState, roundTimer, winner) => {
    if (gameState === 'result') {
      setTimeout(() => {
        currentScreen = 'result'
        renderResult(winner)
      }, 100)
    }
  })
  gameEngine.start()
}

function handleRestart() {
  if (gameEngine) {
    gameEngine.stop()
  }
  currentScreen = 'battle'
  gameEngine = new GameEngine(canvas)
  gameEngine.setCallback((p1, p2, gameState, roundTimer, winner) => {
    if (gameState === 'result') {
      setTimeout(() => {
        currentScreen = 'result'
        renderResult(winner)
      }, 100)
    }
  })
  gameEngine.start()
}

function handleBackToStart() {
  if (gameEngine) {
    gameEngine.stop()
    gameEngine = null
  }
  currentScreen = 'start'
  renderStart()
}

function renderStart() {
  ctx.fillStyle = '#0a0a1a'
  ctx.fillRect(0, 0, GAME_CONFIG.canvasWidth, GAME_CONFIG.canvasHeight)
  
  const stars = []
  for (let i = 0; i < 60; i++) {
    stars.push({
      x: Math.random() * GAME_CONFIG.canvasWidth,
      y: Math.random() * GAME_CONFIG.canvasHeight,
      size: 1 + Math.random() * 2,
      opacity: 0.1 + Math.random() * 0.5,
      twinkle: Math.random() * Math.PI * 2
    })
  }
  
  function animate() {
    if (currentScreen !== 'start') return
    
    ctx.fillStyle = '#0a0a1a'
    ctx.fillRect(0, 0, GAME_CONFIG.canvasWidth, GAME_CONFIG.canvasHeight)
    
    stars.forEach(star => {
      star.twinkle += 0.02
      const alpha = star.opacity * (0.5 + 0.5 * Math.sin(star.twinkle))
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
      ctx.fillRect(star.x, star.y, star.size, star.size)
    })
    
    ctx.font = 'bold 36px monospace'
    ctx.textAlign = 'center'
    ctx.fillStyle = '#ffd700'
    ctx.shadowColor = '#ffd700'
    ctx.shadowBlur = 20
    ctx.fillText('MECHA', GAME_CONFIG.canvasWidth / 2, GAME_CONFIG.canvasHeight / 2 - 40)
    
    ctx.font = 'bold 24px monospace'
    ctx.fillStyle = '#ffffff'
    ctx.shadowColor = '#00d4ff'
    ctx.shadowBlur = 10
    ctx.fillText('BATTLE', GAME_CONFIG.canvasWidth / 2, GAME_CONFIG.canvasHeight / 2)
    
    ctx.font = '10px monospace'
    ctx.fillStyle = '#4a4a5a'
    ctx.shadowBlur = 0
    ctx.fillText('PIXEL ARENA', GAME_CONFIG.canvasWidth / 2, GAME_CONFIG.canvasHeight / 2 + 20)
    
    ctx.shadowBlur = 0
    
    drawStartButton()
    drawControls()
    
    requestAnimationFrame(animate)
  }
  animate()
}

function drawStartButton() {
  const btnX = GAME_CONFIG.canvasWidth / 2 - 80
  const btnY = GAME_CONFIG.canvasHeight / 2 + 60
  const btnWidth = 160
  const btnHeight = 40
  
  ctx.fillStyle = '#996600'
  ctx.fillRect(btnX, btnY + 4, btnWidth, btnHeight)
  
  ctx.fillStyle = '#cc9900'
  ctx.fillRect(btnX, btnY, btnWidth, btnHeight)
  
  ctx.fillStyle = '#ffd700'
  ctx.fillRect(btnX + 4, btnY + 4, btnWidth - 8, btnHeight - 8)
  
  ctx.font = 'bold 14px monospace'
  ctx.textAlign = 'center'
  ctx.fillStyle = '#0a0a1a'
  ctx.fillText('开始战斗', GAME_CONFIG.canvasWidth / 2, btnY + 28)
  
  canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0]
    const rect = canvas.getBoundingClientRect()
    const scaleX = GAME_CONFIG.canvasWidth / rect.width
    const scaleY = GAME_CONFIG.canvasHeight / rect.height
    const x = (touch.clientX - rect.left) * scaleX
    const y = (touch.clientY - rect.top) * scaleY
    
    if (x >= btnX && x <= btnX + btnWidth && y >= btnY && y <= btnY + btnHeight) {
      handleStart()
    }
  })
}

function drawControls() {
  const p1BoxX = 20
  const p2BoxX = GAME_CONFIG.canvasWidth - 140
  const boxY = GAME_CONFIG.canvasHeight / 2 + 120
  const boxWidth = 120
  const boxHeight = 80
  
  ctx.strokeStyle = '#00d4ff'
  ctx.lineWidth = 2
  ctx.strokeRect(p1BoxX, boxY, boxWidth, boxHeight)
  ctx.fillStyle = 'rgba(0, 212, 255, 0.05)'
  ctx.fillRect(p1BoxX, boxY, boxWidth, boxHeight)
  
  ctx.strokeStyle = '#ff3366'
  ctx.strokeRect(p2BoxX, boxY, boxWidth, boxHeight)
  ctx.fillStyle = 'rgba(255, 51, 102, 0.05)'
  ctx.fillRect(p2BoxX, boxY, boxWidth, boxHeight)
  
  ctx.font = '10px monospace'
  ctx.textAlign = 'center'
  ctx.fillStyle = '#00d4ff'
  ctx.fillText('P1 - BLUE', p1BoxX + boxWidth / 2, boxY + 15)
  
  ctx.fillStyle = '#ff3366'
  ctx.fillText('P2 - RED', p2BoxX + boxWidth / 2, boxY + 15)
  
  ctx.font = '8px monospace'
  ctx.textAlign = 'left'
  ctx.fillStyle = '#888899'
  
  const p1Controls = ['移动: A/D', '跳跃: W', '攻击: J', '重击: L', '防御: K']
  p1Controls.forEach((text, i) => {
    ctx.fillText(text, p1BoxX + 10, boxY + 30 + i * 12)
  })
  
  const p2Controls = ['移动: ←/→', '跳跃: ↑', '攻击: 1', '重击: 3', '防御: 2']
  p2Controls.forEach((text, i) => {
    ctx.fillText(text, p2BoxX + 10, boxY + 30 + i * 12)
  })
  
  ctx.font = '8px monospace'
  ctx.textAlign = 'center'
  ctx.fillStyle = '#4a4a5a'
  ctx.fillText('重击消耗能量 · 防御减免60%伤害 · 99秒限时', GAME_CONFIG.canvasWidth / 2, GAME_CONFIG.canvasHeight - 20)
}

function renderResult(winner) {
  ctx.fillStyle = '#0a0a1a'
  ctx.fillRect(0, 0, GAME_CONFIG.canvasWidth, GAME_CONFIG.canvasHeight)
  
  const particles = []
  for (let i = 0; i < 30; i++) {
    particles.push({
      x: Math.random() * GAME_CONFIG.canvasWidth,
      y: Math.random() * GAME_CONFIG.canvasHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2 - 1,
      color: ['#ffd700', '#ff3366', '#00d4ff', '#ffffff'][i % 4],
      size: 2 + Math.random() * 4,
      life: 100 + Math.random() * 50
    })
  }
  
  const winnerName = winner === 1 ? 'BLUE' : winner === 2 ? 'RED' : 'DRAW'
  const winnerColor = winner === 1 ? '#00d4ff' : winner === 2 ? '#ff3366' : '#ffd700'
  
  function animate() {
    if (currentScreen !== 'result') return
    
    ctx.fillStyle = '#0a0a1a'
    ctx.fillRect(0, 0, GAME_CONFIG.canvasWidth, GAME_CONFIG.canvasHeight)
    
    particles.forEach(p => {
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.05
      p.life--
      if (p.life > 0) {
        ctx.globalAlpha = p.life / 150
        ctx.fillStyle = p.color
        ctx.fillRect(p.x, p.y, p.size, p.size)
      }
    })
    ctx.globalAlpha = 1
    
    ctx.font = 'bold 32px monospace'
    ctx.textAlign = 'center'
    ctx.fillStyle = '#ff3366'
    ctx.shadowColor = '#ff3366'
    ctx.shadowBlur = 20
    ctx.fillText('K.O.!', GAME_CONFIG.canvasWidth / 2, GAME_CONFIG.canvasHeight / 2 - 30)
    
    ctx.font = 'bold 20px monospace'
    ctx.fillStyle = winnerColor
    ctx.shadowColor = winnerColor
    ctx.fillText(winnerName + ' WINS!', GAME_CONFIG.canvasWidth / 2, GAME_CONFIG.canvasHeight / 2 + 10)
    
    ctx.shadowBlur = 0
    
    drawResultButtons(winner)
    
    requestAnimationFrame(animate)
  }
  animate()
}

function drawResultButtons() {
  const restartBtnX = GAME_CONFIG.canvasWidth / 2 - 80
  const restartBtnY = GAME_CONFIG.canvasHeight / 2 + 50
  const btnWidth = 160
  const btnHeight = 40
  
  ctx.fillStyle = '#996600'
  ctx.fillRect(restartBtnX, restartBtnY + 4, btnWidth, btnHeight)
  
  ctx.fillStyle = '#cc9900'
  ctx.fillRect(restartBtnX, restartBtnY, btnWidth, btnHeight)
  
  ctx.fillStyle = '#ffd700'
  ctx.fillRect(restartBtnX + 4, restartBtnY + 4, btnWidth - 8, btnHeight - 8)
  
  ctx.font = 'bold 14px monospace'
  ctx.textAlign = 'center'
  ctx.fillStyle = '#0a0a1a'
  ctx.fillText('再来一局', GAME_CONFIG.canvasWidth / 2, restartBtnY + 28)
  
  const backBtnX = GAME_CONFIG.canvasWidth / 2 - 80
  const backBtnY = GAME_CONFIG.canvasHeight / 2 + 100
  
  ctx.fillStyle = '#3a3a4a'
  ctx.fillRect(backBtnX, backBtnY + 4, btnWidth, btnHeight)
  
  ctx.fillStyle = '#4a4a5a'
  ctx.fillRect(backBtnX, backBtnY, btnWidth, btnHeight)
  
  ctx.fillStyle = '#6a6a7a'
  ctx.fillRect(backBtnX + 4, backBtnY + 4, btnWidth - 8, btnHeight - 8)
  
  ctx.fillStyle = '#ffffff'
  ctx.fillText('返回主菜单', GAME_CONFIG.canvasWidth / 2, backBtnY + 28)
  
  canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0]
    const rect = canvas.getBoundingClientRect()
    const scaleX = GAME_CONFIG.canvasWidth / rect.width
    const scaleY = GAME_CONFIG.canvasHeight / rect.height
    const x = (touch.clientX - rect.left) * scaleX
    const y = (touch.clientY - rect.top) * scaleY
    
    if (x >= restartBtnX && x <= restartBtnX + btnWidth && y >= restartBtnY && y <= restartBtnY + btnHeight) {
      handleRestart()
    } else if (x >= backBtnX && x <= backBtnX + btnWidth && y >= backBtnY && y <= backBtnY + btnHeight) {
      handleBackToStart()
    }
  })
}

function onLoad() {
  initCanvas()
  renderStart()
  
  wx.showShareMenu({
    withShareTicket: true
  })
}

function onShow() {
  if (gameEngine) {
    gameEngine.start()
  }
}

function onHide() {
  if (gameEngine) {
    gameEngine.stop()
  }
}

function onError(msg) {
  console.error('Game error:', msg)
}

wx.onLoad(onLoad)
wx.onShow(onShow)
wx.onHide(onHide)
wx.onError(onError)

export { onLoad, onShow, onHide, onError }
