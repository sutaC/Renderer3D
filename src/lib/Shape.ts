export type Point = [x: number, y: number, z: number];

export default class Shape {
	public readonly points: Point[] = [];
	public readonly edges: [number, number][] = [];

	public originX: number = 0;
	public originY: number = 0;
	public distance: number = 1.25;

	public rotationX: number = 0;
	public rotationY: number = 0;
	public rotationZ: number = 0;

	public size: number = 1;

	// Shapes

	public static createCube(size: number = 100): Shape {
		const shp = new Shape();

		shp.points[0] = [0.5, 0.5, 0.5];
		shp.points[1] = [-0.5, 0.5, 0.5];
		shp.points[2] = [0.5, -0.5, 0.5];
		shp.points[3] = [-0.5, -0.5, 0.5];
		shp.points[4] = [0.5, 0.5, -0.5];
		shp.points[5] = [-0.5, 0.5, -0.5];
		shp.points[6] = [0.5, -0.5, -0.5];
		shp.points[7] = [-0.5, -0.5, -0.5];

		shp.edges.push([0, 1]);
		shp.edges.push([0, 2]);
		shp.edges.push([0, 4]);
		shp.edges.push([1, 3]);
		shp.edges.push([1, 5]);
		shp.edges.push([2, 3]);
		shp.edges.push([2, 6]);
		shp.edges.push([3, 7]);
		shp.edges.push([4, 5]);
		shp.edges.push([4, 6]);
		shp.edges.push([5, 7]);
		shp.edges.push([6, 7]);

		shp.size = size;

		return shp;
	}

	public static createPrism(size: number = 100): Shape {
		const shp = new Shape();

		const w = 1;
		const h = 0.866;

		shp.points[0] = [-w / 2, -h / 3, h / 3]; // bottom
		shp.points[1] = [w / 2, -h / 3, h / 3]; // bottom
		shp.points[2] = [0, -h / 3, -((h * 2) / 3)]; // bottom
		shp.points[3] = [0, (h * 2) / 3, 0]; // top

		shp.edges.push([0, 1]);
		shp.edges.push([1, 2]);
		shp.edges.push([2, 0]);
		shp.edges.push([0, 3]);
		shp.edges.push([1, 3]);
		shp.edges.push([2, 3]);

		shp.size = size;

		return shp;
	}

	public static createPrismSqB(size: number = 100): Shape {
		const shp = new Shape();

		const w = 1;
		const h = 0.866;

		shp.points[0] = [-w / 2, -h / 3, w / 2]; // bottom
		shp.points[1] = [-w / 2, -h / 3, -w / 2]; // bottom
		shp.points[2] = [w / 2, -h / 3, -w / 2]; // bottom
		shp.points[3] = [w / 2, -h / 3, w / 2]; // bottom
		shp.points[4] = [0, (h * 2) / 3, 0]; // top

		shp.edges.push([0, 1]);
		shp.edges.push([1, 2]);
		shp.edges.push([2, 3]);
		shp.edges.push([3, 0]);

		shp.edges.push([0, 4]);
		shp.edges.push([1, 4]);
		shp.edges.push([2, 4]);
		shp.edges.push([3, 4]);

		shp.size = size;

		return shp;
	}
}
