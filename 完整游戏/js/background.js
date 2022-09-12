export class Layer {
  constructor(game, image, speedModifier){
    this.game = game
    this.image = image
    this.gameWidth = game.width
    this.gameHeight = game.height
    this.spriteWidth = this.gameWidth
    this.spriteHeight = 720
    this.width = 2400
    this.height = 720
    this.x = 0
    this.y = 0
    this.fps = 60
    this.speedModifier = speedModifier
    this.speed = game.speed * this.speedModifier
  }
  update(deltaTime){
    this.speed = this.game.speed * this.speedModifier * (deltaTime/(1000/this.fps))
    this.x += this.speed
    if (this.x > this.width) this.x = 0 + this.speed
  }
  draw(ctx){
    // 使用两个背景图实现无缝跳转
    ctx.drawImage(this.image, this.x, this.y, this.spriteWidth, this.spriteHeight, 0, 0, this.gameWidth, this.gameHeight)
    ctx.drawImage(this.image, this.x - this.width, this.y, this.spriteWidth, this.spriteHeight, 0, 0, this.gameWidth, this.gameHeight)
  }
}

export class Background {
  constructor(game){
    this.layers = [
      new Layer(game, layer1, 0.2),
      new Layer(game, layer2, 0.4),
      new Layer(game, layer3, 0.6),
      new Layer(game, layer4, 0.8),
      new Layer(game, layer5, 1),
    ]
  }
  update(deltaTime){
    this.layers.forEach(layer=>layer.update(deltaTime))
  }
  draw(ctx){
    this.layers.forEach(layer=>layer.draw(ctx))
  }
}
