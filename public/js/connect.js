const initialState = {
  player: 'yellow',
  winner: false,
  board: [[0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]]
}

const reducer = (state = initialState, action) => {
  console.log(initialState)
  /* A switch statement that is checking the action.type and returning the state. */
  switch (action.type) {
    case 'CHIP_DROPPED':
      return state = {
        ...state,
        board: action.updateBoard
      }
    case 'PLAYER_SWITCHED':
      return state = {
        ...state,
        player: action.player
      }
    case 'WINNER':
      return state = {
        ...state,
        winner: true
      }
    case 'RESET':
      return state = {
        /* This is the initial state of the game. */
        player: 'yellow',
        winner: 'false',
        board: [[0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]]
      }
    default:
      return state
  }
}

let store = Redux.createStore(reducer, initialState)

/**
 * If the game is a draw, display the text 'The game is a draw! Replay?'; otherwise, display the text
 * '{status} won the game! Replay?'
 * @param status - 'draw' or 'X' or 'O'
 */
const gameOver = (status) => {
  const $endText = document.querySelector('#end-text')
  status == 'draw'
    ? $endText.textContent = 'The game is a draw! Replay?'
    : $endText.textContent = `${status} won the game! Replay?`
  store.dispatch({ type: 'WINNER' })
}

const winner = (row, col, color) => {
  const { board } = store.getState()
  let count = 0
  let num = color == 'Yellow' ? 1 : -1

  /* This is checking the row for a winner. */
  for (let i = 0; i < board[row].length; i++) {
    board[row][i] == num ? count += 1 : count = 0
    if (count == 4) {
      gameOver(color)
      break
    }
  }
  count = 0

  for (let i = 0; i < board.length; i++) {
    board[i][col] == num ? count += 1 : count = 0
    if (count == 4) {
      gameOver(color)
      break
    }
  }
  count = 0

  /* This is checking the diagonal for a winner. */
  for (let i = 3; i >= -3; i--) {
    if (row - i > 5 || row - i < 0 || col - i > 6 || col - i < 0) {
      continue
    }
    board[row - i][col - i] == num ? count += 1 : count = 0
    if (count == 4) {
      gameOver(color)
      break
    }
  }
  count = 0

  for (let i = 3; i >= -3; i--) {
    if (row + i > 5 || row + i < 0 || col - i > 6 || col - i < 0) {
      continue
    }
    board[row + i][col - i] == num ? count += 1 : count = 0
    if (count == 4) {
      gameOver(color)
      break
    }
  }
  count = 0

  /* This is checking if the board is full. If it is, then the game is a draw. */
  for (let i = 0; i < board.length; i++) {
    if (board[i].includes(0)) {
      count += 1
    }
    if (count == 0) {
      gameOver('draw')
      break
    }
  }
}

const dropChip = (col) => {
  const { board, player } = store.getState()
  const updateBoard = [...board]

  /* This is checking the board to see if the column is full. If it is, then the chip will not be
  dropped. */
  for (let i = board.length - 1; i >= 0; i--) {
    if (board[i][col] == 0) {
      if (player == 'yellow') {
        updateBoard[i][col] = 1
        winner(i, col, 'Yellow')
        store.dispatch({ type: 'PLAYER_SWITCHED', player: 'red' })
        break
      } else if (player == 'red') {
        updateBoard[i][col] = -1
        winner(i, col, 'Red')
        store.dispatch({ type: 'PLAYER_SWITCHED', player: 'yellow' })
        break
      }
      store.dispatch({ type: 'CHIP_DROPPED', updateBoard })
    }
  }
}

const renderGame = () => {
  /* This is the renderGame function. It is getting the state of the board, player, and winner. It is
  then selecting the board and setting the innerHTML to an empty string. It is then selecting the
  status and setting the textContent to the player's turn. It is then setting the boxShadow to the
  color of the player. */
  const { board, player, winner } = store.getState()
  const $board = document.querySelector('#board')
  $board.innerHTML = ''
  const $status = document.querySelector('#status')
  $status.textContent = `${player}'s turn`
  $status.style.boxShadow = player == 'yellow'
    ? '0 .25em .3125em rgba(245, 255, 58, .7)'
    : '0 .25em .3125em rgba(255, 63, 63, 0.5)'

  const $end = document.querySelector('#end')
  winner == true ? $end.classList.remove('hidden') : $end.classList.add('hidden')

  for (let i = 0; i < board.length; i++) {
    const $row = document.createElement('div')
    $row.classList.add('row')
    $board.appendChild($row)

    /* This is creating the cells and adding the yellow and red classes to the cells. */
    for (let j = 0; j < board[i].length; j++) {
      const $cell = document.createElement('div')
      $cell.classList.add('cell')
      $cell.dataset.row = i
      $cell.dataset.column = j

      if (board[i][j] == 1) {
        $cell.classList.add('yellow')
      } else if (board[i][j] == -1) {
        $cell.classList.add('red')
      }
      $row.appendChild($cell)
    }
  }
}

store.subscribe(renderGame)

renderGame()

/* This is adding an event listener to the document. If the event target has a class name that includes
'cell', then it is getting the row and column of the cell and dropping the chip in that column. */
document.addEventListener('click', (event) => {
  if (event.target.className.includes('cell')) {
    const $row = event.target.dataset.row
    const $column = event.target.dataset.column
    dropChip($column)
  }
})
/* This is adding an event listener to the end-text. If the end-text is clicked, then the game will be
reset. */
const $restart = document.querySelector('#end-text')
$restart.addEventListener('click', () => {
  store.dispatch({ type: 'RESET' })
})