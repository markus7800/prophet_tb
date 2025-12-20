
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

let fen = ""
let moves = ""
var index = -1;

function init() {
    const config = localStorage.getItem("explorerConfig");
    const components = config.split(":")
    fen = components[0] + " 0 1";
    moves = components[1].split(" ");
    console.log(fen)
    console.log(moves)
    document.querySelector("#fen").innerHTML = fen
}

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


$('#copy-pgn').on('click', function() {
    const pgn = game.pgn();
    const textToCopy = pgn.slice("[SetUp \"1\"\n]".length)

    navigator.clipboard.writeText(textToCopy).then(() => {
        console.log("PGN copied to clipboard!");
      }).catch(err => {
        console.error("Copy failed:", err);
      });
})

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


init();
const game = fenAndUciToGame(fen, moves);
const san_history = game.history();
populatePGNTable(san_history);
reset()