import PageStructure from "../../components/PageStructure";
import Card from "../../components/Card";
import Button from "@mui/material/Button";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { FormDialog } from "../../components/FormDialog";
import IList from "../../interfaces/iList";
import { UserContext } from "../../contexts/UserContext";

export default function Dashboard() {
	const navigate = useNavigate();

	const [lists, setLists] = useState<IList[]>([]);
	const [fetchTrigger, setFetchTrigger] = useState(false);
	const [openListForm, setOpenListForm] = useState(false);
	const context = useContext(UserContext);

	useEffect(() => {
		const fetchLists = async () => {
			const response = await fetch(
				`/api/lists/user/${context?.user?._id}`,
				{
					method: "GET",
					credentials: "include", // Ensure credentials are sent
				}
			);

			if (response.ok) {
				const listsData = await response.json();
				setLists(listsData.data);
			}
		};

		fetchLists();
	}, [fetchTrigger]);

	const handleOpenListForm = () => {
		setOpenListForm(true);
	};
	const handleCloseListForm = () => {
		setOpenListForm(false);
	};

	const createNewList = async (formData: Record<string, string>) => {
		try {
			const response = await fetch("/api/lists/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					listName: formData["listName"],
				}),
			});

			const responseObj = await response.json();
			if (response.ok) {
				alert("Lista criada com sucesso!");
				setFetchTrigger(!fetchTrigger);
				return true;
			} else {
				throw responseObj.error;
			}
		} catch (error: any) {
			console.error(error.name, error.message);
			alert("Failed to create list: " + error.message);
			return false;
		}
	};

	const deleteList = async (listId: string, listName: string) => {
		if (!confirm(`Deseja realmente apagar a lista ${listName}?`)) return;

		try {
			const response = await fetch(`/api/lists/${listId}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			});

			const responseObj = await response.json();
			if (response.ok) {
				setFetchTrigger(!fetchTrigger);
				alert("Lista apagada com sucesso!");
				//return true;
			} else {
				throw responseObj.error;
			}
		} catch (error: any) {
			console.error(error.name, error.message);
			alert("Failed to delete list: " + error.message);
			//return false;
		}
	};

	return (
		<>
			<PageStructure>
				<h1>Bem vindo(a) ao ShopBuddy!</h1>
				<Button
					sx={{ marginBottom: "30px" }}
					variant="contained"
					onClick={handleOpenListForm}
				>
					Adicionar nova lista
				</Button>
				{lists
					.slice()
					.reverse()
					.map((list) => (
						<Card
							key={list._id}
							title={list.listName}
							date={new Date(list.createdAt)}
							total={list.products.reduce(
								(acc, product) =>
									acc + product.price * product.quantity,
								0
							)}
							action={() => {
								navigate("/list/" + list._id);
							}}
							deleteAction={() => {
								deleteList(list._id, list.listName);
							}}
						/>
					))}
			</PageStructure>
			<FormDialog
				title="Adicionar nova lista"
				fields={[
					{ id: "listName", label: "Nome da lista", type: "text" },
				]}
				open={openListForm}
				handleClose={handleCloseListForm}
				handleSubmit={createNewList}
			></FormDialog>
		</>
	);
}
