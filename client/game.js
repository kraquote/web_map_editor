let world;
let map;
let batiment;

let camera;
let ship;
let munitions;
let projectiles;
let game_over;
let enemies;
let score;
let items;
let timeezz2 = 0;
let shield = 0;
let timeezz = 1;
let time1 = 0;
let editor = false;
let debug = false;
let timep = 0;
let timep2 = 0;
let timeps = 0;
let timep2s = 0;
var distp = -100;
var direction = 'right';
var isee = false;
var iseeangle = 'down';
var pnjsee;
let seefinish = false;
let inte = false;
let startinit;
let func = false;
let buildw = false;
let firskin = 'zenitsu';
let pokemonx = 'larmoison';
let raretex = 'normal';
let z = 1;

async function init(map_name = null, reset_ship = true, reset_score = true, changex = null, changey = null) {
  startinit = true;
  if (reset_ship) {
    camera = { x: 1280 / 2, y: 720 / 2 };
    ship = { x: camera.x, y: camera.y, angle: 0, life: 1000, speed: 2, };
  }
  if (changex != null) {
    ship.x = changex;
  }
  if (changey != null) {
    ship.y = changey;
  }
  projectiles = [];
  iteration = 0;
  game_over = 0;
  if (reset_score)
    score = 0;

  if (world == null) {
    let response = await fetch('worlds/world3.json');
    let world = await response.json();

    loadWorld(world);
  }

  map = world.maps[map_name || world.start];
  if(map.enemies != [])
  enemies = map.enemies.map(enemy => Object.assign({}, enemy));

  for (let batiment of map.batiment)
    Decoration(batiment.look);

  for (let wall of map.walls) {
    if (wall.look != null) {
      AutoloadBloc(wall.look);
    }
  }

  backed(map.name)
  startinit = false;
}

function loadWorld(data) {

  if (data.format == null) {
    world = { format: 5 };
    world = Object.assign(world, data);
  } else {
    world = data;
  }

  if (world.format < 5) {
    for (let key in world.maps) {
      let map = world.maps[key];

      if (map.block != null) {
        map.walls.push(...map.block);
        delete map.block;
      }

      for (let wall of map.walls) {
        let [nx, ny] = normal(wall.y1 - wall.y2, wall.x2 - wall.x1);

        wall.length = distance(wall.x1, wall.y1, wall.x2, wall.y2);
        wall.angle = Math.atan2(wall.y2 - wall.y1, wall.x2 - wall.x1);
        wall.nx = nx;
        wall.ny = ny;
      }
    }
  }

  if (world.format < 5) {
    for (let key in world.maps) {
      let map = world.maps[key];
      map.enemies = [];
      map.batiment = [];
    }
  }

  world.format = 5;

}

function update() {
  // Modes

  if (pressed_keys.editor == 1) {
    editor = !editor;

  }
  if (pressed_keys.debug == 1)
    debug = !debug;

  // Game or editor
  if (!editor) {
    updateGame();
  } else {
    updateEditor();
  }
}

function moveCamera(x, y, t1, t2) {
  t1 /= 2;
  t2 /= 2;

  if (camera.x < x - canvas.width * t1) {
    camera.x = fixSmooth(camera.x, x, t1, t2, canvas.width);
  } else if (camera.x > x + canvas.width * t1) {
    camera.x = fixSmooth(camera.x, x, t1, t2, canvas.width);
  }
  if (camera.y < y - canvas.height * t1) {
    camera.y = fixSmooth(camera.y, y, t1, t2, canvas.height);
  } else if (camera.y > y + canvas.height * t1) {
    camera.y = fixSmooth(camera.y, y, t1, t2, canvas.height);
  }

  if (map.width == undefined)
    return;
  camera.x = clamp(camera.x, canvas.width / 2, map.width * z - canvas.width / 2);
  camera.y = clamp(camera.y, canvas.height / 2, map.height * z - canvas.height / 2);
}

function fixSmooth(from, to, t1, t2, width) {
  let delta = t2 - t1;

  let a = Math.abs(from - to) / (delta * width);
  let b = t1 / delta;
  let f = Math.sqrt(a - b) / 80;

  let value = (1 - f) * from + f * to;
  return value;
}

