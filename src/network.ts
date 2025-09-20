import { lerp } from './utils/lerp';

class NeuralNetwork {
  levels: Level[];
  constructor(neuronCounts: number[]) {
    this.levels = [];
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
    }
  }

  static feedForward(givenInputs: number[], network: NeuralNetwork) {
    let outputs = Level.feedForward(givenInputs, network.levels[0]);
    for (let i = 1; i < network.levels.length; i++) {
      outputs = Level.feedForward(outputs, network.levels[i]);
    }
    return outputs;
  }

  static mutate(network: NeuralNetwork, amount = 1) {
    network.levels.forEach((level) => {
      for (let i = 0; i < level.biases.length; i++) {
        level.biases[i] = lerp(level.biases[i], Math.random() * 2 - 1, amount);
      }
      for (let i = 0; i < level.biases.length; i++) {
        for (let j = 0; j < level.inputs.length; j++) {
          level.weights[j][i] = lerp(
            level.weights[j][i],
            Math.random() * 2 - 1,
            amount
          );
        }
      }
    });
  }
}

export class Level {
  inputs: number[];
  outputs: number[];
  biases: number[];
  weights: number[][];

  constructor(private inputCount: number, private outputCount: number) {
    this.inputs = new Array(inputCount).fill(0);
    this.outputs = new Array(outputCount).fill(0);
    this.biases = new Array(outputCount).fill(0);

    this.weights = [];
    for (let i = 0; i < this.inputCount; i++) {
      this.weights[i] = new Array(this.outputCount);
    }

    Level.randomize(this);
  }

  private static randomize(level: Level) {
    for (let i = 0; i < level.outputs.length; i++) {
      for (let j = 0; j < level.inputs.length; j++) {
        level.weights[j][i] = Math.random() * 2 - 1; // Random value between -1 and 1
      }
    }
    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = Math.random() * 2 - 1;
    }
  }

  static feedForward(givenInputs: number[], level: Level) {
    for (let i = 0; i < givenInputs.length; i++) {
      level.inputs[i] = givenInputs[i];
    }
    // Compute outputs
    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0;
      for (let j = 0; j < level.inputs.length; j++) {
        sum += level.weights[j][i] * level.inputs[j];
      }
      if (sum > level.biases[i]) {
        level.outputs[i] = 1;
      } else {
        level.outputs[i] = 0;
      }
    }
    return level.outputs;
  }
}

export default NeuralNetwork;
