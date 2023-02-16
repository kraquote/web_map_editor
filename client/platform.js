window.addEventListener('load', async () => {

    await init("map01", true, true);
    window.requestAnimationFrame(loop);
});

  function pause() {

log ++;
logs ++;
console.log(log);
console.log(logs);
}

function play() {

console.log('plus pause');
log = 0;
logs = 0;
}

let log = 0;


window.addEventListener('blur', pause);
window.addEventListener('focus', play);


let canvas = document.getElementById('game');
let ctx = canvas.getContext('2d');

let pending_images = 0;
let prev_timestamp = 0;
let iteration = 0;

let pressed_keys = {
    up: 0,
    down: 0,
    left: 0,
    right: 0,
    debug: 0,
    editor: 0
};
let mouse_state = {
    x: 0,
    y: 0,
    left: 0,
    middle: 0,
    right: 0
};

let buttons = [];

function loop(timestamp) {
    if (pending_images) {
        window.requestAnimationFrame(loop);
        return;
    }

    // Sync canvas dimensions
    {
        let rect = canvas.getBoundingClientRect();

        canvas.width = rect.width;
        canvas.height = rect.height;
    }

    let delay = timestamp - prev_timestamp;
    prev_timestamp = timestamp;

    let updates = Math.round(delay / (1000 / 120));
    let update_time = perf(() => {
        for (let i = 0; i < updates; i++) {
            // React to UI buttons
            if (mouse_state.left == -1) {
                for (let btn of buttons) {
                    let over = mouse_state.x >= btn.x &&
                               mouse_state.x <= btn.x + btn.width &&
                               mouse_state.y >= btn.y &&
                               mouse_state.y <= btn.y + btn.height;

                    if (over) {
                        mouse_state.left = 0;
                        btn.func();

                        break;
                    }
                }
            }

            buttons = [];
            iteration++;
            if(logs != 1){
            if(on_battle == false){
                if(startinit == false)
            update();
          }else {
            updatess();
          }
        }


            // Repeated buttons
            for (let key in pressed_keys) {
                if (pressed_keys[key])
                    pressed_keys[key]++;
            }
            if (mouse_state.left)
                mouse_state.left++;
            if (mouse_state.middle)
                mouse_state.middle++;
            if (mouse_state.right)
                mouse_state.right++;
        }
    });

if(on_battle == false){
  if(startinit == false)
    draw(delay, update_time);
  } else {
    draws(delay, update_time);
  }

    drawButtons();


    window.requestAnimationFrame(loop);
}



document.addEventListener('keydown', handleKeyEvent);
document.addEventListener('keyup', handleKeyEvent);

function handleKeyEvent(e) {
    if (e.repeat)
        return;

    if (e.key == 'z' || e.keyCode == 38) {
        pressed_keys.up = 0 + (e.type === 'keydown');
    } else if (e.key == 's' || e.keyCode == 40) {
        pressed_keys.down = 0 + (e.type === 'keydown');
    } else if (e.key == 'q' || e.keyCode == 37) {
        pressed_keys.left = 0 + (e.type === 'keydown');
    } else if (e.key == 'd' || e.keyCode == 39) {
        pressed_keys.right = 0 + (e.type === 'keydown');
    } else if (e.keyCode == 9) { // Tab
        pressed_keys.debug = 0 + (e.type === 'keydown');
        e.preventDefault();
    } else if (e.key == ' ') {
        pressed_keys.editor = 0 + (e.type === 'keydown');
    }
}

document.addEventListener('mousemove', handleMouseEvent);
document.addEventListener('mousedown', handleMouseEvent);
document.addEventListener('mouseup', handleMouseEvent);

