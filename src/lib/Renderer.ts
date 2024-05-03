import Shape, { type Point, type Triangle } from './Shape';

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

function calculateNormal(a: Point, b: Point, c: Point): Point {
	const normal: Point = [0, 0, 0],
		lineA: Point = [0, 0, 0],
		lineB: Point = [0, 0, 0];

	lineA[0] = b[0] - a[0];
	lineA[1] = b[1] - a[1];
	lineA[2] = b[2] - a[2];

	lineB[0] = c[0] - a[0];
	lineB[1] = c[1] - a[1];
	lineB[2] = c[2] - a[2];

	normal[0] = lineA[1] * lineB[2] - lineA[2] * lineB[1];
	normal[1] = lineA[2] * lineB[0] - lineA[0] * lineB[2];
	normal[2] = lineA[0] * lineB[1] - lineA[1] * lineB[0];

	const l = Math.sqrt(normal[0] ** 2 + normal[1] ** 2 + normal[2] ** 2);
	normal[0] /= l;
	normal[1] /= l;
	normal[2] /= l;
	return normal;
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

	private drawLine(a: Point, b: Point, color: string = '#FFFFFF') {
		this.ctx.strokeStyle = color;
		this.ctx.lineWidth = 2;
		this.ctx.beginPath();
		this.ctx.moveTo(this.centerX + a[0], this.centerY + a[1]);
		this.ctx.lineTo(this.centerX + b[0], this.centerY + b[1]);
		this.ctx.stroke();
		this.ctx.closePath();
	}

	private drawTriangle(a: Point, b: Point, c: Point, color?: string): void {
		this.drawLine(a, b, color);
		this.drawLine(a, c, color);
		this.drawLine(b, c, color);
	}

	private fillTriangle(a: Point, b: Point, c: Point, color: string = '#FFFFFF'): void {
		this.ctx.fillStyle = color;
		this.ctx.beginPath();
		this.ctx.moveTo(this.centerX + a[0], this.centerY + a[1]);
		this.ctx.lineTo(this.centerX + b[0], this.centerY + b[1]);
		this.ctx.lineTo(this.centerX + c[0], this.centerY + c[1]);
		this.ctx.moveTo(this.centerX + b[0], this.centerY + b[1]);
		this.ctx.lineTo(this.centerX + c[0], this.centerY + c[1]);
		this.ctx.fill();
		this.ctx.closePath();
		this.drawTriangle(a, b, c, color);
	}

	public drawShape(shape: Shape, drawPoints: boolean = false) {
		// Rotating
		const rotated: Point[] = [];
		const rotationX = getRotationProjection(shape.rotationX, 'x');
		const rotationY = getRotationProjection(shape.rotationY, 'y');
		const rotationZ = getRotationProjection(shape.rotationZ, 'z');
		for (let point of shape.points) {
			point = matrixMultiplyPoint(rotationX, point);
			point = matrixMultiplyPoint(rotationY, point);
			point = matrixMultiplyPoint(rotationZ, point);
			rotated.push(point);
		}

		// Is to draw
		const toDraw: Triangle[] = [];
		const cameraPosition: Point = [0, 0, shape.originZ / shape.size];
		const colors = new Map<Triangle, string>();
		for (const triangle of shape.triangles) {
			const trianglePoints = {
				a: rotated[triangle[0]],
				b: rotated[triangle[1]],
				c: rotated[triangle[2]]
			};
			const normal = calculateNormal(trianglePoints.a, trianglePoints.b, trianglePoints.c);
			const dotPoint =
				normal[0] * (trianglePoints.a[0] - cameraPosition[0]) +
				normal[1] * (trianglePoints.a[1] - cameraPosition[1]) +
				normal[2] * (trianglePoints.a[2] - cameraPosition[2]);
			if (dotPoint > 0.0) continue;
			const dotPointLumination =
				normal[0] * cameraPosition[0] +
				normal[1] * cameraPosition[1] +
				normal[2] * cameraPosition[2];
			const colorFactor = Math.floor(255 * (dotPointLumination / 2));
			const color = `rgb(${colorFactor} ${colorFactor} ${colorFactor}	)`;
			colors.set(triangle, color);
			toDraw.push(triangle);
		}

		// Projecting
		const projected: Point[] = [];
		const distance = shape.originZ / shape.size;
		for (let point of rotated) {
			const z = 1 / (distance - point[2]);
			const projection: Point[] = [
				[z, 0, 0],
				[0, z, 0]
			];
			point = matrixMultiplyPoint(projection, point);
			scalePoint(point, shape.size);
			projected.push(point);
			if (drawPoints) this.drawPoint(point);
		}

		// Drawing
		for (const triangle of toDraw) {
			const color = colors.get(triangle) || '#ffffff';
			this.fillTriangle(
				projected[triangle[0]],
				projected[triangle[1]],
				projected[triangle[2]],
				color
			);
		}
	}

	public clear(): void {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}
