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
	 * Canvas used to display graphics
	 */
	private readonly canvas: HTMLCanvasElement;
	/**
	 * Canvas context 2D for drawing on canvas
	 */
	private readonly ctx: CanvasRenderingContext2D;
	/**
	 * Center X positionon canvas
	 */
	private readonly centerX: number;
	/**
	 * Center Y positionon canvas
	 */
	private readonly centerY: number;
	/**
	 * Camera object representing player
	 */
	private readonly camera: Camera;

	/**
	 * Renderer debug options
	 * @prop {boolean} wireframe - Draws triangle wireframe on shape
	 * @prop {boolean} clipping - Sets clipped triangle color to green
	 */
	public debugOptions = {
		wireframe: false,
		clipping: false
	};

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
		const lightDirection: Vector = vec.vector({ x: 0, y: 0, z: -1 });
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
	 * @param color Point color
	 */
	public drawPoint(point: Vector, color = '#FFFFFF'): void {
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
	 * @param color Line color
	 */
	public drawLine(a: Vector, b: Vector, color: string = '#FFFFFF'): void {
		this.ctx.strokeStyle = color;
		this.ctx.lineWidth = 1.5;
		this.ctx.beginPath();
		this.ctx.moveTo(a.x, this.canvas.height - a.y);
		this.ctx.lineTo(b.x, this.canvas.height - b.y);
		this.ctx.stroke();
		this.ctx.closePath();
	}

	/**
	 * Draws triangle based on given points
	 * @param a Point a
	 * @param b Point b
	 * @param c Point c
	 * @param color Triangle color
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
	 * @param color Triangle color
	 */
	private fillTriangle(a: Vector, b: Vector, c: Vector, color: string = '#FFFFFF'): void {
		this.ctx.fillStyle = color;
		this.ctx.beginPath();
		this.ctx.moveTo(a.x, this.canvas.height - a.y);
		this.ctx.lineTo(b.x, this.canvas.height - b.y);
		this.ctx.lineTo(c.x, this.canvas.height - c.y);
		this.ctx.moveTo(b.x, this.canvas.height - b.y);
		this.ctx.lineTo(c.x, this.canvas.height - c.y);
		this.ctx.fill();
		this.ctx.closePath();
		this.drawTriangle(a, b, c, color);
	}

	/**
	 * Draws given shape object
	 * @param shape Shape to draw
	 */
	public drawShape(shape: Shape): void {
		// Setup
		const triangles: Triangle[] = shape.triangles.map((tr) => tr.map((p) => p)) as Triangle[]; // Copies triangles
		const transformed: Triangle[] = [];
		const drawable: Triangle[] = [];

		const triangleColors = new Map<Triangle, string>();

		// Matrices
		// Shape view
		const vUp: Vector = vec.vector({ x: 0, y: 1, z: 0 });
		let vTarget: Vector = vec.vector({ x: 0, y: 0, z: 1 });
		const cameraRotationMatrix = vec.matrixRotation(this.camera.yaw, 'y');
		this.camera.lookDirection = vec.vectorMatrixMultiply(cameraRotationMatrix, vTarget);
		vTarget = vec.vectorAdd(this.camera.position, this.camera.lookDirection);
		const matCamera: number[][] = vec.matrixPointAt(this.camera.position, vTarget, vUp);
		const matViewRotation: number[][] = vec.matrixInverseRotation(matCamera);
		const matViewTranslation: Vector = vec.matrixInverseTranslation(
			this.camera.position,
			matCamera
		);

		// Shape rotation
		const rotationXMatrix: number[][] = vec.matrixRotation(shape.rotation.x, 'x');
		const rotationYMatrix: number[][] = vec.matrixRotation(shape.rotation.y, 'y');
		const rotationZMatrix: number[][] = vec.matrixRotation(shape.rotation.z, 'z');

		// Shape translation
		const translationMatrix: number[][] = vec.matrixTranslaton(
			vec.vector({
				x: shape.origin.x / shape.size,
				y: shape.origin.y / shape.size,
				z: shape.origin.z / shape.size
			})
		);
		const centeringMatrix: number[][] = vec.matrixTranslaton(
			vec.vector({
				x: this.centerX,
				y: this.centerY,
				z: 0
			})
		);

		// Shape projection
		const fov = 90;
		// const aspect = this.canvas.width / this.canvas.height;
		const aspect = 16 / 9;
		const near = 1;
		const far = 500;
		const projectionMatrix: number[][] = vec.matrixProjection(fov, aspect, far, near);

		for (const triangle of triangles) {
			// Transforming
			for (let i = 0; i < triangle.length; i++) {
				let point = triangle[i];
				// Rotating
				point = vec.vectorMatrixMultiply(rotationXMatrix, point);
				point = vec.vectorMatrixMultiply(rotationYMatrix, point);
				point = vec.vectorMatrixMultiply(rotationZMatrix, point);
				// Translating
				point = vec.vectorMatrixMultiply(translationMatrix, point);
				// Transformed points
				triangle[i] = point;
			}

			// Selecting triangle
			const normal = vec.vectorNormal(triangle[0], triangle[1], triangle[2]);
			const cameraRay = vec.vectorSubtract(triangle[0], this.camera.position);
			const dotProduct = vec.vectorDotProduct(cameraRay, normal);
			if (dotProduct > 0) continue;

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
				// TODO: change
				point = vec.vectorAdd(point, matViewTranslation);
				triangle[i] = point;
			}

			// Clipping
			// Clip setup
			const color = triangleColors.get(triangle) || 'red';
			triangleColors.delete(triangle);
			let clipped: Triangle[] = [];

			// Clipping against screen depth
			clipped = vec.triangleClippingAgainstPlane(
				vec.vector({ x: 0, y: 0, z: 1 }),
				vec.vector({ x: 0, y: 0, z: 1 }),
				triangle
			);

			// Skips if no clipped triangles
			if (clipped.length === 0) continue;

			// Projecting points to 2d
			for (const tri of clipped) {
				for (let i = 0; i < tri.length; i++) {
					let point = tri[i];
					// Projection
					point = vec.vectorMatrixMultiply(projectionMatrix, point);
					// Scaling
					point = vec.vectorMultiply(point, shape.size);
					// Centering
					point = vec.vectorMatrixMultiply(centeringMatrix, point);
					tri[i] = point;
				}
			}

			// Clips array of triangles
			const clipArray = (
				triangles: Triangle[],
				clipFn: (tr: Triangle) => Triangle[]
			): Triangle[] => {
				const result: Triangle[] = [];
				for (const tr of triangles) {
					const clippedTr: Triangle[] = clipFn(tr);
					for (const tr of clippedTr) {
						result.push(tr);
					}
				}
				return result;
			};

			// Clips against screan edges
			clipped = clipArray(clipped, (tr) =>
				vec.triangleClippingAgainstPlane(
					vec.vector({ x: 0, y: 0, z: 0 }),
					vec.vector({ x: 0, y: 1, z: 0 }),
					tr
				)
			);
			clipped = clipArray(clipped, (tr) =>
				vec.triangleClippingAgainstPlane(
					vec.vector({ x: 0, y: this.canvas.height - 1, z: 0 }),
					vec.vector({ x: 0, y: -1, z: 0 }),
					tr
				)
			);
			clipped = clipArray(clipped, (tr) =>
				vec.triangleClippingAgainstPlane(
					vec.vector({ x: 0, y: 0, z: 0 }),
					vec.vector({ x: 1, y: 0, z: 0 }),
					tr
				)
			);
			clipped = clipArray(clipped, (tr) =>
				vec.triangleClippingAgainstPlane(
					vec.vector({ x: this.canvas.width - 1, y: 0, z: 0 }),
					vec.vector({ x: -1, y: 0, z: 0 }),
					tr
				)
			);

			// Adds clipped triangles
			for (const ctr of clipped) {
				triangleColors.set(ctr, color);
				// Debug clipping
				if (this.debugOptions.clipping && ctr !== triangle) {
					triangleColors.set(ctr, 'green');
				}
				drawable.push(ctr);
			}
		}

		// Drawing traingles
		for (const triangle of drawable) {
			const color = triangleColors.get(triangle) || 'red';
			this.fillTriangle(triangle[0], triangle[1], triangle[2], color);
			// Debug wireframe
			if (this.debugOptions.wireframe) {
				this.drawTriangle(triangle[0], triangle[1], triangle[2], 'black');
			}
		}
	}

	/**
	 * Clears canvas
	 */
	public clear(): void {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}
