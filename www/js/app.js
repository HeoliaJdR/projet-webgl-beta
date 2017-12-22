if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var container, stats;
var camera, scene, renderer;
var characters = [];
var nCharacters = 0;
var baseCharacter;
var cameraControls;
var controls = {
  moveForward: false,
  moveBackward: false,
  moveLeft: false,
  moveRight: false
};
var clock = new THREE.Clock();
var t = 0;
init();
animate();
function init() {
  container = document.createElement( 'div' );
  document.body.appendChild( container );
  // CAMERA
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 6000 );
  camera.position.set( 0, 40, -100 );
  // SCENE
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xffffff );
  //scene.fog = new THREE.Fog( 0xffffff, 1000, 4000 );
  scene.add( camera );
  // LIGHTS

  scene.add( new THREE.AmbientLight( 0x222222 ) );
  var light = new THREE.DirectionalLight( 0xffffff, 2.25 );
  light.position.set( 200, 450, 500 );
  light.castShadow = true;
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 512;
  light.shadow.camera.near = 100;
  light.shadow.camera.far = 1200;
  light.shadow.camera.left = -1000;
  light.shadow.camera.right = 1000;
  light.shadow.camera.top = 350;
  light.shadow.camera.bottom = -350;
  scene.add( light );

  var sphere = new THREE.SphereGeometry( 320, 32, 32 );
      sun = new THREE.PointLight( 0xffffff, 3, 10000 );
      sun.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) );
      sun.position.set(0,0,0);
      sun.castShadow = true;
      scene.add( sun );
  // scene.add( new THREE.CameraHelper( light.shadow.camera ) );
  //  GROUND
  var gt = new THREE.TextureLoader().load( "textures/duskwallowmoss.png" );
  var gg = new THREE.PlaneBufferGeometry( 16000, 16000 );
  var gm = new THREE.MeshPhongMaterial( { color: 0xffffff, map: gt } );
  var ground = new THREE.Mesh( gg, gm );
  ground.rotation.x = - Math.PI / 2;
  ground.material.map.repeat.set( 64, 64 );
  ground.material.map.wrapS = THREE.RepeatWrapping;
  ground.material.map.wrapT = THREE.RepeatWrapping;
  // note that because the ground does not cast a shadow, .castShadow is left false
  ground.receiveShadow = true;
  scene.add( ground );
  //SOUND
  var listener = new THREE.AudioListener();
      camera.add( listener );

      var sound = new THREE.Audio( listener );

       // load a sound and set it as the Audio object's buffer
      var audioLoader = new THREE.AudioLoader();
      audioLoader.load( 'sound/dayforest01.mp3', function( buffer ) {
          sound.setBuffer( buffer );
          sound.setLoop( true );
          sound.setVolume( 0.1 );
          sound.play();
      });
  //OBJECTS
  addSky2();
    //addPOKEMON();
      //addSword();
      addStele();

      //addHouse();
      addHouse2();
      //addTownHall();
  // RENDERER
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
  container.appendChild( renderer.domElement );
  //
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // STATS
  stats = new Stats();
  container.appendChild( stats.dom );
  // EVENTS
  window.addEventListener( 'resize', onWindowResize, false );
  document.addEventListener( 'keydown', onKeyDown, false );
  document.addEventListener( 'keyup', onKeyUp, false );
  // CONTROLS
  cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
  cameraControls.target.set( 0, 40, 0 );
  cameraControls.update();
  // CHARACTER
  var configOgro = {
    baseUrl: "object/ogro/",
    body: "ogro.md2",
    skins: [ "grok.jpg", "ogrobase.png", "arboshak.png", "ctf_r.png", "ctf_b.png", "darkam.png", "freedom.png",
         "gib.png", "gordogh.png", "igdosh.png", "khorne.png", "nabogro.png",
         "sharokh.png" ],
    weapons:  [ [ "weapon.md2", "weapon.jpg" ] ],
    animations: {
      move: "run",
      idle: "stand",
      jump: "jump",
      attack: "attack",
      crouchMove: "cwalk",
      crouchIdle: "cstand",
      crouchAttach: "crattack"
    },
    walkSpeed: 350,
    crouchSpeed: 175
  };
  /*
  var nRows = 1;
  var nSkins = configOgro.skins.length;
  nCharacters = 1;
  for ( var i = 0; i < nCharacters; i ++ ) {
    var character = new THREE.MD2CharacterComplex();
    character.scale = 3;
    character.controls = controls;
    characters.push( character );
  }
  var baseCharacter = new THREE.MD2CharacterComplex();
  baseCharacter.scale = 3;
  baseCharacter.onLoadComplete = function () {
    var k = 0;
    for ( var j = 0; j < nRows; j ++ ) {
      for ( var i = 0; i < nSkins; i ++ ) {
        var cloneCharacter = characters[ k ];
        cloneCharacter.shareParts( baseCharacter );
        // cast and receive shadows
        cloneCharacter.enableShadows( true );
        cloneCharacter.setWeapon( 0 );
        cloneCharacter.setSkin( i );
        cloneCharacter.root.position.x = ( i - nSkins/2 ) * 150;
        cloneCharacter.root.position.z = j * 250;
        scene.add( cloneCharacter.root );
        k ++;
      }
    }
    var gyro = new THREE.Gyroscope();
    gyro.add( camera );
    gyro.add( light, light.target );
    characters[ Math.floor( nSkins / 2 ) ].root.add( gyro );
  };
  baseCharacter.loadParts( configOgro );
  */
  baseCharacter = new THREE.MD2CharacterComplex();
  //baseCharacter.scale = 3;
  baseCharacter.controls = controls;
  baseCharacter.onLoadComplete = function () {

        //var cloneCharacter = characters[ k ];
        //cloneCharacter.shareParts( baseCharacter );
        // cast and receive shadows
        baseCharacter.enableShadows( true );
        baseCharacter.setWeapon( 0 );
        baseCharacter.setSkin( 4 );
        baseCharacter.root.position.x = 0;
        baseCharacter.root.position.z = 0;
        scene.add( baseCharacter.root );


    var gyro = new THREE.Gyroscope();
    gyro.add( camera );
    gyro.add( light, light.target );
    baseCharacter.root.add( gyro );
  };
  baseCharacter.loadParts( configOgro );
}
// EVENT HANDLERS
function onWindowResize( event ) {
  SCREEN_WIDTH = window.innerWidth;
  SCREEN_HEIGHT = window.innerHeight;
  renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
  camera.aspect = SCREEN_WIDTH/ SCREEN_HEIGHT;
  camera.updateProjectionMatrix();
}
function onKeyDown ( event ) {
  event.stopPropagation();
  switch( event.keyCode ) {
    case 38: /*up*/
    case 87: /*W*/ 	controls.moveForward = true; break;
    case 40: /*down*/
    case 83: /*S*/ 	 controls.moveBackward = true; break;
    case 37: /*left*/
    case 65: /*A*/   controls.moveLeft = true; break;
    case 39: /*right*/
    case 68: /*D*/    controls.moveRight = true; break;
    //case 67: /*C*/     controls.crouch = true; break;
    //case 32: /*space*/ controls.jump = true; break;
    //case 17: /*ctrl*/  controls.attack = true; break;
  }
}
function onKeyUp ( event ) {
  event.stopPropagation();
  switch( event.keyCode ) {
    case 38: /*up*/
    case 87: /*W*/ controls.moveForward = false; break;
    case 40: /*down*/
    case 83: /*S*/ 	 controls.moveBackward = false; break;
    case 37: /*left*/
    case 65: /*A*/ 	 controls.moveLeft = false; break;
    case 39: /*right*/
    case 68: /*D*/ 	  controls.moveRight = false; break;
    //case 67: /*C*/     controls.crouch = false; break;
    //case 32: /*space*/ controls.jump = false; break;
    //case 17: /*ctrl*/  controls.attack = false; break;
  }
}
//
function animate() {
  t += 0.001;
  sun.position.x = 4000*Math.cos(t) + 0;
      sun.position.y = 4000*Math.sin(t) + 0;
  requestAnimationFrame( animate );
  render();
  stats.update();
}
function render() {
  var delta = clock.getDelta();
  baseCharacter.update( delta );
  renderer.render( scene, camera );
}


