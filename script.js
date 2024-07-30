//so we are building a tic tac toe game

const Board = (function() {
    //this would be the tic tac toe matrix
    const board = [
        [null,null,null],
        [null,null,null],
        [null,null,null]
    ]
    
    const display = ()=>{
        board.forEach((row)=>console.log([...row]));
    }

    const move = (player,row,col)=>{
        if (board[row][col]!=null) {
            alert("not valid");
            return false;
        } 
        board[row][col] = player.char;
        return true;
    }

    const checkWin = (char)=>{
        //first we check the row
        for (row of board) {
            if (!row.includes(null) && (new Set(row)).size===1) return true;
        }
        //we check for columns
        for (let col=0; col<3; col++) {
            if ((board[0][col]!=null && board[1][col]!=null && board[2][col]!=null) &&
                (board[0][col] === board[1][col] && board[1][col]===board[2][col])) {
                return true;
            }
        }
        //we check for the diagnols
        if ((board[0][0]!=null && board[1][1]!=null && board[2][2]!=null) &&
            (board[0][0] === board[1][1] && board[1][1] === board[2][2])) {
            return true;
        }
        if ((board[0][2]!=null && board[1][1]!=null && board[2][0]!=null) &&
            (board[0][2] === board[1][1] && board[1][1] === board[2][0])) {
            return true;
        }
        //if nothing matches 
        return false;
    }

    const refresh = ()=>{
        for (let row=0; row<3; row++) {
            for (let col=0; col<3; col++) {
                board[row][col] = null;
            }
        }
    }

    return {move,checkWin,display,refresh};

})();

//now we need the players
function createPlayer(name,char) {
    return {
        name,
        char
    }
}

function playRound(player1,player2) {
    let currentPlayer = player1;
    for (let i = 0; i < 9; i++) {
        let validMove = false;
        while (!validMove) {
            let row = prompt(`${currentPlayer.name} Enter row`);
            let col = prompt(`${currentPlayer.name} Enter col`);
            validMove = Board.move(currentPlayer,parseInt(row),parseInt(col));
            if (!validMove) {
                console.log('Invalid move. Try again.');
            }
        }
      
        Board.display();
        if (Board.checkWin(currentPlayer.char)) {
            console.log(`${currentPlayer.name} wins`);
            return;
        }
        currentPlayer = currentPlayer===player1 ? player2 : player1;
    }
    console.log("draw");
}

//now the game round
function startMain(player1,player2) {
    do {
        playRound(player1,player2);
        Board.refresh();
    } while (prompt("Do you want to play again(yes/no)?", "no").toLowerCase() === "yes");
}

// startMain();

const start = document.querySelector("#introPage > p");
const startPage = document.querySelector("#introPage");
const playerCard = document.querySelectorAll(".player-card");
const forms = document.querySelectorAll(".player-card>form");
const gamePage = document.querySelector(".game-page");
start.addEventListener("click",async function(e) {
    if (!formFilled()) return;
    e.target.classList.add("click");
    playerCard.forEach((card)=>card.classList.add("click"));
    await new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve();
        },3000);
    })
    startPage.style.display = "none";
    gamePage.style.display = "flex";
    let player1Data = new FormData(forms[0]);
    let player2Data = new FormData(forms[1]);
    let player1 = createPlayer(player1Data.get("name"),player1Data.get("character"));
    let player2 = createPlayer(player2Data.get("name"),player2Data.get("character"));
    //startMain(player1,player2);
})

function formFilled() {
    if (forms[0].checkValidity() && forms[1].checkValidity()) return true;
}