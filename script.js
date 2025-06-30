const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let painting = false;
let imageLoaded = false;
let eraserMode = false;
let uploadedImage = new Image();

// Upload and draw the image
document.getElementById('uploadInput').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    uploadedImage.onload = function () {
      canvas.width = uploadedImage.width;
      canvas.height = uploadedImage.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(uploadedImage, 0, 0);
      imageLoaded = true;
    };
    uploadedImage.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

// Get brush color or white (for eraser)
function getBrushColor() {
  return eraserMode ? '#FFFFFF' : document.getElementById('colorPicker').value;
}

// Get brush size from slider
function getBrushSize() {
  return parseInt(document.getElementById('brushSize').value);
}

// Start drawing
canvas.addEventListener('mousedown', (e) => {
  if (!imageLoaded) return;
  painting = true;
  draw(e);
});

canvas.addEventListener('mousemove', (e) => {
  if (!painting || !imageLoaded) return;
  draw(e);
});

canvas.addEventListener('mouseup', () => {
  painting = false;
  ctx.beginPath();
});

canvas.addEventListener('mouseleave', () => {
  painting = false;
  ctx.beginPath();
});

// Touch events (for mobile)
canvas.addEventListener('touchstart', (e) => {
  if (!imageLoaded) return;
  const touch = e.touches[0];
  const mouseEvent = new MouseEvent('mousedown', {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchmove', (e) => {
  if (!imageLoaded) return;
  const touch = e.touches[0];
  const mouseEvent = new MouseEvent('mousemove', {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchend', () => {
  canvas.dispatchEvent(new MouseEvent('mouseup'));
});

// Drawing logic
function draw(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.lineWidth = getBrushSize();
  ctx.lineCap = 'round';
  ctx.strokeStyle = getBrushColor();

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

// Download the result
function downloadImage() {
  if (!imageLoaded) return alert("Upload an image first.");
  const link = document.createElement('a');
  link.download = 'painted-kalamkari.png';
  link.href = canvas.toDataURL();
  link.click();
}

// Clear canvas and redraw image
function clearCanvas() {
  if (!imageLoaded) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(uploadedImage, 0, 0);
}

// Toggle eraser mode
function toggleEraser() {
  eraserMode = !eraserMode;
  const btn = document.querySelector('button[onclick="toggleEraser()"]');
  btn.textContent = eraserMode ? "Eraser ON" : "Eraser OFF";
}
