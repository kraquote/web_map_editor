let tool;
let edit_wall = {};
//0E0E0E

let edit_batiment = {};
let delete_obj;
let moove_obj;
let follow_mouse = false;
let clicked = 0;


function find_bat(x, y) {
    
    [x, y] = mouse2map(x, y);

    if(x <= camera.x + (canvas.width/2)){
    for (let i = map.batiment.length - 1; i >= 0; i--) {
        let wall = map.batiment[i];
        if(wall.look != undefined)
        img = loadImage('decos/'+ wall.look);

        if( x <= img.width + wall.x && x >= wall.x - img.width && y <= img.height + wall.y && y >= wall.y - img.height)
        return wall;
    }
}

}

function find_block(x, y) {
    [x, y] = mouse2map(x, y);

    if(x <= camera.x + (canvas.width/2)){
    for (let i = map.walls.length - 1; i >= 0; i--) {

        let wall = map.walls[i];
        if(wall.look != undefined){
            img = loadImage('assets/blocs/'+ wall.look);
        }else {
            img = {};
            img.height = 32;
            img.width = 32;
        }

        if( x <= img.width + wall.x1 && x >= wall.x1 - img.width && y <= img.height + wall.y1 && y >= wall.y1 - img.height ||
            x <= img.width + wall.x1 && x >= wall.x1 - img.width && y <= img.height + wall.y2 && y >= wall.y2 - img.height ||
            x <= img.width + wall.x2 && x >= wall.x2 - img.width && y <= img.height + wall.y2 && y >= wall.y2 - img.height ||
            x <= img.width + wall.x2 && x >= wall.x2 - img.width && y <= img.height + wall.y1 && y >= wall.y1 - img.height){

        return wall;
            }
    }
}
}

function finde(x, y) {
  
    [x, y] = mouse2map(x, y);
    if(free == false){

    for (let i = 0; i <= map.back.length -1; i++) {
        
        let wall = map.back[i];
      
        let length = Math.max(wall.length, 0.01);

        let extrem1 = distance(x, y, wall.x1, wall.y1);
        let extrem2 = distance(x, y, wall.x2, wall.y2);
  
        if (extrem1 <= length + wall.width && extrem2 <= length + wall.width) {
           

            let colx;
            let coly;
            {
                let dot = (((x - wall.x1) * (wall.x2 - wall.x1)) +
                           ((y - wall.y1) * (wall.y2 - wall.y1)) ) / (length * length);

                colx = wall.x1 + (dot * (wall.x2 - wall.x1));
                coly = wall.y1 + (dot * (wall.y2 - wall.y1));
            }

            if (distance(x, y, colx, coly) <= wall.width / 1.25){

                return wall;
              }
        }
    }
}else{
    return {"x1":x,"y1":y};
}
    return null;
}

function selection(w){
    for (let index = 0; index < document.getElementsByClassName("sel").length; index++) {
        document.getElementsByClassName("sel")[index].classList.remove('sele')
        
    }
    w.classList.add('sele');

    
}

let free = false
function free_djeska(){
    if(free == false){
        free = true
        let doc = document.getElementsByClassName("selectable")[0]
        doc.classList.add("selec")
    }else if(free == true){
        free = false
        let doc = document.getElementsByClassName("selectable")[0]
        doc.classList.remove("selec")
}
}

async function place_block(w) {

    selection(w)
        tool = 'wall';
        let file = await loadFile();
        let file_selected = file.name;
        edit_wall = { look: file_selected, width: 32, collide: false };

}

async function place_bat(w) {
    selection(w)
    tool = 'batiment';
    let file = await loadFile();
    let file_selected = file.name;
        Decoration(file_selected);

        edit_batiment = { look: file_selected };
}

function supp_block(w){
    selection(w)
    tool = 'delete_block';
    delete_obj = null;
}

function suppr_bat(w){

    selection(w)
    tool = 'delete_bat';
    delete_obj = null;
}
function moove_bat(w){

    selection(w)
    tool = 'moove';
    moove_obj = null;
}

