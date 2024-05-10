import Shape, { type Triangle } from './Shape';
import { type Vector } from './Vector';
import * as vec from './Vector';

export default class Renderer {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private readonly centerX: number;
	private readonly centerY: number;

	public vCamera: Vector = [0, 0, 0];
	public vLookDirection: Vector = [0, 0, 1];
	public yaw: number = 0;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		this.centerX = this.canvas.width / 2;
		this.centerY = this.canvas.height / 2;
	}

	// Calculations

	private calculateColor(normal: Vector, shape: Shape): string {
		const lightDirection: Vector = [0, 0, -1];
		const luminationFactor =
			normal[0] * lightDirection[0] + normal[1] * lightDirection[1] + normal[2] * lightDirection[2];
		const r = Math.floor(shape.colorObj.r * luminationFactor);
		const g = Math.floor(shape.colorObj.g * luminationFactor);
		const b = Math.floor(shape.colorObj.b * luminationFactor);
		return `rgb(${r} ${g} ${b})`;
	}

	// Drawing

	private drawPoint(point: Vector): void {
		this.ctx.fillStyle = '#FFFFFF';
		this.ctx.beginPath();
		this.ctx.arc(this.centerX + point[0], this.centerY - point[1], 3, 0, Math.PI * 2);
		this.ctx.fill();
		this.ctx.closePath();
	}

	private drawLine(a: Vector, b: Vector, color: string = '#FFFFFF') {
		this.ctx.strokeStyle = color;
		this.ctx.lineWidth = 1.5;
		this.ctx.beginPath();
		this.ctx.moveTo(this.centerX + a[0], this.centerY - a[1]);
		this.ctx.lineTo(this.centerX + b[0], this.centerY - b[1]);
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
		this.ctx.moveTo(this.centerX + a[0], this.centerY - a[1]);
		this.ctx.lineTo(this.centerX + b[0], this.centerY - b[1]);
		this.ctx.lineTo(this.centerX + c[0], this.centerY - c[1]);
		this.ctx.moveTo(this.centerX + b[0], this.centerY - b[1]);
		this.ctx.lineTo(this.centerX + c[0], this.centerY - c[1]);
		this.ctx.fill();
		this.ctx.closePath();
		this.drawTriangle(a, b, c, color);
	}

	// TMP

	public moveForward(): void {
		const vMove = vec.vectorMultiply(this.vLookDirection, 0.1);
		this.vCamera = vec.vectorAdd(this.vCamera, vMove);
	}

	public moveBackward(): void {
		const vMove = vec.vectorMultiply(this.vLookDirection, 0.1);
		this.vCamera = vec.vectorSubtract(this.vCamera, vMove);
	}

	// /TMP

	public drawShape(shape: Shape) {
		// View
		const vUp: Vector = [0, 1, 0];
		let vTarget: Vector = [0, 0, 1];
		this.vLookDirection = vec.vectorRotate(vTarget, this.yaw, 'y');
		vTarget = vec.vectorAdd(this.vCamera, this.vLookDirection);

		const matCamera: Vector[] = vec.matrixPointAt(this.vCamera, vTarget, vUp);
		const matViewRotation: Vector[] = vec.matrixInverseRotation(matCamera);
		const matViewTranslation: Vector = vec.matrixInverseTranslation(this.vCamera, matCamera);

		// Pipeline stages
		const pointsTransformed: Vector[] = [];
		const pointsProjected: Vector[] = [];

		const visibleTriangles: Triangle[] = [];
		const triangleColors = new Map<Triangle, string>();

		// Transforming
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
			// Transformed points
			pointsTransformed.push(point);
		}

		// Selecting triangles
		for (const triangle of shape.triangles) {
			const normal = vec.vectorNormal(
				pointsTransformed[triangle[0]],
				pointsTransformed[triangle[1]],
				pointsTransformed[triangle[2]]
			);
			const dotProduct = vec.vectorDotProduct(
				vec.vectorSubtract(pointsTransformed[triangle[0]], this.vCamera),
				normal
			);
			if (dotProduct > 0.0) continue;
			// Iluminating triangles
			const color = this.calculateColor(normal, shape);
			triangleColors.set(triangle, color);
			// Selected triangles
			visibleTriangles.push(triangle);
		}

		// Projecting points
		for (let point of pointsTransformed) {
			// Moving by view
			point = vec.vectorMatrixMultiply(matViewRotation, point);
			point = vec.vectorAdd(point, matViewTranslation);
			// Projecting to 2d
			point = vec.vectorProject2d(point);
			// Scaling
			point = vec.vectorMultiply(point, shape.size);
			pointsProjected.push(point);
		}

		// Sorting triangles by perspective (painter's algorithm)
		visibleTriangles.sort((a, b) => {
			const zA = pointsProjected[a[0]][2] + pointsProjected[a[1]][2] + pointsProjected[a[2]][2];
			const zB = pointsProjected[b[0]][2] + pointsProjected[b[1]][2] + pointsProjected[b[2]][2];
			return zB - zA;
		});

		// Drawing traingles
		for (const triangle of visibleTriangles) {
			const color = triangleColors.get(triangle) || 'red';
			this.fillTriangle(
				pointsProjected[triangle[0]],
				pointsProjected[triangle[1]],
				pointsProjected[triangle[2]],
				color
			);
		}
	}

	public clear(): void {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}
