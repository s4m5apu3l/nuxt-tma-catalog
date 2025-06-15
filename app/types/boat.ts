export interface BoatPoint {
	id: string;
	name: string;
	// from: [number, number];
	// current: { longitude: number; latitude: number };
	// to: { longitude: number; latitude: number };
	// current: [number, number];
	// to: [number, number];

	// prevlongitude: number;
	// prevlatitude: number;
	// tabels: { to: { longitude: number; latitude: number } }[];
	longitude: number;
	latitude: number;
	descr: string;
	route: {
		pointA: string;
		pointB: string;
		distance: number;
		duration: string;
		price: number;
	};
}
