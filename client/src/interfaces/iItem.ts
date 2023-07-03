export default interface IItem {
	id: number;
	name: string;
	quantity: number;
	unit: "und" | "g" | "kg" | "ml" | "L" | "m" | "cm";
	unitPrice: number;
	checked: boolean;
}
