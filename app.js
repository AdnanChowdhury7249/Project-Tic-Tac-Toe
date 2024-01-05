
const GameBoard = (() => {

    let gameBoard = ["", "", "", "", "", "", "", "", ""]

    const render = () => {
        let boardHTML = "";
        gameBoard.forEach((box, index) => {
            boardHTML += `<div class="box" id="${index}">${box}</div>`


        })
        document.querySelector(".board").innerHTML = boardHTML;
        const boxes = document.querySelectorAll(".box")
        boxes.forEach((box) => {
            box.addEventListener("click", Game.handleClick)
        })
    }

    const update = (index, value) => {
        gameBoard[index] = value
        render();
    };

    const getGameBoard = () => gameBoard;

    const highlightWiningCombination = ((winningCombo) => {
        console.log("Highlighting Winning Combination", winningCombo);
        winningCombo.forEach((index) => {
            const box = document.getElementById(index);
            if (box) {
                console.log("Adding winning-box class to element", index);
                box.classList.add("winning-box");

                console.log("Current styles:", window.getComputedStyle(box));
            }
        });
    });


    return {
        render,
        update,
        getGameBoard,
        highlightWiningCombination,
    }


})();


const createPlayer = (name, mark) => {
    return {
        name,
        mark
    }
}

const displayController = (() => {
    const renderMessage = (message) => {
        document.getElementById("winnerMessage").innerHTML = message;

        if (message) {
            winnerModal.style.display = "block";


            window.addEventListener("click", (event) => {
                if (event.target === winnerModal) {
                    winnerModal.style.display = "none";
                }
            });
        }
    };

    return {
        renderMessage,
    };
})();



const Game = (() => {
    let players = [];
    let currentPlayerIndex;
    let gameOver;
    const start = () => {
        players = [
            createPlayer(document.querySelector("#player1").value, "X"),
            createPlayer(document.querySelector("#player2").value, "O")
        ]
        currentPlayerIndex = 0;
        gameOver = false;
        GameBoard.render();
        const boxes = document.querySelectorAll(".box")
        boxes.forEach((box) => {
            box.addEventListener("click", handleClick)
        })
    }

    const handleClick = (event) => {
        if (gameOver) {
            return;
        }
        let index = event.target.id;
        indexNum = parseInt(index);

        if (GameBoard.getGameBoard()[indexNum] !== "") {
            return;
        }

        // Ensure that players[currentPlayerIndex] and its mark property are defined
        if (players[currentPlayerIndex] && players[currentPlayerIndex].mark) {
            GameBoard.update(indexNum, players[currentPlayerIndex].mark);
        } else {
            // Handle the case where players[currentPlayerIndex] or its mark property is undefined
            console.error("Player or mark is undefined.");
            return;
        }

        if (checkForWin(GameBoard.getGameBoard(), players[currentPlayerIndex].mark)) {
            gameOver = true;
            displayController.renderMessage(`${players[currentPlayerIndex].name} wins`);
        } else if (checkForTie(GameBoard.getGameBoard())) {
            gameOver = true;
            displayController.renderMessage(`It's a Tie!`);
        }
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    };


    const restart = () => {
        for (let i = 0; i < 9; i++) {
            GameBoard.update(i, "")
        }
        GameBoard.render();
        gameOver = false;
        document.querySelector(".message").innerHTML = ""
    }

    return {
        start,
        handleClick,
        restart,
    }

})();


function checkForWin(board) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]

    ];


    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            console.log("Winning condition met for combination", winningCombinations[i]);

            GameBoard.highlightWiningCombination(winningCombinations[i]);
            return true;
        }
    }
    return false
}

function checkForTie(board) {
    return board.every(cell => cell !== "")

}

restart = document.querySelector("#restartGame")
restart.addEventListener("click", () => {
    Game.restart();
})

start = document.querySelector("#restartGame")
start.addEventListener("click", () => {
    Game.start();
})