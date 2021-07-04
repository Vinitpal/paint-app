const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let size = 5;
let color = "white";
let mousePressed = false;
ctx.lineJoin = "round";
ctx.lineCap = "round";
let x, y;

const brush = document.getElementById("brush");
const eraser = document.getElementById("eraser");
const rectangle = document.getElementById("rectangle");
const circle = document.getElementById("circle");
const clear = document.getElementById("clear");
const save = document.getElementById("save");

canvas.addEventListener("mousedown", brushDown);
canvas.addEventListener("mousemove", brushMove);
canvas.addEventListener("mouseup", brushUp);

// todo color + size change

//4. Color change conditions
function colorChange() {
  myColor = color.value;
  ctx.strokeStyle = color;
}

//5. Size change conditions
function sizeChange() {
  mySize = size.value;
  ctx.lineWidth = mySize;
}

function getCoordinates(canvas, e) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

function drawBrush(canvas, x, y) {
  if (mousePressed) {
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

function brushDown(e) {
  mousePressed = true;
  var coordinates = getCoordinates(canvas, e);
  x0 = coordinates.x;
  y0 = coordinates.y;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x0, y0);
  ctx.stroke();
}

function brushMove(e) {
  let coordinates = getCoordinates(canvas, e);
  x1 = coordinates.x;
  y1 = coordinates.y;
  drawBrush(canvas, x1, y1);
}

function brushUp() {
  mousePressed = false;
}

function brushClick() {
  colorChange();
  sizeChange();

  canvas.addEventListener("mousedown", brushDown);
  canvas.addEventListener("mousemove", brushMove);
  canvas.addEventListener("mouseup", brushUp);
}

function eraserClick() {
  ctx.strokeStyle = "transparent";
  sizeChange();

  canvas.addEventListener("mousedown", brushDown, false);
  canvas.addEventListener("mousemove", brushMove, false);
  canvas.addEventListener("mouseup", brushUp, false);
}

brush.addEventListener("click", brushClick);

// let restoreArray = [];
// let restoreIndex = -1;

// // start drawing event
// canvas.addEventListener("mousedown", (e) => {
//   x = e.offsetX;
//   y = e.offsetY;

//   drawCircles(x, y);

//   isPressed = true;
// });

// // stop drawing event
// canvas.addEventListener("mouseup", (e) => {
//   isPressed = false;
//   x = undefined;
//   y = undefined;

//   size = 1;
//   isPressed = false;

//   if (!isPressed) {
//     restoreArray.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
//     restoreIndex++;
//   }
// });

// canvas.addEventListener("mouseout", (e) => {
//   if (!isPressed) {
//     return;
//   }
//   e.preventDefault();
//   e.stopPropagation();
//   isPressed = false;
// });

// // drag drawing event
// canvas.addEventListener("mousemove", (e) => {
//   e.preventDefault();
//   e.stopPropagation();
//   if (isPressed) {
//     const x2 = e.offsetX;
//     const y2 = e.offsetY;

//     const r1 = size;
//     const r2 = size;

//     console.log(x2, y2);

//     ellipse(x2, y2, r1, r2);
//     // drawOval(x, y, x2, y2);
//     // drawCircles(x2, y2);
//     // drawLine(x, y, x2, y2);

//     // x = x2;
//     // y = y2;
//     size++;
//   }
// });

// function drawCircles(x, y) {
//   ctx.beginPath();
//   ctx.arc(x, y, size, 0, Math.PI * 2);
//   ctx.fillStyle = color;
//   ctx.fill();
// }

// function drawLine(x1, y1, x2, y2) {
//   ctx.beginPath();
//   ctx.moveTo(x1, y1);
//   ctx.lineTo(x2, y2);
//   ctx.lineCap = "round";
//   ctx.strokeStyle = color;
//   ctx.lineWidth = size * 2;
//   ctx.stroke();
// }

// function ellipse(x, y, r1, r2) {
//   ctx.beginPath();
//   ctx.ellipse(x, y, r1, r2, 0, 0, Math.PI * 2);
//   ctx.fill();
// }

// function drawOval(x, y) {
//   ctx.beginPath();
//   ctx.moveTo(startX, startY + (y - startY) / 2);
//   ctx.bezierCurveTo(startX, startY, x, startY, x, startY + (y - startY) / 2);
//   ctx.bezierCurveTo(x, y, startX, y, startX, startY + (y - startY) / 2);
//   ctx.closePath();
//   ctx.stroke();
// }

// // ctrl + z aka undo functioning
// document.addEventListener("keydown", function (event) {
//   if (event.ctrlKey && event.key === "z") {
//     console.log("ctrl + z");
//     undo();
//   }
// });

// function undo() {
//   if (restoreIndex <= 0) {
//     clear();
//   } else {
//     restoreIndex -= 1;
//     restoreArray.pop();
//     ctx.putImageData(restoreArray[restoreIndex], 0, 0);
//   }
// }

// clear screen function
clear.addEventListener("click", clearCanvas);

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // restoreIndex = -1;
  // restoreArray = [];
}

// Handle Save Button
save.addEventListener("click", function () {
  let imageName = prompt("Please enter image name");
  let canvasDataURL = canvas.toDataURL();
  let a = document.createElement("a");
  a.href = canvasDataURL;
  a.download = imageName || none;
  a.click();
});

resize();
function resize() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
}
