const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const moeda = document.querySelector('.moeda');
const dino = document.querySelector('.dino');
const grass = document.querySelector('.grass');
const monstro = document.querySelector('.monstro');
const textStart = document.querySelector('text-start');
const audioStart = new Audio('./audio/theme.mp3');
const audioGameOver = new Audio('./audio/gameover.mp3');
const audioMoeda = new Audio('./audio/moeda.mp3');
const floor1 = document.querySelector('.floor-1');
const floor2 = document.querySelector('.floor-2');
const floor3 = document.querySelector('.floor-3');
const timerElement = document.getElementById('timer'); 
const restartButton = document.getElementById('restart-button'); 

let moedas = 0;
let dinoCaught = false;
let isJumping = false;
let gameTime = 0; 
let timerInterval;
let gameOverTriggered = false;

const start = () => {
    if (gameOverTriggered) return; 

    document.getElementById("text-start").style.color = "rgb(236, 236, 236)";

    pipe.classList.add('pipe-animation');
    dino.classList.add('dino-animation');
    monstro.classList.add('monstro-animation');
    moeda.classList.add('moeda-animation');
    
    mario.src = './images/mario.gif';
    mario.style.width = '150px';
    mario.style.marginLeft = '50px';
    moeda.src = './images/moeda.gif';
    dino.src = './images/dino.gif';
    monstro.src = './images/monstro.gif';

    function checkCollision() {
        if (gameOverTriggered) return; 

        const marioRect = mario.getBoundingClientRect();
        const moedaRect = moeda.getBoundingClientRect();
        const dinoRect = dino.getBoundingClientRect();
        const monstroRect = monstro.getBoundingClientRect();
    
        if (marioRect.right > moedaRect.left &&
            marioRect.left < moedaRect.right &&
            marioRect.bottom > moedaRect.top &&
            marioRect.top < moedaRect.bottom) {
            moedas++;
            audioMoeda.play();
            document.getElementById('moedas').innerHTML = 'Moedas: ' + moedas;
    
            moeda.style.display = 'none';
    
            setTimeout(() => {
                moeda.style.display = 'block';
            }, 1000); 
        }
        
        if (!dinoCaught && marioRect.right > dinoRect.left &&
            marioRect.left < dinoRect.right &&
            marioRect.bottom > dinoRect.top &&
            marioRect.top < dinoRect.bottom) {
            dinoCaught = true;
            mario.src = './images/dino2.gif';
            mario.style.width = '150px';
            mario.style.marginLeft = '50px';
            dino.classList.remove('dino-animation'); 
            dino.classList.add('dino-move');
        }

    
        const groundLevel = window.innerHeight - 100;  
        const proximity = 1;
        const marioBottom = parseInt(window.getComputedStyle(mario).bottom.replace('px', ''));

        if (Math.abs(marioRect.right - monstroRect.left) < proximity && marioBottom <= groundLevel) {
            gameOver();
        }
    }
    
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes dinoMove {
            0% { transform: translateX(0); }
            100% { transform: translateX(200px); }
        }

        .dino-move {
            animation: dinoMove 2s infinite alternate;
        }
    `;
    document.head.appendChild(style);

    setInterval(checkCollision, 100);

    function grassAnimation(){
        grass.classList.add('grass-animation');
    }
    setInterval(grassAnimation, 8000);

    function floorAnimation1(){
        floor1.classList.add('floor-animation-1');
    }
    setInterval(floorAnimation1, 0);

    function floorAnimation2(){
        floor2.classList.add('floor-animation-2');
    }
    setInterval(floorAnimation2, 0);
            
    function floorAnimation3(){
        floor3.classList.add('floor-animation-3');
    }
    setInterval(floorAnimation3, 3100); 

    if (!timerInterval) { 
        gameTime = 0;
        timerElement.innerHTML = `Tempo: ${gameTime}s`;
        timerInterval = setInterval(() => {
            if (!gameOverTriggered) {
                gameTime++;
                timerElement.innerHTML = `Tempo: ${gameTime}s`;
            }
        }, 1000);
    }

    audioStart.play();
}

document.addEventListener('keydown', start);

const jump = () => {
    if (gameOverTriggered) return; 

    mario.classList.add('jump');

    setTimeout(() => {
        mario.classList.remove('jump');
    }, 1500); 

    if (dinoCaught) {
        mario.src = './images/dino2.gif';
    }
}

document.addEventListener('keydown', jump);

const gameOver = () => {
    gameOverTriggered = true; 

    const pipePosition = pipe.offsetLeft;
    const moedaPosition = moeda.offsetLeft;
    const dinoPosition = dino.offsetLeft;
    const monstroPosition = monstro.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');
    const grassPosition = grass.offsetLeft;
    const floorPosition1 = floor1.offsetLeft;
    const floorPosition2 = floor2.offsetLeft;
    const floorPosition3 = floor3.offsetLeft;

    pipe.style.animation = 'none';
    pipe.style.left = `${pipePosition}px`;

    monstro.style.animation = 'none';
    monstro.style.left = `${monstroPosition}px`;

    moeda.style.animation = 'none';
    moeda.style.left = `${moedaPosition}px`;

    mario.style.animation = 'none';
    mario.style.bottom = `${marioPosition}px`;

    mario.src = './images/game-over.png';
    mario.style.width = '75px';
    mario.style.marginLeft = '50px';

    grass.style.animation = 'none';
    grass.style.left = `${grassPosition}px`;

    floor1.style.animation = 'none';
    floor1.style.left = `${floorPosition1}px`;

    floor2.style.animation = 'none';
    floor2.style.left = `${floorPosition2}px`;

    floor3.style.animation = 'none';
    floor3.style.left = `${floorPosition3}px`;

    document.getElementById("text-start").style.color = "black";
    document.getElementById("text-start").innerHTML = "<strong>GAME OVER</strong>";

    audioStart.pause();
    audioGameOver.play();
    setTimeout(() => audioGameOver.pause(), 8000);

    clearInterval(checkGameOver);
    clearInterval(timerInterval); 
    timerInterval = null; 

    restartButton.style.display = 'block'; 
};

restartButton.addEventListener('click', () => {
    location.reload(); 
});

const checkGameOver = setInterval(() => {
    if (gameOverTriggered) return; 

    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
        gameOver();
    }
}, 10);
