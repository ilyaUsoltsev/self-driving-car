import Controls from './controls';
import Sensor from './sensor';
import type { Borders } from './types';

class Car {
  controls: Controls;
  speed: number;
  acceleration: number;
  maxSpeed: number;
  friction: number;
  angle: number;
  sensor: Sensor;

  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {
    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = 3;
    this.friction = 0.05;
    this.angle = 0;
    this.sensor = new Sensor(this);
    this.controls = new Controls();
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);
    ctx.fillStyle = 'red';
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fill();
    ctx.restore();
    this.sensor.draw(ctx);
  }

  update(roadBorders: Borders) {
    this.move();
    this.sensor.update(roadBorders);
  }

  private move() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }
    if (Math.abs(this.speed) >= this.maxSpeed) {
      this.speed = Math.sign(this.speed) * this.maxSpeed;
    }

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;

    //flip speed when going backwards
    if (this.speed !== 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) {
        this.angle += 0.03 * flip;
      }
      if (this.controls.right) {
        this.angle -= 0.03 * flip;
      }
    }
  }
}

export default Car;