function save_world(){
    map.back = []
    map.ennemies = []
    let json = JSON.stringify(world, null, 4);
    let blob = new Blob([json]);

    saveFile(blob, 'world.json');
    backed(map.name)
}

function load_creation_map(){
 document.getElementById("tools").classList.add('blur')
 document.getElementById("decos_settings").classList.add('blur')
 document.getElementById("game").classList.add('blur')
 document.getElementById("map_settings").classList.remove('disable')


}

function unload_map_creation(){
    document.getElementById("tools").classList.remove('blur')
    document.getElementById("decos_settings").classList.remove('blur')
    document.getElementById("game").classList.remove('blur')
    document.getElementById("map_settings").classList.add('disable')

    document.getElementById("idHT").value = " "
    document.getElementById("idHT1").value = " "
    document.getElementById("idHT2").value = " "
    document.getElementById("idHT3").value = " "
}

function label_to_map_creation() {
    create_maps(document.getElementById("idHT").value,parseFloat(document.getElementById("idHT1").value),parseFloat(document.getElementById("idHT2").value),document.getElementById("idHT3").value)
    unload_map_creation()
  
}
let selected_obj;

function selec_block(w) {
    selection(w)

    tool = 'selecte_wall';
    selected_obj = null;
    
}

function selec_bat(w) {
    selection(w)
    tool = 'selecte_bat';
    selected_obj = null;

}

function del() {
    ttype = document.getElementById("type")
    if(ttype.innerHTML == "<div>bloc</div>"){

        map.walls = map.walls.filter(item => item !== selected_obj)
        update_info("Deleted")
    }else if(ttype.innerHTML == "<div>batiment</div>"){

        map.batiment = map.batiment.filter(item => item !== selected_obj)
        update_info("Deleted")
    }
}

