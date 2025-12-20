
var $board = $('#chess-board')
var board = Chessboard('chess-board', {
    draggable: false,
    moveSpeed: 10,
    snapbackSpeed: 10,
    snapSpeed: 10,
    snapSpeed: 10,
    position: "8/8/8/8/8/8/8/8 w - - ",
    pieceTheme: 'chesspieces/wikipedia/{piece}.png',
})

let fen = "6N1/5KR1/2n5/8/8/8/2n5/1k6 w - - 0 1"
let moves = "f7e6 c6b4 e6e5 b4d3 e5e4 d3f2 e4f3 f2d3 f3e2 c2b4 e2e3 b1b2 e3d4 d3f4 d4c4 b4d5 g7h7 d5e3 c4d4 e3c2 d4e4 f4e6 e4e5 e6g5 h7h5 c2e1 e5f5 g5f3 f5e4 f3d2 e4e3 d2b3 h5h1 e1c2 e3d3 b3c1 d3e4 c1b3 h1h3 b3c5 e4e5 c2e1 g8f6 e1d3 e5d6 c5b7 d6c7 b7c5 c7c6 b2c2 h3h2 c2c3 c6d5 c3b4 h2h4 b4b5 d5d4 d3f4 f6e8 c5b3 d4e4 f4g6 h4h7 b3c5 e4d4 g6f4 e8d6 b5c6 h7h6 c5b3 d4e4 f4e6 e4e5 e6d4 h6h3 b3c5 d6c8 d4c2 h3c3 c2b4 e5d4 b4a6 c3c2 c6d7 c8b6 d7d6 b6c4 d6c6 c4e3 c6d6 e3f5 d6e6 f5g7 e6f7 g7h5 c5e6 d4e5 a6b4 c2e2 b4d3 e5e4 d3b4 e2b2 f7g6 h5g3 e6g5 e4d4 g5e6 d4c4 b4a6 b2f2 e6g5 f2f1 a6c7 g3e2 g5f7 e2f4 g6g5 c4d4 c7b5 d4c5 b5d6 f4e6 g5g6 e6f8 g6g5 c5d5 d6f5 f1a1 f5g3 a1a2 f7h6 a2g2 g5g4 f8e6 g4f3 g2b2 g3h5 b2b4 h5f6 d5d4 f6h5 d4d3 h6g4 e6g5 f3g3 g5e4 g3h4 b4a4 h5f4 d3d4 f4e2 d4d5 e2f4 d5d6 f4h3 a4a8 g4f2 e4c5 h4g5 d6e5 f2g4 e5d4 h3f4 c5e4 g5g6 a8a6 g6f5 a6a5 f5e6 e4c5 e6e7 a5a7 e7f6 d4e4 f6g5 a7a5 f4h5 c5e6 g5g6 a5b5 g6f7 e6c5 f7e7 b5b2 e7d6 c5b7 d6e7 b2a2 h5g7 a2e2 e7d7 e2g2 g7e8 e4f4 g4f6 f4e5 d7e7 g2e2 e7d7 b7a5 f6g4 e5f5 g4h6 f5g6 h6g8 a5c4 e8c7 g6f7 g8h6 f7f6 h6g8 f6e5 g8e7 e2d2 d7c6 d2c2 c7a6 c4e3 c6d7 c2d2 d7c6 d2d6 c6b5 d6h6 e7c8 h6h5 a6b4 e5d4 b5c6 e3c4 c8e7 h5h6 c6c7 h6h7 c7d7 d4e5 b4d5 c4d2 d7c6 d2e4 e7g6 e5f5 g6f8 h7h6 c6c7 h6h1 f8d7 h1b1 d7b8 f5e5 d5e3 e5d4 e3f5 d4d5 f5e3 d5c5 b8d7 c5d4 e3g4 b1c1 c7d8 c1e1 g4f6 e4g5 d8c7 g5f7 d7f8 e1f1 f6g4 f1g1 g4f6 g1e1 c7d7 d4e5 f6e8 f7h8 d7e7 e5d5 e7d7 e1f1 e8c7 d5e5 f8e6 h8g6 e6c5 f1b1 d7c6 g6e7 c6d7 e7f5 d7c6 f5d4 c6d7 b1d1 c7a6 d4f5 d7c6 d1h1 a6b4 h1h6 c6d7 e5d4 c5e6 d4c4 b4a6 h6h7 d7c6 h7h1 a6c7 h1d1 c7e8 f5e7 c6c7 c4d5 e6f8 e7g8 c7d7 d5c5 d7c7 d1e1 f8d7 c5d5 d7b6 d5e6 e8d6 g8e7 d6c4 e1a1 c4d6 a1c1 d6c4 c1c2 c7b8 e7f5 b8a7 f5d4 a7a6 c2a2 a6b7 a2h2 b6a4 h2c2 a4b2 c2c3 c4b6 c3h3 b2c4 h3h4 b7a6 h4h5 a6a7 d4c2 a7b7 c2b4 b6a4 e6d5 c4b6 d5e5 a4c5 h5h6 b7c7 h6g6 c5d7 e5f5 b6c8 g6c6 c7b7 c6c2 d7b6 f5e6 b6a8 b4d5 a8b6 c2b2 b7c6 d5b4 c6b5 b4d3 b5c4 d3e5 c4c3 b2b1 c3d4 b1a1 d4c3 a1c1 c3b3 c1c7 b3b4 e5c6 b4b3 c6b8 b3b4 e6e5 b4b3 c7c5 c8a7 e5d4 b3b4 b8a6 b4a4 c5h5 b6d7 d4c4 a7c6 a6c7 c6e5 c4c3 a4a5 h5h6 d7c5 c3d4 c5d7 d4d5 a5b4 h6h4 b4c3 c7b5 c3d2 h4h3 e5g4 d5d4 d2e2 b5c3 e2f1 c3d5 f1g2 d5f4 g2f2 h3c3 g4f6 c3a3 f6g4 f4h3 f2e2 h3g5 d7f6 a3a2 e2f1 g5h3 f1e1 h3f4 e1f1 f4d3 f1g1 a2b2 g1f1 b2c2 f1g1 d3b2 g1f1 b2c4 f1e1 d4d3 e1f1 c4e3 g4e3 d3e3 f6g4 e3f3 g4e5 f3f4 e5g6 f4e3 g6h4 c2f2 f1e1 f2f6 h4g2 e3f3 e1f1 f6f7 g2e1 f3e3 f1g1 e3e2 e1g2 f7e7 g2f4 e2f3 f4d3 e7e3 d3c5 e3e1 g1h2 e1d1 c5e6 d1d2 h2g1 f3g3 g1f1 d2d5 e6c7 d5e5 c7a8 g3f3 f1g1 e5e2 a8b6 e2g2 g1f1 g2b2 f1e1 b2b6 e1d2 b6b3 d2c2 b3e3 c2b1 e3e2 b1a1 e2f2 a1b1 f3e3 b1a1 e3d3 a1b1 d3c3 b1a1 c3b3 a1b1 f2f1".split(" ")
var index = -1;

