class Debug {
  constructor(game){
    this.game = game
  }
}

// 调试模式中用于画出物体圆
export class DrawCircle extends Debug {
  constructor(game, size){
    super(game)
    this.size = size ? size : 2
  }
  draw(ctx){
    if (this.game.debug === true) {
      ctx.beginPath()
      ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/this.size, 0, 2 * Math.PI)
      ctx.strokeStyle = 'black'
      ctx.stroke()
    }
  }
}

// 调试模式中用于画出物体矩形
export class DrawRect extends Debug {
  constructor(game){
    super(game)
  }
  draw(ctx){
    ctx.strokeRect(this.x, this.y, this.width, this.height)
  }
}
