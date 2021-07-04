let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
resize();

// resize canvas when window is resized
function resize() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
}

// add window event listener to trigger when window is resized
window.addEventListener("resize", resize);

let size = 1;
let color = "white";
let isPressed = false;
let x;
let y;

let restoreArray = [];
let restoreIndex = -1;

// let pen = document.getElementById("pen");
// let penPressed = false;

// start drawing event
canvas.addEventListener("mousedown", (e) => {
  x = e.offsetX;
  y = e.offsetY;

  drawCircles(x, y);

  isPressed = true;
});

// stop drawing event
canvas.addEventListener("mouseup", (e) => {
  isPressed = false;
  x = undefined;
  y = undefined;

  if (!isPressed) {
    restoreArray.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    restoreIndex++;
  }
});

// drag drawing event
canvas.addEventListener("mousemove", (e) => {
  if (isPressed) {
    const x2 = e.offsetX;
    const y2 = e.offsetY;

    drawCircles(x2, y2);
    drawLine(x, y, x2, y2);

    x = x2;
    y = y2;
  }
});

function drawCircles(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineCap = "round";
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 2;
  ctx.stroke();
}

function drawOval(x, y, x2, y2) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(x, y + (y2 - y) / 2);
  ctx.bezierCurveTo(x, y, x2, y, x2, y + (y2 - y) / 2);
  ctx.bezierCurveTo(x2, y2, x, y2, x, y + (y2 - y) / 2);
  ctx.closePath();
  ctx.stroke();
}

// ctrl + z aka undo functioning
document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.key === "z") {
    console.log("ctrl + z");
    undo();
  }
});

function undo() {
  if (restoreIndex <= 0) {
    clear();
  } else {
    restoreIndex -= 1;
    restoreArray.pop();
    ctx.putImageData(restoreArray[restoreIndex], 0, 0);
  }
}

// clear screen function
let clearBtn = document.getElementById("clear");
clearBtn.addEventListener("click", clear);

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  restoreIndex = -1;
  restoreArray = [];
}

// Handle Save Button
let saveButton = document.getElementById("save");

saveButton.addEventListener("click", function () {
  let imageName = prompt("Please enter image name");
  let canvasDataURL = canvas.toDataURL();
  let a = document.createElement("a");
  a.href = canvasDataURL;
  a.download = imageName || "drawing";
  a.click();
});
