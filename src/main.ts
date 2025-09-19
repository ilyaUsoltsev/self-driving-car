import Car from './car';
import './style.css';

const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

canvas.width = 200;

const car = new Car(100, 100, 30, 50);

function animate() {
  canvas.height = window.innerHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  car.update();
  car.draw(ctx);
  requestAnimationFrame(animate);
}

animate();
