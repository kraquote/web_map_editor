let assets = {
    dirt: loadImage('assets/blocs/170.png'),
      dirt2: loadImage('assets/blocs/838.png'),
    center: loadImage('decos/center.png'),
    bush: loadImage('decos/bush.png'),
    a: loadImage('decos/arbre3.png'),
    ab: loadImage('decos/arbre2.png'),
    ac: loadImage('decos/arbre4.png'),
    ad: loadImage('decos/arbre7.png'),
    ae: loadImage('decos/arbregiant.png'),
    b: loadImage('decos/lamp.png'),
    c: loadImage('decos/banc.png'),
    d: loadImage('decos/portail.png'),
    e: loadImage('decos/maison1.png'),
    f: loadImage('decos/statue2.png'),
    g: loadImage('decos/statue.png'),
    h: loadImage('decos/baniere.png'),
    i: loadImage('decos/center.png'),
    j: loadImage('decos/bush.png'),

};


let tabl_to_push_pok = {};
let tabl_to_push_skin = {};
function loadAnimation(name, type, direction, rarete) {



  if (type == 'poke') {

    let name_cut = name.replace('.png', '');
    let a1 = name_cut + '_a1_' + rarete + '_' + direction;
    let a2 = name_cut + '_a2_' + rarete + '_' + direction;

    if (tabl_to_push_pok[a1] == undefined) {
      if (rarete == 'normal') {

        anim1 = loadImage('assets/sprites/pokemons/' + name + '/' + name + '_' + direction + '1.png');
        anim2 = loadImage('assets/sprites/pokemons/' + name + '/' + name + '_' + direction + '2.png');

        tabl_to_push_pok[a1] = anim1;
        tabl_to_push_pok[a2] = anim2;

      } else {
        anim1 = loadImage('assets/sprites/pokemons/' + name + '/' + name + '_' + rarete + '_' + direction + '1.png');
        anim2 = loadImage('assets/sprites/pokemons/' + name + '/' + name + '_' + rarete + '_' + direction + '2.png');

        tabl_to_push_pok[a1] = anim1;
        tabl_to_push_pok[a2] = anim2;
      }
    } else {
      anim1 = tabl_to_push_pok[a1];
      anim2 = tabl_to_push_pok[a2];
    }
    return [anim1, anim2];
  } else if (type == 'human') {

    let name_cut = name.replace('.png', '');
    let a1 = name_cut + '_a1_' + direction;
    let a2 = name_cut + '_a2_' + direction;
    let a3 = name_cut + '_a3_' + direction;
    if (tabl_to_push_skin[a1] == undefined) {

      anim1 = loadImage('assets/sprites/humans/' + name + '/' + name + '_wait_' + direction + '2.png');
      anim2 = loadImage('assets/sprites/humans/' + name + '/' + name + '_walk_' + direction + '2.png');
      anim3 = loadImage('assets/sprites/humans/' + name + '/' + name + '_walk_' + direction + '3.png');

      tabl_to_push_skin[a1] = anim1;
      tabl_to_push_skin[a2] = anim2;
      tabl_to_push_skin[a3] = anim3;

    } else {
      anim1 = tabl_to_push_skin[a1];
      anim2 = tabl_to_push_skin[a2];
      anim3 = tabl_to_push_skin[a3];
    }

    return [anim1, anim2, anim3];

  }

};

let tabl_to_b = {};
function AutoloadBloc(name){

let name_cut = name.replace('.png', '');

if (tabl_to_b[name_cut] == undefined) {
  img = loadImage('assets/blocs/' + name);
  tabl_to_b[name_cut] = img;
  return img;
} else {
  return tabl_to_b[name_cut];
}

}

let tabl_to_push = {};

function Decoration(name) {

  if(name == undefined ){
    name = "undefined.png"
  }
  let name_cut = name.replace('.png', '');

  if (tabl_to_push[name_cut] == undefined) {
    img = loadImage('decos/' + name);
    tabl_to_push[name_cut] = img;
    return img;
  } else {
    return tabl_to_push[name_cut];
  }

}