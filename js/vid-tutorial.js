// https://www.youtube.com/watch?v=3eGeh_aJxMI
var renderer,
scene,
camera,
controls,
myCanvas = document.getElementById('web-gl-container');
var USE_WIREFRAME = false;



//RENDERER
renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.canvasRenderer();
myCanvas.appendChild(renderer.domElement);
// renderer = new THREE.WebGLRenderer({canvas: myCanvas, antialias: true});
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

//CAMERA
camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 3000);

//SCENE
scene = new THREE.Scene();

//LIGHTS
var light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

var light2 = new THREE.PointLight(0xffffff, 0.5);
scene.add(light2);

controls = new THREE.OrbitControls( camera );
camera.position.set( 0, 20, -100 );
camera.rotation.x = 45
controls.update();

var geometry = new THREE.BoxGeometry(100, 100, 100);  //PlaneGeometry(width, height, widthSegments, heightSegments)
// Three Geometry
// Basic Geometry - Less Efficient
// var geometry = new THREE.Geometry();
// geometry.vertices.push(
//     new THREE.Vector3(-10, 10, 0),
//     new THREE.Vector3(-10, -10, 0),
//     new THREE.Vector3(10, 10, 0)
// )
// geometry.faces.push(new THREE.Face3(0, 1, 2));

// // Buffer Geometry More Effient by taking in all data associated with shape
// var geometry = new THREE.BufferGeometry();
// // create a simple square shape. We duplicate the top left and bottom right
// // vertices because each vertex needs to appear once per triangle.
// var vertices = new Float32Array( [
// 	-10.0, -10.0,  10.0,
// 	 10.0, -10.0,  10.0,
// 	 10.0,  10.0,  10.0,

// 	 10.0,  10.0,  10.0,
// 	-10.0,  10.0,  10.0,
// 	-10.0, -10.0,  10.0
// ] );

// // itemSize = 3 because there are 3 values (components) per vertex - so youre creating triangles
// geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );


var material = new THREE.MeshLambertMaterial({color: 0xF3FFE2});
var mesh = new THREE.Mesh(geometry, material);
mesh.position.z = -1000;
// scene.add(mesh);


// Font Loader
var loader = new THREE.FontLoader();
var font = loader.load(
	'fonts/gentilis_bold.typeface.json',
	function onLoad( font ) {
        console.log(font);
        var fontGeometry = new THREE.TextGeometry('Sample Text', {
            font: font,
            size: 100,
            height: 10,
            material: 0,
            bevelThickness: .2,
            extrudeMaterial: .1
        })
        var fontMaterial = new THREE.MeshLambertMaterial({
            color: 0XEFC728,
            wireframe: USE_WIREFRAME
        });
        var fontMesh = new THREE.Mesh(fontGeometry, fontMaterial);
        fontMesh.position.set(400, -200, 1000);
        fontMesh.rotation.y = 3
		scene.add( fontMesh );
	},
	function onProgress( xhr ) {
		console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
	},
	function onError( err ) {
		console.log( 'An error happened' );
	}
);



//RENDER LOOP
render();

var delta = 0;
function render() {
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
