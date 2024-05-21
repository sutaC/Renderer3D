import { Shape, type ColorObject, type Triangle } from './Shape';
import type { Vector, Matrix } from './Vector';
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
 * Renderer debug options
 * @prop {boolean} wireframe - Draws triangle wireframe on shape
 * @prop {boolean} clipping - Sets clipped triangle color to green
 * @prop {boolean} points - Draws points of shape
 */
export type RendererDebugOptions = {
	wireframe: boolean;
	clipping: boolean;
	points: boolean;
};

/**
 * Graphics rendering options
 * @prop {number} fov - Field of View in degrees
 */
export type GraphicsOptions = {
	fov: number;
};

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
	 * Camera object representing player
	 */
	private readonly camera: Camera;

	/**
	 * Debug options
	 */
	public readonly debugOptions: RendererDebugOptions = {
		wireframe: false,
		clipping: false,
		points: false
	};

	public readonly graphicsOptions: GraphicsOptions = {
		fov: 45
	};

	/**
	 * @param canvas Canvas used to display graphics
	 * @param camera Camera object representing player
	 */
	constructor(canvas: HTMLCanvasElement, camera: Camera) {
		this.camera = camera;
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
	}

	// Calculations
	/**
	 * Calculates triangles color after shading
	 * @param normal Normal of triangle
	 * @param colorObj Base color information
	 * @returns Color in rgb notation
	 */
	private calculateColor(normal: Vector, colorObj: ColorObject): string {
		const lightDirection: Vector = vec.vector({ x: 0, y: 0.5, z: normal.z });
		const luminationFactor = Math.max(0.1, vec.vectorDotProduct(normal, lightDirection));
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
		this.ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
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
		this.ctx.moveTo(a.x, a.y);
		this.ctx.lineTo(b.x, b.y);
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
		this.ctx.moveTo(a.x, a.y);
		this.ctx.lineTo(b.x, b.y);
		this.ctx.lineTo(c.x, c.y);
		this.ctx.moveTo(b.x, b.y);
		this.ctx.lineTo(c.x, c.y);
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

		const cameraMatrix: Matrix = vec.matrixPointAt(this.camera.position, vTarget, vUp);
		const viewMatrix: Matrix = vec.matrixInverse(cameraMatrix);

		// Shape rotation
		const rotationXMatrix: Matrix = vec.matrixRotation(shape.rotation.x, 'x');
		const rotationYMatrix: Matrix = vec.matrixRotation(shape.rotation.y, 'y');
		const rotationZMatrix: Matrix = vec.matrixRotation(shape.rotation.z, 'z');

		// Shape translation
		const translationMatrix: Matrix = vec.matrixTranslaton(
			vec.vector({
				x: shape.origin.x / shape.size,
				y: shape.origin.y / shape.size,
				z: shape.origin.z / shape.size
			})
		);
		const centeringMatrix: Matrix = vec.matrixTranslaton(
			vec.vector({
				x: this.canvas.width / 2,
				y: this.canvas.height / 2,
				z: 0
			})
		);

		// Shape projection
		const aspect = this.canvas.width / this.canvas.height;
		const near = 0.5;
		const far = 1000;
		const projectionMatrix: Matrix = vec.matrixProjection(
			this.graphicsOptions.fov,
			aspect,
			far,
			near
		);

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

			// Views points
			for (let i = 0; i < triangle.length; i++) {
				let point = triangle[i];
				// Moving by view
				point = vec.vectorMatrixMultiply(viewMatrix, point);
				triangle[i] = point;
			}

			transformed.push(triangle);
		}

		// Sorting triangles by perspective (painter's algorithm)
		transformed.sort((a, b) => {
			const zA = a[0].z + a[1].z + a[2].z;
			const zB = b[0].z + b[1].z + b[2].z;
			return zB - zA;
		});

		for (const triangle of transformed) {
			// Clipping
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

					// Perspectivic devision
					point = vec.vectorDevide(point, point.w);

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
			if (this.debugOptions.points) {
				for (const point of triangle) {
					this.drawPoint(point, 'blue');
				}
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
