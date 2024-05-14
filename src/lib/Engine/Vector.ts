import type { Triangle } from './Shape';

export interface Vector {
	x: number;
	y: number;
	z: number;
}

// Operations

/**
 * Covetrs array to vector
 * @param array Array to convert
 * @returns Converted array
 */
export function arrayToVector(array: number[]): Vector {
	if (array.length !== 3) {
		throw new Error(
			'Could not convert array to vector, becouse array length is not eaqual to vector length (3)'
		);
	}
	return {
		x: array[0],
		y: array[1],
		z: array[2]
	};
}

/**
 * Converts vector to array
 * @param vector Vector to convert
 * @returns Converted vector
 */
export function vectorToArray(vector: Vector): number[] {
	return [vector.x, vector.y, vector.z];
}

/**
 * Adds two vectors
 * @param a Vector to add
 * @param b  Vector to add
 * @returns Vectors of sum
 */
export function vectorAdd(a: Vector, b: Vector): Vector {
	return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

/**
 * Subtracts two vectors
 * @param a Vector to subtract
 * @param b	Subtractor vector
 * @returns Subtracted vector
 */
export function vectorSubtract(a: Vector, b: Vector): Vector {
	return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

/**
 * Multiplies vector by given multiplier
 * @param vector Vector to multiply
 * @param multiplier Multiplier
 * @returns Multiplied vector
 */
export function vectorMultiply(vector: Vector, multiplier: number): Vector {
	return { x: vector.x * multiplier, y: vector.y * multiplier, z: vector.z * multiplier };
}

/**
 * Devides vector by given devider
 * @param vector Vector to devide
 * @param divider Devider
 * @returns Devided vector
 */
export function vectorDevide(vector: Vector, divider: number): Vector {
	return { x: vector.x / divider, y: vector.y / divider, z: vector.z / divider };
}

/**
 * Calculates length of given vector
 * @param vector Vector to which the length is calculated
 * @returns Vector length
 */
export function vectorLength(vector: Vector): number {
	return Math.sqrt(vector.x ** 2 + vector.y ** 2 + vector.z ** 2);
}

/**
 * Normalises given vector
 * @param vector Vector to normalise
 * @returns Normalised vector
 */
export function vectorNormalise(vector: Vector): Vector {
	const len = vectorLength(vector);
	return { x: vector.x / len, y: vector.y / len, z: vector.z / len };
}

// Calculations

/**
 * Multiplies vector by given matrix
 * @param matrix Matrix multiplier (must have the same ammount of rows as vectors ammount of collumns)
 * @param vector Vector to multiply
 * @returns Multiplied vector
 */
export function vectorMatrixMultiply(matrix: number[][], vector: Vector): Vector {
	if (matrix.length !== 3) {
		throw new Error('Matrix length must be be the same size as vector length (3)');
	}
	const vecArray: number[] = vectorToArray(vector);
	const arrResult: number[] = [0, 0, 0];
	for (let i = 0; i < vecArray.length; i++) {
		for (let j = 0; j < vecArray.length; j++) {
			arrResult[i] += matrix[i][j] * vecArray[j];
		}
	}
	return arrayToVector(vecArray);
}

/**
 * Calculate cross product of two vectors
 * @param a Vector to calculate corss product
 * @param b Vector to calculate corss product
 * @returns Vector cross product
 */
export function vectorCrossProduct(a: Vector, b: Vector): Vector {
	return { x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x };
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
	const normal: Vector = {
		x: lineA.y * lineB.z - lineA.z * lineB.y,
		y: lineA.z * lineB.x - lineA.x * lineB.z,
		z: lineA.x * lineB.y - lineA.y * lineB.x
	};
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
 * Calculates matrix point at
 * @param position Position vector - object position
 * @param target Target vector - object facing direction
 * @param up Up vector - normal to objects facing direction axle
 * @returns Point at matrix - transformation for object rotation depending on given position
 */
export function matrixPointAt(position: Vector, target: Vector, up: Vector): number[][] {
	const newForward: Vector = vectorNormalise(vectorSubtract(target, position));
	const a: Vector = vectorMultiply(newForward, vectorDotProduct(up, newForward));
	const newUp = vectorNormalise(vectorSubtract(up, a));
	const newRight: Vector = vectorCrossProduct(newUp, newForward);
	const matrix: number[][] = [
		vectorToArray(newRight),
		vectorToArray(newUp),
		vectorToArray(newForward)
	];
	return matrix;
}

/**
 * Inverts rotation matrix
 * @param matrix Rottaion matrix
 * @returns Inverted rotation matrix
 */
export function matrixInverseRotation(matrix: number[][]): number[][] {
	return [
		[matrix[0][0], matrix[1][0], matrix[2][0]],
		[matrix[0][1], matrix[1][1], matrix[2][1]],
		[matrix[0][2], matrix[1][2], matrix[2][2]]
	];
}

/**
 * Inverts translation matrix
 * @param position Position vector on which matrix invetrs
 * @param matrix Translation matrix
 * @returns Inverted translation matrix
 */
export function matrixInverseTranslation(position: Vector, matrix: number[][]): Vector {
	return {
		x: -vectorDotProduct(position, arrayToVector(matrix[0])),
		y: -vectorDotProduct(position, arrayToVector(matrix[1])),
		z: -vectorDotProduct(position, arrayToVector(matrix[2]))
	};
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
	triangle: Triangle,
	points: Vector[]
): Triangle[] {
	planeNormal = vectorNormalise(planeNormal);

	// Return shortest distance from point to plane
	const distance = (point: Vector): number =>
		planeNormal.x * point.x +
		planeNormal.y * point.y +
		planeNormal.z * point.z -
		vectorDotProduct(planeNormal, planePoint);

	const insidePoints: number[] = [];
	const outsidePoints: number[] = [];

	for (let i = 0; i < triangle.length; i++) {
		const dist = distance(points[triangle[i]]);
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
		const validPoint = points[insidePoints[0]];
		const newPoint1 = vectorIntersectPlane(
			planePoint,
			planeNormal,
			validPoint,
			points[outsidePoints[0]]
		);
		const newPoint2 = vectorIntersectPlane(
			planePoint,
			planeNormal,
			validPoint,
			points[outsidePoints[1]]
		);
		const newTriangle = [
			insidePoints[0],
			points.push(newPoint1) - 1,
			points.push(newPoint2) - 1
		] as Triangle;
		return [newTriangle];
	}

	if (insidePoints.length === 2 && outsidePoints.length === 1) {
		const validPoint1 = points[insidePoints[0]];
		const validPoint2 = points[insidePoints[1]];

		// 1st new triangle
		const newPointT1 = vectorIntersectPlane(
			planePoint,
			planeNormal,
			validPoint1,
			points[outsidePoints[0]]
		);
		const newTriangle1 = [
			insidePoints[0],
			insidePoints[1],
			points.push(newPointT1) - 1
		] as Triangle;

		// 2nd new triangle
		const newPointT2 = vectorIntersectPlane(
			planePoint,
			planeNormal,
			validPoint2,
			points[outsidePoints[0]]
		);
		const newTriangle2 = [
			insidePoints[1],
			points.length - 1,
			points.push(newPointT2) - 1
		] as Triangle;

		return [newTriangle1, newTriangle2];
	}

	throw new Error('Error ocurred while clipping triangles, no valid points ammount was found');
}

// Translations

/**
 * Rotates vector by given angle in selected axis
 * @param vector Vector to rotate
 * @param angle Angle at which vector rotates (in degrees)
 * @param axis Axis on which vector rotates (x | y | z)
 * @returns Rotated vector
 */
export function vectorRotate(vector: Vector, angle: number, axis: 'x' | 'y' | 'z'): Vector {
	const radians = angle * (Math.PI / 180);
	let matrix: number[][];
	switch (axis) {
		case 'x':
			matrix = [
				[1, 0, 0],
				[0, Math.cos(radians), -Math.sin(radians)],
				[0, Math.sin(radians), Math.cos(radians)]
			];
			break;
		case 'y':
			matrix = [
				[Math.cos(radians), 0, -Math.sin(radians)],
				[0, 1, 0],
				[Math.sin(radians), 0, Math.cos(radians)]
			];
			break;
		case 'z':
			matrix = [
				[Math.cos(radians), -Math.sin(radians), 0],
				[Math.sin(radians), Math.cos(radians), 0],
				[0, 0, 1]
			];
			break;
	}
	return vectorMatrixMultiply(matrix, vector);
}

/**
 * Projects 3D vector to 2D (also sets Z position to 1)
 * @param vector Vector to project
 * @returns Projected vector
 */
export function vectorProject2d(vector: Vector): Vector {
	return vectorDevide(vector, vector.z);
}
