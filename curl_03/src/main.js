const { Num, Noise, Color, Context, Anim } = bljs;
const { Label, HSlider, RadioButton, Toggle, Panel, Canvas } = mc;

/////////////////////////////
// MODEL
/////////////////////////////

const width = 400;
const height = 400;
const model = {
  scale: 0.01,
  mouseX: 0,
  mouseY: 0,
  mode: "Slope",
  showX: true,
  showY: false,
  showSlope: false,
};

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, 210 + width, height + 40);
const canvas = new Canvas(panel, 190, 20, width, height);
const context = canvas.context;
Context.extendContext(context);

new HSlider(panel, 20, 40, "Noise Scale", model.scale, 0.001, 0.02)
  .setDecimals(3)
  .bind(model, "scale");

new Toggle(panel, 20, 80, "Show X", model.showX) 
  .bind(model, "showX");

new Toggle(panel, 75, 80, "Show Y", model.showY) 
  .bind(model, "showY");

new Toggle(panel, 130, 80, "Show Slope", model.showSlope) 
  .bind(model, "showSlope");

new Label(panel, 20, 120, "Mode");
new RadioButton(panel, 30, 140, "mode", "Slope", true)
  .bind(model, "mode");
new RadioButton(panel, 30, 160, "mode", "Curl", false)
  .bind(model, "mode");
/////////////////////////////
// VIEW
/////////////////////////////

context.canvas.addEventListener("mousemove", onMouseMove);

const anim = new Anim(render);
anim.run();

function render(fps) {
  const res = 10;
  // context.lineWidth = 0.5;
  const scale = model.scale;
  for (let x = 0; x < width; x += res) {
    for (let y = 0; y < height; y += res) {
      const n = Noise.perlin2((x + res / 2) * scale, (y + res / 2) * scale);
      const h = Num.map(n, -1, 1, 128, 255);
      context.fillStyle = Color.gray(h);
      context.fillRect(x, y, res, res);
    }
  }

  const delta = 0.001;
  const xx = model.mouseX * scale;
  const yy = model.mouseY * scale;
  let n1 = Noise.perlin2(xx - delta, yy);
  let n2 = Noise.perlin2(xx + delta, yy);
  const a = (n2 - n1) / (delta * 2);

  n1 = Noise.perlin2(xx, yy - delta);
  n2 = Noise.perlin2(xx, yy + delta);
  const b = (n2 - n1) / (delta * 2);

  if (model.mode === "Slope") {
    context.strokeStyle = "red";
    context.beginPath();
    if (model.showX) {
      context.moveTo(model.mouseX, model.mouseY);
      context.lineTo(model.mouseX + a * 40, model.mouseY);
    }
    if (model.showY) {
      context.moveTo(model.mouseX, model.mouseY);
      context.lineTo(model.mouseX, model.mouseY + b * 40);
    }
    if (model.showSlope) {
      context.moveTo(model.mouseX, model.mouseY);
      context.lineTo(model.mouseX + a * 40, model.mouseY + b * 40);
    }
    context.stroke();
  } else {
    context.strokeStyle = "red";
    context.beginPath();
    context.moveTo(model.mouseX, model.mouseY);
    context.lineTo(model.mouseX + a * 40, model.mouseY + b * 40);
    context.stroke();

    context.strokeStyle = "green";
    context.beginPath();
    context.moveTo(model.mouseX, model.mouseY);
    context.lineTo(model.mouseX + b * 40, model.mouseY - a * 40);
    context.stroke();
  }
}

function onMouseMove(event) {
  model.mouseX = event.offsetX;
  model.mouseY = event.offsetY;
}


