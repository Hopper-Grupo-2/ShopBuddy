import IItem from "./iItem";

export default interface IList {
	_id: string;
	listName: string;
	products: IItem[];
	owner: string;
	members: { userId: string }[];
	createdAt: Date;
	updatedAt: Date;
}
