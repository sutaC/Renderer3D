import { Shape, type ColorObject, type Triangle } from './Shape';
import { type Vector } from './Vector';
import * as vec from './Vector';

/**
 * Camera representation interface
 */
export interface Camera {
	/**
	 * Position vector of camera
	 */
	position: Vector;
	/**
	 * Direction which camera is facing
	 */
	lookDirection: Vector;
	/**
	 * Camera yaw rotation (Y axis)
	 */
	yaw: number;
}

/**
 * Engine module for handling graphics
 */
export class Renderer {
	/**
	 * Canvas used to display graphics [readonly]
	 */
	private readonly canvas: HTMLCanvasElement;
	/**
	 * Canvas context 2D for drawing on canvas [readonly]
	 */
	private readonly ctx: CanvasRenderingContext2D;
	/**
	 * Center X positionon canvas [readonly]
	 */
	private readonly centerX: number;
	/**
	 * Center Y positionon canvas [readonly]
	 */
	private readonly centerY: number;
	/**
	 * Camera object representing player [readonly]
	 */
	private readonly camera: Camera;

	/**
	 * @param canvas Canvas used to display graphics
	 * @param camera Camera object representing player
	 */
	constructor(canvas: HTMLCanvasElement, camera: Camera) {
		this.camera = camera;
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		this.centerX = this.canvas.width / 2;
		this.centerY = this.canvas.height / 2;
	}

	// Calculations

	/**
	 * Calculates triangles color after shading
	 * @param normal Normal of triangle
	 * @param colorObj Base color information
	 * @returns Color in rgb notation
	 */
	private calculateColor(normal: Vector, colorObj: ColorObject): string {
		const lightDirection: Vector = { x: 0, y: 0, z: -1 };
		const luminationFactor =
			normal.x * lightDirection.x + normal.y * lightDirection.y + normal.z * lightDirection.z;
		const r = Math.floor(colorObj.r * luminationFactor);
		const g = Math.floor(colorObj.g * luminationFactor);
		const b = Math.floor(colorObj.b * luminationFactor);
		return `rgb(${r} ${g} ${b})`;
	}

	// Drawing

	/**
	 * Draws given point
	 * @param point Point to draw
	 * @param color Point color [default='#FFFFFF']
	 */
	private drawPoint(point: Vector, color = '#FFFFFF'): void {
		this.ctx.fillStyle = color;
		this.ctx.beginPath();
		this.ctx.arc(this.centerX + point.x, this.centerY - point.y, 3, 0, Math.PI * 2);
		this.ctx.fill();
		this.ctx.closePath();
	}

	/**
	 * Draws line between two given points
	 * @param a Point a
	 * @param b Point b
	 * @param color Line color [default='#FFFFFF']
	 */
	private drawLine(a: Vector, b: Vector, color: string = '#FFFFFF'): void {
		this.ctx.strokeStyle = color;
		this.ctx.lineWidth = 1.5;
		this.ctx.beginPath();
		this.ctx.moveTo(this.centerX + a.x, this.centerY - a.y);
		this.ctx.lineTo(this.centerX + b.x, this.centerY - b.y);
		this.ctx.stroke();
		this.ctx.closePath();
	}

	/**
	 * Draws triangle based on given points
	 * @param a Point a
	 * @param b Point b
	 * @param c Point c
	 * @param color Triangle color [default='#FFFFFF']
	 */
	private drawTriangle(a: Vector, b: Vector, c: Vector, color: string = '#FFFFFF'): void {
		this.drawLine(a, b, color);
		this.drawLine(a, c, color);
		this.drawLine(b, c, color);
	}

	/**
	 * Fills triangle based on given points
	 * @param a Point a
	 * @param b Point b
	 * @param c Point c
	 * @param color Triangle color [default='#FFFFFF']
	 */
	private fillTriangle(a: Vector, b: Vector, c: Vector, color: string = '#FFFFFF'): void {
		this.ctx.fillStyle = color;
		this.ctx.beginPath();
		this.ctx.moveTo(this.centerX + a.x, this.centerY - a.y);
		this.ctx.lineTo(this.centerX + b.x, this.centerY - b.y);
		this.ctx.lineTo(this.centerX + c.x, this.centerY - c.y);
		this.ctx.moveTo(this.centerX + b.x, this.centerY - b.y);
		this.ctx.lineTo(this.centerX + c.x, this.centerY - c.y);
		this.ctx.fill();
		this.ctx.closePath();
		this.drawTriangle(a, b, c, color);
	}

