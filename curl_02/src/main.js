const { Num, Noise, Color, Context, Anim } = bljs;
const { Label, HSlider, RadioButton, Toggle, Panel, Canvas } = mc;

/////////////////////////////
// MODEL
/////////////////////////////

const width = 400;
const height = 400;
const model = {
  scale: 0.01,
  x: 116,
  showDeltas: true,
  showSlopes: true,
  delta: 0.0001,
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
  .bind(model, "scale")
  .addHandler(render);

new HSlider(panel, 20, 80, "X", model.x, 0, width)
  .bind(model, "x")
  .addHandler(render);

new HSlider(panel, 20, 120, "Delta", model.delta, 0.0001, 1)
  .setDecimals(4)
  .bind(model, "delta")
  .addHandler(render);

new Toggle(panel, 20, 160, "Show Deltas", model.showDeltas) 
  .bind(model, "showDeltas")
  .addHandler(render);

new Toggle(panel, 100, 160, "Show Slopes", model.showSlopes) 
  .bind(model, "showSlopes")
  .addHandler(render);


/////////////////////////////
// VIEW
/////////////////////////////

render();

function render(fps) {
  context.lineWidth = model.lineWidth;
  context.clearWhite();
  context.beginPath();
  for (let x = 0; x < width; x++) {
    let n = Noise.perlin1(x * model.scale);
    let y = n * height;
    context.lineTo(x, height / 2 - y);
  }
  context.stroke();

  const n = Noise.perlin1(model.x * model.scale);
  context.fillCircle(model.x, height / 2 - n * height, 5);

  let slope;

  if (model.showDeltas) {
    const n1 = Noise.perlin1(model.x * model.scale - model.delta);
    const x1 = model.x - model.delta / model.scale;
    const y1 = n1 * height;
    context.strokeCircle(x1, height / 2 - y1, 3);
    const n2 = Noise.perlin1(model.x * model.scale + model.delta);
    const x2 = model.x + model.delta / model.scale;
    const y2 = n2 * height;
    context.strokeCircle(x2, height / 2 - y2, 3);

    if (model.showSlopes) {
      context.beginPath();
      context.moveTo(x1, height / 2 - y1);
      context.lineTo(x2, height / 2 - y2);
      context.stroke();

      slope = (y2 - y1) / (model.delta / model.scale * 2);
      context.save();
      context.lineWidth = 5;
      context.translate(model.x, height / 2 - n * height);
      context.strokeStyle = "rgba(255, 0, 0, 0.25)";
      context.beginPath();
      context.moveTo(-50, -50 * -slope);
      context.lineTo(50, 50 * -slope);
      context.stroke();

      context.restore();
    }
  }


}
