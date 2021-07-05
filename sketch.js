/* Settings */
let mapSize = 80;
let island = true;
let islandSize = 4;
let playerSpeed = "DEFAULT";


let tileSize;

/* Player info */
let playerPosX;
let playerPosY;

let playerSpeedDirX = 0;
let playerSpeedDirY = 0;

/* World Generation */
let smoothness = 0.04; 

/* Tiles info */
var colors = [];
var heights = [];

var jsonFile;

function preload() {
  jsonFile = loadJSON("tiles.json");
}

/* Load json data into the tiles structure */
function loadData() {
  let tiles = jsonFile['tiles'];
  for (let i = 0; i < tiles.length; i++) {
    let tile = tiles[i];
    
    let tileColor = color(tile['rgb'][0], tile['rgb'][1], tile['rgb'][2]);
    colors.push(tileColor);
    heights.push(tile['maxHeight'])
  }
}

function setup() {
  createCanvas(800, 800);
  
  tileSize = width / mapSize;

  if (playerSpeed == "DEFAULT") {
    playerSpeed = smoothness;
  }

  playerPosX = random(10000);
  playerPosY = random(10000);

  loadData();
  noStroke();

}

function draw() {
  for (let y = 0; y < mapSize; y++) {
    for (let x = 0; x < mapSize; x++) {

      let gradient = 0;
      if (island) {
        gradient = islandGradient(x * tileSize, y * tileSize);
      }

      let tile = noise((x * smoothness) + playerPosX, (y * smoothness) + playerPosY) - gradient;
      
      /* With the tile (height 0 -> 1 value) determine which tile type it is */
      let foundTileType = false;
      let i = 0;

      while (!foundTileType) {
        if (tile < heights[i]) {
          fill(colors[i]);
          foundTileType = true;
        }

        i++;
      }

      /* Draw the tile */
      rect(x * tileSize, y * tileSize, tileSize, tileSize); 
    }
  }

  playerPosX += playerSpeedDirX * playerSpeed;
  playerPosY += playerSpeedDirY * playerSpeed;

}

/* Move controls to non island mode */
function keyPressed() {
  if (!island) {
    if (keyCode === LEFT_ARROW) {
      playerSpeedDirX = -1;
    } else if (keyCode === RIGHT_ARROW) {
      playerSpeedDirX = 1;
    }
    
    if (keyCode === UP_ARROW) {
      playerSpeedDirY = -1;
    } else if (keyCode === DOWN_ARROW) {
      playerSpeedDirY = 1;
    }
  }
}

function keyReleased() {
  if(!island) {
    if (keyCode === LEFT_ARROW) {
      playerSpeedDirX = 0;
    }
    
    if (keyCode === RIGHT_ARROW) {
      playerSpeedDirX = 0;
    }
    
    if (keyCode === UP_ARROW) {
      playerSpeedDirY = 0;
    }
    
    if (keyCode === DOWN_ARROW) {
      playerSpeedDirY = 0;
    }
  }
}

/* Gradient function to generate a island from the infinite world seed
   The gradient can have values between 0 and 1, meaning:
      -> 0: The tile stays with the same type
      -> 1: The tile becomes water
      -> Any other value between 0 and 1 reduces the tile "height" therefor 
         changing the tile type. The higher this value is the biggest change
         in type we see 
*/
function islandGradient(x, y) {
  let distance = dist(x, y, width/2, height/2);
  
  if (distance <= width/islandSize) {
    return 0;
  } else if (distance <= width/2){
    return map(distance, width/islandSize, width/2, 0, 0.5);
  } else {
    return 1;
  }
}



