function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

class Canvas {
    constructor(width=window.innerWidth, height=window.innerHeight) {
        this.UPPER_BLOCK_LIMIT = width*height*1000
        this.UPPER_BLOCK_SIZE_LIMIT_DIVISION = 5

        this.width = width
        this.height = height
        this.canvas = null

        this.create()
    }

    create() {
        let canvas = document.createElement("canvas")
        canvas.id = "canvas"
        canvas.width = this.width
        canvas.height = this.height
        this.canvas = canvas.getContext("2d")
        document.body.appendChild(canvas)
    }

    drawRect() {
        this.canvas.fillStyle = `rgb(${getRandomInt(255)}, ${getRandomInt(255)}, ${getRandomInt(255)})`;
        this.canvas.fillRect(getRandomInt(this.width), getRandomInt(this.height), getRandomInt(this.width)/this.UPPER_BLOCK_SIZE_LIMIT_DIVISION, getRandomInt(this.height)/this.UPPER_BLOCK_SIZE_LIMIT_DIVISION);
    }

    startPsychosis() {
        for (let i = 0; i < getRandomInt(this.UPPER_BLOCK_LIMIT); i++) {
            this.drawRect()
        }
    }
}

let c = new Canvas()
c.startPsychosis()