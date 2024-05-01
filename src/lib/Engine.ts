type Point = [number, number, number];

class Shape {
	public readonly points: Point[];
	public readonly edges: [number, number][] = [];

	constructor(size: number) {
		if (size < 0) {
			throw Error('Point size out of scope');
		}
		this.points = new Array<Point>(size);
	}
}

const projection: Point[] = [
	[1, 0, 0],
	[0, 1, 0]
];

function matrixMultiplyPoint(matrix: Point[], point: Point): Point {
	if (matrix.length > 3) {
		throw new Error('Projection length cannot be longer than point size (3)');
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
	switch (axis) {
		case 'x':
			return [
				[1, 0, 0],
				[0, Math.cos(angle), -Math.sin(angle)],
				[0, Math.sin(angle), Math.cos(angle)]
			];
		case 'y':
			return [
				[Math.cos(angle), 0, -Math.sin(angle)],
				[0, 1, 0],
				[Math.sin(angle), 0, Math.cos(angle)]
			];
		case 'z':
			return [
				[Math.cos(angle), -Math.sin(angle), 0],
				[Math.sin(angle), Math.cos(angle), 0],
				[0, 0, 1]
			];
	}
}

// ===

export default class Engine {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private readonly centerX: number;
	private readonly centerY: number;

	private rotationAngle = 0;

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

	private clear(): void {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	public run(): void {
		this.clear();

		// Setup

		const square = new Shape(8);

		const size = 50;

		square.points[0] = [size, size, size];
		square.points[1] = [-size, size, size];
		square.points[2] = [size, -size, size];
		square.points[3] = [-size, -size, size];
		square.points[4] = [size, size, -size];
		square.points[5] = [-size, size, -size];
		square.points[6] = [size, -size, -size];
		square.points[7] = [-size, -size, -size];

		square.edges.push([0, 1]);
		square.edges.push([0, 2]);
		square.edges.push([0, 4]);
		square.edges.push([1, 3]);
		square.edges.push([1, 5]);
		square.edges.push([2, 3]);
		square.edges.push([2, 6]);
		square.edges.push([3, 7]);
		square.edges.push([4, 5]);
		square.edges.push([4, 6]);
		square.edges.push([5, 7]);
		square.edges.push([6, 7]);

		// Drawing

		const rotationX = getRotationProjection(this.rotationAngle, 'x');
		const rotationY = getRotationProjection(this.rotationAngle, 'y');
		const rotationZ = getRotationProjection(this.rotationAngle, 'z');

		const projected: Point[] = [];

		for (let point of square.points) {
			point = matrixMultiplyPoint(rotationX, point);
			point = matrixMultiplyPoint(rotationY, point);
			point = matrixMultiplyPoint(rotationZ, point);
			point = matrixMultiplyPoint(projection, point);
			this.drawPoint(point);
			projected.push(point);
		}

		for (const edge of square.edges) {
			this.drawLine(projected[edge[0]], projected[edge[1]]);
		}

		// Animation

		this.rotationAngle += 0.02;

		setTimeout(this.run.bind(this), 1000 / 60);
	}
}
