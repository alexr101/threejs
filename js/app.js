const example = (function() {
	'use strict'; 
	var scene = new THREE.Scene();
	var renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.canvasRenderer();
	var light = new THREE.PointLight(0xddc254, .8, 100); // color, intensity. distance
	var ambientLight = new THREE.AmbientLight( 0xf4efdc, 1 ); // color, intensity
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
		renderer.shadowMap.type = THREE.BasicShadowMap;
		// renderer.shadowMapSoft = true;
		
		canvas.appendChild(renderer.domElement);

		var lightGeometry = new THREE.SphereBufferGeometry( 1, 16, 8 );
		var lightMat = new THREE.MeshStandardMaterial( {
			emissive: 0xffffee,
			emissiveIntensity: .2,
			color: 0x000000
		});
		light.add( new THREE.Mesh( lightGeometry, lightMat ) );
		light.position.set(-50, 10, 0);
		light.castShadow = true;
		light.shadow.camera.near = 0.1;    
		light.shadow.camera.far = 250;  

		scene.add(light);
		scene.add( ambientLight );

		camera  = new THREE.PerspectiveCamera(
			35, 
			window.innerWidth/window.innerHeight,
			1,
			1000
		);
		
		var controls = new THREE.OrbitControls( camera, canvas );
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

		var sphereMaterial = new THREE.MeshLambertMaterial({
			color: 0xf4f4f4,
			wireframe: USE_WIREFRAME			
		});
		sphere = new THREE.Mesh(
			new THREE.SphereGeometry(7, 7, 7),
			sphereMaterial
		);
		sphere.position.x = 30;
		sphere.position.y = 10;
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
			bulbPower: Object.keys( bulbLuminousPowers )[ 1 ],
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
		light.power = bulbLuminousPowers[ datGuiParams.bulbPower ];



		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}

	window.onload = initScene;

	return {
		scene: scene
	}
})();


