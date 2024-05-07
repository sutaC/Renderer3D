import cubeObj from './shapes/cube.json';
import prismObj from './shapes/prism.json';
import prismSqBObj from './shapes/prismSqB.json';

interface ShapeObject {
	name: string;
	points: number[][];
	triangles: number[][];
}

interface ColorObject {
	hex: string;
	r: number;
	g: number;
	b: number;
}

export type Point = [x: number, y: number, z: number];
export type Triangle = [aIdx: number, bIdx: number, cIdx: number];

export type ShapeNames = 'cube' | 'prism' | 'prismSqB';

export default class Shape {
	public readonly points: Point[];
	public readonly triangles: Triangle[];

	public originZ: number = 300;

	public rotationX: number = 0;
	public rotationY: number = 0;
	public rotationZ: number = 0;

	public size: number = 1;

	public colorObj: ColorObject = {
		hex: '#FFFFFF',
		r: 255,
		g: 255,
		b: 255
	};
	public shadow: number = 3;

	constructor(points: Point[] = [], triangles: Triangle[] = []) {
		this.points = points;
		this.triangles = triangles;
	}

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

	private static copyShapeParams(shape: Shape, origin: Shape): void {
		shape.size = origin.size;
		shape.originZ = origin.originZ;
		shape.rotationX = origin.rotationX;
		shape.rotationY = origin.rotationY;
		shape.rotationZ = origin.rotationZ;
		shape.colorObj = origin.colorObj;
		shape.shadow = origin.shadow;
	}

	public static createShape(name: ShapeNames, size: number = 100, origin?: Shape) {
		let obj: ShapeObject;
		switch (name) {
			case 'cube':
				obj = cubeObj;
				break;
			case 'prism':
				obj = prismObj;
				break;
			case 'prismSqB':
				obj = prismSqBObj;
				break;
		}
		const shp = new Shape(obj.points as Point[], obj.triangles as Triangle[]);
		shp.size = size;
		if (origin) {
			this.copyShapeParams(shp, origin);
		}
		return shp;
	}

	public static createShapeFromObjFile(file: File, origin?: Shape): Promise<Shape> {
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
				const shape = new Shape();
				const read = result.split('\n');
				for (let i = 0; i < read.length; i++) {
					const line = read[i];

					if (line.length === 0) continue;
					const pivot = line.indexOf(' ');
					const type = line.substring(0, pivot);
					const data = line.substring(pivot + 1, line.length);
					if (type === 'v') {
						const vertices = data
							.split(' ')
							.filter((v) => v.length > 0)
							.map((v) => (v.includes('\r') ? v.substring(0, v.indexOf('\r')) : v));
						if (vertices.length !== 3) {
							console.error(vertices);
							return reject(`Not suported vertices was provided at line ${i}: "${data}"`);
						}
						const x = Number(vertices[0]);
						const y = Number(vertices[1]);
						const z = Number(vertices[2]);
						const point: Point = [x, y, z];
						shape.points.push(point);
					} else if (type === 'f') {
						const faces = data.split(' ');
						if (faces.length !== 3) {
							console.error(faces);
							return reject(
								`Not suported face was provided at line ${i}, engine only supports faces of 3 vertices and got provided with ${faces.length}`
							);
						}
						const v1 = Number(faces[0].split('/')[0]) - 1;
						const v2 = Number(faces[1].split('/')[0]) - 1;
						const v3 = Number(faces[2].split('/')[0]) - 1;
						const triangle: Triangle = [v1, v2, v3];
						shape.triangles.push(triangle);
					}
				}
				if (origin) {
					this.copyShapeParams(shape, origin);
				}
				return resolve(shape);
			});
			fileReader.readAsText(file);
		});
	}
}
