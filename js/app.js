const example = (function() {
	'use strict'; 
	var scene = new THREE.Scene();
	var renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.canvasRenderer();
	var light = new THREE.AmbientLight(0x4286f4);
	var camera;
	var boxes = [];
	var sphere;

	function initScene() {
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.getElementById('web-gl-container').appendChild(renderer.domElement);
		scene.add(light);

		camera  = new THREE.PerspectiveCamera(
			35, 
			window.innerWidth/window.innerHeight,
			1,
			1000
		);
		camera.position.z = 100;
		scene.add(camera);

		function addABunchOfBoxes(qty, size) {
			for (let i = 0; i < qty; i++) {
				var box = new THREE.Mesh(
					new THREE.BoxGeometry(size, size, size),
					new THREE.MeshBasicMaterial(0xffff00)
				);
				box.name = 'boxy';
				scene.add(box);
				box.position.x =  i * (size*2) - 50;	
				
				boxes.push(box);
			}
		}

		
		addABunchOfBoxes(15, 3);

		var material = new THREE.MeshBasicMaterial({
			color: 0xf4f4f4,
			wireframe: true			
		});

		sphere = new THREE.Mesh(
			new THREE.SphereGeometry(7, 7, 7),
			material
		);
		sphere.position.x = 30;
		sphere.position.y = -10;
		sphere.rotation.x = 45;
		sphere.name = 'the sphere';
		scene.add(sphere);

		render();
	}

	function render(){
		boxes.forEach(function(box){
			box.rotation.x += 0.01;
			box.rotation.y += 0.01;
			box.rotation.z += 0.01;
		})

		sphere.rotation.y += 0.01;
		sphere.position.x -= 0.03;
		// if(sphere.position.x < window.innerWidth/2)
		// 	sphere.position.x = 10;

		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}

	window.onload = initScene;

	return {
		scene: scene
	}
})();