function updateGame() {

  moveCamera(ship.x * z, ship.y * z, 0.2, 0.4);

  if (!game_over) {
    // Move ship
    if (isee == false) {
      if (pressed_keys.up != 0) {
        ship.y -= 1 * ship.speed / z;
        ship.angle = -Math.PI / 2;
        var direction = 'up';

      } else if (pressed_keys.down != 0) {
        ship.y += 1 * ship.speed / z;
        ship.angle = Math.PI / 2;
        var direction = 'down';

      } else if (pressed_keys.left) {
        ship.x -= 1 * ship.speed / z;
        ship.angle = -Math.PI;
        var direction = 'left';

      } else if (pressed_keys.right) {
        ship.x += 1 * ship.speed / z;
        ship.angle = -Math.PI * 2;
        var direction = 'right';

      }

    } else {
      if (iseeangle == 'down') {
        var direction = 'up';
      } else if (iseeangle == 'up') {
        var direction = 'down';
      } else if (iseeangle == 'right') {
        var direction = 'left';
      } else if (iseeangle == 'left') {
        var direction = 'right';
      }
    }


  }

}







function draw(delay, update_time) {
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'white';
  ctx.font = '20px Roboto';
  Background(map.background);
  if (editor) {
    drawEditor();
  } else {

    drawGame();
  }

  if (debug) {
    ctx.save();

    let text = `FPS : ${(1000 / delay).toFixed(0)} (${delay.toFixed(2)} ms / ${update_time.toFixed(2)} ms)`;
    ctx.textAlign = 'right';
    ctx.fillText(text, canvas.width - 8, 24);

    ctx.restore();
  }

}

function drawGame() {
  ctx.save();
  if (!editor) {
    ctx.translate(canvas.width / 2 - camera.x, canvas.height / 2 - camera.y);

    // Draw walls
    for (let wall of map.walls)

      drawWall(wall, debug);

    // Draw ship

    if (pressed_keys.up != 0) {

      direction = 'up';
      let [anim1, anim2, anim3] = loadAnimation(firskin, 'human', direction);
      drawPerso(anim1, anim2, anim3, 'up');

    } else if (pressed_keys.down != 0) {

      direction = 'down';
      let [anim1, anim2, anim3] = loadAnimation(firskin, 'human', direction);
      drawPerso(anim1, anim2, anim3, 'down');

    } else if (pressed_keys.left != 0) {

      direction = 'left';
      let [anim1, anim2, anim3] = loadAnimation(firskin, 'human', direction);
      drawPerso(anim1, anim2, anim3, 'left');
    } else if (pressed_keys.right != 0) {
      let [anim1, anim2, anim3] = loadAnimation(firskin, 'human', direction);
      drawPerso(anim1, anim2, anim3, 'right');
      direction = 'right';


    } else {
      let [anim1, anim2, anim3] = loadAnimation(firskin, 'human', direction);
      ctx.save();
      ctx.scale(z, z);
      ctx.translate(ship.x, ship.y);

      ctx.drawImage(anim1, -anim1.width, -anim1.height, anim1.width * 2, anim1.height * 2);

      ctx.restore();
    }

    // Draw batiment
    for (let batiment of map.batiment)
      drawBatiment(batiment);


  }
  ctx.restore();


}

function drawWall(wall, model) {
  if (buildw == true)
    return;
  if (!editor) {
    if (wall.look == null)
      return;
  }
  buildw = true;
  let img;

  if (wall.look == null) {
    img = AutoloadBloc('undefined.png');
  } else {
    img = AutoloadBloc(wall.look);
  }
  let length = wall.length;

  if (length == 0)
    length = 32;
  let step = wall.width;


  for (let i = 0; i <= length; i += step) {


    let x = wall.x1 + i / length * (wall.x2 - wall.x1);
    let y = wall.y1 + i / length * (wall.y2 - wall.y1);
    ctx.save();

    ctx.scale(z, z);
    ctx.translate(x, y);
    ctx.drawImage(img, -img.width, -img.height, 32, 32);
    ctx.restore();
  }
  buildw = false;

}

function drawBatiment(batiment) {
 
  if (batiment.x <= ship.x + 1000 && batiment.x >= ship.x - 1000 && batiment.y <= ship.y + 1000 && batiment.y >= ship.y - 1000) {
    if (batiment.backg == null || batiment.backg == true || batiment.backg == undefined) {
      if(batiment.look == undefined){
      return;
      }
      let imgz = loadImage('decos/' + batiment.look);


      let x = batiment.x;
      let y = batiment.y;

      ctx.save();
      ctx.scale(z, z);

      ctx.translate(x, y);
      if(batiment.r != undefined)
      ctx.rotate(batiment.r* Math.PI / 180)
      ctx.drawImage(imgz, -imgz.width, -imgz.height, imgz.width * 1.5, imgz.height * 1.5);

      ctx.restore();
    }
  }
}

