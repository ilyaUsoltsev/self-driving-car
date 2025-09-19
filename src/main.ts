import Car from './car';
import Road from './road';
import './style.css';

const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

canvas.width = 300;

const road = new Road(canvas.width / 2, canvas.width * 0.9, 5);
const car = new Car(road.getLaneCenter(3), 100, 30, 50);

function animate() {
  car.update();
  canvas.height = window.innerHeight;
  ctx.save();
  ctx.translate(0, -car.y + canvas.height * 0.7);
  road.draw(ctx);
  car.draw(ctx);
  ctx.restore();
  requestAnimationFrame(animate);
}

animate();