function addSky(){
  var skyGeometry = new THREE.SphereGeometry( 10000, 32, 32 );
  var skyMaterial = new createSkyMaterial();
  var sky = new THREE.Mesh( skyGeometry, skyMaterial );
  skyMaterial.side = THREE.DoubleSide
  sky.castShadow = true;
  sky.receiveShadow = true;

  sky.position.x = 0;
  sky.position.y = 0;
  sky.position.x = 0;


  scene.add( sky );
}

function addSky2(){
  var skyGeometry = new THREE.SphereGeometry( 5000, 32, 32 );
  var skyMaterial = new createSkyMaterial();
  var sky = new THREE.Mesh( skyGeometry, skyMaterial );
  skyMaterial.side = THREE.DoubleSide
  sky.castShadow = true;
  sky.receiveShadow = true;

  sky.position.x = 0;
  sky.position.y = 0;
  sky.position.x = 0;


  scene.add( sky );
}

function createSkyMaterial(){

  var skyTexture = THREE.ImageUtils.loadTexture("textures/skyc.jpg");
  var skyMaterial = new THREE.MeshBasicMaterial();
  skyMaterial.map = skyTexture;

  return skyMaterial
}

 function addStele(){

  new THREE.ObjectLoader().load("object/stele/scene.json",function ( obj ) {

      obj.scale.set(20,20,20);
      obj.position.x = 0;
      obj.position.y = 0;
      obj.position.z = 2000;
      obj.rotation.y = (Math.PI)/2;

      scene.add( obj );
      //ground.push(obj);
  });
}

function addHouse2(){
    new THREE.ObjectLoader().load( "object/farmHouse2/house.json", function ( house ) {

        house.scale.set(20,20,20);
        //house.rotation.y = Math.PI;
        house.position.x = 0;
        house.position.y = 40;
        house.position.z = 0;

      scene.add( house );

} );
  }