function apply(w){

    ttype = document.getElementById("type")
    if(ttype.innerHTML == "<div>bloc</div>"){
        let l
        for (let index = 0; index < map.walls.length; index++) {
            if(map.walls[index] == selected_obj){
            l = index
            break
        }
        }
        let tcoord = document.getElementById("coord").childNodes
        tlok = document.getElementById("lok").childNodes
        let nbr = 0

        for (let index = 0; index < tcoord.length; index++) {
            if(tcoord[index].localName == "div"){
                
                if(nbr == 0)    
                selected_obj.x1 = parseFloat(tcoord[index].childNodes[1].innerHTML)

                if(nbr == 1)
                selected_obj.x2 = parseFloat(tcoord[index].childNodes[1].innerHTML)

                if(nbr == 2)
                selected_obj.y1 = parseFloat(tcoord[index].childNodes[1].innerHTML)

                if(nbr == 3)
                selected_obj.y2 = parseFloat(tcoord[index].childNodes[1].innerHTML)
                nbr ++
            }
            
        }

        if(selected_obj.x1 > selected_obj.x2){
            selected_obj.ny = -1
            selected_obj.nx = 0
        }else if(selected_obj.x2 > selected_obj.x1){
            selected_obj.ny = 1
            selected_obj.nx = 0
        }else if(selected_obj.y1 > selected_obj.y2){
            selected_obj.nx = 1
            selected_obj.ny = 0
        }else if(selected_obj.y2 > selected_obj.y1){
            selected_obj.nx = -1
            selected_obj.ny = 0
        }

        if(selected_obj.ny != 0){
            selected_obj.length = Math.abs(selected_obj.x1 - selected_obj.x2)
        }

        if(selected_obj.nx != 0){
            selected_obj.length = Math.abs(selected_obj.y1 - selected_obj.y2)
        }
        selected_obj.look =  tlok[0].childNodes[1].innerHTML + ".png"
        map.walls[l] = selected_obj

        update_info("bloc")

    }else if(ttype.innerHTML == "<div>batiment</div>"){
        let l
        for (let index = 0; index < map.batiment.length; index++) {
            if(map.batiment[index] == selected_obj){
            l = index
            break
        }
        }

        let tcoord = document.getElementById("coord").childNodes
        tlok = document.getElementById("lok").childNodes
        trot = document.getElementById("rotation").childNodes
        let nbr = 0

        for (let index = 0; index < tcoord.length; index++) {
            if(tcoord[index].localName == "div"){
                
                if(nbr == 0)    
                selected_obj.x = parseFloat(tcoord[index].childNodes[1].innerHTML)

                if(nbr == 1)
                selected_obj.y = parseFloat(tcoord[index].childNodes[1].innerHTML)
                nbr ++
            }
            
        }

        selected_obj.look =  tlok[0].childNodes[1].innerHTML + ".png"
        selected_obj.r =  trot[0].childNodes[1].innerHTML
        map.batiment[l] = selected_obj

        update_info("batiment")
    }

}
function update_info(t) {

    ttype = document.getElementById("type")

    tcoord = document.getElementById("coord")
    

    tlent = document.getElementById("lenght")
    tlok = document.getElementById("lok")
    trot = document.getElementById("rotation")

    ttype.innerHTML = "<div>" + t + "</div>"
    if(t == "bloc"){
        tcoord.innerHTML = "<div>x1 : <strong contenteditable='true'>" + selected_obj.x1 + " </strong></div>"
        tcoord.innerHTML += "<div> x2 : <strong contenteditable='true'>" + selected_obj.x2 + " </strong></div> " 
        tcoord.innerHTML += "<div> y1 : <strong contenteditable='true'>" + selected_obj.y1 + " </strong></div>"
        tcoord.innerHTML += "<div> y2 : <strong contenteditable='true'>" + selected_obj.y2 + "</strong></div>"

    tlent.innerHTML = "<div>" + selected_obj.length + "</div>"
    nl = selected_obj.look
    if(nl != undefined)
    nl = selected_obj.look.replace('.png', '')
    tlok.innerHTML = "<div> <strong contenteditable='true'>" + nl + "</strong>.png</div>"
    trot.innerHTML = " "
    }else if(t == "batiment"){
        tcoord.innerHTML = "<div>x : <strong contenteditable='true'>" + selected_obj.x + " </strong></div>"
    
        tcoord.innerHTML += "<div> y : <strong contenteditable='true'>" + selected_obj.y + " </strong></div>"
 

    tlent.innerHTML = "<div>" + selected_obj.length + "</div>"
    nl = selected_obj.look
    if(nl != undefined)
    nl = selected_obj.look .replace('.png', '')
    tlok.innerHTML = "<div> <strong contenteditable='true'>" + nl + "</strong>.png</div>"
    if(selected_obj.r == undefined)
    selected_obj.r = 0 
    trot.innerHTML = "<div> <strong contenteditable='true'>" + selected_obj.r + "</strong> degrès</div>"

    }else if(t == "Deleted"){
        tcoord.innerHTML = " "
        tlent.innerHTML = " "
        tlok.innerHTML = " "
        trot.innerHTML = " "
    }
    /*
    if(selected_obj.r == undefined)
    selected_obj.r = 0 
trot.innerHTML = "<div contenteditable='true'>" + selected_obj.r + "</div>"
*/
}
function updateEditor() {
    // Adjust camera

    {
        if (pressed_keys.left > 0)
            camera.x -= 10;
        if (pressed_keys.right > 0)
            camera.x += 10;
        if (pressed_keys.up > 0)
            camera.y -= 10;
        if (pressed_keys.down > 0)
            camera.y += 10;

        if (follow_mouse) {
            let [relx, rely] = mouse2map(mouse_state.x, mouse_state.y);
            moveCamera(relx, rely, 0.8, 4.0);
        } else {
            camera.x = clamp(camera.x, canvas.width / 2, map.width - canvas.width / 2);
            camera.y = clamp(camera.y, canvas.height / 2, map.height - canvas.height / 2);
        }
    }

    // Load and save
    // Maps
    {
        let map_names = Object.keys(world.maps);

        for (let i = 0; i < map_names.length; i++) {
            let name = map_names[i];

            button(canvas.width - 10, 10 + i * 48, name, { align: 'right',
                                                           toggled: map.name == name }, () => {
                if (name != map.name)
                    init(name);
            });
        }
    }


    // Edit walls
    if (tool == 'wall') {
        if (edit_wall.x2 == null) {
          let x;
          let y;
back = finde(mouse_state.x, mouse_state.y);
if(back == null){
y = 0;
}else {
  y = back.y1;
}
if(back == null){
x = 0;

}else {
  x = back.x1;
}
edit_wall.x1 = x;
edit_wall.y1 = y;
            if (mouse_state.left == -1) {
                mouse_state.left = 0;
                edit_wall.x2 = 0;
            }
        }

        if (edit_wall.x2 != null) {
          let x;
          let y;
          back = finde(mouse_state.x, mouse_state.y);
          if(back == null){
          y = 0;
          }else {
            y = back.y1;
          }
          if(back == null){
          x = 0;

          }else {
            x = back.x1;
          }

          edit_wall.x2 = x;
          edit_wall.y2 = y;

            let [nx, ny] = normal(edit_wall.y1 - edit_wall.y2, edit_wall.x2 - edit_wall.x1);

            edit_wall.length = distance(edit_wall.x1, edit_wall.y1, edit_wall.x2, edit_wall.y2);
            edit_wall.angle = Math.atan2(edit_wall.y2 - edit_wall.y1, edit_wall.x2 - edit_wall.x1);
            edit_wall.nx = nx;
            edit_wall.ny = ny;

            if (mouse_state.left == -1) {
                map.walls.push(edit_wall);
                selected_obj = edit_wall
                t = "bloc"
                update_info(t)
                edit_wall = { look: edit_wall.look, width: edit_wall.width };
            }
        }
    }
    // Edit batiment
    if (tool == 'batiment') {
      let x;
      let y;
      back = finde(mouse_state.x, mouse_state.y);
        
      if(back == null){
      y = 0;
      }else {
        y = back.y1;
      }
      if(back == null){
      x = 0;

      }else {
        x = back.x1;
      }

      edit_batiment.x = x;
      edit_batiment.y = y;

            if (mouse_state.left == -1) {
                map.batiment.push(edit_batiment);
                selected_obj = edit_batiment
                t = "batiment"
                update_info(t)

                edit_batiment = { look: edit_batiment.look};

            }
    }

    if (tool == 'selecte_wall') {
        selected_obj = find_block(mouse_state.x, mouse_state.y);
       
        if (selected_obj != null && mouse_state.left == -1) {

            tool = null;
            t = "bloc"
            update_info(t)
            let doc = document.getElementsByClassName("el")[0]
            doc.classList.remove("sele")
        }
    }

    if (tool == 'selecte_bat') {
        selected_obj = find_bat(mouse_state.x, mouse_state.y);

        if (selected_obj != null && mouse_state.left == -1) {

            tool = null;
            t = "batiment"
            update_info(t)
            let doc = document.getElementsByClassName("el2")[0]
            doc.classList.remove("sele")
        }
    }
    // Deletion tool
    if (tool == 'delete_block') {
       
        delete_obj = find_block(mouse_state.x, mouse_state.y);

        if (delete_obj != null && mouse_state.left == -1) {
            map.walls = map.walls.filter(wall => wall != delete_obj);

            delete_obj = null;
        }
    }else if (tool == 'delete_bat') {
        delete_obj = find_bat(mouse_state.x, mouse_state.y);

        if (delete_obj != null && mouse_state.left == -1) {
            map.batiment = map.batiment.filter(batiment => batiment != delete_obj);

            delete_obj = null;
        }
    }

    // Moove tool
    if (tool == 'moove') {

      if(clicked == 0)
        moove_obj = find_bat(mouse_state.x, mouse_state.y);

        if (moove_obj != null && mouse_state.left == -1 && clicked == 0) {
          clicked = 1;

        }
        else if(clicked == 1 && moove_obj != null && mouse_state.left == -1){
            clicked = 0
          back = finde(mouse_state.x, mouse_state.y);
        
          moove_obj.x = back.x1;
          moove_obj.y = back.y1;
          moove_obj = null
        }else if(clicked == 1) {
            back = finde(mouse_state.x, mouse_state.y);
        
            moove_obj.x = back.x1;
            moove_obj.y = back.y1;
        }
    }
}


