let turn = 0;
let pos = ["GHI", "ABC"]
let dragEl;
let snapshot;
let badIdeas = [];
let points = [0,0];
document.onmouseup = drop
document.ontouchend = drop
draw();

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js', {
        scope: '/hexapawn/'
    }).then(function (reg) {

        if (reg.installing) {
            console.log('Service worker installing');
        } else if (reg.waiting) {
            console.log('Service worker installed');
        } else if (reg.active) {
            console.log('Service worker active');
        }

    }).catch(function (error) {
        // registration failed
        console.log('Registration failed with ' + error);
    });
}



function draw() {
    pos[0] = pos[0].split('').sort().join('');
    pos[1] = pos[1].split('').sort().join('');
    humanPawns = pos[0].split('');
    cumputerPawns = pos[1].split('');
    document.body.innerHTML = "";
    cumputerPawns.forEach(pawn => {
        document.body.insertAdjacentHTML("beforeend", `<div id="${pawn}" class="pawn computer"></div>`);
    })
    humanPawns.forEach(pawn => {
        document.body.insertAdjacentHTML("beforeend", `<div id="${pawn}" class="pawn human" onmousedown="drag(this)" ontouchstart="drag(this)"></div>`);
    })
    document.body.insertAdjacentHTML("beforeend", `<div id="points"><span>${points[0]}</span><span>${points[1]}</span></div>`);
    document.body.insertAdjacentHTML("beforeend", `
        <ul class="links">
        <li><a target="_blank" href="https://youtu.be/sw7UAZNgGg8">WTF?</a></li>
        <li><a target="_blank" href="https://en.wikipedia.org/wiki/Hexapawn">More About</a></li>
        <li><a target="_blank" href="https://github.com/behnamazizi/hexapawn">Github</a></li>
    </ul>
    `);

    turn++
    document.body.classList.remove('human', 'computer')
    document.body.classList.add(`${turn %2 == 0 && turn > 1 ?  'computer':  'human'}`)
    setTimeout(() => {
        isWon();
    }, 500);
}

function drag(el) {
    dragEl = el;
    document.body.onmousemove = sticker;
    document.body.ontouchmove = sticker;
    el.classList.add('drag')
    function sticker(e) {
        isAllow(el.id, e, undefined)[0] ?
            (document.querySelectorAll(`.allow.${isAllow(el.id, e ,undefined)[1]}`).length > 0 ? '' :
                (document.querySelectorAll('.allow').forEach(el => el.remove()), document.body.insertAdjacentHTML('beforeend', `<div class="allow ${isAllow(el.id, e)[1]}"></div>`))) :
            (document.querySelectorAll('.allow').length > 0 ?
                document.querySelectorAll('.allow').forEach(el => el.remove()) : '');

        movePos = e.type === "touchmove" ? [e.changedTouches[0].clientY, e.changedTouches[0].clientX] : [e.pageY, e.pageX];
        el.style.top = movePos[0] - ((window.innerHeight - document.body.offsetHeight) / 2) - (el.offsetWidth / 2)
        el.style.left = movePos[1] - ((window.innerWidth - document.body.offsetWidth) / 2) - (el.offsetWidth / 2)
    }
}

function drop(e) {
    if (dragEl != '') {
        dragEl.classList.remove('drag')
        document.body.onmousemove = '';
        document.body.ontouchmove = '';
        alw = isAllow(dragEl.id, e)
        if (alw[0]) {
            winnerpos = alw[1];
            pos[1] = pos[1].replace(alw[1], '');
            pos[0] = pos[0].replace(dragEl.id, alw[1]);
            draw();
            
        } else {
            document.querySelectorAll('.pawn').forEach(el => el.style = '')
        }
    }
    dragEl = '';
}