function move_from_uci(uci) {
    return {
        from: uci.slice(0, 2),
        to: uci.slice(2, 4),
        promotion: uci[4] || undefined
    };
}

function fenAndUciToGame(fen, moves) {
    const chess = new Chess(fen);
    
    for (const uci of moves) {
        const move = move_from_uci(uci)
        const result = chess.move(move);
        if (!result) throw new Error(`Illegal move: ${uci}`);
    }
    
    return chess
}


function move_to(next_index) {
    index = parseInt(index)
    next_index = parseInt(next_index)
    // console.log("move from", index, "to", next_index)
    if (0 <= next_index && next_index < moves.length) {
        if (next_index == index + 1) {
            const m = moves[next_index];
            // console.log(m)
            let sq1 = m.substring(0,2)
            let sq2 = m.substring(2,4)
            board.move(sq1 + "-" + sq2)
            index = next_index;
        } else if (next_index == index - 1) {
            const m = moves[next_index+1];
            // console.log(m)
            let sq1 = m.substring(0,2)
            let sq2 = m.substring(2,4)
            board.move(sq2 + "-" + sq1)
            index = next_index;
        } else {
            const chess = new Chess(fen);
            for (var i = 0; i <= next_index; i++) {
                const move = move_from_uci(moves[i])
                const result = chess.move(move);
                if (!result) throw new Error(`Illegal move: ${uci}`);
            }
            board.position(chess.fen(), false)
            index = next_index;
        }

        $board.find('.square-55d63').removeClass('highlight-check')
        if (san_history[index].slice(-1) == "+" || san_history[index].slice(-1) == "#") {
            if (index % 2 == 1) {
                $board.find("[data-piece=wK]").parent().addClass('highlight-check')
            } else {
                $board.find("[data-piece=bK]").parent().addClass('highlight-check')
            }
        }
    }
}

