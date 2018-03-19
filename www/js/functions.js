/*
  #################################################################
  #                     READ HEIGHTMAPS                           #
  #################################################################
*/

function getHeightData(img) {
    var canvas = document.createElement( 'canvas' );
    canvas.width = 128;
    canvas.height = 128;
    var context = canvas.getContext( '2d' );

    var size = 128 * 128, data = new Float32Array( size );

    context.drawImage(img,0,0);

    for ( var i = 0; i < size; i ++ ) {
        data[i] = 0
    }

    var imgd = context.getImageData(0, 0, 128, 128);
    var pix = imgd.data;

    var j=0;
    for (var i = 0, n = pix.length; i < n; i += (4)) {
        var all = pix[i]+pix[i+1]+pix[i+2];
        data[j++] = all/30;
    }

    return data;
}

/*function getHeightData (img, scale){
  if (scale == undefined){
    scale = 1;
  }
  var canvas = document.createElement( 'canvas' );
  canvas.width = img.width;
  canvas.height = img.height;
  var context = canvas.getContext( '2d' );

  var size = img.width * img.height;
  var data = new Float32Array ( size );

  context.drawImage( img, 0, 0 );

  for (var i = 0; i < size; i++){
    data[i] = 0;
  }

  var imgd = context.getImageData(0, 0, img.width, img.height);
  var pix = imgd.data;

  var j = 0;
  for(var i = 0; i < pix.lenght; i += 4){
    var all = pix[i] + pix[i+1] + pix[i+2];
    data[j++] = all/(12 * scale);
  }
  return data;
}*/

/*
  #################################################################
  #                         TEXTURE                               #
  #################################################################
*/
function newTexture(texturePath, activeWrap, repX, repY){
  var newText = new THREE.TextureLoader().load( texturePath );
  if(activeWrap == 1){
    newText.wrapS = THREE.RepeatWrapping;
    newText.wrapT = THREE.RepeatWrapping;
    newText.repeat.set( repX, repY );
  }
  return newText;
}
/*
  #################################################################
  #               NEW OBJECT WITHOUT AUTO TEXTURE                 #
  #################################################################
*/
function newObjMeshNoAutoText (dimX, dimY, dimZ, texture){
  var newObjGeo = new THREE.BoxBufferGeometry(dimX, dimY, dimZ);
  var newObjMat = new THREE.MeshBasicMaterial( { map: texture } );
  var newMesh = new THREE.Mesh( newObjGeo, newObjMat );
  return newMesh;
}
/*
  #################################################################
  #                  NEW OBJECT TEXTURE                           #
  #################################################################
*/
function newObjMeshWithAutoText (dimX, dimY, dimZ, texturePath, activeWrap, repX, repY){
  var newText = new THREE.TextureLoader().load( texturePath );
  if(activeWrap == 1){
    newText.wrapS = THREE.RepeatWrapping;
    newText.wrapT = THREE.RepeatWrapping;
    newText.repeat.set( repX, repY );
  }
  var newObjGeo = new THREE.BoxBufferGeometry(dimX, dimY, dimZ);
  var newObjMat = new THREE.MeshBasicMaterial( { map: newText } );
  var newMesh = new THREE.Mesh( newObjGeo, newObjMat );
  return newMesh;
}

/*
  #################################################################
  #                           JSON MESH                           #
  #################################################################
*/
function newJsonMesh(filePath, meshName, scale, x, y, z, rotationNeeded, rotationy){
  new THREE.ObjectLoader().load( filePath, function ( meshName ) {

      meshName.scale.set(scale,scale,scale);
      meshName.position.x = x;
      meshName.position.y = y;
      meshName.position.z = z;
      if( rotationNeeded == 1 ){
        meshName.rotation.y = (Math.PI)/rotationy;
      }

    scene.add( meshName );
    console.log(filePath + " a bien été chargé");

  } );
}


function jsonLoaderMesh(filePath, meshName, scale, x, y, z, rotationNeeded, rotationy, nbMat, displayed){
  if(displayed == "yes"){
    var loader = new THREE.JSONLoader();

    // load a resource
    loader.load(
    	// resource URL
    	filePath,

    	// onLoad callback
    	function ( geometry, material ) {
        for(i = 0; i < nbMat; i++){
          material[i].morphTargets = true;
        }
        var materials = new THREE.MeshFaceMaterial(material);
    		var meshName = new THREE.Mesh( geometry, material );
        meshName.scale.set(scale,scale,scale);
        meshName.position.x = x;
        meshName.position.y = y;
        meshName.position.z = z;
        meshName.castShadow = true;
        if( rotationNeeded == 1 ){
          meshName.rotation.y = (Math.PI)/rotationy;
        }
    		scene.add( meshName );
        console.log(filePath + " est chargé.")
    	},

    	// onProgress callback
    	function ( xhr ) {
    		console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
    	},

    	// onError callback
    	function( err ) {
    		console.log( 'An error happened' );
    	}
    );
  } else if (displayed == "no"){
    console.log("L'objet est désactivé")
  }
}
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function createForest(){
  var xa = -5000;
  var ya = -20;
  var za = 0;
  for(i = 0; i < 6; i++){
    for(j = 0; j < 13; j++){
      jsonLoaderMesh('object/tree1/tree1.json', newJsonMesh, 100, xa, ya, za, 0, 0, 2, "yes");
      za += getRandomInt(200);
    }
    xa += 200;
    za = 0;
  }

  console.log("Forêt créée");
}

function  createWallLeft(){
  var newJsonMesh;
  var xa = -2500;
  var ya = -20;
  var za = 0;
  for(i = 0; i < 15; i++){
    jsonLoaderMesh('object/brokenWall/brokenWall.json', newJsonMesh, 20, xa, ya, za, 0, 0, 2, "yes");
    za -= 249;
  }
}

function  createWallRight(){
  var newJsonMesh;
  var xa = -2500;
  var ya = -20;
  var za = 2000;
  for(i = 0; i < 10; i++){
    jsonLoaderMesh('object/brokenWall/brokenWall.json', newJsonMesh, 20, xa, ya, za, 0, 0, 2, "yes");
    za += 249;
  }
}
///////
function ghettoCreationRight(x, y ,z, orientation){
  var newJsonMesh;
  var name;
  var nbMat;
  for(i = 0; i < 20; i++){
    rand = getRandomInt(2);
    if (rand == 1){
      name = 'object/burnedHouse/burnedHouse.json';
      nbMat = 6;
    }
    else{
      name = 'object/brokenHouse/brokenHouse.json';
      nbMat = 13;
    }
    jsonLoaderMesh(name, newJsonMesh, 20, x, y, z, 1, orientation, nbMat, "yes");
    z += 249;
  }
}

function ghettoCreationLeft(x, y ,z, orientation){
  var newJsonMesh;
  var name;
  var nbMat;
  for(i = 0; i < 20; i++){
    rand = getRandomInt(2);
    if (rand == 1){
      name = 'object/burnedHouse/burnedHouse.json';
      nbMat = 6;
    }
    else{
      name = 'object/brokenHouse/brokenHouse.json';
      nbMat = 13;
    }
    jsonLoaderMesh('object/burnedHouse/burnedHouse.json', newJsonMesh, 20, x, y, z, 1, orientation, nbMat, "yes");
    z -= 249;
  }
}
