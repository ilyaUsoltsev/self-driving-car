import Car from './car';
import NeuralNetwork from './network';
import Road from './road';
import './style.css';
import Visualizer from './visualizer';

const saveButton = document.getElementById('saveButton') as HTMLButtonElement;
const discardButton = document.getElementById(
  'discardButton'
) as HTMLButtonElement;

saveButton.onclick = () => {
  save(bestCar);
};

discardButton.onclick = () => {
  discard();
};

const carCanvas = document.getElementById('carCanvas') as HTMLCanvasElement;
const networkCanvas = document.getElementById(
  'networkCanvas'
) as HTMLCanvasElement;
const carCtx = carCanvas.getContext('2d') as CanvasRenderingContext2D;
const networkCtx = networkCanvas.getContext('2d') as CanvasRenderingContext2D;

carCanvas.width = 300;
networkCanvas.width = 500;

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, 5);
const N = 2000;
const cars = generateCars(N);
let bestCar = cars[0];

if (localStorage.getItem('neuralNetwork')) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].neuralNetwork = JSON.parse(
      localStorage.getItem('neuralNetwork') as string
    );
    if (i !== 0) {
      NeuralNetwork.mutate(
        cars[i].neuralNetwork!,
        0.1 // Mutation rate
      );
    }
  }
}

const traffic: Car[] = [
  new Car(road.getLaneCenter(3), -100, 30, 50, 'DUMMY', 1),
  new Car(road.getLaneCenter(1), -300, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(0), -300, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(4), -500, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(5), -500, 30, 50, 'DUMMY', 1),
  new Car(road.getLaneCenter(2), -700, 30, 50, 'DUMMY', 1),
  new Car(road.getLaneCenter(1), -700, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(3), -900, 30, 50, 'DUMMY', 1),
  new Car(road.getLaneCenter(4), -900, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(0), -900, 30, 50, 'DUMMY', 1),
  new Car(road.getLaneCenter(2), -1100, 30, 50, 'DUMMY', 1),
  new Car(road.getLaneCenter(3), -1300, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(1), -1300, 30, 50, 'DUMMY', 1),
  new Car(road.getLaneCenter(0), -1500, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(4), -1500, 30, 50, 'DUMMY', 1),
  new Car(road.getLaneCenter(5), -1700, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(2), -1700, 30, 50, 'DUMMY', 1),
  new Car(road.getLaneCenter(3), -1900, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(1), -1900, 30, 50, 'DUMMY', 1),
  new Car(road.getLaneCenter(0), -2100, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(4), -2100, 30, 50, 'DUMMY', 1),
  new Car(road.getLaneCenter(5), -2300, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(2), -2300, 30, 50, 'DUMMY', 1),
  new Car(road.getLaneCenter(3), -2500, 30, 50, 'DUMMY', 2),
];

function save(bestCar: Car) {
  localStorage.setItem('neuralNetwork', JSON.stringify(bestCar.neuralNetwork));
}

function discard() {
  localStorage.removeItem('neuralNetwork');
}

function generateCars(N: number): Car[] {
  const cars: Car[] = [];
  for (let i = 0; i < N; i++) {
    cars.push(new Car(road.getLaneCenter(3), 100, 30, 50, 'AI'));
  }
  return cars;
}

function animate(time?: number) {
  for (const trafficCar of traffic) {
    trafficCar.update(road.borders, []);
  }
  for (const car of cars) {
    car.update(road.borders, traffic);
  }
  bestCar = cars.find((c) => c.y === Math.min(...cars.map((car) => car.y)))!;
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;
  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);
  road.draw(carCtx);
  for (const trafficCar of traffic) {
    trafficCar.draw(carCtx, 'red');
  }
  carCtx.globalAlpha = 0.2;
  for (const car of cars) {
    car.draw(carCtx, 'green');
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, 'blue', true);
  carCtx.restore();

  networkCtx.lineDashOffset = -time! / 50;

  Visualizer.drawNetwork(networkCtx, bestCar.neuralNetwork!);
  requestAnimationFrame(animate);
}

animate(undefined);