function handleMouseEvent(e) {
    let rect = canvas.getBoundingClientRect();

    mouse_state.x = e.clientX - rect.left;
    mouse_state.y = e.clientY - rect.top;

    if ((e.buttons & 0b001) && !mouse_state.left) {
        mouse_state.left = 1;
    } else if (!(e.buttons & 0b001) && mouse_state.left)  {
        mouse_state.left = -1;
    }
    if ((e.buttons & 0b100) && !mouse_state.middle) {
        mouse_state.middle = 1;
    } else if (!(e.buttons & 0b100) && mouse_state.middle)  {
        mouse_state.middle = -1;
    }
    if ((e.buttons & 0b010) && !mouse_state.right) {
        mouse_state.right = 1;
    } else if (!(e.buttons & 0b010) && mouse_state.right)  {
        mouse_state.right = -1;
    }
}


// UI

function button(x, y, text, options, func) {
    let btn = { x: 0, y: 0, width: 0, height: 0, text: text, toggled: !!options.toggled, func: func };

    ctx.font = '20px Roboto';
    btn.width = ctx.measureText(text).width + 40;
    btn.height = 38;
    if (options.align == 'center') {
        btn.x = x - btn.width / 2;
    } else if (options.align == 'right') {
        btn.x = x - btn.width;
    } else {
        btn.x = x;
    }
    btn.y = y;

    buttons.push(btn);
}

function drawButtons() {
    ctx.save();

    for (let btn of buttons) {
        let over = mouse_state.x >= btn.x &&
                   mouse_state.x <= btn.x + btn.width &&
                   mouse_state.y >= btn.y &&
                   mouse_state.y <= btn.y + btn.height;

        let gradient = ctx.createLinearGradient(0, btn.y, 0, btn.y + btn.height);

        if (btn.toggled) {
            gradient.addColorStop(0, '#146241');
            gradient.addColorStop(0.5, '#2cb67c');
            gradient.addColorStop(1, '#146241');
        } else if (over) {
            gradient.addColorStop(0, '#12325f');
            gradient.addColorStop(0.5, '#4079c8');
            gradient.addColorStop(1, '#12325f');
        } else {
            gradient.addColorStop(0, '#24579d');
            gradient.addColorStop(0.5, '#5093ef');
            gradient.addColorStop(1, '#24579d');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(btn.x + btn.width / 2, btn.y);
        ctx.arcTo(btn.x + btn.width, btn.y, btn.x + btn.width, btn.y + btn.height / 2, 14);
        ctx.arcTo(btn.x + btn.width, btn.y + btn.height, btn.x + btn.width / 2, btn.y + btn.height, 14);
        ctx.arcTo(btn.x, btn.y + btn.height, btn.x, btn.y + btn.height / 2, 14);
        ctx.arcTo(btn.x, btn.y, btn.x + btn.width / 2, btn.y, 14);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.fillText(btn.text, btn.x + 20, btn.y + 26);
    }

    ctx.restore();
}

// Utility

function clamp(value, min, max) {
    if (value > max) {
        return max;
    } else if (value < min) {
        return min;
    } else {
        return value;
    }
}

function distance(x1, y1, x2, y2) {
    let dx = x1 - x2;
    let dy = y1 - y2;

    return Math.sqrt(dx * dx + dy * dy);
}

function normal(x, y) {
    let length = Math.sqrt(x * x + y * y);

    x /= length;
    y /= length;

    return [x, y];
}

function loadImage(src) {
    let img = new Image();

    img.src = src;
    img.onload = () => {
        pending_images--;
    }
    pending_images++;

    return img;
}

function perf(func) {
    let start = performance.now();
    func();
    let end = performance.now();

    return end - start;
}

function saveFile(blob, filename) {
    let url = URL.createObjectURL(blob);

    let a = document.createElement('a');
    a.download = filename;
    a.href = url;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    if (URL.revokeObjectURL)
        setTimeout(() => URL.revokeObjectURL(url), 60000);
};

async function loadFile() {
    return new Promise((resolve, reject) => {
        let input = document.createElement('input');

        input.type = 'file';
        input.onchange = async (e) => {
            let file = e.target.files[0];

            if (file != null) {
                resolve(file);
            } else {
                reject();
            }
        };

        input.click();
    });
}
