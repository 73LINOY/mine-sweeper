const FLAG = 'FLAG'
const BOMB = 'BOMB'
const FLOOR = 'FLOOR'


const FLAG_IMG = '<img src="img/flag.jpg">'
const BOMB_IMG = '<img src="img/bomb.jpg">'

var gBoard

function onInitGame() {
    
}

function buildBoard() {
    var rowsCount = 4
    var colsCount = 4
    var board = []

    for (var i = 0; i < rowsCount; i++) {
        board[i] = []
        for (var j = 0; j < colsCount; j++) {
            board[i][j] = { type: FLOOR, gameElement: null }
            if (i === 0 ||
                i === rowsCount - 1 ||
                j === 0 ||
                j === colsCount - 1
            ) {
                board[i][j].type = WALL
            }
        }
    }


}