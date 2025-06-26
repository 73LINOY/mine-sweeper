const FLAG = 'FLAG'
const BOMB = 'BOMB'
const FLOOR = 'FLOOR'


const FLAG_IMG = '<img src="img/flag.jpg">'
const BOMB_IMG = '<img src="img/bomb.png">'

var gBoard = []
var gSize = 4
var gBombCount = 2

function onInitGame() {
    buildBoard()
    renderBoard()
    setMines()
}

function buildBoard() {
    for (var i = 0; i < gSize; i++) {
        gBoard[i] = []
        for (var j = 0; j < gSize; j++) {
            gBoard[i][j] = { type: FLOOR, gameElement: null }
        }
    }

}

function renderBoard() {
    var tableStr = ''
    for (var i = 0; i < gSize; i++) {
        tableStr += '<tr>'
        for (var j = 0; j < gSize; j++) {
            var cellClass = `cell-${i}-${j} `
            if (gBoard[i][j].type === FLOOR) cellClass += ' floor'
            
            tableStr += `<td class="cell ${cellClass}" onclick="cellClicked(${i}, ${j})">`

            if (gBoard[i][j].gameElement === BOMB) {
                tableStr += BOMB_IMG
            } else if (gBoard[i][j].gameElement === FLAG) {
                tableStr += FLAG_IMG
            }

            tableStr += `</td>`
        }
        tableStr += '</tr>'
    }
    document.querySelector('.board-table').innerHTML = tableStr
}

function setMines() {
    for (var i = 0; i < gBombCount; i++) {
        var randomI = getRandomInt(0, gSize)
        var randomJ = getRandomInt(0, gSize)
        gBoard[randomI][randomJ].gameElement = BOMB
    }
    renderBoard()
}

function cellClicked(i, j) {
    if (gBoard[i][j].gameElement === BOMB) {
        document.querySelector(`.cell-${i}-${j} img`).style.display = 'block'
    } 
}