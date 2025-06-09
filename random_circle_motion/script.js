function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomIntInRange(min, max) {
    min = Math.ceil(min);
    return Math.floor(Math.random() * (Math.floor(max) - min + 1)) + min;
}

class Canvas {
    constructor(width=window.innerWidth, height=window.innerHeight) {
        this.UPPER_BLOCK_LIMIT = width * height * 10
        this.UPPER_BLOCK_SIZE_LIMIT_DIVISION = 5

        this.width = width
        this.height = height
        this.canvas = null
        this.rects = []
        this.nextBidirectionalRange = 100
        this.iterationDelay = 2000

        this.createCanvas()
        this.createGenesisCircles()
        this.drawCircles()

        setInterval(() => {
            this.createNextCircles()
            this.canvas.clearRect(0, 0, canvas.width, canvas.height);
            this.drawCircles()
        }, this.iterationDelay);
    }

    createCanvas() {
        let canvas = document.createElement("canvas")
        canvas.id = "canvas"
        canvas.width = this.width
        canvas.height = this.height
        this.canvas = canvas.getContext("2d")
        document.body.appendChild(canvas)
    }

    createGenesisCircles() {
        for (let i = 0; i < getRandomInt(this.UPPER_BLOCK_LIMIT); i++) {
            this.rects[i] = {
                color: `rgb(${getRandomInt(255)}, ${getRandomInt(255)}, ${getRandomInt(255)})`,
                x: getRandomInt(this.width),
                y: getRandomInt(this.height),
                width: getRandomInt(this.width) / this.UPPER_BLOCK_SIZE_LIMIT_DIVISION,
            }
        }
    }

    createNextCircles() {
        for (let i = 0; i < this.rects.length; i++) {
            this.rects[i] = {
                color: this.rects[i].color,
                x: getRandomIntInRange(this.rects[i].x - this.nextBidirectionalRange, this.rects[i].x + this.nextBidirectionalRange),
                y: getRandomIntInRange(this.rects[i].y - this.nextBidirectionalRange, this.rects[i].y + this.nextBidirectionalRange),
                width: this.rects[i].width,
            }
        }
    }

    drawCircles() {
        for (let i = 0; i < this.rects.length; i++) {
            this.canvas.beginPath();
            this.canvas.fillStyle = this.rects[i].color
            this.canvas.arc(this.rects[i].x, this.rects[i].y, this.rects[i].width / 2, 0, 2 * Math.PI);
            this.canvas.fill();
        }
    }
}

let c = new Canvas()
