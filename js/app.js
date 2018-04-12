const example = (function() {
	'use strict'; 
	var scene = new THREE.Scene();
	var renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.canvasRenderer();
	var light = new THREE.AmbientLight(0x4286f4);
	var camera;
	var box;

	function initScene() {
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.getElementById('web-gl-container').appendChild(renderer.domElement);
		scene.add(light);

		camera  = new THREE.PerspectiveCamera(
			35, 
			window.innerWidth/window.innerHeight,
			1,
			1000
		)
		camera.position.z = 100;
		scene.add(camera);

		box = new THREE.Mesh(
			new THREE.BoxGeometry(20, 20, 20),
			new THREE.MeshBasicMaterial(0xffff00)
		)
		box.name = 'boxy';
		scene.add(box);

		render();
	}

	function render(){
		box.rotation.x += 0.01;
		box.rotation.y += 0.01;
		box.rotation.z += 0.01;
		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}

	window.onload = initScene;

	return {
		scene: scene
	}
})();


