export default class CollisionAnimation {
  constructor(game, x, y, size){
    this.game = game
    this.x = x
    this.y = y
    this.size = size
    this.image = collisionAnimation
    this.spriteWidth = 200
    this.spriteHeight = 179
    this.width = this.spriteWidth * 0.5 * this.size
    this.height = this.spriteHeight * 0.5 * this.size
    this.timer = 0
    this.frame = 0
    this.fps = 10
    this.frameInterval = 1000/this.fps
    this.sound = new Audio('./assets/boom.wav')
    // 弧度0 - 6.2 之间等于 0-360度
    this.angle = Math.random() * 6.2
    this.markedForDeletion = false
    this.timerMusic = 0
  }
  update(deltaTime){
    this.x -= this.game.speed
    if (this.timerMusic === 0) this.sound.play()
    this.timerMusic++
    if (this.timer >= this.frameInterval) {
      this.frame++
      this.timer = 0
    } else {
      this.timer += deltaTime
    }
    if (this.frame > 4) this.markedForDeletion = true
  }
  draw(ctx){
    // 绘制状态保存
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.angle)
    ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, 0 - this.width/2, 0 - this.height/2, this.width, this.height)
    // 恢复
    ctx.restore()
  }
}