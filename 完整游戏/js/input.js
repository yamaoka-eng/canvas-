export default class InputHandler {
  constructor(game){
    this.game = game
    this.keys = []
    window.addEventListener('keydown', ({ key })=>{
      if ((key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight' || key === ' ') && this.keys.indexOf(key) === -1) this.keys.push(key)
      else if (key === 'd') this.game.debug = !this.game.debug
    })
    window.addEventListener('keyup', ({ key })=>{
      if ((key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight' || key === ' ') && this.keys.indexOf(key) !== -1) this.keys.splice(this.keys.indexOf(key), 1)
    })
  }
}