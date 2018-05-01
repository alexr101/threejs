// https://www.youtube.com/watch?v=3eGeh_aJxMI
var renderer,
scene,
camera,
controls,
myCanvas = document.getElementById('web-gl-container');
var USE_WIREFRAME = true;



//RENDERER
renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.canvasRenderer();
myCanvas.appendChild(renderer.domElement);
// renderer = new THREE.WebGLRenderer({canvas: myCanvas, antialias: true});
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 3000);
scene = new THREE.Scene();

//LIGHTS
var light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);
var light2 = new THREE.PointLight(0xffffff, 0.5);
scene.add(light2);

controls = new THREE.OrbitControls( camera );
camera.position.set( 0, 0, 50 );
camera.rotation.x = 45
controls.update();

var geometry = new THREE.SphereGeometry(10, 10, 10);  //PlaneGeometry(width, height, widthSegments, heightSegments)
var material = new THREE.MeshLambertMaterial({color: 0xF3FFE2, wireframe: USE_WIREFRAME});
var mesh = new THREE.Mesh(geometry, material);
mesh.position.z = 0;
scene.add(mesh);

var loader = new THREE.ColladaLoader();
loader.options.convertUpAxis = true;

loader.load('models/collada/elf/elf.dae', function(collada) {
    elf = collada.scene;
    elf.position.y = -3
    scene.add(elf);
})




//RENDER LOOP
render();

function render() {
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
