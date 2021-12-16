
let scene, camera, renderer, clock, deltaTime, totalTime;

let arToolkitSource, arToolkitContext;

let markerRoot1;

let mesh1; //mesh para mostrar video 

let raycaster;

let mouse;

let INTERSECTED;

let objects = [];

let video1;


initialize();
animate();

function initialize()
{
	scene = new THREE.Scene();

	let ambientLight = new THREE.AmbientLight( 0xcccccc, 0.5 );
	scene.add( ambientLight );
				
	camera = new THREE.Camera();
	scene.add(camera);

	renderer = new THREE.WebGLRenderer({
		antialias : true,
		alpha: true
	});
	renderer.setClearColor(new THREE.Color('lightgrey'), 0)
	renderer.setSize( 1920, 1080 );
	renderer.domElement.style.position = 'absolute'
	renderer.domElement.style.top = '0px'
	renderer.domElement.style.left = '0px'
	document.body.appendChild( renderer.domElement );

	clock = new THREE.Clock();
	deltaTime = 0;
	totalTime = 0;
	
	////////////////////////////////////////////////////////////
	// setup arToolkitSource
	////////////////////////////////////////////////////////////

	arToolkitSource = new THREEx.ArToolkitSource({
		sourceType : 'webcam',
	});

	function onResize()
	{
		arToolkitSource.onResize()	
		arToolkitSource.copySizeTo(renderer.domElement)	
		if ( arToolkitContext.arController !== null )
		{
			arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)	
		}	
	}

	arToolkitSource.init(function onReady(){
		onResize()
	});
	
	// handle resize event
	window.addEventListener('resize', function(){
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
	arToolkitContext.init( function onCompleted(){
		camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
	});

	////////////////////////////////////////////////////////////
	// setup markerRoots
	////////////////////////////////////////////////////////////

	// build markerControls
	markerRoot1 = new THREE.Group();
	scene.add(markerRoot1);
	let markerControls1 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot1, {
		type: 'pattern', patternUrl: "data/hiro.patt",
	})

    ///Video///

    let geometry1 = new THREE.PlaneGeometry( 3, 2 );

    let video1= document.getElementById('video1');
    let texture = new THREE.VideoTexture(video1);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;
	video1.pause();


    let material1 = new THREE.MeshBasicMaterial({map: texture});

    mesh1 = new THREE.Mesh(geometry1, material1);
    mesh1.rotation.x = -Math.PI/2;
    markerRoot1.add(mesh1);
	objects.push(mesh1);


	document.addEventListener("mousemove", onDocumentMouseMove, false); 



}

function onDocumentMouseMove(event){
	event.preventDefault();
	mouse.set((event.clientX / window.InnerWidth) * 2 - 1, - (event.clientY / Window.InnerHeight) * 2 + 1);
	raycaster.setFromCamera(mouse, camera);
	let intersects = raycaster.intersectObjects(object, true);

	if (intersects.lenght > 0) {
		if (intersects[0].object != INTERSECTED) {
			if (INTERSECTED) {

			}
			INTERSECTED = intersects[0].object;

			video1.play();

			console.log("intersected");

		}
	}
}


function update()
{
	// update artoolkit on every frame
	if ( arToolkitSource.ready !== false )
		arToolkitContext.update( arToolkitSource.domElement );
}


function render()
{
	renderer.render( scene, camera );
}


function animate()
{
	requestAnimationFrame(animate);
	deltaTime = clock.getDelta();
	totalTime += deltaTime;
	update();
	render();
}