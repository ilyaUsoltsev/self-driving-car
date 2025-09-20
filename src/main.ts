import Car from './car';
import Road from './road';
import './style.css';
import Visualizer from './visualizer';

const carCanvas = document.getElementById('carCanvas') as HTMLCanvasElement;
const networkCanvas = document.getElementById(
  'networkCanvas'
) as HTMLCanvasElement;
const carCtx = carCanvas.getContext('2d') as CanvasRenderingContext2D;
const networkCtx = networkCanvas.getContext('2d') as CanvasRenderingContext2D;

carCanvas.width = 300;
networkCanvas.width = 500;

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, 5);
const car = new Car(road.getLaneCenter(3), 100, 30, 50, 'AI');

const traffic: Car[] = [
  new Car(road.getLaneCenter(3), -100, 30, 50, 'DUMMY', 1),
];

function animate(time?: number) {
  for (const trafficCar of traffic) {
    trafficCar.update(road.borders, []);
  }
  car.update(road.borders, traffic);
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;
  carCtx.save();
  carCtx.translate(0, -car.y + carCanvas.height * 0.7);
  road.draw(carCtx);
  for (const trafficCar of traffic) {
    trafficCar.draw(carCtx, 'red');
  }
  car.draw(carCtx, 'blue');
  carCtx.restore();

  networkCtx.lineDashOffset = -time! / 50;

  Visualizer.drawNetwork(networkCtx, car.neuralNetwork!);
  requestAnimationFrame(animate);
}

animate(undefined);
