import { Sitting, Running, Jumping, Falling, Rolling, Diving, Hit } from "./playerStates.js"
import { DrawCircle } from "./debug.js"
import CollisionAnimation from "./collisionAnimation.js"
import FloatingMessage from "./floatingMessages.js"

export default class Player extends DrawCircle {
  constructor(game){
    super(game, 2.5)
    this.collisionNarrowSize = 2.5
    this.image = player
    this.game = game
    this.spriteWidth = 100
    this.spriteHeight = 91.3
    this.width = this.spriteWidth
    this.height = this.spriteHeight
    this.x = 100
    this.y = this.game.height - this.height - this.game.groundMargin
    this.jumpHeight = -26
    this.weight = 1
    this.vx = 0
    this.vy = 0
    this.frameX = 0
    this.frameY = 0
    this.frameMaxX = 0
    this.frameInterval = 50
    this.timer = 0
    this.fps = 60
    this.states = [
      new Sitting(this.game),
      new Running(this.game), 
      new Jumping(this.game), 
      new Falling(this.game), 
      new Rolling(this.game),
      new Diving(this.game),
      new Hit(this.game),
    ]
  }
  update(input, deltaTime){
    this.currentState.handleInput(input)
    if (input.keys.indexOf('ArrowRight') !== -1 && this.currentState !== this.states[0]) this.vx = 10
    else if (input.keys.indexOf('ArrowLeft') !== -1 && this.currentState !== this.states[0]) this.vx = -8
    else this.vx = 0
    if (input.keys.indexOf('ArrowUp') !== -1 && this.onGround() && !input.keys.includes('ArrowDown')) this.vy = this.jumpHeight
    this.x += this.vx * (deltaTime/(1000/this.fps))
    this.y += this.vy * (deltaTime/(1000/this.fps))
    if (!this.onGround()) {
      this.vy += this.weight
    } else {
      this.vy = 0
    }
    if (this.x > this.game.width - this.width) this.x = this.game.width - this.width
    if (this.x < 0) this.x = 0 
    if (this.y >= this.game.height - this.height - this.game.groundMargin) this.y = this.game.height - this.height - this.game.groundMargin
    if (this.timer >= this.frameInterval) {
      this.frameX >= this.frameMaxX ? this.frameX = 0 : this.frameX++
      this.timer = 0
    } else {
      this.timer += deltaTime
    }
    this.checkCollision()
  }
  draw(ctx){
    super.draw(ctx)
    ctx.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
  }
  onGround(){
    return this.y >= this.game.height - this.height - this.game.groundMargin
  }
  setState(state, speed){
    this.currentState = this.states[state]
    this.game.speed = this.game.maxSpeed * speed
    this.currentState.enter()
  }
  checkCollision(){
    this.game.enemies.forEach(enemy => {
      let dx = enemy.x + enemy.width/2 - this.x - this.width/2
      let dy = enemy.y + enemy.height/2 - this.y - this.height/2
      const distance = Math.sqrt(dx * dx + dy * dy)
      if (distance < this.width/this.collisionNarrowSize + enemy.width/2) {
        enemy.markedForDeletion = true
        this.game.booms.push(new CollisionAnimation(this.game, enemy.x + enemy.width/2, enemy.y + enemy.height/2, enemy.randomSize))
        if (this.currentState === this.states[4] || this.currentState === this.states[5]) {
          this.game.score++
          this.game.floatingMessages.push(new FloatingMessage('+1', enemy.x, enemy.y, 110, 50))
        } else {
          this.game.lives--
          this.setState(6, 0)
        }
      }
    })
  }
}