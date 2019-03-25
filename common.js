//
// Game singleton
//

var Game = {};
var objLoader;
var g

Game.loadObj = function ()
{
    if(!objLoader)
        objLoader = new THREE.OBJLoader();
    
    objLoader.load(
        'models/millenium-falcon.obj',

        function(object)
        {
            //var texture = new THREE.TextureLoader().load('Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_g005c.jpg');
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
            ship.scale.set(3,3,3);
            ship.position.z = 0;
            ship.position.x = 0;
            ship.rotation.y = Math.PI /2;
            
            this.scene.add(ship);
        },
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    
        },
        // called when loading has errors
        function ( error ) {
    
            console.log( 'An error happened' );
    
        });
}

Game.run = function () {
    var WIDTH = window.innerWidth -60;
    var HEIGHT = window.innerHeight-30;

    this._previousElapsed = 0;

    // setup a WebGL renderer within an existing canvas
    var canvas = document.getElementById('demo');
    this.renderer = new THREE.WebGLRenderer({canvas: canvas});
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    this.renderer.setViewport(0, 0, WIDTH, HEIGHT);

    // create the scene
    this.scene = new THREE.Scene();

    // Light
    ambientLight = new THREE.AmbientLight ( 0x888888 );
    this.scene.add(ambientLight);


    // Add  a camera so we can view the scene
    this.camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    this.camera.position.set(0,50,0);
    this.camera.lookAt(new THREE.Vector3(25,0,0))

    console.log(this.camera.position)

    var color = 0xffffff;

    var map = new THREE.TextureLoader().load("images/grass.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(5,5);

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.x = 0;
    mesh.position.y = 0;
    mesh.position.z = 0;

    this.scene.add(mesh)

    // Create the cube geometry
    var geometry = new THREE.CubeGeometry(2, 2, 2);

    cube = new THREE.Mesh(geometry);

    // Move the mesh back from the camera and tilt it toward the viewer
    cube.position.x = 0;
    cube.position.y = 0;
    cube.position.z = 0;

    this.scene.add(cube)

    console.log(mesh.position)

    //this.loadObj();

    // start up game
    this.init();
    window.requestAnimationFrame(this.tick);
};

Game.tick = function (elapsed) {
    window.requestAnimationFrame(this.tick);

    // compute delta time in seconds -- also cap it
    var delta = (elapsed - this._previousElapsed) / 1000.0;
    delta = Math.min(delta, 0.25); // maximum delta of 250 ms
    this._previousElapsed = elapsed;

    this.update(delta);
    this.renderer.render(this.scene, this.camera);
}.bind(Game);

// collection of materials used in the demos
Game.materials = {
    shadow: new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.5
    }),
    solid: new THREE.MeshNormalMaterial({}),
    colliding: new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.5
    }),
    dot: new THREE.MeshBasicMaterial({
        color: 0x0000ff
    })
};

// override these methods to create the demo
Game.init = function () {};
Game.update = function (delta) {};
Game.toggleDebug = function () {};

//
// Utils
//

var Utils =  {};
/*
Utils.createShadow = function (mesh, material) {
    var params = mesh.geometry.parameters;
    mesh.geometry.computeBoundingSphere();
    var geo = mesh.geometry.type === 'BoxGeometry'
        ? new THREE.PlaneGeometry(params.width, params.depth)
        : new THREE.CircleGeometry(mesh.geometry.boundingSphere.radius, 24);

    var shadow = new THREE.Mesh(geo, material);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.x = mesh.position.x;
    shadow.position.z = mesh.position.z;

    return shadow;
};

Utils.updateShadow = function (shadow, target) {
    shadow.position.x = target.position.x;
    shadow.position.z = target.position.z;
    shadow.visible = target.position.y >= 0;

    shadow.scale.x = target.scale.x;
    shadow.scale.y = target.scale.z;
};*/


//
// main
//

window.onload = function () {
    Game.run();
};
