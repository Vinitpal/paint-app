const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let tool = "brush";
let size = 5;
// let color = "white";
let mousePressed = false;
ctx.lineJoin = "round";
ctx.lineCap = "round";
let x, y;
let existingLines = [];

const brush = document.getElementById("brush");
const line = document.getElementById("line");
const eraser = document.getElementById("eraser");
const rectangle = document.getElementById("rectangle");
const circle = document.getElementById("circle");
const clear = document.getElementById("clear");
const save = document.getElementById("save");

const items = document.querySelectorAll(".items");

let itemSelected = true;

// ----- Pencil and toolbox Menu -----
const brush_menu = document.getElementById("brush-menu");

items.forEach((item, idx) => {
  item.addEventListener("click", () => {
    items.forEach((item) => item.classList.remove("active"));
    if (items[idx].classList.contains("pencil")) {
      brush.classList.add("active");
      brush_menu.classList.add("pencil-active");
    } else {
      items[idx].classList.add("active");
      brush_menu.classList.remove("pencil-active");
    }
  });
});

canvas.addEventListener("mousedown", brushDown);
canvas.addEventListener("mousemove", brushMove);
canvas.addEventListener("mouseup", brushUp);

// todo color + size change

const options = document.querySelectorAll(".options-items div");

options.forEach((option) => {
  option.addEventListener("click", () => {
    let color = option.className;
    colorChange(color);
  });
});

let restoreArray = [];
let restoreIndex = -1;

function colorChange(color) {
  myColor = color;
  ctx.strokeStyle = myColor;
}

function sizeChange(mySize) {
  ctx.lineWidth = mySize;
}

// ----- coordinates -----

function getCoordinates(canvas, e) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

// ----- draw functions -----

function drawBrush(canvas, x, y) {
  if (mousePressed) {
    ctx.globalCompositeOperation = "source-over";
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

function drawLine(x, y) {
  if (mousePressed) {
    ctx.globalCompositeOperation = "source-over";
    ctx.moveTo(x, y);
    ctx.stroke();
  }
}

// ----- brush function - down - move - up -----

function brushDown(e) {
  mousePressed = true;
  let coordinates = getCoordinates(canvas, e);
  let x0 = coordinates.x;
  let y0 = coordinates.y;

  ctx.beginPath();
  colorChange();

  if (tool === "brush") {
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0, y0);
    ctx.stroke();
  } else if (tool === "eraser") {
    ctx.globalCompositeOperation = "destination-out";
    ctx.moveTo(x0, y0);
    ctx.stroke();
    ctx.fill();
  } else if (tool === "line") {
    existingLines = [
      {
        startX: x0,
        startY: y0,
      },
    ];
    drawLine(x0, y0);
  }
  // else if (tool === "circle") {
  //   // ctx.arc(x0, y0, size, 0, Math.PI * 2);
  //   // ctx.stroke;
  // }
}

function brushMove(e) {
  let coordinates = getCoordinates(canvas, e);
  let x1 = coordinates.x;
  let y1 = coordinates.y;

  existingLines.push({
    lastX: x1,
    lastY: y1,
  });

  sizeChange(size);

  if (tool === "brush") {
    drawBrush(canvas, x1, y1);
  } else if (tool === "eraser" && mousePressed) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineWidth = 10;
    ctx.lineTo(x1, y1);
    ctx.stroke();
  } else if (tool === "line" && mousePressed) {
    // clearCanvas();
    let prevX = existingLines[1].lastX;
    let prevY = existingLines[1].lastY;

    // ctx.moveTo(prevX, prevY);
    // ctx.lineTo(x1, y1);
    // console.log("working2");
    ctx.stroke();
  }
  // else if (tool === "circle") {
  //   ctx.arc(x1, y1, 8, 0, Math.PI * 2);
  //   ctx.stroke;
  // }
}

function brushUp(e) {
  stop = getCoordinates(canvas, e);
  stopX = stop.x;
  stopY = stop.y;
  mousePressed = false;

  if (tool === "line") {
    ctx.lineTo(stopX, stopY);
    ctx.stroke();
  }
  if (!mousePressed) {
    restoreArray.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    restoreIndex++;
  }
}

// ----- click handler functions -----

function brushClick() {
  tool = "brush";
  colorChange();
  sizeChange(size);

  canvas.addEventListener("mousedown", brushDown);
  canvas.addEventListener("mousemove", brushMove);
  canvas.addEventListener("mouseup", brushUp);
}

function eraserClick() {
  tool = "eraser";
  // ctx.strokeStyle = "#16161a";
  // sizeChange(size * 3);

  canvas.addEventListener("mousedown", brushDown);
  canvas.addEventListener("mousemove", brushMove);
  canvas.addEventListener("mouseup", brushUp);
}

function lineClick() {
  tool = "line";

  canvas.addEventListener("mousedown", brushDown);
  canvas.addEventListener("mousemove", brushMove);
  canvas.addEventListener("mouseup", brushUp);
}

function circleClick() {
  tool = "circle";

  canvas.addEventListener("mousedown", brushDown);
  canvas.addEventListener("mousemove", brushMove);
  canvas.addEventListener("mouseup", brushUp);
}

brush.addEventListener("click", brushClick);
eraser.addEventListener("click", eraserClick);
line.addEventListener("click", lineClick);
circle.addEventListener("click", circleClick);

// ----- undo functioning -----

document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.key === "z") {
    console.log("ctrl + z");
    undo();
  }
});

function undo() {
  if (restoreIndex <= 0) {
    clearCanvas();
  } else {
    restoreIndex -= 1;
    restoreArray.pop();
    ctx.putImageData(restoreArray[restoreIndex], 0, 0);
  }
}

// ----- clear screen function -----
clear.addEventListener("click", clearCanvas);

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  restoreIndex = -1;
  restoreArray = [];
}

// ----- Save Button function -----
// save.addEventListener("click", function () {
//   let imageName = prompt("Please enter image name");
//   let canvasDataURL = canvas.toDataURL();
//   let a = document.createElement("a");
//   a.href = canvasDataURL;
//   a.download = imageName || none;
//   a.click();
// });

// ----- window resize function -----
resize();
function resize() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
}

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
