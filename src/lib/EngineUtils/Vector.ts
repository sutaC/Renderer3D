import type { Triangle } from './Shape';

export type Matrix = [
	[number, number, number, number],
	[number, number, number, number],
	[number, number, number, number],
	[number, number, number, number]
];

export interface Vector {
	x: number;
	y: number;
	z: number;
	w: number;
}

// Type transformations
/**
 * Creates vector with default values
 * @param vec Vector initializer
 */
export function vector(vec?: { x?: number; y?: number; z?: number; w?: number }): Vector {
	return {
		x: vec?.x || 0,
		y: vec?.y || 0,
		z: vec?.z || 0,
		w: vec?.w || 1
	};
}

/**
 * Covetrs array to vector
 * @param array Array to convert
 * @returns Converted array
 */
export function arrayToVector(array: number[]): Vector {
	if (array.length > 4) {
		throw new Error(
			'Could not convert array to vector, becouse array length is not too big to convert into vector'
		);
	}
	return vector({
		x: array[0],
		y: array[1],
		z: array[2],
		w: array[3]
	});
}

/**
 * Converts vector to array
 * @param vec Vector to convert
 * @returns Converted vector
 */
export function vectorToArray(vec: Vector): number[] {
	return [vec.x, vec.y, vec.z, vec.w];
}

/**
 * Adds two vectors
 * @param a Vector to add
 * @param b  Vector to add
 * @returns Vectors of sum
 */
export function vectorAdd(a: Vector, b: Vector): Vector {
	return vector({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });
}

// Operations

/**
 * Subtracts two vectors
 * @param a Vector to subtract
 * @param b	Subtractor vector
 * @returns Subtracted vector
 */
