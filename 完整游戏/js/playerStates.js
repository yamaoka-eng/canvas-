import { Dust, Fire, Splash } from "./particles.js"

const states = {
  SITTING: 0,
  RUNNING: 1,
  JUMPING: 2,
  FALLing: 3,
  ROLLING: 4,
  DIVING: 5,
  HIT: 6
}

class State {
  constructor(state, game){
    this.state = state
    this.game = game
  }
}

export class Sitting extends State {
  constructor(game){
    super('SITTING', game)
  }
  enter(){
    this.game.player.frameX = 0
    this.game.player.frameY = 5
    this.game.player.frameMaxX = 4
  }
  handleInput(input){
    if (input.keys.includes('ArrowUp') && !input.keys.includes('ArrowDown')) this.game.player.setState(states.JUMPING, 1)
    else if ((!input.keys.includes('ArrowDown') && input.keys.includes('ArrowLeft')) || (!input.keys.includes('ArrowDown') && input.keys.includes('ArrowRight'))) this.game.player.setState(states.RUNNING, 1)
    else if (input.keys.includes(' ')) this.game.player.setState(states.ROLLING, 2)
  }
}

export class Running extends State {
  constructor(game){
    super('RUNNING', game)
  }
  enter(){
    this.game.player.frameX = 0
    this.game.player.frameY = 3
    this.game.player.frameMaxX = 8
  }
  handleInput(input){
    if (Math.random() > 0.5) {
      this.game.particles.unshift(new Dust(this.game, this.game.player.x + this.game.player.width/3, this.game.player.y + this.game.player.height))
      this.game.particles.unshift(new Dust(this.game, this.game.player.x + this.game.player.width/1.8, this.game.player.y + this.game.player.height))
    }
    if (input.keys.includes('ArrowDown')) this.game.player.setState(states.SITTING, 0)
    else if (input.keys.includes('ArrowUp')) this.game.player.setState(states.JUMPING, 1)
    else if (input.keys.includes(' ')) this.game.player.setState(states.ROLLING, 2)
  }
}

export class Jumping extends State {
  constructor(game){
    super('JUMPING', game)
  }
  enter(){
    this.game.player.frameX = 0
    this.game.player.frameY = 1
    this.game.player.frameMaxX = 6
    this.game.player.weight = 1
  }
  handleInput(input){
    if (this.game.player.vy > this.game.player.weight) this.game.player.setState(states.FALLing, 1)
    else if (input.keys.includes(' ')) this.game.player.setState(states.ROLLING, 2)
    else if (input.keys.includes('ArrowDown')) this.game.player.setState(states.DIVING, 1)
  }
}

export class Falling extends State {
  constructor(game){
    super('FALLing', game)
  }
  enter(){
    this.game.player.frameX = 0
    this.game.player.frameY = 2
    this.game.player.frameMaxX = 6
    this.game.player.weight = 1
  }
  handleInput(input){
    if (this.game.player.onGround()) this.game.player.setState(states.RUNNING, 1)
    else if (input.keys.includes(' ')) this.game.player.setState(states.ROLLING, 2)
    else if (input.keys.includes('ArrowDown')) this.game.player.setState(states.DIVING, 1)
  }
}

export class Rolling extends State {
  constructor(game){
    super('ROLLING', game)
  }
  enter(){
    this.game.player.frameX = 0
    this.game.player.frameY = 6
    this.game.player.frameMaxX = 6 
    this.game.player.weight = 2
  }
  handleInput(input){
    this.game.particles.unshift(new Fire(this.game, this.game.player.x, this.game.player.y - this.game.player.height/10))
    if (!input.keys.includes(' ') && this.game.player.onGround()) this.game.player.setState(states.RUNNING, 1)
    else if (!input.keys.includes(' ') && !this.game.player.onGround()) this.game.player.setState(states.FALLing, 1)
  }
}

export class Diving extends State {
  constructor(game){
    super('DIVING', game)
  }
  enter(){
    this.game.player.frameX = 0
    this.game.player.frameY = 5
    this.game.player.frameMaxX = 4
    this.game.player.weight = 3
  }
  handleInput(input){
    this.game.particles.unshift(new Fire(this.game, this.game.player.x, this.game.player.y - this.game.player.height/10))
    if (this.game.player.onGround()) { 
      for (let i = 0; i < 30; i++) {
        this.game.particles.unshift(new Splash(this.game, this.game.player.x + this.game.player.width/10, this.game.player.y + this.game.player.height/4))
      }
      this.game.player.setState(states.SITTING, 0)
    } 
  }
}

export class Hit extends State {
  constructor(game){
    super('HIT', game)
  }
  enter(){
    this.game.player.frameX = 0
    this.game.player.frameY = 4
    this.game.player.frameMaxX = 10
  }
  handleInput(input){
    this.game.input.keys = []
    if (this.game.player.frameX >= 10 && this.game.player.onGround()) {
      this.game.player.setState(states.RUNNING, 1)
    } else if (this.game.player.frameX >= 10 && !this.game.player.onGround()){
      this.game.player.setState(states.FALLing, 1)
    }
  }
}
