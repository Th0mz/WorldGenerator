let mapSize = 80;
let tileSize;

let island = true;

let playerPosX;
let playerPosY;
let playerSpeed;
let playerSpeedDirX = 0;
let playerSpeedDirY = 0;
let smoothness = 0.04;


let deepWater;
let water;
let lowWater; 
let sand;
let smallGrass;
let grass;
let jungle;
let mountains; 

var colors = [];
var heights;


function setup() {
  createCanvas(800, 800);
  
  tileSize = width / mapSize;

  playerSpeed = smoothness;
  playerPosX = random(10000);
  playerPosY = random(10000);
  

  /*
  deepWater = color(0, 105, 148); colors.push(deepWater);
  water = color(17, 128, 173); colors.push(water);
  lowWater = color(67, 165, 204); colors.push(lowWater);
  sand = color(180, 184, 106); colors.push(sand);
  smallGrass = color(149, 176, 74); colors.push(smallGrass);
  grass = color(99, 133, 28); colors.push(grass);
  jungle = color(77, 107, 15); colors.push(jungle);
  mountains = color(56, 82, 2); colors.push(mountains);  

  heights = [0.1, 0.25, 0.4, 0.45, 0.5, 0.65, 0.75, 1];
  */

  processJSON("tiles.json");
  noStroke();

}

function processJSON(filename) {
  let jsonFile = loadJSON(filename);
  print(jsonFile."tiles");
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
  let islandSize = 4;
  
  if (distance <= width/islandSize) {
    return 0;
  } else if (distance <= width/2){
    return map(distance, width/islandSize, width/2, 0, 0.5);
  } else {
    return 1;
  }
}



