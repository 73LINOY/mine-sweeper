const FLAG = 'FLAG'
const BOMB = 'BOMB'
const FLOOR = 'FLOOR'


const FLAG_IMG = '<img src="img/flag.webp" class="cell-flag">'
const BOMB_IMG = '<img src="img/bomb.png" class="cell-bomb">'

var gBoard = []
var gSize = 4
var gBombCount = 2
var gGame = {
    isOn: false,
    markedCount: 0,
    revealedCount: 0,
    // secsPassed: 0
}

function onInitGame() {
    gGame.isOn = true
    gGame.markedCount = 0
    gGame.revealedCount = 0
    buildBoard()
    renderBoard()
    document.querySelector('#flags-left').innerText= gBombCount
}

function buildBoard() {
    for (var i = 0; i < gSize; i++) {
        gBoard[i] = []
        for (var j = 0; j < gSize; j++) {
            gBoard[i][j] = { type: FLOOR, minesAroundCount: 0, isMine: false, isMarked: false, isRevealed: false }
        }
    }

}

function renderBoard() {
    var tableStr = ''
    for (var i = 0; i < gSize; i++) {
        tableStr += '<tr>'
        for (var j = 0; j < gSize; j++) {
            var cellClass = `cell-${i}-${j} `
            cellClass += gBoard[i][j].isRevealed ? 'revealed ' : ''
            if (gBoard[i][j].type === FLOOR) cellClass += ' floor'

            tableStr += `<td class="cell ${cellClass}" onclick="cellClicked(${i}, ${j})" oncontextmenu="onFlagCell(event, ${i}, ${j})">`

            if (gBoard[i][j].isMine) {
                tableStr += BOMB_IMG
            }
            if (gBoard[i][j].isMarked) {
                tableStr += FLAG_IMG
            } 
            if (!gBoard[i][j].isMarked && !gBoard[i][j].isMine) {
                tableStr += `<span class="cell-bomb-count">${gBoard[i][j].minesAroundCount ? gBoard[i][j].minesAroundCount : ''}</span>`
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
        while(gBoard[randomI][randomJ].isRevealed && gBoard[randomI][randomJ].isMine) {
            randomI = getRandomInt(0, gSize)
            randomJ = getRandomInt(0, gSize)
        }
        gBoard[randomI][randomJ].isMine = true
    }
}

function cellClicked(i, j) {
    if (!gGame.isOn) return
    if (gBoard[i][j].isRevealed || gBoard[i][j].isMarked) return
    gBoard[i][j].isRevealed = true
    if (gBoard[i][j].isMine) {
        document.querySelector(`.cell-${i}-${j} img`).style.display = 'block'
        gameOver()
    } else {
        document.querySelector(`.cell-${i}-${j}`).classList.add('revealed')
        if (!gGame.revealedCount) {
            setMines()
            updateNegBombsForBoard()
            renderBoard()
        }
        gGame.revealedCount++
        checkVictory()

        if (!gBoard[i][j].minesAroundCount) {
            expandNeighboringCells(i, j)
        }
    }
}

function gameOver() {
    showMines()
    gGame.isOn = false
    document.querySelector('.smiley').innerText = '🥲'

}

function showMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) {
                document.querySelector(`.cell-${i}-${j} img`).style.display = 'block'
                if (gBoard[i][j].isMarked) {
                    document.querySelector(`.cell-${i}-${j} img.cell-flag`).style.display = 'none'
                }
            }
        }
    }
}
function restart() {
    document.querySelector('.smiley').innerText = '😊'
    onInitGame()
}
function updateNegBombs(rowIdx, colIdx) {
    var negsBombsCount = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue
            if (i === rowIdx && j === colIdx) continue

            if (gBoard[i][j].isMine) {
                negsBombsCount++
            }
        }
    }
    gBoard[rowIdx][colIdx].minesAroundCount = negsBombsCount
}

function updateNegBombsForBoard() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) continue
            updateNegBombs(i, j)
        }
    }
}

function onFlagCell(ev, i, j) {
    ev.preventDefault()
    if (!gGame.isOn) return

    if (gBoard[i][j].isMarked) {
        gGame.markedCount--
        gBoard[i][j].isMarked = false
        renderBoard()
        return
    }

    if (gGame.markedCount >= gBombCount) return

    gBoard[i][j].isMarked = true
    gGame.markedCount++
    document.querySelector('#flags-left').innerText= gBombCount - gGame.markedCount
    checkVictory()
    renderBoard()
}

function checkVictory() {
    if (gGame.revealedCount === Math.pow(gSize, 2) - gBombCount && gGame.markedCount === gBombCount) {
        document.querySelector('.smiley').innerText = '🥳'
        gGame.isOn = false
        return true
    }
    return false
}

function expandNeighboringCells(rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue
            if (i === rowIdx && j === colIdx) continue

            cellClicked(i, j)
        }
    }
}

function setDifficulty(size, minesCount) {
    gSize = size
    gBombCount = minesCount
    onInitGame()
}