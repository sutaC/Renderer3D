import { vector, type Vector } from './Vector';

/**
 * Interface for handling shape color
 */
export interface ColorObject {
	/**
	 * Color in hex notation
	 */
	hex: string;
	/**
	 * Color red value in rgb notation
	 */
	r: number;
	/**
	 * Color green value in rgb notation
	 */
	g: number;
	/**
	 * Color blue value in rgb notation
	 */
	b: number;
}

/**
 * Triangle tuple list containing indexes of points of which it consists
 */
export type Triangle = [a: Vector, b: Vector, c: Vector];

/**
 * Names of shapes stored in JSON files
 */
export type ShapeNames = 'cube' | 'prism' | 'piramid' | 'cup' | 'diamond' | 'teapot';

/**
 * Shape class defining shapes understandable by the renderer
 */
export class Shape {
	/**
	 * Triangles that make up a shape
	 */
	public readonly triangles: Triangle[];

	/**
	 * Position of shapes origin
	 */
	public origin: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
	/**
	 * Rotation of shape
	 */
	public rotation: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
	/**
	 * Size of shape
	 */
	public size: number = 100;
	/**
	 * Color of shape
	 */
	public colorObj: ColorObject = {
		hex: '#FFFFFF',
		r: 255,
		g: 255,
		b: 255
	};

	/**
	 * @param triangles Triangles that make up a shape
	 */
	constructor(triangles: Triangle[] = []) {
		this.triangles = triangles;
	}

	/**
	 * Sets new color for object calculaing rgb values
	 * @param hex Color in hex notation
	 */
	public setColor(hex: string): void {
		if (hex.length !== 7) {
			console.error('Not proper hex string was provided', hex);
			return;
		}
		this.colorObj = {
			hex,
			r: Number.parseInt(hex.substring(1, 3), 16),
			g: Number.parseInt(hex.substring(3, 5), 16),
			b: Number.parseInt(hex.substring(5, 7), 16)
		};
	}

	// Shapes

	/**
	 * Copies origin params to shape
	 * @param shape Shape to to which it is copied
	 * @param origin Shape from which it is copied
	 */
	public static copyShapeParams(shape: Shape, origin: Shape): void {
		shape.size = origin.size;
		shape.origin = origin.origin;
		shape.rotation = origin.rotation;
		shape.colorObj = origin.colorObj;
	}

	/**
	 * Parses text in `.obj` file notation into shape object
	 * @param text Text in `.obj` file notation
	 * @returns New shape from given text
	 */
	public static parseToShape(text: string): Shape {
		const points: Vector[] = [];
		const trianglesIdx: number[][] = [];

		const read = text.split('\n');
		for (let i = 0; i < read.length; i++) {
			const line = read[i];

			if (line.length === 0) continue;
			const pivot = line.indexOf(' ');
			const type = line.substring(0, pivot);
			const data = line.substring(pivot + 1, line.length);
			if (type === 'v') {
				const vertices = data
					.split(' ')
					.map((v) => v.replaceAll(/[^0-9.-]/gm, '')) // Removes all non-digits
					.filter((v) => v.length > 0);

				if (vertices.length !== 3) {
					console.error(vertices);
					throw new Error(`Not suported vertices was provided at line ${i}: "${data}"`);
				}
				const x = Number(vertices[0]);
				const y = Number(vertices[1]);
				const z = Number(vertices[2]);
				const point: Vector = vector({ x, y, z });
				points.push(point);
			} else if (type === 'f') {
				const faces = data.split(' ');
				if (faces.length !== 3) {
					console.error(faces);
					throw new Error(
						`Not suported face was provided at line ${i}, engine only supports faces of 3 vertices and got provided with ${faces.length}`
					);
				}
				const v1 = Number(faces[0].split('/')[0]) - 1;
				const v2 = Number(faces[1].split('/')[0]) - 1;
				const v3 = Number(faces[2].split('/')[0]) - 1;
				const trIdx: number[] = [v1, v2, v3];
				trianglesIdx.push(trIdx);
			}
		}

		const triangles: Triangle[] = trianglesIdx.map(
			(tri) => [points[tri[0]], points[tri[1]], points[tri[2]]] as Triangle
		);

		return new Shape(triangles);
	}

	/**
	 * Creates shape from given `.obj` file
	 * @param file `.obj` file
	 * @returns New shape from given file
	 */
	public static createShapeFromObjFile(file: File): Promise<Shape> {
		const extension = file.name.substring(file.name.lastIndexOf('.'));
		if (extension !== '.obj') {
			throw new Error(
				"Wrong file format was provided, accepts only '.obj' files, not " + extension
			);
		}
		return new Promise<Shape>((resolve, reject) => {
			const fileReader = new FileReader();
			fileReader.addEventListener('load', (event) => {
				const result = event.target?.result as String | undefined;
				if (!result) {
					console.error(event);
					return reject('Error ocurred while reading file');
				}
				try {
					const shape: Shape = this.parseToShape(result as string);
					return resolve(shape);
				} catch (error) {
					return reject(`Error ocurred while shape parsing: ${error}`);
				}
			});
			fileReader.readAsText(file);
		});
	}

	/**
	 * Loads shape from given ulr pointing to `.obj` file
	 * @param url Ulr pointing to `.obj` file
	 * @returns New shape loaded from given url
	 */
	public static async loadShape(url: string): Promise<Shape> {
		const result = await fetch(url);
		if (!result.ok) {
			throw new Error("Couldn't fetch file from given url");
		}
		const data = await result.text();
		const shape = this.parseToShape(data);
		return shape;
	}
}
