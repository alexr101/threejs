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
		camera.position.set( -50, 130, 200 );
		scene.add(camera);

		var controls = new THREE.OrbitControls( camera, canvas );
		controls.update();
 

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
				box.position.x =  i * (size*2) - 100;	
				box.receiveShadow = true
				box.castShadow = true;
				boxes.push(box);
			}
		}

		addABunchOfBoxes(20, 10);

		var sphereMaterial = new THREE.MeshLambertMaterial({
			color: 0xf4f4f4,
			roughness: 10,
			wireframe: USE_WIREFRAME			
		});
		sphere = new THREE.Mesh(
			new THREE.SphereGeometry(20, 20, 20),
			sphereMaterial
		);
		sphere.position.x = 30;
		sphere.position.y = 40;
		sphere.rotation.x = 45;
		sphere.castShadow = true;
		sphere.name = 'the sphere';
		sphere.animation = function(){
			if(this.goRight)
				this.position.x += 0.5;
			else
				this.position.x -= .5
		}
		scene.add(sphere);

		var planeGeometry = new THREE.PlaneGeometry( 700, 300, 300, 300 );
		var planeMaterial = new THREE.MeshLambertMaterial( {
			color: 0x999999, 
			metalness: 0.2,
			reflectivity: 0.25,
			side: THREE.DoubleSide,
			roughness: 0.8,
			bumpScale: 0.0005,
			wireframe: USE_WIREFRAME
		} );
		var plane = new THREE.Mesh( planeGeometry, planeMaterial );
		plane.receiveShadow = true;
		plane.renderReverseSided  = true;
		plane.position.y = -10;
		plane.rotateX( - Math.PI / 2);
		scene.add( plane );

		// DAT GUI PARAMS FOR LIGHT
		// ref for lumens: http://www.power-sure.com/lumens.htm
		bulbLuminousPowers = {
			"110000 lm (1000W)": 110000,
			"3500 lm (300W)": 3500,
			"1700 lm (100W)": 1700,
			"800 lm (60W)": 800,
			"400 lm (40W)": 400,
			"180 lm (25W)": 180,
			"20 lm (4W)": 20,
			"Off": 0
		};
		// ref for solar irradiances: https://en.wikipedia.org/wiki/Lux
		hemiLuminousIrradiances = {
			"0.0001 lx (Moonless Night)": 0.0001,
			"0.002 lx (Night Airglow)": 0.002,
			"0.5 lx (Full Moon)": 0.5,
			"3.4 lx (City Twilight)": 3.4,
			"50 lx (Living Room)": 50,
			"100 lx (Very Overcast)": 100,
			"350 lx (Office Room)": 350,
			"400 lx (Sunrise/Sunset)": 400,
			"1000 lx (Overcast)": 1000,
			"18000 lx (Daylight)": 18000,
			"50000 lx (Direct Sun)": 50000
		};
		datGuiParams = {
			shadows: true,
			exposure: 0.68,
			bulbPower: Object.keys( bulbLuminousPowers )[ 6],
			hemiIrradiance: Object.keys( hemiLuminousIrradiances )[0]
		};
		var gui = new dat.GUI();
		gui.add( datGuiParams, 'hemiIrradiance', Object.keys( hemiLuminousIrradiances ) );
		gui.add( datGuiParams, 'bulbPower', Object.keys( bulbLuminousPowers ) );
		gui.add( datGuiParams, 'exposure', 0, 1 );
		gui.add( datGuiParams, 'shadows' );
		gui.open();

		render();
	}

	function render(){
		// BOX UPDATES
		boxes.forEach(function(box){
			box.rotation.x += 0.01;
			box.rotation.y += 0.01;
			box.rotation.z += 0.01;
		})

		// SPHERE  UPDATES
		sphere.rotation.y += 0.01;
		sphere.animation();
		if(sphere.position.x < -30)
			sphere.goRight = true;
		if(sphere.position.x > 30)
			sphere.goRight = false;

		// DAT GUI UPDATES
		renderer.toneMappingExposure = Math.pow( datGuiParams.exposure, 5.0 ); // to allow for very bright scenes.
		renderer.shadowMap.enabled = datGuiParams.shadows;
		light.castShadow = datGuiParams.shadows;
		light.power = bulbLuminousPowers[ datGuiParams.bulbPower ];
		light2.castShadow = datGuiParams.shadows;
		light2.power = bulbLuminousPowers[ datGuiParams.bulbPower ];
		hemiLight.intensity = hemiLuminousIrradiances[ datGuiParams.hemiIrradiance ];


		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}

	window.onload = initScene;

	return {
		scene: scene
	}
})();