function isAllow(curentId, event, dropTarget) {

    if (dropTarget === undefined) {
        page = event.type.search("touch") >= 0 ? [event.changedTouches[0].pageY, event.changedTouches[0].pageX] : [event.pageY, event.pageX];
        bodythird = (document.body.offsetHeight / 3)
        dropPos = [
            page[0] - ((window.innerHeight - document.body.offsetHeight) / 2),
            page[1] - ((window.innerWidth - document.body.offsetWidth) / 2)
        ];
        dropPos = [
            dropPos[0] < bodythird ? 1 : (dropPos[0] > bodythird * 2) ? 3 : 2,
            dropPos[1] < bodythird ? 1 : (dropPos[1] > bodythird * 2) ? 3 : 2
        ];
        switch (dropPos.join('')) {
            case "11":
                dropTarget = "A";
                break;
            case "12":
                dropTarget = "B";
                break;
            case "13":
                dropTarget = "C";
                break;
            case "21":
                dropTarget = "D";
                break;
            case "22":
                dropTarget = "E";
                break;
            case "23":
                dropTarget = "F";
                break;
            case "31":
                dropTarget = "G";
                break;
            case "32":
                dropTarget = "H";
                break;
            case "33":
                dropTarget = "I";
                break;
        }
    }
    if (turn % 2 != 0) {
         allow1 = ["GD", "DA", "HE", "EB", "IF", "FC"]
         allow2 = ["GE", "HD", "HF", "IE", "DB", "EA", "EC", "FB"]
        return allow1.includes(curentId + dropTarget) ?
            (pos[0].includes(dropTarget) || pos[1].includes(dropTarget) ? [false, dropTarget] : [true, dropTarget]) :
            (allow2.includes(curentId + dropTarget) ? (pos[1].includes(dropTarget) ? [true, dropTarget] : [false, dropTarget]) : [false, dropTarget]);

    } else {
         allow1 = ["AD", "BE", "CF", "DG", "EH", "FI"]
         allow2 = ["AE", "BD", "BF", "CE", "DH", "EG", "EI", "FH"]
        return allow1.includes(curentId + dropTarget) ?
            (pos[1].includes(dropTarget) || pos[0].includes(dropTarget) ? [false, dropTarget] : [true, dropTarget]) :
            (allow2.includes(curentId + dropTarget) ? (pos[0].includes(dropTarget) ? [true, dropTarget] : [false, dropTarget]) : [false, dropTarget]);

    }

}

function computerMove() {
    setTimeout(() => {
        pMoves = posiblemoves('computer')
        let possibilities = {};
        pMoves.forEach(move => {
            p = 0;
            ["G","H","I"].forEach(w => move[1].includes(w) ? p += 2 : '');
            badIdeas.includes(pos.join('') + move) ? p -= 1 : '';
            Object.keys(possibilities).includes(p.toString()) ? possibilities[p].push(move) : (possibilities[p] = [], possibilities[p].push(move));
        })
        max = -100;
        Object.keys(possibilities).forEach(p => {
            max = Math.max(max, parseInt(p));
        })
        rnd = Math.floor(Math.random() * possibilities[max].length);
        choosen = possibilities[max][rnd]       
        snapshot = pos.join('') + choosen;
        pos[0] = pos[0].replace(choosen.split('')[1], '');
        pos[1] = pos[1].replace(choosen.split('')[0], choosen.split('')[1]);

        draw();
        



    }, 500);
}

function isWon() {
    humanPosibleMoves = posiblemoves('human');
    computerPosibleMoves = posiblemoves('computer');
    winner =
        turn % 2 === 0 && computerPosibleMoves.length == 0 ? 'human' :
        turn % 2 != 0 && humanPosibleMoves.length == 0 ? 'computer' :
        ["A", "B", "C"].some(i => pos[0].includes(i)) ? 'human' :
        ["G", "H", "I"].some(i => pos[1].includes(i)) ? 'computer' : '';
    if (winner.length > 0) {
        pos = ["GHI", "ABC"];
        turn = 0;
        
        winner === 'computer' ?
        (winnerpos = snapshot[snapshot.length - 1], snapshot = '', points[0]++):
        (badIdeas.push(snapshot), snapshot = '', points[1]++);
        
        alerter(winner.toUpperCase() + ' WON!')
        document.body.insertAdjacentHTML('afterBegin', `<div id="winnerspot" class="${winner} ${winnerpos}"></div>`)
        
    }else{
       if (turn % 2 === 0) computerMove()
    }



}

function posiblemoves(player) {
    player = player === 'human' ? pos[0] : pos[1];
    pms = [];
    pm = player.split('').map(m => {
        let d = [];
        ["A", "B", "C", "D", "E", "F", "G", "H", "I"].forEach(p => {
            if (isAllow(m, undefined, p)[0] === true) d.push((m + isAllow(m, undefined, p)[1]).toString())
        })
        return d
    })
    .filter(c => {
        return c.length > 0
    })
    pm.forEach(p => {
        p.forEach(i => {
            pms.push(i)
        })
    })
    return pms

}

function alerter(text) {
    document.body.insertAdjacentHTML('beforeend', `<div id="alert">${text}<button onclick="document.querySelector('#alert').remove(); draw();">OK</button></div>`)
}
