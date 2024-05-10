import Shape, { type Triangle } from './Shape';
import { type Vector } from './Vector';
import * as vec from './Vector';

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

	private drawPoint(point: Vector): void {
		this.ctx.fillStyle = '#FFFFFF';
		this.ctx.beginPath();
		this.ctx.arc(this.centerX + point[0], this.centerY + point[1], 3, 0, Math.PI * 2);
		this.ctx.fill();
		this.ctx.closePath();
	}

	private drawLine(a: Vector, b: Vector, color: string = '#FFFFFF') {
		this.ctx.strokeStyle = color;
		this.ctx.lineWidth = 1.5;
		this.ctx.beginPath();
		this.ctx.moveTo(this.centerX + a[0], this.centerY + a[1]);
		this.ctx.lineTo(this.centerX + b[0], this.centerY + b[1]);
		this.ctx.stroke();
		this.ctx.closePath();
	}

	private drawTriangle(a: Vector, b: Vector, c: Vector, color?: string): void {
		this.drawLine(a, b, color);
		this.drawLine(a, c, color);
		this.drawLine(b, c, color);
	}

	private fillTriangle(a: Vector, b: Vector, c: Vector, color: string = '#FFFFFF'): void {
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
		// Transforming
		const transformed: Vector[] = [];

		const translationVec: Vector = [
			shape.origin.x / shape.size,
			shape.origin.y / shape.size,
			shape.origin.z / shape.size
		];
		for (let point of shape.points) {
			// Rotating
			point = vec.vectorRotate(point, shape.rotation.x, 'x');
			point = vec.vectorRotate(point, shape.rotation.y, 'y');
			point = vec.vectorRotate(point, shape.rotation.z, 'z');
			// Translating
			point = vec.vectorAdd(point, translationVec);
			// Transformed elements
			transformed.push(point);
		}

		// Is to draw
		const toDraw: Triangle[] = [];
		const cameraPosition: Vector = [0, 0, 0];
		const colors = new Map<Triangle, string>();
		for (const triangle of shape.triangles) {
			const trianglePoints = {
				a: transformed[triangle[0]],
				b: transformed[triangle[1]],
				c: transformed[triangle[2]]
			};
			const normal = vec.calculateNormal(trianglePoints.a, trianglePoints.b, trianglePoints.c);
			const dotPoint =
				normal[0] * (trianglePoints.a[0] - cameraPosition[0]) +
				normal[1] * (trianglePoints.a[1] - cameraPosition[1]) +
				normal[2] * (trianglePoints.a[2] - cameraPosition[2]);
			if (dotPoint > 0.0) continue;
			// Ilumination
			const lightDirection: Vector = [0, 0, -1];
			const luminationFactor =
				normal[0] * lightDirection[0] +
				normal[1] * lightDirection[1] +
				normal[2] * lightDirection[2];
			const r = Math.floor(shape.colorObj.r * luminationFactor);
			const g = Math.floor(shape.colorObj.g * luminationFactor);
			const b = Math.floor(shape.colorObj.b * luminationFactor);
			const color = `rgb(${r} ${g} ${b})`;
			colors.set(triangle, color);
			toDraw.push(triangle);
		}

		// Projecting
		const projected: Vector[] = [];
		for (let point of transformed) {
			point = vec.vectorProject2d(point);
			point = vec.vectorScale(point, shape.size);
			projected.push(point);
			if (drawPoints) this.drawPoint(point);
		}

		// Painters algorithm for perspective
		toDraw.sort((a, b) => {
			const zA = (projected[a[0]][2] + projected[a[1]][2] + projected[a[2]][2]) / 3;
			const zB = (projected[b[0]][2] + projected[b[1]][2] + projected[b[2]][2]) / 3;
			return zB - zA;
		});

		// Drawing
		for (const triangle of toDraw) {
			const color = colors.get(triangle) || 'red';
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
