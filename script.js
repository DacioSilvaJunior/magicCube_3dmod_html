import * as THREE from "three";

import { OrbitControls }

from "three/addons/controls/OrbitControls.js";

/////////////////////////
// variáveis
/////////////////////////

const cubos=[];

const estado={

movimentos:0,
animando:false

};

/////////////////////////
// cena
/////////////////////////

const scene=new THREE.Scene();

scene.background=
new THREE.Color(0x222222);

const camera=
new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
);

camera.position.set(
6,
6,
8
);

const renderer=
new THREE.WebGLRenderer({
antialias:true
});

renderer.setSize(
window.innerWidth,
window.innerHeight
);

document.body.appendChild(
renderer.domElement
);

/////////////////////////
// controles
/////////////////////////

const controls=
new OrbitControls(
camera,
renderer.domElement
);

controls.enableDamping=true;

/////////////////////////
// luz
/////////////////////////

scene.add(
new THREE.AmbientLight(
0xffffff,
2
)
);

const luz=
new THREE.DirectionalLight(
0xffffff,
2
);

luz.position.set(
10,
10,
10
);

scene.add(luz);

/////////////////////////
// cubinhos
/////////////////////////

for(let x=-1;x<=1;x++){

for(let y=-1;y<=1;y++){

for(let z=-1;z<=1;z++){

const materiais=[

new THREE.MeshBasicMaterial({
color:x===1?0xff0000:0x333333
}),

new THREE.MeshBasicMaterial({
color:x===-1?0xff8800:0x333333
}),

new THREE.MeshBasicMaterial({
color:y===1?0xffffff:0x333333
}),

new THREE.MeshBasicMaterial({
color:y===-1?0xffff00:0x333333
}),

new THREE.MeshBasicMaterial({
color:z===1?0x00ff00:0x333333
}),

new THREE.MeshBasicMaterial({
color:z===-1?0x0000ff:0x333333
})

];

const cubo=
new THREE.Mesh(
new THREE.BoxGeometry(
0.95,
0.95,
0.95
),
materiais
);

cubo.position.set(
x,
y,
z
);

cubos.push(
cubo
);

scene.add(
cubo
);

}

}

}

/////////////////////////
// girar
/////////////////////////

function girarFace(
eixo,
valor
){

if(
estado.animando
)return;

estado.animando=true;

const grupo=
new THREE.Group();

scene.add(
grupo
);

const face=
cubos.filter(
c=>Math.round(
c.position[eixo]
)==valor
);

face.forEach(
c=>grupo.attach(c)
);

let angulo=0;

function animar(){

angulo+=0.05;

grupo.rotation[eixo]=angulo;

if(
angulo<
Math.PI/2
){

requestAnimationFrame(
animar
);

}else{

face.forEach(
c=>scene.attach(c)
);

scene.remove(
grupo
);

estado.animando=false;

estado.movimentos++;

document
.getElementById(
"contador"
)
.innerHTML=
"Movimentos: "+
estado.movimentos;

}

}

animar();

}

/////////////////////////
// teclado
/////////////////////////

document.addEventListener(
"keydown",
e=>{

switch(
e.key.toLowerCase()
){

case "u":

girarFace(
"y",
1
);

break;

case "d":

girarFace(
"y",
-1
);

break;

case "f":

girarFace(
"z",
1
);

break;

case "b":

girarFace(
"z",
-1
);

break;

case "r":

girarFace(
"x",
1
);

break;

case "l":

girarFace(
"x",
-1
);

break;

}

}
);

/////////////////////////
// render
/////////////////////////

function animate(){

requestAnimationFrame(
animate
);

controls.update();

renderer.render(
scene,
camera
);

}

animate();