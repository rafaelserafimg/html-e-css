const state = {
  view: {
    squares: document.querySelectorAll(".square"),
    enemy: document.querySelector(".enemy"),
    timeLeft: document.querySelector("#time-left"),
    score: document.querySelector("#score"),
    lives: document.querySelector("#lives"),
  },

  values: {
    gameVelocity: 800,
    hitPosition: 0,
    result: 0,
    curretTime: 60,
    lives: 3,
  },

  actions: {
    timerId: setInterval(randomSquare, 800),
    countDownTimerId: setInterval(countDown, 800),
  },
};

function countDown() {
  state.values.curretTime--;
  state.view.timeLeft.textContent = state.values.curretTime;

  if (state.values.curretTime <= 0) {
    clearInterval(state.actions.countDownTimerId);
    clearInterval(state.actions.timerId);
    alert("Game Over! Seu resultado foi: " + state.values.result);
  }
}

function playSound(audioName) {
  let audio = new Audio(`./src/audios/${audioName}.m4a`);
  audio.volume = 0.2;
  audio.play();
}

function randomSquare() {
  state.view.squares.forEach((square) => {
    square.classList.remove("enemy");
  });

  let randomNumber = Math.floor(Math.random() * 9);
  let randomSquare = state.view.squares[randomNumber];

  randomSquare.classList.add("enemy");
  state.values.hitPosition = randomSquare.id;
}

function addListenerHitBox() {
  state.view.squares.forEach((square) => {
    square.addEventListener("mousedown", () => {

      // impedir clique após o jogo acabar
      if (state.values.lives <= 0 || state.values.curretTime <= 0) return;

      // ACERTOU
      if (square.id == state.values.hitPosition) {
        state.values.result++;
        state.view.score.textContent = state.values.result;
        state.values.hitPosition = null;
        playSound("hit");

      // ERROU
      } else {
        if (state.values.lives > 0) {
          state.values.lives--;
          state.view.lives.textContent = state.values.lives;
          playSound("error");
        }

        // se acabou as vidas → GAME OVER
        if (state.values.lives <= 0) {
          state.values.lives = 0; // impedir vidas negativas
          state.view.lives.textContent = 0;

          clearInterval(state.actions.countDownTimerId);
          clearInterval(state.actions.timerId);

          alert("Game Over! Você perdeu todas as vidas!");
        }
      }
    });
  });
}

function resetGame() {
  // parar timers antigos
  clearInterval(state.actions.countDownTimerId);
  clearInterval(state.actions.timerId);

  // resetar valores
  state.values.curretTime = 60;
  state.values.result = 0;
  state.values.hitPosition = null;
  state.values.lives = 3;

  // atualizar interface
  state.view.timeLeft.textContent = 60;
  state.view.score.textContent = 0;
  state.view.lives.textContent = 3;

  // reiniciar timers
  state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
  state.actions.countDownTimerId = setInterval(countDown, state.values.gameVelocity);
}

function initialize() {
  addListenerHitBox();
}

initialize();

// botão de reinício
document.querySelector("#restart-btn").addEventListener("click", resetGame);
