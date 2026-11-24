declare interface Window {
	setSpeed: (s: number) => void;
	getSpeed: () => number | undefined;
	setAxis:  (s: string) => void;
	getAxis:  () => string;
	setColor: () => void;
}