	/**
	 * Draws given shape object
	 * @param shape Shape to draw
	 */
	public drawShape(shape: Shape): void {
		// View
		const vUp: Vector = { x: 0, y: 1, z: 0 };
		let vTarget: Vector = { x: 0, y: 0, z: 1 };
		this.camera.lookDirection = vec.vectorRotate(vTarget, this.camera.yaw, 'y');
		vTarget = vec.vectorAdd(this.camera.position, this.camera.lookDirection);

		const matCamera: number[][] = vec.matrixPointAt(this.camera.position, vTarget, vUp);
		const matViewRotation: number[][] = vec.matrixInverseRotation(matCamera);
		const matViewTranslation: Vector = vec.matrixInverseTranslation(
			this.camera.position,
			matCamera
		);

		const triangles: Triangle[] = shape.triangles.map((tr) => tr.map((p) => p)) as Triangle[]; // Copies triangles
		const transformed: Triangle[] = [];
		const drawable: Triangle[] = [];

		const triangleColors = new Map<Triangle, string>();

		const translationVec: Vector = {
			x: shape.origin.x / shape.size,
			y: shape.origin.y / shape.size,
			z: shape.origin.z / shape.size
		};

		for (const triangle of triangles) {
			// Transforming
			for (let i = 0; i < triangle.length; i++) {
				let point = triangle[i];
				// Rotating
				point = vec.vectorRotate(point, shape.rotation.x, 'x');
				point = vec.vectorRotate(point, shape.rotation.y, 'y');
				point = vec.vectorRotate(point, shape.rotation.z, 'z');
				// Translating
				point = vec.vectorAdd(point, translationVec);
				// Transformed points
				triangle[i] = point;
			}

			// Selecting triangle
			const normal = vec.vectorNormal(triangle[0], triangle[1], triangle[2]);
			const dotProduct = vec.vectorDotProduct(
				vec.vectorSubtract(triangle[0], this.camera.position),
				normal
			);
			if (dotProduct > 0.0) continue;

			// Iluminating triangle
			const color = this.calculateColor(normal, shape.colorObj);
			triangleColors.set(triangle, color);

			transformed.push(triangle);
		}

		// Sorting triangles by perspective (painter's algorithm)
		transformed.sort((a, b) => {
			const zA = a[0].z + a[1].z + a[2].z;
			const zB = b[0].z + b[1].z + b[2].z;
			return zB - zA;
		});

		for (const triangle of transformed) {
			// Views points
			for (let i = 0; i < triangle.length; i++) {
				let point = triangle[i];
				// Moving by view
				point = vec.vectorMatrixMultiply(matViewRotation, point);
				point = vec.vectorAdd(point, matViewTranslation);
				triangle[i] = point;
			}

			// Clip triangles

			const color = triangleColors.get(triangle) || 'red';

			// Clips by screen plane
			const clipped: Triangle[] = vec.triangleClippingAgainstPlane(
				{ x: 0, y: 0.5, z: 0 },
				{ x: 0, y: 0, z: 1 },
				triangle
			);
			// Adds clipped triangles
			for (const ctr of clipped) {
				triangleColors.set(ctr, color);
				drawable.push(ctr);
			}
		}

		for (const triangle of drawable) {
			// Projecting points to 2d
			for (let i = 0; i < triangle.length; i++) {
				let point = triangle[i];
				// Projection
				point = vec.vectorProject2d(point);
				// Scaling
				point = vec.vectorMultiply(point, shape.size);
				triangle[i] = point;
			}

			// Drawing traingles

			const color = triangleColors.get(triangle) || 'red';

			this.fillTriangle(triangle[0], triangle[1], triangle[2], color);
		}
	}

	/**
	 * Clears canvas
	 */
	public clear(): void {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}
