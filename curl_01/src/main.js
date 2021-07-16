const { Num, Noise, Color, Context, Anim } = bljs;
const { Label, HSlider, RadioButton, Toggle, Panel, Canvas } = mc;

/////////////////////////////
// MODEL
/////////////////////////////

const width = 400;
const height = 400;
const model = {
  scale: 0.01,
  speed: 0.01,
  res: 10,
  showPerlin: true,
  mode: "Slope",
  lineWidth: 0.5,
};

/////////////////////////////
// CONTROLS
/////////////////////////////
const panel = new Panel(document.body, 0, 0, 210 + width, height + 40);
const canvas = new Canvas(panel, 190, 20, width, height);
const context = canvas.context;
Context.extendContext(context);

new HSlider(panel, 20, 40, "Noise Scale", model.scale, 0.001, 0.05)
  .setDecimals(3)
  .bind(model, "scale");

new HSlider(panel, 20, 80, "Noise Speed", model.speed, 0.001, 0.1)
  .setDecimals(3)
  .bind(model, "speed");

new HSlider(panel, 20, 120, "Resolution", model.res, 2, 20)
  .bind(model, "res");

new HSlider(panel, 20, 160, "LineWidth", model.lineWidth, 0.1, 2)
  .setDecimals(1)
  .bind(model, "lineWidth");

new Toggle(panel, 20, 200, "Show Perlin", model.showPerlin) 
  .bind(model, "showPerlin");

new Label(panel, 20, 240, "Mode");
new RadioButton(panel, 30, 260, "mode", "Slope", true)
  .bind(model, "mode");
new RadioButton(panel, 30, 280, "mode", "Curl", false)
  .bind(model, "mode");
/////////////////////////////
// VIEW
/////////////////////////////

let z = 0;
const showPerlin = false;
const anim = new Anim(render);
anim.run();

function render(fps) {
  context.lineWidth = model.lineWidth;
  const scale = model.scale;
  context.clearWhite();
  let res = 10;
  if (model.showPerlin) {
    for (let x = 0; x < width; x += res) {
      for (let y = 0; y < height; y += res) {
        const n = Noise.perlin((x + res / 2) * scale, (y + res / 2) * scale, z);
        const h = Num.map(n, -1, 1, 0, 360);
        context.fillStyle = Color.hsv(h, 0.5, 1);
        context.fillRect(x, y, res, res);
      }
    }
  }
  const delta = 0.001;
  res = model.res;
  for (let x = 0; x < width; x += res) {
    for (let y = 0; y < height; y += res) {
      const xx = (x + res / 2) * scale;
      const yy = (y + res / 2) * scale;
      let n1 = Noise.perlin(xx - delta, yy, z);
      let n2 = Noise.perlin(xx + delta, yy, z);
      const a = (n2 - n1) / (delta * 2);

      n1 = Noise.perlin(xx, yy - delta, z);
      n2 = Noise.perlin(xx, yy + delta, z);
      const b = (n2 - n1) / (delta * 2);
      context.beginPath();
      context.moveTo(x + res / 2, y + res / 2);
      if (model.mode === "Slope") {
        context.lineTo(x + res / 2 + a * res, y + res / 2 + b * res);
      } else {
        context.lineTo(x + res / 2 + b * res, y + res / 2 - a * res);
      }
      context.stroke();
    }
  }
  z += model.speed;
}
