const example = (function() {
	'use strict'; 
	var scene = new THREE.Scene();
	var renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.canvasRenderer();
	var light = new THREE.PointLight(0xf2e74b, 1, 1000, 2); // color, intensity. distance
	var light2 = new THREE.PointLight(0x943df7, 1, 1000, 2); // color, intensity. distance

	var ambientLight = new THREE.AmbientLight( 0xf4efdc, .2 ); // color, intensity
	var hemiLight;
	var canvas = document.getElementById('web-gl-container');
	var camera;
	var boxes = [];
	var sphere;
	var USE_WIREFRAME = false;
	var datGuiParams;
	var bulbLuminousPowers;
	var hemiLuminousIrradiances;

	function initScene() {
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.shadowMap.enabled = true;
		// next props: https://stackoverflow.com/questions/16752075/quality-of-three-js-shadow-in-chrome-macos
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		renderer.shadowMapSoft = true;
		renderer.physicallyCorrectLights = true;
		renderer.gammaInput = true;
		renderer.gammaOutput = true;
		renderer.toneMapping = THREE.ReinhardToneMapping;

		canvas.appendChild(renderer.domElement);

		var lightGeometry = new THREE.SphereBufferGeometry( 1, 16, 8 );
		var lightMat = new THREE.MeshStandardMaterial( {
			emissive: 0xffffee,
			emissiveIntensity: 1,
			color: 0x000000
		});
		// next 2 props: https://stackoverflow.com/questions/16752075/quality-of-three-js-shadow-in-chrome-macos
		light.shadowMapWidth = 2048; // default is 512
		light.shadowMapHeight = 2048; // default is 512
		light.add( new THREE.Mesh( lightGeometry, lightMat ) );
		light.position.set(-150, 50, -100);
		light.castShadow = true;

		var lightGeometry2 = new THREE.SphereBufferGeometry( 1, 16, 8 );
		var lightMat2 = new THREE.MeshStandardMaterial( {
			emissive: 0xffffee,
			emissiveIntensity: 1,
			color: 0x000000
		});
		// next 2 props: https://stackoverflow.com/questions/16752075/quality-of-three-js-shadow-in-chrome-macos
		light2.shadowMapWidth = 2048; // default is 512
		light2.shadowMapHeight = 2048; // default is 512
		light2.add( new THREE.Mesh( lightGeometry2, lightMat2 ) );
		light2.position.set(150, 50, 100);
		light2.castShadow = true;

		hemiLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 0.02 );

		scene.add( hemiLight );
		scene.add(light);
		scene.add(light2);
		scene.add( ambientLight );

		camera  = new THREE.PerspectiveCamera(
			65, 
			window.innerWidth/window.innerHeight,
			1,
			1000
		);
		camera.position.set( 0, 0, 0.1 );
		scene.add(camera);

		var controls = new THREE.OrbitControls( camera, canvas );
        controls.update();
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.rotateSpeed = -1;
        // Lock X and Z axises
        // controls.minPolarAngle = Math.PI/2;
        // controls.maxPolarAngle = Math.PI/2; 
 

		// function addABunchOfBoxes(qty, size) {
		// 	for (let i = 0; i < qty; i++) {
		// 		var box = new THREE.Mesh(
		// 			new THREE.BoxGeometry(size, size, size),
		// 			new THREE.MeshLambertMaterial({
		// 				color: 0xffff00,
		// 				wireframe: USE_WIREFRAME
		// 			})
		// 		);
		// 		box.name = 'boxy';
		// 		scene.add(box);
		// 		box.position.x =  i * (size*2) - 100;	
		// 		box.receiveShadow = true
		// 		box.castShadow = true;
		// 		boxes.push(box);
		// 	}
		// }

        // addABunchOfBoxes(20, 10);
        var texture = new THREE.TextureLoader().load( "vr-photo-spheres/office.jpg", function(){

            var sphereMaterial = new THREE.MeshBasicMaterial({
                color: 0xf4f4f4,
                map: texture,
            });
            sphere = new THREE.Mesh(
                new THREE.SphereGeometry(150, 150, 150),
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






		// var planeGeometry = new THREE.PlaneGeometry( 700, 300, 300, 300 );
		// var planeMaterial = new THREE.MeshLambertMaterial( {
		// 	color: 0x999999, 
		// 	metalness: 0.2,
		// 	reflectivity: 0.25,
		// 	side: THREE.DoubleSide,
		// 	roughness: 0.8,
		// 	bumpScale: 0.0005,
		// 	wireframe: USE_WIREFRAME
		// } );
		// var plane = new THREE.Mesh( planeGeometry, planeMaterial );
		// plane.receiveShadow = true;
		// plane.renderReverseSided  = true;
		// plane.position.y = -10;
		// plane.rotateX( - Math.PI / 2);
		// scene.add( plane );



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


