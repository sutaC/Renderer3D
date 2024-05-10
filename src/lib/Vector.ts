export type Vector = [x: number, y: number, z: number];

// Operations

export function vectorAdd(a: Vector, b: Vector): Vector {
	return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

export function vectorSubtract(a: Vector, b: Vector): Vector {
	return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

export function vectorMultiply(a: Vector, b: Vector): Vector {
	return [a[0] * b[0], a[1] * b[1], a[2] * b[2]];
}

export function vectorDevide(a: Vector, b: Vector): Vector {
	return [a[0] / b[0], a[1] / b[1], a[2] / b[2]];
}

export function vectorNormalise(vector: Vector): Vector {
	const l = Math.sqrt(vector[0] ** 2 + vector[1] ** 2 + vector[2] ** 2);
	return [vector[0] / l, vector[1] / l, vector[2] / l];
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

export function calculateNormal(a: Vector, b: Vector, c: Vector): Vector {
	const lineA: Vector = vectorSubtract(b, a);
	const lineB: Vector = vectorSubtract(c, a);
	const normal: Vector = [
		lineA[1] * lineB[2] - lineA[2] * lineB[1],
		lineA[2] * lineB[0] - lineA[0] * lineB[2],
		lineA[0] * lineB[1] - lineA[1] * lineB[0]
	];
	return vectorNormalise(normal);
}

export function calculateDotPoint(vector: Vector, normal: Vector) {
	return normal[0] * vector[0] + normal[1] * vector[1] + normal[2] * vector[2];
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

export function vectorScale(vector: Vector, multiplier: number): Vector {
	const multiplierVec: Vector = [multiplier, multiplier, multiplier];
	return vectorMultiply(vector, multiplierVec);
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
