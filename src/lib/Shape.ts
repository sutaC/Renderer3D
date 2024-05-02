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
		const cube = new Shape();

		cube.points[0] = [0.5, 0.5, 0.5];
		cube.points[1] = [-0.5, 0.5, 0.5];
		cube.points[2] = [0.5, -0.5, 0.5];
		cube.points[3] = [-0.5, -0.5, 0.5];
		cube.points[4] = [0.5, 0.5, -0.5];
		cube.points[5] = [-0.5, 0.5, -0.5];
		cube.points[6] = [0.5, -0.5, -0.5];
		cube.points[7] = [-0.5, -0.5, -0.5];

		cube.edges.push([0, 1]);
		cube.edges.push([0, 2]);
		cube.edges.push([0, 4]);
		cube.edges.push([1, 3]);
		cube.edges.push([1, 5]);
		cube.edges.push([2, 3]);
		cube.edges.push([2, 6]);
		cube.edges.push([3, 7]);
		cube.edges.push([4, 5]);
		cube.edges.push([4, 6]);
		cube.edges.push([5, 7]);
		cube.edges.push([6, 7]);

		cube.size = size;

		return cube;
	}

	public static createPrism(size: number = 100): Shape {
		const prism = new Shape();

		const w = 1;
		const h = 0.866;

		prism.points[0] = [-w / 2, -h / 3, h / 3]; // bottom
		prism.points[1] = [w / 2, -h / 3, h / 3]; // bottom
		prism.points[2] = [0, -h / 3, -((h * 2) / 3)]; // bottom
		prism.points[3] = [0, (h * 2) / 3, 0]; // top

		prism.edges.push([0, 1]);
		prism.edges.push([1, 2]);
		prism.edges.push([2, 0]);

		prism.edges.push([0, 3]);
		prism.edges.push([1, 3]);
		prism.edges.push([2, 3]);

		prism.size = size;

		return prism;
	}
}
