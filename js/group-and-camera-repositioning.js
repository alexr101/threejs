const example = (function() {
	'use strict'; 
	var scene = new THREE.Scene();
	var renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.canvasRenderer();
	var canvas = document.getElementById('web-gl-container');
	var camera;
    var sphere;
    var boxes = [];


	function initScene() {
		renderer.setSize(window.innerWidth, window.innerHeight);
		canvas.appendChild(renderer.domElement);
		camera  = new THREE.PerspectiveCamera( 65,  window.innerWidth/window.innerHeight, 1, 1000 );
		camera.position.set( 0, 0, 0.1 );
		// scene.add(camera);

		var controls = new THREE.OrbitControls( camera, canvas );
        controls.update();
        // controls.enableZoom = false;
        controls.enablePan = false;
        controls.rotateSpeed = -1;

        var texture = new THREE.TextureLoader().load( "vr-photo-spheres/office.jpg", function(texture){
            var sphereMaterial = new THREE.MeshBasicMaterial({
                color: 0xf4f4f4,
                map: texture,
            });
            sphere = new THREE.Mesh(
                new THREE.SphereGeometry(450, 450, 450),
                sphereMaterial
            );
            sphere.position.x = 30;
            sphere.position.y = 40;
            sphere.rotation.set(THREE.Math.degToRad(0), 0, 0)
            sphere.castShadow = true;
            sphere.name = 'the sphere';
            sphere.material.side = THREE.DoubleSide;
            scene.add(sphere);
        });

         

		function addABunchOfBoxes(qty, size) {
			for (let i = 0; i < qty; i++) {
                var group = new THREE.Group();
                group.name = 'group'+i;

				var box = new THREE.Mesh(
					new THREE.BoxGeometry(size, size, size),
					new THREE.MeshLambertMaterial({
						color: 0xffff00,
					})
				);
				box.name = 'boxy';
                box.position.z =  i * (size*2) - 80;
                box.position.x =  i * (size*4) - 80;
				box.receiveShadow = true
				box.castShadow = true;
                boxes.push(box);
                group.add(box);
                scene.add(group);
			}
        }

        addABunchOfBoxes(3, 10);
        console.log(scene);

        var group1 = scene.getObjectByName('group0');
        // group1.add(camera);

        var domEvents	= new THREEx.DomEvents(camera, renderer.domElement)
        boxes.forEach(function(box) {
            domEvents.addEventListener(box, 'click', function(event){
                console.log(box);
            })
        })

		render();
	}

	function render(){
		// BOX UPDATES

		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}

	window.onload = initScene;

	return {
		scene: scene
	}
})();


