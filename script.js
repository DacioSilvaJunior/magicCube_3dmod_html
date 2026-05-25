import * as THREE from "three";

import { OrbitControls }

from "three/addons/controls/OrbitControls.js";

/////////////////////////
// Variáveis
/////////////////////////

const cubos=[];

const estado={
    movimentos:0,
    embaralhos:0,
    animando:false
};

/////////////////////////
// Cena
/////////////////////////

const scene=new THREE.Scene();

scene.background=
new THREE.Color(0x222222);

const camera = new THREE.PerspectiveCamera(
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

const renderer = new THREE.WebGLRenderer({
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
// Controles
/////////////////////////

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping=true;

/////////////////////////
// Iluminação
/////////////////////////

scene.add(
    new THREE.AmbientLight(
        0xffffff,
        2
    )
);

const luz = new THREE.DirectionalLight(
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
// Cubinhos
/////////////////////////

for(let x=-1;x<=1;x++){

    for(let y=-1;y<=1;y++){

        for(let z=-1;z<=1;z++){

            const materiais=[

                new THREE.MeshBasicMaterial({
                    color: x === 1 ? 0xff0000 : 0x333333
                }),

                new THREE.MeshBasicMaterial({
                    color: x === -1 ? 0xff8800 : 0x333333
                }),

                new THREE.MeshBasicMaterial({
                    color: y === 1 ? 0xffffff :  0x333333
                }),

                new THREE.MeshBasicMaterial({
                    color: y === -1 ? 0xffff00 : 0x333333
                }),

                new THREE.MeshBasicMaterial({
                    color: z === 1 ? 0x00ff00 : 0x333333
                }),

                new THREE.MeshBasicMaterial({
                    color: z === -1 ? 0x0000ff : 0x333333
                })

            ];

            const cubo =
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
// Rotações
/////////////////////////

function girarFace(eixo, valor, direcao){

    if(
        estado.animando
    )return;

    estado.animando=true;

    const grupo = new THREE.Group();

    scene.add(
        grupo
    );

    const face = cubos.filter(
        c=>Math.round(
        c.position[eixo]
        )==valor
    );

    face.forEach(
        c=>grupo.attach(c)
    );

    let angulo=0;
    let velocidade = 0.05;

    function animar(){

        angulo += velocidade;

        if(angulo <= Math.PI/2){

            grupo.rotation[eixo] = angulo * direcao;

            requestAnimationFrame(
                animar
            );

        } else {

            // força rotação exata de 90°
            grupo.rotation[eixo] = (Math.PI / 2) * direcao;

            // atualiza matrizes
            grupo.updateMatrixWorld(true);

            face.forEach(c => {

                // devolve ao scene mantendo transformações
                scene.attach(c);

                // arredonda posição
                c.position.x = Math.round(c.position.x);
                c.position.y = Math.round(c.position.y);
                c.position.z = Math.round(c.position.z);

                // arredonda rotação
                c.rotation.x = Math.round(c.rotation.x / (Math.PI/2)) * (Math.PI/2);
                c.rotation.y = Math.round(c.rotation.y / (Math.PI/2)) * (Math.PI/2);
                c.rotation.z = Math.round(c.rotation.z / (Math.PI/2)) * (Math.PI/2);

            });

            scene.remove(grupo);

            estado.animando = false;

            estado.movimentos++;

            document.getElementById("contador").innerHTML =
                "Movimentos: " + estado.movimentos;
        }

    }

    animar();

}

/////////////////////////
// Inputs
/////////////////////////

document.addEventListener(
    "keydown",
    e=>{

        switch(e.key.toLowerCase()){

            case "a":
                girarFace("y", 1, 1);

                break;

            case "s":
                girarFace("y", 0, 1);

                break;

            case "d":
                girarFace("y", -1, 1);

                break;

            case "j":
                girarFace("x", -1, 1);

                break;

            case "k":
                girarFace("x", 0, 1);

                break;

            case "l":
                girarFace("x", 1, 1);

                break;
            
            case "q":
                girarFace("y", 1, -1);

                break;

            case "w":
                girarFace("y", 0, -1);

                break;

            case "e":
                girarFace("y", -1, -1);

                break;

            case "o":
                girarFace("x", 1, -1);

                break;

            case "i":
                girarFace("x", 0, -1);

                break;

            case "u":
                girarFace("x", -1, -1);

                break;
        }

    }
);


/////////////////////////
// Shuffle
/////////////////////////

async function shuffle(){
    if(estado.animando) return;

    const movimentos = [

        // eixo X
        { eixo: "x", valor: -1 },
        { eixo: "x", valor: 0 },
        { eixo: "x", valor: 1 },

        // eixo Y
        { eixo: "y", valor: -1 },
        { eixo: "y", valor: 0 },
        { eixo: "y", valor: 1 },

        // eixo Z
        { eixo: "z", valor: -1 },
        { eixo: "z", valor: 0 },
        { eixo: "z", valor: 1 }

    ];

    for(let i = 0; i < 5; i++){

        const movimento = movimentos[Math.floor(Math.random() * movimentos.length)];

        const direcao = Math.random() > 0.5 ? 1 : -1;

        await girarFaceAsync(movimento.eixo, movimento.valor, direcao);

    }

}

window.shuffle = shuffle;

function girarFaceAsync(eixo, valor, direcao){

    return new Promise(resolve => {

        if(estado.animando){
            resolve();
            return;
        }

        estado.animando = true;

        const grupo = new THREE.Group();

        scene.add(grupo);

        const face = cubos.filter(c => Math.abs(c.position[eixo] - valor) < 0.1);

        face.forEach(c => grupo.attach(c));

        let angulo = 0;

        const velocidade = 0.05;

        function animar(){

            angulo = Math.min(angulo + velocidade,Math.PI / 2);

            grupo.rotation[eixo] =
                angulo * direcao;

            if(angulo < Math.PI / 2){

                requestAnimationFrame(animar);

            } else {

                grupo.rotation[eixo] =
                    (Math.PI / 2) * direcao;

                grupo.updateMatrixWorld(true);

                face.forEach(c => {

                    scene.attach(c);

                    c.position.x =
                        Math.round(c.position.x);

                    c.position.y =
                        Math.round(c.position.y);

                    c.position.z =
                        Math.round(c.position.z);

                    c.rotation.x =
                        Math.round(
                            c.rotation.x / (Math.PI/2)
                        ) * (Math.PI/2);

                    c.rotation.y =
                        Math.round(
                            c.rotation.y / (Math.PI/2)
                        ) * (Math.PI/2);

                    c.rotation.z =
                        Math.round(
                            c.rotation.z / (Math.PI/2)
                        ) * (Math.PI/2);

                });

                scene.remove(grupo);

                estado.animando = false;

                estado.embaralhos++;

                document.getElementById("embaralhos").innerHTML = "Embaralhos: " + estado.embaralhos;

                resolve();

            }

        }

        animar();

    });

}

/////////////////////////
// Render
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