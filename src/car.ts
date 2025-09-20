import Controls from './controls';
import Sensor from './sensor';
import type { Borders, Point } from './types';
import { polygonsIntersect } from './utils/polygonsIntersect';

class Car {
  controls: Controls;
  speed: number;
  acceleration: number;
  maxSpeed: number;
  friction: number;
  angle: number;
  sensor: Sensor | null = null;
  polygon: Point[];
  damaged = false;

  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public type: 'KEYS' | 'DUMMY',
    public maxSpeedOverride?: number
  ) {
    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = this.maxSpeedOverride || 3;
    this.friction = 0.05;
    this.angle = 0;
    if (this.type !== 'DUMMY') {
      this.sensor = new Sensor(this);
    }

    this.controls = new Controls(this.type);
    this.polygon = this.createPolygon();
  }

  draw(ctx: CanvasRenderingContext2D, color: string) {
    if (this.damaged) {
      ctx.fillStyle = 'gray';
    } else {
      ctx.fillStyle = color;
    }

    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();
    if (this.sensor) {
      this.sensor.draw(ctx);
    }
  }

  update(roadBorders: Borders, traffic: Car[]) {
    if (!this.damaged) {
      this.move();
      this.polygon = this.createPolygon();
      this.damaged = this.assessDamage(roadBorders, traffic);
    }
    if (this.sensor) {
      this.sensor.update(roadBorders, traffic);
    }
  }

  private createPolygon() {
    const points: Point[] = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const angle = Math.atan2(this.width, this.height);
    // top right, top left, bottom left, bottom right
    points.push({
      x: this.x - Math.sin(this.angle - angle) * rad,
      y: this.y - Math.cos(this.angle - angle) * rad,
    });
    points.push({
      x: this.x - Math.sin(this.angle + angle) * rad,
      y: this.y - Math.cos(this.angle + angle) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - angle) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - angle) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + angle) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + angle) * rad,
    });

    return points;
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

  assessDamage(roadBorders: Borders, traffic: Car[]) {
    for (let i = 0; i < roadBorders.length; i++) {
      const border = roadBorders[i];
      if (polygonsIntersect(this.polygon, border)) {
        return true;
      }
    }
    for (let i = 0; i < traffic.length; i++) {
      const car = traffic[i];
      if (polygonsIntersect(this.polygon, car.polygon)) {
        console.log(this.polygon, car.polygon);
        return true;
      }
    }
    return false;
  }
}

export default Car;
