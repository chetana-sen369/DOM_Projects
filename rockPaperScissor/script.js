const playerCount = document.querySelector("#playerScore");
const compCount = document.querySelector("#computerScore");
const resetBtn = document.querySelector("#reset");
const resultDiv = document.getElementById("result");
const playerDisplay = document.getElementById("player");
const computerDisplay = document.getElementById("computer");
const emoji = {
  rock: "✊",
  paper: "✋",
  scissors: "✌️"
};
const rules = {
  rock: "scissors",
  paper: "rock",
  scissors: "paper"
};
const choices = ["rock", "paper", "scissors"];
let countP = 0;
let countC = 0;
// random computer choice
function computerChoice() {
  return choices[Math.floor(Math.random() * choices.length)];
}
// determine winner
function selectWinner(player, computer) {
  if (player === computer) {
    resultDiv.className = "result tie";
    resultDiv.innerText = "It's a tie!";
  } else if (rules[player] === computer) {
    resultDiv.className = "result pWin";
    resultDiv.innerText = `You Win!`;
    countP++;
  } else {
    resultDiv.className = "result cWin";
    resultDiv.innerText = `Computer Wins!`;
    countC++;
  }
  playerCount.textContent = `You: ${countP}`;
  compCount.textContent = `Computer: ${countC}`;
}
// player and computer choices 
document.querySelectorAll(".optBtn").forEach(btn => {
  btn.addEventListener("click", function() {
    const playerChoice = this.id;
    const compChoice = computerChoice();
    playerDisplay.textContent = `Your choice: ${emoji[playerChoice]} ${playerChoice}`;
    computerDisplay.textContent = `Computer choice: ${emoji[compChoice]} ${compChoice}`;
    selectWinner(playerChoice, compChoice);
  });
});
// reset game
resetBtn.addEventListener("click", function(){
    countP = 0;
  countC = 0;
  playerCount.textContent = `You: ${countP}`;
  compCount.textContent = `Computer: ${countC}`;
  playerDisplay.textContent = "Your choice:";
  computerDisplay.textContent = "Computer choice: ";
  resultDiv.className = "result";
  resultDiv.innerText = "Choose an option to start!";
});




