export class InputManager {
  constructor() {
    this.p1 = this.emptyInput()
    this.p2 = this.emptyInput()
    this.keys = new Set()
    this.justPressed = new Set()
    this.prevKeys = new Set()
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
  }

  emptyInput() {
    return {
      left: false,
      right: false,
      up: false,
      down: false,
      attack: false,
      defend: false,
      heavyAttack: false,
    }
  }

  init() {
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
  }

  destroy() {
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
  }

  handleKeyDown(e) {
    e.preventDefault()
    if (!this.keys.has(e.code)) {
      this.justPressed.add(e.code)
    }
    this.keys.add(e.code)
  }

  handleKeyUp(e) {
    this.keys.delete(e.code)
  }

  update() {
    this.p1 = {
      left: this.keys.has('KeyA'),
      right: this.keys.has('KeyD'),
      up: this.keys.has('KeyW'),
      down: this.keys.has('KeyS'),
      attack: this.justPressed.has('KeyJ'),
      defend: this.keys.has('KeyK'),
      heavyAttack: this.justPressed.has('KeyL'),
    }

    this.p2 = {
      left: this.keys.has('ArrowLeft'),
      right: this.keys.has('ArrowRight'),
      up: this.keys.has('ArrowUp'),
      down: this.keys.has('ArrowDown'),
      attack: this.justPressed.has('Digit1'),
      defend: this.keys.has('Digit2'),
      heavyAttack: this.justPressed.has('Digit3'),
    }

    this.prevKeys = new Set(this.keys)
    this.justPressed.clear()
  }
}
