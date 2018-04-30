const example = (function() {
	'use strict'; 
	var scene = new THREE.Scene();
	var renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.canvasRenderer();
	var light = new THREE.PointLight(0xddc254, .8, 100); // color, intensity. distance
	var ambientLight = new THREE.AmbientLight( 0xf4efdc, 1 ); // color, intensity 
	var camera;
	var boxes = [];
	var sphere;
	var USE_WIREFRAME = false;

	function initScene() {
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.shadowMapEnabled = true;
		renderer.shadowMap.type = THREE.BasicShadowMap;
		// renderer.shadowMapSoft = true;
		
		document.getElementById('web-gl-container').appendChild(renderer.domElement);

		light.position.set(-50, 10, 0);
		light.castShadow = true;
		light.shadow.camera.near = 0.1;    
		light.shadow.camera.far = 250;  
		light.power = 20*Math.PI;

		scene.add(light);
		scene.add( ambientLight );

		camera  = new THREE.PerspectiveCamera(
			35, 
			window.innerWidth/window.innerHeight,
			1,
			1000
		);
		
		var controls = new THREE.OrbitControls( camera );
		camera.position.set( 0, 20, 100 );
		controls.update();
 
		scene.add(camera);

		function addABunchOfBoxes(qty, size) {
			for (let i = 0; i < qty; i++) {
				var box = new THREE.Mesh(
					new THREE.BoxGeometry(size, size, size),
					new THREE.MeshLambertMaterial({
						color: 0xffff00,
						wireframe: USE_WIREFRAME
					})
				);
				box.name = 'boxy';
				scene.add(box);
				box.position.x =  i * (size*2) - 50;	
				box.receiveShadow = true
				box.castShadow = true;
				boxes.push(box);
			}
		}

		addABunchOfBoxes(20, 3);

		// var sphereMaterial = new THREE.MeshLambertMaterial({
		// 	color: 0xf4f4f4,
		// 	wireframe: USE_WIREFRAME			
		// });
		// sphere = new THREE.Mesh(
		// 	new THREE.SphereGeometry(7, 7, 7),
		// 	sphereMaterial
		// );
		// sphere.position.x = 30;
		// sphere.position.y = 10;
		// sphere.rotation.x = 45;
		// sphere.castShadow = true;
		// sphere.name = 'the sphere';
		// sphere.animation = function(){
		// 	if(this.goRight)
		// 		this.position.x += 0.5;
		// 	else
		// 		this.position.x -= .5
		// }
		// scene.add(sphere);

		var planeGeometry = new THREE.PlaneGeometry( 300, 300, 300, 300 );
		var planeMaterial = new THREE.MeshLambertMaterial( {
			color: 0x999999, 
			side: THREE.DoubleSide,
			wireframe: USE_WIREFRAME
		} );
		var plane = new THREE.Mesh( planeGeometry, planeMaterial );
		plane.receiveShadow = true;
		plane.renderReverseSided  = true;
		plane.position.y = -10;
		plane.rotateX( - Math.PI / 2);
		scene.add( plane );

		render();
	}

	function render(){
		boxes.forEach(function(box){
			box.rotation.x += 0.01;
			box.rotation.y += 0.01;
			box.rotation.z += 0.01;
		})

		// sphere.rotation.y += 0.01;
		// sphere.animation();
		// if(sphere.position.x < -30)
		// 	sphere.goRight = true;
		// if(sphere.position.x > 30)
		// 	sphere.goRight = false;

		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}

	window.onload = initScene;

	return {
		scene: scene
	}
})();