export function vectorSubtract(a: Vector, b: Vector): Vector {
	return vector({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
}

/**
 * Multiplies vector by given multiplier
 * @param vec Vector to multiply
 * @param multiplier Multiplier
 * @returns Multiplied vector
 */
export function vectorMultiply(vec: Vector, multiplier: number): Vector {
	return vector({ x: vec.x * multiplier, y: vec.y * multiplier, z: vec.z * multiplier });
}

/**
 * Devides vector by given devider
 * @param vec Vector to devide
 * @param divider Devider
 * @returns Devided vector
 */
export function vectorDevide(vec: Vector, divider: number): Vector {
	return vector({ x: vec.x / divider, y: vec.y / divider, z: vec.z / divider });
}

/**
 * Calculates length of given vector
 * @param vec Vector to which the length is calculated
 * @returns Vector length
 */
export function vectorLength(vec: Vector): number {
	return Math.sqrt(vec.x ** 2 + vec.y ** 2 + vec.z ** 2);
}

/**
 * Normalises given vector
 * @param vec Vector to normalise
 * @returns Normalised vector
 */
export function vectorNormalise(vec: Vector): Vector {
	const len = vectorLength(vec);
	return vector({ x: vec.x / len, y: vec.y / len, z: vec.z / len });
}

// Calculations

/**
 * Calculate cross product of two vectors
 * @param a Vector to calculate corss product
 * @param b Vector to calculate corss product
 * @returns Vector cross product
 */
export function vectorCrossProduct(a: Vector, b: Vector): Vector {
	return vector({
		x: a.y * b.z - a.z * b.y,
		y: a.z * b.x - a.x * b.z,
		z: a.x * b.y - a.y * b.x
	});
}

/**
 * Calculate normal of three vectors
 * @param a Vector to calculate normal
 * @param b Vector to calculate normal
 * @param c Vector to calculate normal
 * @returns Normal vector
 */
export function vectorNormal(a: Vector, b: Vector, c: Vector): Vector {
	const lineA: Vector = vectorSubtract(b, a);
	const lineB: Vector = vectorSubtract(c, a);
	const normal: Vector = vectorCrossProduct(lineA, lineB);
	return vectorNormalise(normal);
}

/**
 * Calculate dot product of two vectors
 * @param a Vetcor to claculate dot product
 * @param b Vetcor to claculate dot product
 * @returns Dot product
 */
export function vectorDotProduct(a: Vector, b: Vector): number {
	return a.x * b.x + a.y * b.y + a.z * b.z;
}

/**
 * Returns point where the line intesects with the plane
 * @param planePoint Point of the plane
 * @param planeNormal Normal of the plane
 * @param lineStart Start point of line
 * @param lineEnd End point of line
 * @returns Point of line intersection with plane
 */
export function vectorIntersectPlane(
	planePoint: Vector,
	planeNormal: Vector,
	lineStart: Vector,
	lineEnd: Vector
): Vector {
	planeNormal = vectorNormalise(planeNormal);
	const planeDotProduct = -vectorDotProduct(planePoint, planeNormal);
	const lineStartDotProduct = vectorDotProduct(lineStart, planeNormal);
	const lineEndDotProduct = vectorDotProduct(lineEnd, planeNormal);
	const t = (-planeDotProduct - lineStartDotProduct) / (lineEndDotProduct - lineStartDotProduct);
	const lineStartToEnd = vectorSubtract(lineEnd, lineStart);
	const lineToInntersect = vectorMultiply(lineStartToEnd, t);
	return vectorAdd(lineStart, lineToInntersect);
}

/**
 * Clips triangle off the plane
 * @param planePoint Point of the plane
 * @param planeNormal Normal of the plane
 * @param triangle Triangle to clip
 * @returns Clipped triangles
 */
export function triangleClippingAgainstPlane(
	planePoint: Vector,
	planeNormal: Vector,
	triangle: Triangle
): Triangle[] {
	planeNormal = vectorNormalise(planeNormal);

	// Return shortest distance from point to plane
	const distance = (point: Vector): number =>
		planeNormal.x * point.x +
		planeNormal.y * point.y +
		planeNormal.z * point.z -
		vectorDotProduct(planeNormal, planePoint);

	const insidePoints: Vector[] = [];
	const outsidePoints: Vector[] = [];

	for (let i = 0; i < triangle.length; i++) {
		const dist = distance(triangle[i]);
		if (dist >= 0) {
			insidePoints.push(triangle[i]);
		} else {
			outsidePoints.push(triangle[i]);
		}
	}

	if (insidePoints.length === 0) {
		// All points are outside of the plane, so clips the whole triangles
		return [];
	}

	if (insidePoints.length === 3) {
		// All points are inside of the plane, so clipping is no needed
		return [triangle];
	}

	if (insidePoints.length === 1 && outsidePoints.length === 2) {
		// Returns new smaller triangle
		const newPoint1 = vectorIntersectPlane(
			planePoint,
			planeNormal,
			insidePoints[0],
			outsidePoints[0]
		);
		const newPoint2 = vectorIntersectPlane(
			planePoint,
			planeNormal,
			insidePoints[0],
			outsidePoints[1]
		);
		const newTriangle = [insidePoints[0], newPoint1, newPoint2] as Triangle;
		return [newTriangle];
	}

	if (insidePoints.length === 2 && outsidePoints.length === 1) {
		// 1st new triangle
		const newPointT1 = vectorIntersectPlane(
			planePoint,
			planeNormal,
			insidePoints[0],
			outsidePoints[0]
		);
		const newTriangle1 = [insidePoints[0], insidePoints[1], newPointT1] as Triangle;

		// 2nd new triangle
		const newPointT2 = vectorIntersectPlane(
			planePoint,
			planeNormal,
			insidePoints[1],
			outsidePoints[0]
		);
		const newTriangle2 = [insidePoints[1], newPointT1, newPointT2] as Triangle;

		return [newTriangle1, newTriangle2];
	}

	throw new Error('Error ocurred while clipping triangles, no valid points ammount was found');
}

/**
 * Clipps array of triangles using given clipping function
 * @param triangles Triangle array to clip
 * @param clipFn Clipping function to clip triangles
 * @returns Clipped array of triangles
 */
export function clipTriangleArray(
	triangles: Triangle[],
	clipFn: (tr: Triangle) => Triangle[]
): Triangle[] {
	const result: Triangle[] = [];
	for (const tr of triangles) {
		const clippedTr: Triangle[] = clipFn(tr);
		for (const tr of clippedTr) {
			result.push(tr);
		}
	}
	return result;
}

// Matrices
/**
 * Creates new basic matrix
 * @returns Basic matrix
 */
export function matrix(): Matrix {
	return [
		[1, 0, 0, 0],
		[0, 1, 0, 0],
		[0, 0, 1, 0],
		[0, 0, 0, 1]
	];
}

/**
 * Multiplies vector by given matrix
 * @param matrix Matrix multiplier (must have the same ammount of rows as vectors ammount of collumns)
 * @param vec Vector to multiply
 * @returns Multiplied vector
 */
export function vectorMatrixMultiply(matrix: Matrix, vec: Vector): Vector {
	const result: Vector = vector();
	result.x =
		vec.x * matrix[0][0] + vec.y * matrix[1][0] + vec.z * matrix[2][0] + vec.w * matrix[3][0];
	result.y =
		vec.x * matrix[0][1] + vec.y * matrix[1][1] + vec.z * matrix[2][1] + vec.w * matrix[3][1];
	result.z =
		vec.x * matrix[0][2] + vec.y * matrix[1][2] + vec.z * matrix[2][2] + vec.w * matrix[3][2];
	result.w =
		vec.x * matrix[0][3] + vec.y * matrix[1][3] + vec.z * matrix[2][3] + vec.w * matrix[3][3];
	return result;
}

/**
 * Multiplies two matrices
 * @param matrix1 Matrix to multiply
 * @param matrix2  Matrix to multiply
 * @returns Multiplied matrix
 */
export function matrixMatrixMultiply(matrix1: Matrix, matrix2: Matrix): Matrix {
	const result: Matrix = matrix();
	for (let c = 0; c < 4; c++)
		for (let r = 0; r < 4; r++)
			result[r][c] =
				matrix1[r][0] * matrix2[0][c] +
				matrix1[r][1] * matrix2[1][c] +
				matrix1[r][2] * matrix2[2][c] +
				matrix1[r][3] * matrix2[3][c];
	return result;
}

/**
 * Creates translation matrix
 * @param translation Translation vector
 * @returns Translation matrix
 */
export function matrixTranslaton(translation: Vector): Matrix {
	return [
		[1, 0, 0, 0],
		[0, 1, 0, 0],
		[0, 0, 1, 0],
		[translation.x, translation.y, translation.z, 1]
	];
}

/**
 * Returns rotation matrix at given angle
 * @param angle Angle at of rotation (in degrees)
 * @param axis Axis of rotation (x | y | z)
 * @returns Rotation matrix
 */
export function matrixRotation(angle: number, axis: 'x' | 'y' | 'z'): Matrix {
	const radians = angle * (Math.PI / 180);
	switch (axis) {
		case 'x':
			return [
				[1, 0, 0, 0],
				[0, Math.cos(radians), -Math.sin(radians), 0],
				[0, Math.sin(radians), Math.cos(radians), 0],
				[0, 0, 0, 1]
			];
		case 'y':
			return [
				[Math.cos(radians), 0, -Math.sin(radians), 0],
				[0, 1, 0, 0],
				[Math.sin(radians), 0, Math.cos(radians), 0],
				[0, 0, 0, 1]
			];
		case 'z':
			return [
				[Math.cos(radians), -Math.sin(radians), 0, 0],
				[Math.sin(radians), Math.cos(radians), 0, 0],
				[0, 0, 1, 0],
				[0, 0, 0, 1]
			];
	}
}

/**
 * Calculates matrix point at
 * @param position Position vector - object position
 * @param target Target vector - object facing direction
 * @param up Up vector - normal to objects facing direction axle
 * @returns Point at matrix - transformation for object rotation depending on given position
 */
export function matrixPointAt(position: Vector, target: Vector, up: Vector): Matrix {
	const newForward: Vector = vectorNormalise(vectorSubtract(target, position));
	const a: Vector = vectorMultiply(newForward, vectorDotProduct(up, newForward));
	const newUp = vectorNormalise(vectorSubtract(up, a));
	const newRight: Vector = vectorCrossProduct(newUp, newForward);
	const matrix: Matrix = [
		[newRight.x, newRight.y, newRight.z, 0],
		[newUp.x, newUp.y, newUp.z, 0],
		[newForward.x, newForward.y, newForward.z, 0],
		[position.x, position.y, position.z, 1]
	];
	return matrix;
}

/**
 * Inverts 4x4 matrix
 * @param matrix 4x4 matrix
 * @returns Inverted 4x4 matrix
 */
export function matrixInverse(matrix: Matrix): Matrix {
	const translation = arrayToVector(matrix[3]);
	return [
		[matrix[0][0], matrix[1][0], matrix[2][0], 0],
		[matrix[0][1], matrix[1][1], matrix[2][1], 0],
		[matrix[0][2], matrix[1][2], matrix[2][2], 0],
		[
			-vectorDotProduct(translation, arrayToVector(matrix[0])),
			-vectorDotProduct(translation, arrayToVector(matrix[1])),
			-vectorDotProduct(translation, arrayToVector(matrix[2])),
			1
		]
	];
}

/**
 * Creates projection matrix for projecting 3d vector to 2d vector
 * @param fov field of view (in degrees)
 * @param aspect asepct ratio of screen
 * @param far farthest projection distance
 * @param near closest projection distance
 * @returns Projection matrix
 */
export function matrixProjection(fov: number, aspect: number, far: number, near: number): Matrix {
	const fovR = (fov * Math.PI) / 180;
	const f = 1.0 / Math.tan(fovR / 2);
	const rangeInv = 1.0 / (near - far);
	return [
		[f / aspect, 0, 0, 0],
		[0, f, 0, 0],
		[0, 0, (near + far) * rangeInv, -1],
		[0, 0, near * far * rangeInv * 2, 0]
	];
}
