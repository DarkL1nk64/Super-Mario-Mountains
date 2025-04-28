const canvas = document.getElementById("gamelmao");
canvas.width = 1152;
canvas.height = 624;
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;

const devmode = true;
const devOpt = { showColl: true };
let performOpt = { shadows: false };
let options = {seeMap: false};

let tileset = {};
let mouseX = 0;
let mouseY = 0;

let sprSize = 48;

let selectorX = 0;
let selectorY = 0;

let selecBlock = 73;

let camX = 0;
let camY = 0;

let mapList = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 72, 72, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 72, 72, 72, 72],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 77, 77, 77, 77],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 77, 77, 77, 77],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 154, 77, 77],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 170, 77, 77],
  [0, 0, 0, 0, 0, 0, 0, 0, 74, 0, 0, 0, 71, 22, 21, 22, 22, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 28, 0, 2, 62, 18, 19, 19, 3],
  [0, 0, 0, 0, 0, 0, 0, 0, 28, 0, 30, 0, 2, 62, 62, 17, 62, 3],
  [0, 0, 0, 0, 0, 0, 28, 0, 30, 0, 0, 0, 2, 19, 18, 17, 17, 3],
  [22, 22, 22, 22, 1, 0, 30, 0, 0, 0, 0, 0, 2, 62, 17, 18, 18, 3],
  [62, 62, 62, 62, 3, 0, 0, 0, 0, 0, 0, 0, 2, 62, 18, 62, 17, 6]
];

tileset["overworld"] = new Image();
tileset["overworld"].src = "assets/overworld.png";

// Ensure gameLoop starts only after image loads
tileset["overworld"].onload = () => {
  gameLoop();
};

document.addEventListener('click', () => {
	//if (mapList[selectorY][selectorX]) {
		mapList[selectorY][selectorX] = selecBlock;
		console.log(`Block placed: ${selecBlock}`);
	//}
});

document.addEventListener("mousemove", function (event) {
  mouseX = event.clientX - 8;
  mouseY = event.clientY - 8;
});

const keys={};
const keyPr={};

document.addEventListener("keydown", function(event) {
	keys[event.key]=true;
	keyPr[event.key]=undefined;
	if (devOpt.consolePress){
		console.log(event.key);
	}
});

document.addEventListener("keyup", function(event) {
	keys[event.key]=false;
});

// Function to export mapList to a .txt file
function exportMapList() {
  // Convert mapList array into a string
  const mapData = mapList.map(row => row.join(",")).join("\n");
  
  // Create a Blob object
  const blob = new Blob([mapData], { type: "text/plain" });
  
  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);
  
  // Create a link element
  const a = document.createElement("a");
  a.href = url;
  a.download = "mapList.txt";
  
  // Programmatically click the link to trigger the download
  a.click();
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
}

// Example: Add an export button
const exportButton = document.createElement("button");
exportButton.textContent = "Export MapList";
exportButton.onclick = exportMapList;
document.body.appendChild(exportButton);

// Function to import and parse the mapList file
function importMapList(event) {
  const file = event.target.files[0]; // Get the uploaded file
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const content = e.target.result; // Read file content
    
    // Convert the file content into a 2D array
    const rows = content.trim().split("\n");
    mapList = rows.map(row => row.split(",").map(Number));

    console.log("MapList imported successfully!");
    console.log(mapList);
  };

  reader.readAsText(file); // Read the file as text
}

// Create an upload input element
const uploadInput = document.createElement("input");
uploadInput.type = "file";
uploadInput.accept = ".txt"; // Restrict to .txt files
uploadInput.onchange = importMapList;
document.body.appendChild(uploadInput);

function loadMapListFromFile(filePath) {
  fetch(filePath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }
      return response.text(); // Read file content as text
    })
    .then(content => {
      // Parse the content into a 2D array
      const rows = content.trim().split("\n");
      mapList = rows.map(row => row.split(",").map(Number));

      console.log("MapList loaded successfully!");
      console.log(mapList);
    })
    .catch(error => {
      console.error("Error loading mapList file:", error);
    });
}

// Call the function during game initialization
loadMapListFromFile("data/montains_mon/level.txt");


// MAIN FUNCTIONS --------------------------------------------------

let lastTime = performance.now();
let fps = 0;

function gameLoop() {
  const currentTime = performance.now();
  let deltaTime = currentTime - lastTime;
  lastTime = currentTime;

  fps = Math.round(1000 / deltaTime);

  _update(deltaTime);
  _draw();

  if (!performOpt.speedMode) {
    requestAnimationFrame(gameLoop);
  }
}

function _update(deltaTime) {
	if (mouseX>0 && mouseY>0 && mouseX<canvas.width && mouseY<canvas.height) {
		selectorX = Math.floor((mouseX)/(sprSize));
		selectorY = Math.floor((mouseY)/(sprSize));
	}
	
	if (keys["d"]) {
		if (keyPr["d"]!=true) {
			camX += sprSize;
		}
		keyPr["d"]=true;
	} else {
		keyPr["d"]=false
	}
	
	if (keys["a"]) {
		camX -= sprSize;
	}
	
	if (options.seeMap) {
		camX+=0.5;
	}
}

function _draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for (let y = 0; y < mapList.length; y++) {
		for (let i = 0; i < mapList[y].length; i++) {
			let tile = mapList[y][i];
			let imgX = tile % 16; // Compute horizontal frame
			let imgY = Math.floor(tile / 16); // Compute vertical frame
			ctx.drawImage(tileset["overworld"],imgX * 16,imgY * 16,16, 16,i * sprSize-camX,y * sprSize-camY,sprSize, sprSize);
		}
	}
  
	ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
	ctx.fillRect(selectorX*sprSize, selectorY*sprSize, sprSize, sprSize);
	ctx.fillStyle = "black";

	// Draw Mouse Coordinates
	ctx.fillText(`Mouse X: ${mouseX} Mouse Y: ${mouseY}`, 0, 20);
	ctx.fillText(`Selector X: ${selectorX} Selector Y: ${selectorY}`, 0, 40);
	ctx.fillText(`Cam X: ${camX} Cam Y: ${camY}`, 0, 60);
	ctx.fillText(keys["d"], 0, 80);
	ctx.fillText(keys["a"], 0, 100);
}

// Only start the gameLoop once image is fully loaded
tileset["overworld"].onload();
