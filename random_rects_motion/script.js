function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomIntInRange(min, max) {
    return (Math.floor(Math.random() * (max - min)) + min);
}

class Canvas {
    constructor(width=window.innerWidth, height=window.innerHeight) {
        this.UPPER_BLOCK_LIMIT = width*height*1000
        this.UPPER_BLOCK_SIZE_LIMIT_DIVISION = 5

        this.width = width
        this.height = height
        this.canvas = null
        this.rects = []
        this.numrects= 0

        this.createCanvas()
        this.createGenesisRects()
        this.drawRects()
        
        for(;;) {
            this.createNextRects()
            this.drawRects()
        }
    }

    createCanvas() {
        let canvas = document.createElement("canvas")
        canvas.id = "canvas"
        canvas.width = this.width
        canvas.height = this.height
        this.canvas = canvas.getContext("2d")
        document.body.appendChild(canvas)
    }

    createGenesisRects() {
        this.numrects = getRandomInt(this.UPPER_BLOCK_LIMIT)
        for (let i = 0; i < this.numrects; i++) {
            this.rects[i] = {
                color: `rgb(${getRandomInt(255)}, ${getRandomInt(255)}, ${getRandomInt(255)})`,
                x: getRandomInt(this.width),
                y: getRandomInt(this.height),
                width: getRandomInt(this.width) / this.UPPER_BLOCK_SIZE_LIMIT_DIVISION,
                height: getRandomInt(this.height) / this.UPPER_BLOCK_SIZE_LIMIT_DIVISION
            }
        }
    }

    createNextRects() {
        for (let i = 0; i < this.numrects; i++) {
            this.rects[i] = {
                color: this.rects[i].color,
                x: getRandomIntInRange(this.rects[i].x - 20, this.rects[i].x + 20),
                y: getRandomIntInRange(this.rects[i].x - 20, this.rects[i].x + 20),
                width: this.rects[i].width,
                height: this.rects[i].height
            }
        }
    }

    drawRects() {
        for (let i = 0; i < this.rects.length; i++) {
            this.canvas.fillStyle = this.rects[i].color
            this.canvas.fillRect(this.rects[i].x, this.rects[i].y, this.rects[i].width, this.rects[i].height)
        }
    }
}

let c = new Canvas()
