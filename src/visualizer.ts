import type { Level } from './network';
import type NeuralNetwork from './network';
import { getRGBA } from './utils/getRGBA';
import { lerp } from './utils/lerp';

class Visualizer {
  public static drawNetwork(
    ctx: CanvasRenderingContext2D,
    network: NeuralNetwork
  ) {
    const margin = 50;
    const left = margin;
    const top = margin;
    const width = ctx.canvas.width - margin * 2;
    const height = ctx.canvas.height - margin * 2;

    const levelHeight = height / network.levels.length;
    for (let i = network.levels.length - 1; i >= 0; i--) {
      const levelTop =
        top +
        lerp(
          height - levelHeight,
          0,
          network.levels.length === 1 ? 0.5 : i / (network.levels.length - 1)
        );

      ctx.setLineDash([7, 3]);
      Visualizer.drawLevel(
        ctx,
        network.levels[i],
        left,
        levelTop,
        width,
        levelHeight,
        i === network.levels.length - 1 ? ['↑', '←', '→', '↓'] : []
      );
    }
  }

  private static drawLevel(
    ctx: CanvasRenderingContext2D,
    level: Level,
    left: number,
    top: number,
    width: number,
    height: number,
    outputLabels: string[]
  ) {
    // Draw the level here
    const right = left + width;
    const bottom = top + height;
    const nodeRadius = 18;
    const { inputs, outputs, weights, biases } = level;
    // Draw connections
    for (let i = 0; i < inputs.length; i++) {
      const inputX = this.getNodeX(inputs, i, left, right);
      for (let j = 0; j < outputs.length; j++) {
        const outputX = this.getNodeX(outputs, j, left, right);
        ctx.beginPath();
        ctx.moveTo(inputX, bottom);
        ctx.lineTo(outputX, top);
        const value = weights[i][j];
        ctx.strokeStyle = getRGBA(value);
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
    // Draw input circles
    for (let i = 0; i < inputs.length; i++) {
      const x = this.getNodeX(inputs, i, left, right);
      ctx.fillStyle = getRGBA(inputs[i]);
      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw output circles
    for (let i = 0; i < outputs.length; i++) {
      const x = this.getNodeX(outputs, i, left, right);

      ctx.fillStyle = getRGBA(outputs[i]);
      ctx.beginPath();
      ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      //   ctx.lineWidth = 2;
      ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
      ctx.strokeStyle = getRGBA(biases[i]);
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      if (outputLabels[i]) {
        ctx.beginPath();
        ctx.font = nodeRadius * 1.5 + 'px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'black';
        ctx.fillText(outputLabels[i], x, top);
      }
    }
  }

  private static getNodeX(
    nodes: number[],
    index: number,
    left: number,
    right: number
  ) {
    return lerp(
      left,
      right,
      nodes.length === 1 ? 0.5 : index / (nodes.length - 1)
    );
  }
}

export default Visualizer;