function drawEditor() {
    ctx.save();
    {
        ctx.translate(canvas.width / 2 - camera.x, canvas.height / 2 - camera.y);

        //Draw Background
        let img = AutoloadBloc(map.background);
        let width = map.width / 32 + 1;
        let height = map.height / 32 + 1;
        for(let j = 0; j <= width; j += 1){
          var l = j;
        for (let i = 0; i <= height; i += 1) {
            let x = 0 + l * 32;
            let y = 0 + i * 32;

            ctx.save();
            ctx.beginPath();
    ctx.strokeStyle = 'black';  // some color/style
    ctx.lineWidth = 2;
            ctx.translate(x, y);
            ctx.drawImage(img, -img.width, -img.height, 32, 32);
            ctx.strokeRect(-img.width, -img.height, 32, 32);
            ctx.restore();
        }
      }



        // Draw walls
        for (let i = 0; i < map.walls.length; i++) {
            let wall = map.walls[i];

            ctx.save();
            if (tool == 'delete_block' && delete_obj == wall || selected_obj == wall)
                ctx.globalAlpha = Math.sin(iteration / 8) * 0.2 + 0.8;
            drawWall(wall);
            ctx.restore();
        }

        if(true){
        for (let i = 0; i < map.batiment.length; i++) {
            let batiment = map.batiment[i];

            ctx.save();
            if (tool == 'delete_bat' && delete_obj == batiment || selected_obj == batiment)
                ctx.globalAlpha = Math.sin(iteration / 8) * 0.2 + 0.8;
                if ( moove_obj == batiment)
                    ctx.globalAlpha = Math.sin(iteration / 8) * 0.2 + 0.8;
            drawBatiment(batiment);
            ctx.restore();
        }
    }



        // Draw specific tools
        ctx.save();
        ctx.globalAlpha = Math.sin(iteration / 8) * 0.2 + 0.8;
        if (tool == 'wall' || tool == 'invisible') {
            if (edit_wall.x2 == null) {
              let img;
              if(edit_wall.look != "iron" && edit_wall.look != null){
                 img = AutoloadBloc(edit_wall.look);

              }else if(edit_wall.look == "iron"){
                 img = assets[edit_wall.look];

              }else {
                img = AutoloadBloc('undefined.png');
              }
                ctx.drawImage(img, edit_wall.x1 - img.width, edit_wall.y1 - img.height, 32, 32);
            } else {
                drawWall(edit_wall);
            }
        } else if (tool == 'batiment') {
            
            drawBatiment(edit_batiment);

        }
        ctx.restore();

        /*// Draw ship
        ctx.save();
        ctx.translate(ship.x, ship.y);
        ctx.rotate(-ship.angle);
        ctx.drawImage(assets.spaceship, -assets.spaceship.width / 2, -assets.spaceship.height / 2);
        ctx.restore(); */
    }
    ctx.restore();

    ctx.save();
    ctx.restore();
}


// Utility create and clean maps

// create_maps("rework", 2000, 2000, "170.png")
function create_maps(name, width, height, back){

    world.maps[name] = {"background": "" + back + "","name": "" + name + "","width": "" + width + "","height": "" + height + "","batiment": [],"enemies": [],"walls": [],"back": []}
    backed(name)
}

function backed(map){
    let mape = world.maps[map]
    let width = mape.width / 32 + 1;
    let height = mape.height / 32 + 1;
        for(let j = 0; j <= width; j += 1){
          var l = j;
        for (let i = 0; i <= height; i += 1) {
            let x = 0 + l * 32;
            let y = 0 + i * 32;
            mape.back.push({"angle": 0, "collide": false, "length": 0,"look": "170.png", "nx": null, "ny": null, "width": 32,"x1": x, "x2": x, "y1": y, "y2": y});
        }
      }
}

function clean_backed(map){
    world.maps[map].back = [];
}