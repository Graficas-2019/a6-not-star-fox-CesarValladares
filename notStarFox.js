
var renderer = null, 
scene = null, 
camera = null,
root = null,
group = null,
ship = null,
building= null,
enemyShip = null,
floor = null,
directionalLight = null;
orbitControls = null;
var object;
var animator = null;
var loopAnimation = true;

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

var buildings = [];

var ship_loaded = 0;
var bool = true;

var floorAnimator = null;
var animateFloor = true;

var objLoader = null;
var mtlLoader = null;

var duration = 1500; // ms
var currentTime = Date.now();
var actualTime = Date.now();

var score = 0; 


function animate() {

    var now = Date.now();
    var delta = now - currentTime;
    currentTime = now;

    seconds = (now - actualTime)/1000
    
    if (seconds >= 2 ){
 
        cloneObj(); 
        cloneShip();
        actualTime = now;
    }
    
    direction.y = Number( moveForward ) - Number( moveBackward );
    direction.z = Number( moveLeft ) - Number( moveRight );
    direction.normalize(); // this ensures consistent movements in all directions
    if ( moveForward || moveBackward ) velocity.y += direction.y *0.005* delta;
    if ( moveLeft || moveRight ) velocity.z += direction.z *0.005* delta;
    
    controls.getObject().translateY( velocity.y * delta );
    controls.getObject().translateZ( velocity.z * delta );

    velocity.y = 0;
    velocity.z = 0;

    for(building_i of buildings){

        building_i.position.x += 3;
        
        if (building_i.position.x >=300){

            scene.remove(building_i)

        }
    }
    
}

function run()
{
    requestAnimationFrame(function() { run(); });
    
        // Render the scene
        renderer.render( scene, camera );

        // Update the animations
        KF.update();
    
        floorAnimator.start();
        animate();

        // Update the camera controller
        //orbitControls.update();
}

function cloneObj(){

    var newBuilding = building.clone();

    zPos = Math.floor(Math.random() * 200) - 100  

    newBuilding.position.z = zPos;
    newBuilding.position.x = -400;
    newBuilding.position.y = 0;

    scene.add(newBuilding);
    buildings.push(newBuilding);

}

function cloneShip(){

    var newShip = enemyShip.clone();

    zPos = Math.floor(Math.random() * 200) - 100  
    yPos = Math.floor(Math.random() * 50) + 50  

    newShip.position.z = zPos;
    newShip.position.x = -400;
    newShip.position.y = yPos;

    scene.add(newShip);
    buildings.push(newShip);

}

