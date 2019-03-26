
var renderer = null, 
scene = null, 
camera = null,
root = null,
group = null,
ship = null,
directionalLight = null;
//orbitControls = null;
var object;
var animator = null;
loopAnimation = false;

// Ship Movement
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;

var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();

var controls = null;

var keyboard = null;

var ship_loaded = 0;
var bool = true;

var objLoader = null;

var duration = 1500; // ms
var currentTime = Date.now();

var score = 0; 


function animate() {

    var now = Date.now();
    var delta = now - currentTime;
    currentTime = now;

    //velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
    direction.y = Number( moveForward ) - Number( moveBackward );
    direction.x = Number( moveLeft ) - Number( moveRight );
    direction.normalize(); // this ensures consistent movements in all directions
    if ( moveForward || moveBackward ) velocity.z -=  1.0 * delta;
    if ( moveLeft || moveRight ) velocity.y -=  1.0 * delta;
    
    controls.getObject().translateY( velocity.y * delta );
    controls.getObject().translateZ( velocity.z * delta );

    console.log(ship.position)

}

function run()
{
    requestAnimationFrame(function() { run(); });
    
        // Render the scene
        renderer.render( scene, camera );

        // Update the animations
        KF.update();
        
        animate();

        // Update the camera controller
        //orbitControls.update();
}

function loadObj()
{
    if(!objLoader)

        objLoader = new THREE.OBJLoader();

    objLoader.load(
        'models/Arwing/Arwing_001.obj',

        function(object)
        {
            //var texture = new THREE.TextureLoader().load('models/Tie_Fighter/texture.jpg');
            //var normalMap = new THREE.TextureLoader().load('Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_TerraCotta_g001c.jpg');       
            object.traverse( function ( child ) 
            {
                if ( child instanceof THREE.Mesh ) 
                {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    //child.material.map = texture;
                    //child.material.normalMap = normalMap;
                }
            } );
                    
            ship = object;
            ship.scale.set(5,5,5);
            ship.position.z = 0;
            ship.position.x = 250;
            ship.position.y = 100;
            ship.rotation.y = Math.PI /2;
            
            group.add(ship);
        },
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

            ship_loaded = ( xhr.loaded / xhr.total * 100 )

            if (ship_loaded >= 100 && bool){
                console.log("controls")
                controls = new THREE.PointerLockControls(group);
                scene.add(controls.getObject());

                bool = false;
            }
    
        },
        // called when loading has errors
        function ( error ) {
    
            console.log( 'An error happened' );
    
        });
    
}

function createScene(canvas) 
{
    
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(window.innerWidth -10, window.innerHeight -10);

    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(400,100,0);
    camera.lookAt(new THREE.Vector3(0,50,0))
    scene.add(camera);

    //orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    
    // Create a group to hold all the objects
    root = new THREE.Object3D;
    
    // Add a directional light to show off the object
    directionalLight = new THREE.DirectionalLight( 0xffffff, 1);

    // Create and add all the lights
    directionalLight.position.set(2, 2, 2);
    root.add(directionalLight);

    ambientLight = new THREE.AmbientLight ( 0x888888 );
    root.add(ambientLight);
    
    // Create a group to hold the objects
    group = new THREE.Object3D;
    root.add(group);

    // Create grass texture map
    var map = new THREE.TextureLoader().load("images/grass.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(10,10);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(500, 1000, 50, 50);
    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));
    mesh.rotation.x = -Math.PI / 2;

    // Add the mesh to our group
    scene.add( mesh );
    mesh.castShadow = false;
    mesh.receiveShadow = true;

    // Now add the group to our scene
    scene.add( root );

    // Load ship
    loadObj();

    var onKeyDown = function ( event ) {
        switch ( event.keyCode ) {
            case 38: // up
            case 87: // w
                moveForward = true;
                break;
            case 37: // left
            case 65: // a
                moveLeft = true;
                break;
            case 40: // down
            case 83: // s
                moveBackward = true;
                break;
            case 39: // right
            case 68: // d
                moveRight = true;
                break;
        }
    };

    var onKeyUp = function ( event ) {
        switch ( event.keyCode ) {
            case 38: // up
            case 87: // w
                moveForward = false;
                break;
            case 37: // left
            case 65: // a
                moveLeft = false;
                break;
            case 40: // down
            case 83: // s
                moveBackward = false;
                break;
            case 39: // right
            case 68: // d
                moveRight = false;
                break;
        }
    };

    window.addEventListener( 'resize', onWindowResize);
    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );
}

/*function onDocumentKeyDown(event){
    var delta = 1;
    event = event || window.event;
    var keycode = event.keyCode;
    console.log(keycode)
    switch(keycode){
    case 37 : //left arrow 
        ship.position.z = ship.position.z + delta;
        break;
    case 38 : // up arrow 
        ship.position.y = ship.position.y + delta;
        break;
    case 39 : // right arrow 
        ship.position.z = ship.position.z - delta;
        break;
    case 40 : //down arrow
        ship.position.y = ship.position.y - delta;
        break;
    }
}

function onDocumentKeyUp(event){

    document.removeEventListener('keydown',onDocumentKeyDown,false);
}
*/

function onWindowResize() 
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}


function playAnimations()
{
    animator.start();
}

