export interface Point {
  x: number;
  y: number;
}

export type Segment = [Point, Point];
export type Borders = [Segment, Segment];

export type CarControl = 'KEYS' | 'DUMMY' | 'AI';