function loadObj()
{

    if(!mtlLoader)

        mtlLoader = new THREE.MTLLoader();

    mtlLoader.load(
        'models/falcon/millenium-falcon.mtl',
        
        function(materials){

            materials.preload();

            if(!objLoader)

                objLoader = new THREE.OBJLoader();

                objLoader.setMaterials(materials)

            objLoader.load(
                'models/falcon/millenium-falcon.obj',

                function(object)
                {
                    var texture = new THREE.TextureLoader().load('models/falcon/falcon.jpg');
                    //var normalMap = new THREE.TextureLoader().load('Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_TerraCotta_g001c.jpg');       
                    object.traverse( function ( child ) 
                    {
                        if ( child instanceof THREE.Mesh ) 
                        {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            child.material.map = texture;
                            //child.material.normalMap = normalMap;
                        }
                    } );
                            
                    ship = object;
                    ship.scale.set(0.03,0.03,0.03);
                    ship.position.z = 0;
                    ship.position.x = 350;
                    ship.position.y = 50;
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
    )
    
}

function loadBuilding(){


    if(!mtlLoader)

        mtlLoader = new THREE.MTLLoader();

    mtlLoader.load(
        'models/building2/Building.mtl',
        
        function(materials){

            materials.preload();

            if(!objLoader)

                objLoader = new THREE.OBJLoader();

                objLoader.setMaterials(materials)

            objLoader.load(
                'models/building2/Building.obj',

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
                            
                    building = object;
                    building.scale.set(0.5,0.5,0.5);
                    building.position.z = 0;
                    building.position.x = -250;
                    building.position.y = -150;
                    building.rotation.y = Math.PI;
                    
                    //scene.add(building);
                },
                function ( xhr ) {

                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

                    building_loaded = ( xhr.loaded / xhr.total * 100 )
            
                },
                // called when loading has errors
                function ( error ) {
            
                    console.log( 'An error happened' );
            
                });
        } 
    )

    var buildingBBox = new THREE.BoxHelper(building, 0x00ff00)
    buildingBBox.update();
    buildingBBox.visible = true;

    var buildingCollider = new THREE.Box3().setFromObject(buildingBBox);

}

function loadEnemyShip(){

    console.log("Loading enemy")

        // if(!mtlLoader)

        //     mtlLoader = new THREE.MTLLoader();

        // mtlLoader.load(
        //     'nodels/Tie_Fighter/Tie_Fighter.mtl',
            
        //     function(materials){

        //         materials.preload();

            if(!objLoader)

                objLoader = new THREE.OBJLoader();

                //objLoader.setMaterials(materials)

            objLoader.load(
                'models/Tie_Fighter/Tie_Fighter.obj',

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
                            
                    enemyShip = object;
                    enemyShip.scale.set(1,1,1);
                    enemyShip.position.z = 0;
                    enemyShip.position.x = 300;
                    enemyShip.position.y = 50;
                    enemyShip.rotation.y = Math.PI/2;
                    
                    //scene.add(enemyShip);
                },
                function ( xhr ) {

                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

                    building_loaded = ( xhr.loaded / xhr.total * 100 )
            
                },
                // called when loading has errors
                function ( error ) {
            
                    console.log( 'An error happened' );
            
                });
        //})
}

function createScene(canvas) 
{
    
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(window.innerWidth -20, window.innerHeight -20);
    // Turn on shadows
    renderer.shadowMap.enabled = true;
    // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(400,50,0);
    camera.lookAt(new THREE.Vector3(0,50,0))
    scene.add(camera);

    //orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    
    // Create a group to hold all the objects
    root = new THREE.Object3D;
    
    // Add a directional light to show off the object
    directionalLight = new THREE.DirectionalLight( 0xffffff, 1);
    //directionalLight.castShadow = true;
    directionalLight.position.set(0, 50, 300);
    root.add(directionalLight);

    // Point light
    var pointLight = new THREE.PointLight (0xffffff, 0.5, 10000);
    pointLight.position.set(350, 350, 300);
    pointLight.castShadow = true;

    //pointLight.shadow.camera.near = 0;
    pointLight.shadow.camera.far = 4000;
    // pointLight.shadow.camera.fov = 10;
    
    scene.add(pointLight);

    // Create and add all the lights
    

    ambientLight = new THREE.AmbientLight ( 0x888888 );
    root.add(ambientLight);
    
    // Create a group to hold the objects
    group = new THREE.Object3D;
    root.add(group);

    // Create grass texture map
    var map = new THREE.TextureLoader().load("images/deathstar.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(10,10);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(800, 1500, 50, 50);
    floor = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));
    floor.rotation.x = -Math.PI / 2;

    // Add the mesh to our group
    root.add( floor );
    floor.castShadow = false;
    floor.receiveShadow = true;

    // Now add the group to our scene
    scene.add( root );

    // Load ship
    loadObj();

    loadBuilding();

    loadEnemyShip();

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

    // Sky Box

	var imagePrefix = "images/skybox/";
    //var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
    var directions  = ["image1", "image2", "image3", "image4", "image5", "image6"];
	var imageSuffix = ".jpeg";
	var skyGeometry = new THREE.CubeGeometry( 1500, 1500, 1500 );	
	
	var materialArray = [];
	for (var i = 0; i < 6; i++)
		materialArray.push( new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
			side: THREE.BackSide
		}));
	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
	scene.add( skyBox );

}

function onWindowResize() 
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}


function playAnimations()
{

    if (animateFloor)
    {
        floorAnimator = new KF.KeyFrameAnimator;
        floorAnimator.init({ 
            interps:
                [
                    { 
                        keys:[0, 1], 
                        values:[
                                { x : 0, y : 0 },
                                { x : -3, y : 0 },
                                ],
                        target:floor.material.map.offset
                    },
                ],
            loop: loopAnimation,
            duration:duration,
        });
        //floorAnimator.start();
    }
}

