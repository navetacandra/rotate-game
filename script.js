// Element declare
let title_menu = document.querySelector('#title-menu')
let gameover_msg = document.querySelector('.gameover_msg')
let dirc_cmd = document.querySelector('#direction-command');
let time = document.querySelector('#times > h2');
let score = document.querySelector('#scores');
let play_btn = document.querySelector('#play-btn');
let circle_element = document.querySelector('.circle');
let menu_layout = document.querySelector('.menu');
let starting_hs = document.querySelector('.highscore .starting');
let gameover_hs = document.querySelector('.highscore .gameover');

// Set top score localStorage
if (!localStorage.getItem('top_score')) {
    localStorage.setItem('top_score', 0)
}

starting_hs.innerHTML = `
    <h2>Your Highest Score ${localStorage.getItem('top_score')}</h2>
`;

// Set title menu
title_menu.innerHTML = '<h2>ROTATE GAME</h2>';

// Reusable variable
let deg = 0;
let curr_pos = 'atas';
let pos = ['atas', 'kanan', 'bawah', 'kiri'];
let pos_f = pos.filter(p => p !== curr_pos);
let n_pos = pos.filter(p => p !== curr_pos);

// Tutorial element
const tutorial_el = `
<div class="tutorial">
    <h4>Baca penunjuk arah dan carilah jalan tercepat sampai arah tujuan sebelum 4 detik!</h4>
    <h5 style="margin-top: -1rem; font-weight: thin;">Klik bagian kanan atau kiri untuk memutar lingkaran.</h5>
</div>
`;

gameover_msg.innerHTML = tutorial_el;

// Gameover indicator
let gameover = false;
let gameover_reason = {
    timeout: false,
    wrong_way: false
};

// On play_btn clicked
play_btn.addEventListener('click', function () {
    // Get Next Position
    n_pos = pos_f[Math.floor(Math.random() * pos_f.length)]

    // Reset value
    gameover = false;
    gameover_reason.timeout = false;
    gameover_reason.wrong_way = false;
    score.innerHTML = '0';
    time.innerHTML = '2';
    deg = 0
    circle_element.style.transform = `rotate(${0}deg)`

    // Countdown timer
    let time_interval = setInterval(() => {
        if (parseInt(time.innerHTML) === 0) {
            gameover = true;
            gameover_reason.timeout = true;
        } else {
            time.innerHTML = parseInt(time.innerHTML) - 1
        }
    }, 1000);

    // Checking gameover
    let checker_gameover = setInterval(() => {
        if (gameover) {
            // Reset top score localStorage
            if (localStorage.getItem('top_score') < parseInt(score.innerHTML)) {
                localStorage.setItem('top_score', parseInt(score.innerHTML))
            }

            starting_hs.style.display = 'none';

            // Change title menu
            title_menu.innerHTML = '<h2>GAME OVER</h2>';

            if (gameover_reason.timeout) {
                gameover_msg.innerHTML = '<h2>TIMEOUT!</h2>' + tutorial_el;
            }

            if (gameover_reason.wrong_way) {
                gameover_msg.innerHTML = '<h2>WRONG WAY!</h2>' + tutorial_el;
            }

            gameover_hs.innerHTML = `
                <h2>Your Highest Score ${localStorage.getItem('top_score')}</h2>
                <h2>Your Score ${score.innerHTML}</h2>
            `;

            // Reset value
            time.innerHTML = '0';
            dirc_cmd.style.display = 'none';
            menu_layout.style.display = 'block';

            // clear all interval
            clearInterval(time_interval);
            clearInterval(checker_gameover);
        }
    }, 100)

    // Hidden backdrop and show direction
    menu_layout.style.display = 'none'
    dirc_cmd.style.display = 'block';
    dirc_cmd.innerHTML = n_pos.toUpperCase();
})



function rotate(v, setter) {
    // Change degrees
    deg = !isNaN(setter) ? setter : deg + v
    circle_element.style.transform = `rotate(${deg}deg)`

    // Get angle
    let angle = deg;
    let position = pos[Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 90) % 4];

    // Detect wrong way
    let p = pos.indexOf(position);
    let n_p = pos.indexOf(n_pos);
    gameover = n_p - p === -2 || n_p - p === 2;
    if (gameover) {
        gameover_reason.wrong_way = true;
    }

    if (position === n_pos) {
        // Reset Time
        time.innerHTML = '2';

        // Add SCore
        score.innerHTML = `${parseInt(score.innerHTML) + 1}`;

        // Change Next Pos
        let temp_pos = pos.filter(p => p !== position);
        n_pos = temp_pos[Math.floor(Math.random() * temp_pos.length)];
        dirc_cmd.innerHTML = n_pos.toUpperCase();
    }
}

if (!gameover) {
    document.querySelector('#btn-kanan').addEventListener('click', () => {
        rotate(90)
    })

    document.querySelector('#btn-kiri').addEventListener('click', () => {
        rotate(-90)
    })

    window.onkeyup = function (event) {
        if (event.which === 39) {
            rotate(90)
        }
        if (event.which === 37) {
            rotate(-90)
        }
    }
}