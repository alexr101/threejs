const example = (function() {
	'use strict'; 
	var scene = new THREE.Scene();
	var renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.canvasRenderer();
	var light = new THREE.DirectionalLight(0xffffff);
	var ambientLight = new THREE.AmbientLight( 0xf4efdc ); 
	var camera;
	var boxes = [];
	var sphere;

	function initScene() {
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.shadowMapEnabled = true;
		renderer.shadowMapSoft = true;
		
		document.getElementById('web-gl-container').appendChild(renderer.domElement);

		light.position.set(0, 2, 2);
		light.target.position.set(0, 0, 0);
		light.castShadow = true;
		light.shadowDarkness = 1;
		light.shadowCameraVisible = true;
		light.shadow.mapSize.width = 1012;  
		light.shadow.mapSize.height = 1012; 
		light.shadow.camera.near = 1;    
		light.shadow.camera.far = 1;  

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
					new THREE.MeshLambertMaterial(0xffff00)
				);
				box.name = 'boxy';
				scene.add(box);
				box.position.x =  i * (size*2) - 50;	
				box.castShadow = true;

				boxes.push(box);
			}
		}

		addABunchOfBoxes(20, 3);

		var material = new THREE.MeshLambertMaterial({
			color: 0xf4f4f4,
			wireframe: true			
		});

		sphere = new THREE.Mesh(
			new THREE.SphereGeometry(7, 7, 7),
			material
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

		var geometry = new THREE.PlaneGeometry( 300, 300, 300 );
		var material = new THREE.MeshLambertMaterial( {color: 0x555555, side: THREE.DoubleSide} );
		var plane = new THREE.Mesh( geometry, material );
		plane.receiveShadow = true;
		plane.renderReverseSided  = true;
		plane.position.y = -10;

		scene.add( plane );
		plane.rotateX( - Math.PI / 2);


		render();
	}

	function render(){
		boxes.forEach(function(box){
			box.rotation.x += 0.01;
			box.rotation.y += 0.01;
			box.rotation.z += 0.01;
		})

		sphere.rotation.y += 0.01;

		sphere.animation();

		if(sphere.position.x < -30)
			sphere.goRight = true;
		if(sphere.position.x > 30)
			sphere.goRight = false;

		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}

	window.onload = initScene;

	return {
		scene: scene
	}
})();


