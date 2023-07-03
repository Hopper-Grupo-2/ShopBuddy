import PageStructure from "../../components/PageStructure";
import { useParams } from "react-router-dom";
import SimplePaper from "../../components/Paper";
import CheckboxList from "../../components/CheckboxList";
import IItem from "../../interfaces/iItem";
import { useState } from "react";
import Button from "@mui/material/Button";

// import "./ListPage.css";

const dummyItemsList: Array<IItem> = [
	{
		id: 5,
		name: "Abacate",
		quantity: 5,
		unit: "und",
		unitPrice: 1,
		checked: false,
	},
	{
		id: 2,
		name: "Pão",
		quantity: 5,
		unit: "und",
		unitPrice: 1,
		checked: false,
	},
	{
		id: 3,
		name: "Carne de sol",
		quantity: 5,
		unit: "und",
		unitPrice: 1,
		checked: false,
	},
];

export default function List() {
	const params = useParams();

	const [items, setItems] = useState<Array<IItem>>(dummyItemsList);

	function checkItem(itemId: number) {
		const currentItem = items.filter((item) => item.id === itemId)[0];
		const currentIndex = items.indexOf(currentItem);
		items[currentIndex].checked = !items[currentIndex].checked;
		setItems([...items]);
	}

	function removeItem(itemId: number) {
		const filteredItems = items.filter((item) => item.id !== itemId);
		setItems([...filteredItems]);
	}

	return (
		<>
			<PageStructure>
				<h1>List with id {params.listId}</h1>
				<SimplePaper>
					<CheckboxList
						items={items}
						onCheck={checkItem}
						onRemove={removeItem}
					/>
					<Button
						sx={{
							margin: "0px auto 15px auto",
							display: "block",
						}}
						variant="contained"
					>
						Adicionar item
					</Button>
				</SimplePaper>
			</PageStructure>
		</>
	);
}
