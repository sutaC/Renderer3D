export type Vector = [x: number, y: number, z: number];

// Operations

export function vectorAdd(a: Vector, b: Vector): Vector {
	return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

export function vectorSubtract(a: Vector, b: Vector): Vector {
	return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

export function vectorMultiply(vector: Vector, num: number): Vector {
	return [vector[0] * num, vector[1] * num, vector[2] * num];
}

export function vectorDevide(vector: Vector, num: number): Vector {
	return [vector[0] / num, vector[1] / num, vector[2] / num];
}

export function vectorLength(vector: Vector): number {
	return Math.sqrt(vector[0] ** 2 + vector[1] ** 2 + vector[2] ** 2);
}

export function vectorNormalise(vector: Vector): Vector {
	const len = vectorLength(vector);
	return [vector[0] / len, vector[1] / len, vector[2] / len];
}

// Calculations

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

export function vectorCrossProduct(a: Vector, b: Vector): Vector {
	return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

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

export function vectorDotProduct(vector: Vector, normal: Vector) {
	return normal[0] * vector[0] + normal[1] * vector[1] + normal[2] * vector[2];
}

export function matrixPointAt(position: Vector, target: Vector, up: Vector) {
	const newForward: Vector = vectorNormalise(vectorSubtract(target, position));
	const a: Vector = vectorMultiply(newForward, vectorDotProduct(up, newForward));
	const newUp = vectorNormalise(vectorSubtract(up, a));
	const newRight: Vector = vectorCrossProduct(newUp, newForward);

	const matrix: Vector[] = [newRight, newUp, newForward];

	// add  pos

	return matrix;
}

export function matrixInverseRotation(matrix: Vector[]): Vector[] {
	return [
		[matrix[0][0], matrix[1][0], matrix[2][0]],
		[matrix[0][1], matrix[1][1], matrix[2][1]],
		[matrix[0][2], matrix[1][2], matrix[2][2]]
	];
}

export function matrixInverseTranslation(matrix: Vector, matrixPointAt: Vector[]): Vector {
	return [
		-vectorDotProduct(matrix, matrixPointAt[0]),
		-vectorDotProduct(matrix, matrixPointAt[1]),
		-vectorDotProduct(matrix, matrixPointAt[2])
	];
}

// Translations

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

export function vectorProject2d(vector: Vector): Vector {
	const z = 1 / vector[2];
	const projection: Vector[] = [
		[z, 0, 0],
		[0, z, 0],
		[0, 0, 1]
	];
	return vectorMatrixMultiply(projection, vector);
}
