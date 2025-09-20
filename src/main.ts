import Car from './car';
import Road from './road';
import './style.css';

const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

canvas.width = 300;

const road = new Road(canvas.width / 2, canvas.width * 0.9, 5);
const car = new Car(road.getLaneCenter(3), 100, 30, 50, 'KEYS');

const traffic: Car[] = [
  new Car(road.getLaneCenter(1), -100, 30, 50, 'DUMMY', 1),
];

function animate() {
  for (const trafficCar of traffic) {
    trafficCar.update(road.borders, []);
  }
  car.update(road.borders, traffic);
  canvas.height = window.innerHeight;
  ctx.save();
  ctx.translate(0, -car.y + canvas.height * 0.7);
  road.draw(ctx);
  for (const trafficCar of traffic) {
    trafficCar.draw(ctx, 'red');
  }
  car.draw(ctx, 'blue');
  ctx.restore();
  requestAnimationFrame(animate);
}

animate();
