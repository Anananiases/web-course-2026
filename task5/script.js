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