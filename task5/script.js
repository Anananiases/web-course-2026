'use strict';

const boardEl   = document.getElementById('board');
const levelEl   = document.getElementById('level');
const statusEl  = document.getElementById('status');
const startBtn  = document.getElementById('startBtn');
const sectorEls = Array.from(document.querySelectorAll('.sector'));


const game = {
    sequence: [],        
    playerIndex: 0,      
    level: 0,            
    phase: 'idle',       
    timers: []           
};




function schedule(fn, delay) {
    const id = setTimeout(() => {
        
        game.timers = game.timers.filter(t => t !== id);
        fn();
    }, delay);
    game.timers.push(id);
    return id;
}


function clearAllTimers() {
    game.timers.forEach(clearTimeout);
    game.timers = [];
}

function randomIndex() {
    return Math.floor(Math.random() * 4);
}

function addStep() {
    game.sequence.push(randomIndex());
    game.level = game.sequence.length;
    game.playerIndex = 0;
    updateLevel();
}

function updateLevel() {
    levelEl.textContent = game.level;
}

async function flashSector(index, ms = 450) {
    const el = sectorEls[index];
    el.classList.add('active');
    await delay(ms);
    el.classList.remove('active');
}

async function playSequence() {
    game.phase = 'showing';
    setStatus('Смотрите внимательно...');

    await delay(500);

    for (const index of game.sequence) {
        await flashSector(index, 450);
        await delay(200); 
        }
 game.phase = 'input';
    game.playerIndex = 0;
    setStatus(`Ваш ход. Повторите ${game.sequence.length} шаг(а).`);
}

function setStatus(text) {
    statusEl.textContent = text;
}

function handleSectorClick(event) {
    
    if (game.phase !== 'input') return;

    const index = Number(event.currentTarget.dataset.index);

    
    flashSector(index, 250);

    const expected = game.sequence[game.playerIndex];

    if (index !== expected) {
        
        gameOver();
        return;
    }

    game.playerIndex++;

    if (game.playerIndex === game.sequence.length) {
        
        nextRound();
    }
}

function nextRound() {
    game.phase = 'wait';         
    setStatus('Верно! Готовим следующий раунд...');
    
    schedule(async () => {
        addStep();
        await playSequence();
    }, 800);
}



function gameOver() {
    clearAllTimers();               
    game.phase = 'gameover';
    setStatus(`Вы дошли до уровня ${game.level}. Нажмите «Старт», чтобы сыграть снова.`);
    setBoardEnabled(false);
}

function startGame() {
    clearAllTimers();               
    resetState();
    setBoardEnabled(true);
    addStep();                      
    schedule(() => playSequence(), 300);
}

function resetState() {
    game.sequence = [];
    game.playerIndex = 0;
    game.level = 0;
    game.phase = 'idle';
    updateLevel();
}

function setBoardEnabled(enabled) {
    sectorEls.forEach(el => {
        el.disabled = !enabled;
        el.style.cursor = enabled ? 'pointer' : 'not-allowed';
    });
}


sectorEls.forEach(el => el.addEventListener('click', handleSectorClick));
startBtn.addEventListener('click', startGame);