function selectCell(cell, scroll) {
    document
    .querySelectorAll("#pgn-table td.selected")
    .forEach(td => td.classList.remove("selected"));
    
    cell.classList.add("selected");
    move_to(cell.dataset.index)
    if (scroll) scrollToCell(cell);
}


function scrollToCell(cell) {    
    if (cell) {
        cell.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
}

function populatePGNTable(strings) {
    const tbody = document.querySelector("#pgn-table tbody");
    tbody.innerHTML = "";
    
    for (let i = 0; i < strings.length; i += 2) {
        const row = document.createElement("tr");
        
        const cell = document.createElement("td");
        row.appendChild(cell);
        for (let col = 0; col < 2; col++) {
            const cell = document.createElement("td");
            cell.textContent = strings[i + col] ?? "";
            cell.dataset.row = i / 2;
            cell.dataset.col = col;
            cell.dataset.index = i + col;
            
            cell.addEventListener("click", () => selectCell(cell, false));
            row.appendChild(cell);
        }
        
        tbody.appendChild(row);
    }
}

function reset() {
    document
    .querySelectorAll("#pgn-table td.selected")
    .forEach(td => td.classList.remove("selected"));
    board.position(fen)
    index = -1
    const cell = document.querySelector(`#pgn-table td[data-index="${0}"]`)
    scrollToCell(cell)
}

$('#chess-start').on('click', reset)

function prev() {
    if (index <= 0) {
        reset();
        return;
    }
    const cell = document.querySelector(`#pgn-table td[data-index="${index-1}"]`)
    selectCell(cell, true)
}

$('#chess-prev').on('click', prev)

function next() {
    if (index < moves.length - 1) {
        const cell = document.querySelector(`#pgn-table td[data-index="${index+1}"]`)
        selectCell(cell, true)
    }
}

$('#chess-next').on('click', next)

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var play = false;

$('#chess-play').on('click', async function () {
    if (play) {
        play = false
        $('#chess-play').text("Play")
    } else {
        $('#chess-play').text("Stop")
        play = true
        while (play && index < moves.length - 1) {
            next()
            await sleep(300)
        }
        play = false
        $('#chess-play').text("Play")
    }
})

function onKeyDown(event) {
    switch (event.key) {
      case "ArrowUp":
        reset();
        break;
      case "ArrowDown":
        const cell = document.querySelector(`#pgn-table td[data-index="${moves.length-1}"]`)
        selectCell(cell, true)
        break;
      case "ArrowLeft":
        prev();
        break;
      case "ArrowRight":
        next()
        break;
    }
  }

  document.addEventListener("keydown", onKeyDown);


const game = fenAndUciToGame(fen, moves);
const san_history = game.history();
populatePGNTable(san_history);
reset();