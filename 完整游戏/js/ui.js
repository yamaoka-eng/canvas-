export class UI {
  constructor(game){
    this.game = game
    this.fontSize = 30
    this.fontFamily = 'Helvetica'
    this.fontColor = 'black'
    this.livesImage = lives
  }
  draw(ctx){
    ctx.save()
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetT = 2
    ctx.shadowColor = 'white'
    ctx.font = this.fontSize + 'px ' + this.fontFamily
    ctx.textAlign = 'left'
    ctx.fillStyle = this.fontColor
    ctx.fillText('Score: ' + this.game.score, 20, 50)
    for (let i = 0; i < this.game.lives; i++) {
      ctx.drawImage(this.livesImage, 20 + i * 25, 55, 25, 25)
    }
    if (this.game.gameOver) {
      ctx.textAlign = 'center'
      ctx.font = this.fontSize * 2 + 'px ' + this.fontFamily
      ctx.fillText('Game Over', this.game.width/2, this.game.height/2)
    }
    ctx.restore()
  }
}