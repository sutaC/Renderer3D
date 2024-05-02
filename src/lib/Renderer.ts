import Shape, { type Point } from './Shape';

function matrixMultiplyPoint(matrix: Point[], point: Point): Point {
	if (matrix.length > 3) {
		throw new Error('Projection length cannot be longer than point 0.5 (3)');
	}

	const result: Point = [0, 0, 0];
	for (let i = 0; i < matrix.length; i++) {
		for (let j = 0; j < matrix.length; j++) {
			result[i] += matrix[i][j] * point[j];
		}
	}
	return result;
}

function getRotationProjection(angle: number, axis: 'x' | 'y' | 'z' = 'z'): Point[] {
	const radians = angle * (Math.PI / 180);

	switch (axis) {
		case 'x':
			return [
				[1, 0, 0],
				[0, Math.cos(radians), -Math.sin(radians)],
				[0, Math.sin(radians), Math.cos(radians)]
			];
		case 'y':
			return [
				[Math.cos(radians), 0, -Math.sin(radians)],
				[0, 1, 0],
				[Math.sin(radians), 0, Math.cos(radians)]
			];
		case 'z':
			return [
				[Math.cos(radians), -Math.sin(radians), 0],
				[Math.sin(radians), Math.cos(radians), 0],
				[0, 0, 1]
			];
	}
}

function scalePoint(point: Point, multiplier: number) {
	for (let i = 0; i < point.length; i++) {
		point[i] *= multiplier;
	}
}

export default class Renderer {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private readonly centerX: number;
	private readonly centerY: number;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		this.centerX = this.canvas.width / 2;
		this.centerY = this.canvas.height / 2;
	}

	private drawPoint(point: Point): void {
		this.ctx.fillStyle = '#FFFFFF';
		this.ctx.beginPath();
		this.ctx.arc(this.centerX + point[0], this.centerY + point[1], 3, 0, Math.PI * 2);
		this.ctx.fill();
		this.ctx.closePath();
	}

	private drawLine(a: Point, b: Point) {
		this.ctx.strokeStyle = '#FFFFFF';
		this.ctx.lineWidth = 1;
		this.ctx.beginPath();
		this.ctx.moveTo(this.centerX + a[0], this.centerY + a[1]);
		this.ctx.lineTo(this.centerX + b[0], this.centerY + b[1]);
		this.ctx.stroke();
		this.ctx.closePath();
	}

	public drawShape(shape: Shape) {
		const rotationX = getRotationProjection(shape.rotationX, 'x');
		const rotationY = getRotationProjection(shape.rotationY, 'y');
		const rotationZ = getRotationProjection(shape.rotationZ, 'z');

		const projected: Point[] = [];

		for (let point of shape.points) {
			point = matrixMultiplyPoint(rotationX, point);
			point = matrixMultiplyPoint(rotationY, point);
			point = matrixMultiplyPoint(rotationZ, point);

			const z = 1 / (shape.distance - point[2]);
			const projection: Point[] = [
				[z, 0, 0],
				[0, z, 0]
			];
			point = matrixMultiplyPoint(projection, point);

			scalePoint(point, shape.size);

			this.drawPoint(point);
			projected.push(point);
		}

		for (const edge of shape.edges) {
			this.drawLine(projected[edge[0]], projected[edge[1]]);
		}
	}

	public clear(): void {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}