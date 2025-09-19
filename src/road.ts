import { clamp } from './utils/clamp';
import { lerp } from './utils/lerp';

class Road {
  left: number;
  right: number;
  laneWidth: number;
  top: number;
  bottom: number;
  borders: { x: number; y: number }[][];

  constructor(
    private x: number,
    private width: number,
    private laneCount: number = 3
  ) {
    this.left = this.x - this.width / 2;
    this.right = this.x + this.width / 2;
    this.laneWidth = this.width / this.laneCount;
    const infinity = 1000000;
    this.top = -infinity;
    this.bottom = infinity;

    const topLeft = { x: this.left, y: this.top };
    const topRight = { x: this.right, y: this.top };
    const bottomLeft = { x: this.left, y: this.bottom };
    const bottomRight = { x: this.right, y: this.bottom };

    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ];
  }

  getLaneCenter(laneIndex: number) {
    const lane = clamp(
      Math.min(laneIndex, this.laneCount - 1),
      0,
      this.laneCount - 1
    );
    return this.left + this.laneWidth / 2 + lane * this.laneWidth;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'white';

    for (let i = 1; i <= this.laneCount - 1; i++) {
      const x = lerp(this.left, this.right, i / this.laneCount);
      ctx.setLineDash([20, 20]);
      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }

    ctx.setLineDash([]);
    this.borders.forEach((border) => {
      ctx.beginPath();
      ctx.moveTo(border[0].x, border[0].y);
      ctx.lineTo(border[1].x, border[1].y);
      ctx.stroke();
    });
  }
}

export default Road;
