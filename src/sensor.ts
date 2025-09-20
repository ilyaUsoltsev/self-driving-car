import type Car from './car';
import type { Segment, Borders } from './types';
import { getIntersection } from './utils/getIntersection';
import { lerp } from './utils/lerp';

class Sensor {
  rayCount: number;
  rayLength: number;
  raySpread: number;
  rays: Segment[];
  readings: (null | { x: number; y: number; offset: number })[];

  constructor(private car: Car) {
    this.rayCount = 4;
    this.rayLength = 100;
    this.raySpread = Math.PI / 2; // 90 degrees spread

    this.rays = [];
    this.readings = [];
  }

  update(roadBorders: Borders, traffic: Car[]) {
    this.castRays();
    this.readings = [];
    for (let i = 0; i < this.rays.length; i++) {
      this.readings.push(this.getReadings(this.rays[i], roadBorders, traffic));
    }
  }

  private getReadings(ray: Segment, roadBorders: Borders, traffic: Car[]) {
    let touches: { x: number; y: number; offset: number }[] = [];
    for (let i = 0; i < roadBorders.length; i++) {
      const border = roadBorders[i];
      const intersection = getIntersection(
        ray[0],
        ray[1],
        border[0],
        border[1]
      );
      if (intersection) {
        touches.push(intersection);
      }
    }

    for (let i = 0; i < traffic.length; i++) {
      const carPolygon = traffic[i].polygon;
      for (let j = 0; j < carPolygon.length; j++) {
        const intersection = getIntersection(
          ray[0],
          ray[1],
          carPolygon[j],
          carPolygon[(j + 1) % carPolygon.length]
        );
        if (intersection) {
          touches.push(intersection);
        }
      }
    }

    if (touches.length === 0) {
      return null;
    } else {
      const minOffset = Math.min(...touches.map((t) => t.offset));
      return touches.find((t) => t.offset === minOffset) || null;
    }
  }

  private castRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle = lerp(
        this.car.angle - this.raySpread / 2,
        this.car.angle + this.raySpread / 2,
        this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
      );

      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };
      this.rays.push([start, end]);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 2;
    for (let i = 0; i < this.rayCount; i++) {
      ctx.strokeStyle = 'yellow';
      let end = this.rays[i][1];
      if (this.readings[i]) {
        end = { x: this.readings[i]!.x, y: this.readings[i]!.y };
      }
      ctx.beginPath();
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
      // Draw intersection part as black
      ctx.strokeStyle = 'black';
      ctx.beginPath();
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }
}

export default Sensor;
