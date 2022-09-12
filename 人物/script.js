const canvas = document.getElementById('canvas1')
const dropdown = document.getElementById('animations')
let playerState = 'idle'
dropdown.addEventListener('change',(e)=>{
  playerState = e.target.value
})
const ctx = canvas.getContext('2d')
const CANVAS_WIDTH = canvas.width = 600
const CANVAS_HEIGHT = canvas.height = 600

const playerImage = new Image()
playerImage.src = 'shadow_dog.png'
const spriteWdith = 575
const spriteHeight = 523

let frameX = 0
let frameY = 0
let gameFrame = 0
let staggerFrames = 5
const spriteAnimations = []
const animationStates = [
  {
    name: 'idle',
    frames: 7
  },
  {
    name: 'jump',
    frames: 7
  },
  {
    name: 'fall',
    frames: 7
  },
  {
    name: 'run',
    frames: 9
  },
  {
    name: 'dizzy',
    frames: 11
  },
  {
    name: 'sit',
    frames: 5
  },
  {
    name: 'roll',
    frames: 7
  },
  {
    name: 'bite',
    frames: 7
  },
  {
    name: 'ko',
    frames: 12
  },
  {
    name: 'getHit',
    frames: 4
  },
]

animationStates.forEach((state, index) => {
  let frames = {
    loc: []
  }
  for (let j = 0; j < state.frames; j++){
    let positionX = j * spriteWdith
    let positionY = index * spriteHeight
    frames.loc.push({ x: positionX, y: positionY })
  }
  spriteAnimations[state.name] = frames
})
console.log(spriteAnimations);

const animate = () => {
  let position = Math.floor(gameFrame/staggerFrames) % spriteAnimations[playerState].loc.length
  frameX = spriteAnimations[playerState].loc[position].x
  frameY = spriteAnimations[playerState].loc[position].y
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  // 1 2选择图片位置 3 4截图图片像素大小, 4 5绘制画布偏移位置, 5 6 图片拉伸大小
  ctx.drawImage(playerImage, frameX, frameY, spriteWdith, spriteHeight, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  gameFrame++
  requestAnimationFrame(animate)
}
animate()
