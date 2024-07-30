//so we are building a tic tac toe game
const MAX_PLAYS = 9;

document.querySelector("audio#bgMusic").play().catch(error => {
    console.error("Autoplay was prevented:", error);
    // Handle autoplay prevention here (e.g., show a play button)
});

function playClickSound() {
    const clickSound = document.querySelector("audio#clickSound");
    clickSound.currentTime = 0; // Rewind to start to allow rapid replay
    clickSound.play();
}

function playWinSound() {
    const winSound = document.getElementById("winnersound");
    winSound.play();
}

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
            return false;
        } 
        board[row][col] = player.char;
        return true;
    }

    const checkWin = ()=>{
        //first we check the row
        for (row of board) {
            if (!row.includes(null) && (new Set(row)).size===1) return true;
        }
        //we check for columns
        for (let col=0; col<3; col++) {
            if ((board[0][col]!=null && board[1][col]!=null && board[2][col]!=null) &&
                (board[0][col] === board[1][col] && board[1][col]===board[2][col])) {
                return "col" + col;
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

function createConsole (player1,player2) {
    let currentPlayer = player1;
    let moves = 0;
    let gameStatus = "ongoing";
    const playMove = function(row,col) {
        if (gameStatus!="ongoing") return false;
        let validMove = Board.move(currentPlayer,row,col);
        if (!validMove) return validMove;
        currentPlayer = currentPlayer===player1 ? player2 : player1;
        moves++;
        return validMove;
    }
    const getCurrentPlayer = function() {
        return currentPlayer;
    }
    const getStatus = function() {
        if (Board.checkWin()) {
            gameStatus = "win";
        } else if (moves===MAX_PLAYS) {
            gameStatus = "draw";
        }
        return gameStatus;
    }
    const refresh = function() {
        gameStatus = "ongoing";
        currentPlayer = player1;
        moves = 0;
        Board.refresh();
    }
    return {playMove,getCurrentPlayer,getStatus,refresh};
}

//now we need the players
function createPlayer(name,char,id) {
    return {
        name,
        char,
        id
    }
}
let gameConsole = null;

//now the game round
function startGame(player1,player2) {
    gameConsole = createConsole(player1,player2);
}





const boxes = document.querySelectorAll(".box");
const player1 = document.querySelector(".game-page > div:first-child");
const player2 = document.querySelector(".game-page > div:last-child");
const result = document.querySelector(".result");
const restartButton = document.querySelector(".restart>button");
restartButton.addEventListener("click",()=>{
    gameConsole.refresh();
    boxes.forEach((box)=>{
        box.textContent = "";
    })
    result.textContent="";
    player1.style.fontSize = "50px";
    player2.style.fontSize = "40px";
})
player1.style.fontSize = "50px";
boxes.forEach((box)=>{
    box.addEventListener("click",(e)=>{
        let player = gameConsole.getCurrentPlayer();
        let row = e.target.getAttribute("data-row");
        let col = e.target.getAttribute("data-col");
        let validMove = gameConsole.playMove(parseInt(row),parseInt(col));
        if (!validMove) return;
        playClickSound();
        //display selection on board UI
        box.textContent = player.char;
        //if winner display winner here so we check the status
        let status = gameConsole.getStatus();
        console.log(status);
        if (status!="ongoing") {
            if (status==="win") {
                playWinSound();
                result.textContent = `${player.name} won!!!`;
            } else {
                result.textContent = `its a draw!`;
            }
            player1.style.fontSize = "40px";
            player2.style.fontSize = "40px";
            return;
        }
        //show the user whose turn it is
        if (player.id === 1) {
            player1.style.fontSize = "40px";
            player2.style.fontSize = "50px";
        } else {
            player2.style.fontSize = "40px";
            player1.style.fontSize = "50px";
        }
        //i need to check which player char to add to screen
        //which side is that player on
        //if this is a draw/win for this player
    })
})

const start = document.querySelector("#introPage > p");

start.addEventListener("click",async function(e) {
    const startPage = document.querySelector("#introPage");
    const playerCard = document.querySelectorAll(".player-card");
    const forms = document.querySelectorAll(".player-card>form");
    const gamePage = document.querySelector(".game-page");
    if (!formFilled(forms)) return;
    //if form is filled then we start the animations by adding the class click
    e.target.classList.add("click");
    playerCard.forEach((card)=>card.classList.add("click"));
    //we wait for the animations to complete for 3 seconds
    await new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve();
        },2200);
    })
    //change the display to the gamePage
    startPage.style.display = "none";
    gamePage.style.display = "flex";
    //create players based on the form data
    let player1Data = new FormData(forms[0]);
    let player2Data = new FormData(forms[1]);
    player1.textContent = player1Data.get("name");
    player2.textContent = player2Data.get("name");
    let player1data = createPlayer(player1Data.get("name"),player1Data.get("character"),1);
    let player2data = createPlayer(player2Data.get("name"),player2Data.get("character"),2);
    startGame(player1data,player2data);
})

function formFilled(forms) {
    if (forms[0].checkValidity() && forms[1].checkValidity()) return true;
}