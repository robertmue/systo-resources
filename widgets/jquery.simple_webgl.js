(function ($) {

  /***********************************************************
   *         simple_webgl widget
   ***********************************************************
   */
    $.widget('systo.simple_webgl', {
        meta:{
            short_description: 'This is an "empty" widget, a starting point for making new widgets.',
            long_description: 'This is actually a complete widget, that does nothing.  '+
            'To make a new widget, copy this one into a new file.   Do a global search-and-replace '+
            'to change all occurences of the word \'simple_webgl\' to whatever you choose as the name for your widget.  '+
            'Then add in whatever options you want your widget to have, and the code that actually makes the widget '+
            'do something.',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Dec 2014',
            visible: true,
            options: {
            }
        },

        options: {
        },

        widgetEventPrefix: 'simple_webgl:',

        _create: function () {
            var self = this;
            this.element.addClass('simple_webgl-1');

            var div = $('<div>threed</div>');
            var div = $('<div>simple_webgl</div>');

            this._container = $(this.element).append(div);

            display();

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('simple_webgl-1');
            this.element.empty();
            this._super();
        },
        _setOption: function (key, value) {
            var self = this;
            var prev = this.options[key];
            var fnMap = {
            };

            // base
            this._super(key, value);

            if (key in fnMap) {
                fnMap[key]();

                // Fire event
                this._triggerOptionChanged(key, prev, value);
            }
        },

        _triggerOptionChanged: function (optionKey, previousValue, currentValue) {
            this._trigger('setOption', {type: 'setOption'}, {
                option: optionKey,
                previous: previousValue,
                current: currentValue
            });
        }
    });


function display() {
/*
	Three.js "tutorials by example"
	Author: Lee Stemkoski
	Date: July 2013 (three.js v59dev)
 */

// MAIN

// standard global variables
var container, scene, camera, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();
// custom global variables
var cube;

init();
animate();

// FUNCTIONS 		
function init() 
{
	// SCENE
	scene = new THREE.Scene();
	// CAMERA
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(0,150,1000);
	camera.lookAt(scene.position);	
	// RENDERER
	if ( Detector.webgl )
		renderer = new THREE.WebGLRenderer( {antialias:true} );
	else
		renderer = new THREE.CanvasRenderer(); 
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	 container = document.getElementById( 'simple_webgl' );
	container.appendChild( renderer.domElement );
	// EVENTS
	THREEx.WindowResize(renderer, camera);
	THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
	// CONTROLS
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	// STATS
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );
	// LIGHT
	var light1 = new THREE.PointLight(0xffffff,0.7,0);
	light1.position.set(0,1000,500);
	scene.add(light1);

    var light2 = new THREE.AmbientLight( 0xa0a0a0 ); // soft white light
    scene.add( light2 );

	// FLOOR
	//var floorTexture = new THREE.ImageUtils.loadTexture( 'images/three_js/checkerboard.jpg' );
	var floorTexture = new THREE.ImageUtils.generateDataTexture (100, 100, 0xaaaa00)
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
	floorTexture.repeat.set( 10, 10 );
	//var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
	var floorMaterial = new THREE.MeshBasicMaterial(  { color: 0xaaaaff, side: THREE.BackSide } );
	var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.y = -0.5;
	floor.rotation.x = Math.PI / 2;
	scene.add(floor);
	// SKYBOX/FOG
	var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
	var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
	var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
	// scene.add(skyBox);
	scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );
	
	////////////
	// CUSTOM //
	////////////
	
	// Sphere parameters: radius, segments along width, segments along height
	var sphereGeom =  new THREE.SphereGeometry( 40, 32, 16 );
    var cylinderGeom = new THREE.CylinderGeometry( 10, 10, 180, 32 );
	
	// Three types of materials, each reacts differently to light.
	var darkMaterial = new THREE.MeshBasicMaterial( { color: 0x00c000 } );
	var darkMaterialL = new THREE.MeshLambertMaterial( { color: 0x00c000 } );
	var darkMaterialP = new THREE.MeshPhongMaterial( { color: 0x00c000 } );
		
	// Creating three spheres to illustrate the different materials.
	// Note the clone() method used to create additional instances
	//    of the geometry from above.

    for (var i=1; i<=100; i++) {
        var x = Math.random()*1000-500;
        var z = Math.random()*1000-500;
        var height = 120+Math.random()*40;
	    var sphere = new THREE.Mesh( sphereGeom.clone(), darkMaterialL );
	    sphere.position.set(x, height, z);
	    scene.add( sphere );	
        var cylinder = new THREE.Mesh( cylinderGeom.clone(), darkMaterialL );
	    cylinder.position.set(x, 50, z);
        scene.add( cylinder );
    }
	
	// create a small sphere to show position of light
	var lightbulb1 = new THREE.Mesh( 
		new THREE.SphereGeometry( 10, 16, 8 ), 
		new THREE.MeshBasicMaterial( { color: 0xffaa00 } )
	);
	scene.add( lightbulb1 );
	lightbulb1.position = light1.position;

}

function animate() 
{
    requestAnimationFrame( animate );
	render();		
	update();
}

function update()
{
	if ( keyboard.pressed("z") ) 
	{ 
		// do something
	}
	
	controls.update();
	stats.update();
}

function render() 
{
	renderer.render( scene, camera );
}

}

})(jQuery);
