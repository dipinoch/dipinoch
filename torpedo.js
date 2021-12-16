//variables globales
let scene, camera, renderer, clock, deltaTime, totalTime; //variables de mi escena THREE
let arToolkitSource, arToolkitContext; //objetos que permiten ejecutar todo lo referente a AR
let marker1; //marcadores
let mesh1; //meshes que van a aparecer al visualizar el marcador 

///////////////FUNCIONES////////////////////////////
//funcion principal 
function main() {
console.log ('bla');
}

init();
animate();
//ejecutamos la app llamando a main 
//main(); //llamado a la funcion main 

function init() {
    ///////CREACION DE UNA ESCENA///////////////////
    scene = new THREE.Scene();

    let ambientLight = new THREE.AmbientLight( 0xcccccc, 0.5 );
	scene.add( ambientLight );

    ///////CREACION DE UNA CAMARA///////////////////
    camera = new THREE.Camera();
    //agrego la camara a mi escena 
    scene.add(camera);

    ///////CREACION DEL RENDERER///////////////////
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

    renderer.setClearColor(new THREE.Color('lightgrey'), 0)
    renderer.setSize(640, 480);
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.top = '0px'
    renderer.domElement.style.left = '0px'
    document.body.appendChild(renderer.domElement);

    ///////CREACION DE UN COUNTER///////////////////
    clock = new THREE.Clock();
    deltaTime = 1;
    totalTime = 1;

    ////////////////////////////////////////////////////////////
    // setup arToolkitSource
    ////////////////////////////////////////////////////////////

    arToolkitSource = new THREEx.ArToolkitSource({
        sourceType: 'webcam',
    });

    function onResize() {
        arToolkitSource.onResize()
        arToolkitSource.copySizeTo(renderer.domElement)
        if (arToolkitContext.arController !== null) {
            arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)
        }
    }

    arToolkitSource.init(function onReady() {
        onResize()
    });

    // handle resize event
    window.addEventListener('resize', function () {
        onResize()
    });

    ////////////////////////////////////////////////////////////
    // setup arToolkitContext
    ////////////////////////////////////////////////////////////	

    // create atToolkitContext
    arToolkitContext = new THREEx.ArToolkitContext({
        cameraParametersUrl: 'data/camera_para.dat',
        detectionMode: 'mono'
    });

    // copy projection matrix to camera when initialization complete
    arToolkitContext.init(function onCompleted() {
        camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
    });

    ////////////////////////////////////////////////////////////
    // setup markerRoots
    ////////////////////////////////////////////////////////////

    //Marcador 1
    marker1 = new THREE.Group();
    //marker1.name = 'marker1';
    scene.add(marker1); //agregamos el marcador a la escena 

    let markerControls1 = new THREEx.ArMarkerControls(arToolkitContext, marker1, {
        type: 'pattern',
        patternUrl: "data/hiro.patt",
    })   

    //////CREACION VIDEO///////////////
    let geoVideo = new THREE.PlaneBufferGeometry(2,2,4,4); //molde geometria

    let video =  document.getElementById('video');
   
    let texture =  new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter= THREE.LinearFilter;
    texture.format =  THREE.RGBFormat;

    let material1 = new THREE.MeshBasicMaterial(
        {

            map:texture
    }
    );

    mesh1 = new THREE.Mesh(geoVideo, material1);
    mesh1.rotation.x = -Math.PI/2;

    marker1.add(mesh1);
}

function update() {
    // update artoolkit on every frame
    if (arToolkitSource.ready !== false)
        arToolkitContext.update(arToolkitSource.domElement);
}

function render() {
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);
    deltaTime = clock.getDelta();
    totalTime += deltaTime;
    render();
    update();
}