function drawBatimentfront(batiment) {
  if (batiment.x <= ship.x + 1000 && batiment.x >= ship.x - 1000 && batiment.y <= ship.y + 1000 && batiment.y >= ship.y - 1000) {
    if (batiment.backg == false) {
      let imgz = loadImage('decos/' + batiment.look);


      let x = batiment.x;
      let y = batiment.y;

      ctx.save();
      ctx.scale(z, z);

      ctx.translate(x, y);
      if(batiment.r != undefined)
      ctx.rotate(batiment.r* Math.PI / 180)
      ctx.drawImage(imgz, -imgz.width, -imgz.height, imgz.width * 1.5, imgz.height * 1.5);

      ctx.restore();
    }
  }
}


function mouse2map(x, y) {
  x -= canvas.width / 2 - camera.x;
  y -= canvas.height / 2 - camera.y;

  return [x, y];
}

function Background(back) {

  //Draw Background
  let img = AutoloadBloc(back);
  let width = map.width * z / 32 + 1;
  let height = map.height * z / 32 + 1;
  for (let js = 0; js <= width; js += 1) {
    var l = js;
    for (let i = 0; i <= height; i += 1) {
      let x = 0 + l * 32;
      let y = 0 + i * 32;
      ctx.save();
      ctx.scale(z, z);
      ctx.translate(canvas.width / 2 - camera.x, canvas.height / 2 - camera.y);

      ctx.translate(x, y);
      ctx.drawImage(img, -img.width, -img.height, 33, 33);
      //ctx.strokeRect(-img.width, -img.height, 32, 32);
      ctx.restore();
    }
  }

}

function drawPerso(anim1, anim2, anim3, direction) {
 
  ctx.save();
  ctx.scale(z, z);
  ctx.translate(ship.x, ship.y);

  if (pressed_keys.up < 35 && pressed_keys.up != 0) {
    ctx.drawImage(anim2, -anim2.width, -anim2.height, anim2.width * 2, anim2.height * 2);
    timep = 0;
    timep2 = 0;
  } else if (pressed_keys.down < 35 && pressed_keys.down != 0) {
    ctx.drawImage(anim2, -anim2.width, -anim2.height, anim2.width * 2, anim2.height * 2);
    timep = 0;
    timep2 = 0;
  } else if (pressed_keys.left < 35 && pressed_keys.left != 0) {
    ctx.drawImage(anim2, -anim2.width, -anim2.height, anim2.width * 2, anim2.height * 2);
    timep = 0;
    timep2 = 0;
  } else if (pressed_keys.right < 35 && pressed_keys.right != 0) {
    ctx.drawImage(anim2, -anim2.width, -anim2.height, anim2.width * 2, anim2.height * 2);
    timep = 0;
    timep2 = 0;
  } else if (pressed_keys.up >= 35) {

    if (timep < 2) {
      ctx.drawImage(anim2, -anim2.width, -anim2.height, anim2.width * 2, anim2.height * 2);
      timep++;
    } else if (timep < 4) {
      ctx.drawImage(anim3, -anim3.width, -anim3.height, anim3.width * 2, anim3.height * 2);
      timep++;
      if (timep == 3) {
        timep2 = 0;
        timep = 0;
      }
    }

  } else if (pressed_keys.down >= 35) {

    if (timep < 2) {
      ctx.drawImage(anim2, -anim2.width, -anim2.height, anim2.width * 2, anim2.height * 2);
      timep++;
    } else {
      ctx.drawImage(anim3, -anim3.width, -anim3.height, anim3.width * 2, anim3.height * 2);
      if (timep2 < 4) {
        timep2 = 0;
        timep = 0;
      }
    }

  } else if (pressed_keys.left >= 35) {

    if (timep < 2) {
      ctx.drawImage(anim2, -anim2.width, -anim2.height, anim2.width * 2, anim2.height * 2);
      timep++;
    } else {
      ctx.drawImage(anim1, -anim1.width, -anim1.height, anim1.width * 2, anim1.height * 2);
      if (timep2 < 2) {
        timep2 = 0;
        timep = 0;
      }

    }

  } else if (pressed_keys.right >= 35) {

    if (timep < 2) {
      ctx.drawImage(anim2, -anim2.width, -anim2.height, anim2.width * 2, anim2.height * 2);
      timep++;
    } else {
      ctx.drawImage(anim1, -anim1.width, -anim1.height, anim1.width * 2, anim1.height * 2);
      if (timep2 < 2) {
        timep2 = 0;
        timep = 0;
      }

    }

  }
  ctx.restore();




}


