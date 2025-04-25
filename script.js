//marioMaker3?
const canvas = document.getElementById("gamelmao");
canvas.width = 1152;
canvas.height = 624;
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;

const devmode=true;
const devOpt = {showColl: true};
let performOpt = {shadows: false};

let tileset={};

tileset["overworld"]=new Image();
tileset["overworld"].src = "assets/overworld.png";

let mapList = [
	[0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,],
	[0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 72, 72, 0 ],
	[0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 72, 72, 72, 72],
	[0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 77, 77, 77, 77],
	[0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 77, 77, 77, 77],
	[0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,154, 77, 77],
	[0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,170, 77, 77],
	[0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 74, 0 , 0 , 0 , 71, 22, 21, 22, 22, 1],
	[0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 28, 0 , 2 , 62, 18, 19, 19, 3],
	[0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 28, 0 , 30, 0 , 2 , 62, 62, 17, 62, 3],
	[0 , 0 , 0 , 0 , 0 , 0 , 28, 0 , 30, 0 , 0 , 0 , 2 , 19, 18, 17, 17, 3],
	[22, 22, 22, 22, 1 , 0 , 30, 0 , 0 , 0 , 0 , 0 , 2 , 62, 17, 18, 18, 3],
	[62, 62, 62, 62, 3 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 2 , 62, 18, 62, 17 , 6]
];

tileset["overworld"].onload = () => {
	let imgX = 0;
	let imgY = 0;
	let data = mapList;
	for (y=0; y<data.length; y++) {
		for (i=0; i<data[y].length; i++) {
			imgX = 0;
			imgY = 0;
			data = mapList;
			while (data[y][i]>15) {
				imgY+=1;
				data[y][i]-=16;
			}
			imgX=data[y][i];
			console.log(data);
			console.log(imgX);
			console.log(imgY);
			ctx.drawImage(tileset["overworld"], imgX*16, imgY*16, 16, 16, i*48, y*48, 48, 48);
		}
	}
	/* for (i=0; i<16; i++) {
		ctx.drawImage(tileset["overworld"], i*16, 64, 16, 16, i*32, 0, 32, 32);
	} */
}