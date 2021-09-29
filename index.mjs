import { Ball } from './js/ball.mjs'

function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (const ball of balls) {
        if (ball.offCanvas()) {
            ball.removeFrom(balls)
            continue
        }
        ball.draw()
        ball.collisionDetect(balls)
        ball.update()
    }

    requestId = requestAnimationFrame(loop)
}

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}, true)

window.addEventListener('keypress', function (event) {
    if (event.code === 'Space') {
        if (requestId) {
            cancelAnimationFrame(requestId)
            requestId = null
        } else {
            requestId = requestAnimationFrame(loop)
        }
    }
})

window.addEventListener('mousewheel', function (event) {
    const delta = -Math.floor(event.deltaY / 100)
    balls.forEach(ball => ball.changeVel(delta))
})

window.addEventListener('click', function (event) {
    const { x, y } = event
    let existingBall = Ball.existingBallAt(balls, x, y)
    if (existingBall) {
        existingBall.removeFrom(balls)

    } else {
        const newBall = Ball.randomBallAt(ctx, x, y)
        balls.push(newBall)
        console.info(`Added new ball; the number of balls are ${balls.length}`)
        console.dir(newBall)
        newBall.draw()
    }
})


const canvas = document.getElementById('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const ctx = canvas.getContext('2d')

const balls = new Array(25).fill().map(_ => Ball.randomBall(ctx))

let requestId = requestAnimationFrame(loop)
