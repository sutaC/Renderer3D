import type { Triangle } from './Shape';

export type Vector = [x: number, y: number, z: number];

// Operations

/**
 * Adds two vectors
 * @param a Vector to add
 * @param b  Vector to add
 * @returns Vectors of sum
 */
export function vectorAdd(a: Vector, b: Vector): Vector {
	return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

/**
 * Subtracts two vectors
 * @param a Vector to subtract
 * @param b	Subtractor vector
 * @returns Subtracted vector
 */
export function vectorSubtract(a: Vector, b: Vector): Vector {
	return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

/**
 * Multiplies vector by given multiplier
 * @param vector Vector to multiply
 * @param multiplier Multiplier
 * @returns Multiplied vector
 */
export function vectorMultiply(vector: Vector, multiplier: number): Vector {
	return [vector[0] * multiplier, vector[1] * multiplier, vector[2] * multiplier];
}

/**
 * Devides vector by given devider
 * @param vector Vector to devide
 * @param divider Devider
 * @returns Devided vector
 */
export function vectorDevide(vector: Vector, divider: number): Vector {
	return [vector[0] / divider, vector[1] / divider, vector[2] / divider];
}

/**
 * Calculates length of given vector
 * @param vector Vector to which the length is calculated
 * @returns Vector length
 */
export function vectorLength(vector: Vector): number {
	return Math.sqrt(vector[0] ** 2 + vector[1] ** 2 + vector[2] ** 2);
}

/**
 * Normalises given vector
 * @param vector Vector to normalise
 * @returns Normalised vector
 */
export function vectorNormalise(vector: Vector): Vector {
	const len = vectorLength(vector);
	return [vector[0] / len, vector[1] / len, vector[2] / len];
}

// Calculations

/**
 * Multiplies vector by given matrix
 * @param matrix Matrix multiplier (must have the same ammount of rows as vectors ammount of collumns)
 * @param vector Vector to multiply
 * @returns Multiplied vector
 */
export function vectorMatrixMultiply(matrix: Vector[], vector: Vector): Vector {
	if (matrix.length !== vector.length) {
		throw new Error('Matrix length must be be the same size as vector length');
	}
	const result: Vector = [0, 0, 0];
	for (let i = 0; i < vector.length; i++) {
		for (let j = 0; j < vector.length; j++) {
			result[i] += matrix[i][j] * vector[j];
		}
	}
	return result;
}

/**
 * Calculate cross product of two vectors
 * @param a Vector to calculate corss product
 * @param b Vector to calculate corss product
 * @returns Vector cross product
 */
export function vectorCrossProduct(a: Vector, b: Vector): Vector {
	return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
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
	const normal: Vector = [
		lineA[1] * lineB[2] - lineA[2] * lineB[1],
		lineA[2] * lineB[0] - lineA[0] * lineB[2],
		lineA[0] * lineB[1] - lineA[1] * lineB[0]
	];
	return vectorNormalise(normal);
}

/**
 * Calculate dot product of two vectors
 * @param a Vetcor to claculate dot product
 * @param b Vetcor to claculate dot product
 * @returns Dot product
 */
export function vectorDotProduct(a: Vector, b: Vector): number {
	return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

/**
 * Calculates matrix point at
 * @param position Position vector - object position
 * @param target Target vector - object facing direction
 * @param up Up vector - normal to objects facing direction axle
 * @returns Point at matrix - transformation for object rotation depending on given position
 */
export function matrixPointAt(position: Vector, target: Vector, up: Vector): Vector[] {
	const newForward: Vector = vectorNormalise(vectorSubtract(target, position));
	const a: Vector = vectorMultiply(newForward, vectorDotProduct(up, newForward));
	const newUp = vectorNormalise(vectorSubtract(up, a));
	const newRight: Vector = vectorCrossProduct(newUp, newForward);
	const matrix: Vector[] = [newRight, newUp, newForward];
	return matrix;
}

/**
 * Inverts rotation matrix
 * @param matrix Rottaion matrix
 * @returns Inverted rotation matrix
 */
export function matrixInverseRotation(matrix: Vector[]): Vector[] {
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
export function matrixInverseTranslation(position: Vector, matrix: Vector[]): Vector {
	return [
		-vectorDotProduct(position, matrix[0]),
		-vectorDotProduct(position, matrix[1]),
		-vectorDotProduct(position, matrix[2])
	];
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
		planeNormal[0] * point[0] +
		planeNormal[1] * point[1] +
		planeNormal[2] * point[2] -
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
	let matrix: Vector[];
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
 * Projects 3D vector to 2D (also sets Z position to 0)
 * @param vector Vector to project
 * @returns Projected vector
 */
export function vectorProject2d(vector: Vector): Vector {
	const z = 1 / vector[2];
	const projection: Vector[] = [
		[z, 0, 0],
		[0, z, 0],
		[0, 0, 0]
	];
	return vectorMatrixMultiply(projection, vector);
}
