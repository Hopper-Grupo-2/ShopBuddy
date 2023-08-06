export default interface IItem {
  name: string;
  quantity: number;
  unit: string;
  price: number;
  market: string;
  checked: boolean;
  _id: string;
}

/* export default interface IItem {
	id: number;
	name: string;
	quantity: number;
	unit: "und" | "g" | "kg" | "ml" | "L" | "m" | "cm";
	unitPrice: number;
	checked: boolean;
}
 */
