import PageStructure from "../../components/PageStructure";
import { useParams } from "react-router-dom";
import SimplePaper from "../../components/Paper";
import CheckboxList from "../../components/CheckboxList";
import IItem from "../../interfaces/iItem";
import { useState, useEffect, useContext } from "react";
import Button from "@mui/material/Button";
import IList from "../../interfaces/iList";
import { FormDialog } from "../../components/FormDialog";
import ChatBox from "../../components/ChatBox";
import styled from "@emotion/styled";
import { MembersModal } from "../../components/MembersModal";
import IUser from "../../interfaces/iUser";
import { SocketContext } from "../../contexts/SocketContext";
import { UserContext } from "../../contexts/UserContext";

const ContentContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	flex-wrap: wrap;

	@media (max-width: 350px) {
		flex-direction: column;
	}
`;

const HeaderContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	padding: 10px;

	@media (max-width: 600px) {
		flex-direction: column;
	}
`;

const ButtonContainer = styled.div`
	display: flex;
	gap: 10px;

	@media (max-width: 600px) {
		margin-bottom: 10px;
	}
`;

// import "./ListPage.css";

/* const dummyItemsList: Array<IItem> = [
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
]; */

export default function List() {
	const params = useParams();
	const [list, setList] = useState<IList>();
	const [items, setItems] = useState<Array<IItem>>([]);
	const [openItemForm, setOpenItemForm] = useState(false);
	const [openMemberForm, setOpenMemberForm] = useState(false);
	const userContext = useContext(UserContext);
	const socketContext = useContext(SocketContext);

	// create use state to save members
	const [members, setMembers] = useState<Array<IUser>>([]);
	// members
	const [showMembers, setShowMembers] = useState(false);

	useEffect(() => {
		const fetchList = async () => {
			const response = await fetch(`/api/lists/${params.listId}`, {
				method: "GET",
				credentials: "include", // Ensure credentials are sent
			});

			if (response.ok) {
				const listData = await response.json();
				//console.log(listData);
				console.log(listData.data.products);
				setList(listData.data);
				setItems(listData.data.products);
			}
		};

		fetchList();

		// fazer um fetch que pega os membros baseado no id

		const fetchMembers = async () => {
			console.log("esse é o list id:", params.listId);
			const response = await fetch(
				`/api/lists/${params.listId}/members`,
				{
					method: "GET",
					credentials: "include", // Ensure credentials are sent
				}
			);

			if (response.ok) {
				const membersData = await response.json();
				console.log("members:", membersData);
				setMembers(membersData.data as IUser[]);
			}
		};

		fetchMembers();
	}, []);

	useEffect(() => {
		if (!socketContext?.socket) return;

		socketContext.socket.emit(
			"enterList",
			params.listId,
			userContext?.user?._id
		);
		console.log("enter list was emitted");
		return () => {
			if (socketContext.socket)
				socketContext.socket.emit("exitList", userContext?.user?._id);
		};
	}, [socketContext?.socket]);

	const handleOpenItemForm = () => {
		setOpenItemForm(true);
	};
	const handleCloseItemForm = () => {
		setOpenItemForm(false);
	};

	const handleOpenMemberForm = () => {
		setOpenMemberForm(true);
	};
	const handleCloseMemberForm = () => {
		setOpenMemberForm(false);
	};

	//show/hide members
	const handleShowMembers = () => {
		setShowMembers(true);
	};

	const handleHideMembers = () => {
		setShowMembers(false);
	};

	const createNewItem = async (formData: Record<string, string>) => {
		try {
			const response = await fetch(
				`/api/lists/${params.listId}/products`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						name: formData["name"],
						quantity: formData["quantity"],
						unit: formData["unit"],
						price: formData["price"],
						checked: false,
					}),
				}
			);

			const responseObj = await response.json();
			if (response.ok) {
				const products = responseObj.data.products;
				setItems(products);
				return true;
			} else {
				throw responseObj.error;
			}
		} catch (error: any) {
			console.error(error.name, error.message);
			alert("Failed to add item: " + error.message);
			return false;
		}
	};

	const addMember = async (formData: Record<string, string>) => {
		try {
			const response = await fetch(
				`/api/lists/${params.listId}/members`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						username: formData["username"],
					}),
				}
			);

			const responseObj = await response.json();
			if (response.ok) {
				alert(
					"Membro adicionado com sucesso! Recarregue a página (por enquanto)"
				);
				//const products = responseObj.data.products;
				//setItems(products);
				return true;
			} else {
				throw responseObj.error;
			}
		} catch (error: any) {
			console.error(error.name, error.message);
			alert("Failed to add member: " + error.message);
			return false;
		}
	};

	const handleDeleteProduct = async (productId: string) => {
		//if (!confirm(`Do you want to remove the product ${productId}?`)) return;
		try {
			const response = await fetch(
				`/api/lists/${list?._id}/products/${productId}`,
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			const responseObj = await response.json();
			if (response.ok) {
				removeItem(productId);
			} else {
				throw responseObj.error;
			}
		} catch (error: any) {
			console.error(error.name, error.message);
			alert("Failed to remove item: " + error.message);
		}
	};

	const handleCheckProduct = async (productId: string) => {
		//if (!confirm(`Do you want to check the product ${productId}?`)) return;
		try {
			const response = await fetch(
				`/api/lists/${list?._id}/products/${productId}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			const responseObj = await response.json();
			if (response.ok) {
				checkItem(productId);
			} else {
				throw responseObj.error;
			}
		} catch (error: any) {
			console.error(error.name, error.message);
			alert("Failed to toggle item: " + error.message);
		}
	};

	useEffect(() => {
		if (!socketContext?.socket) return;

		socketContext.socket.on("addProduct", (products: IItem[]) => {
			setItems(products);
		});

		socketContext.socket.on("checkProduct", (productId: string) => {
			checkItem(productId);
		});

		socketContext.socket.on("deleteProduct", (productId: string) => {
			removeItem(productId);
		});

		return () => {
			socketContext.socket?.off("checkProduct");
			socketContext.socket?.off("addProduct");
		};
	}, [socketContext?.socket, items]);

	/* useEffect(() => {
		if (!socketContext?.socket) return;

		socketContext.socket.on("addProduct", (list: IList) => {
			setItems(list.products);
		});

		return () => {
			socketContext.socket?.off("addProduct");
		};
	}, [socketContext?.socket, items]); */

	function checkItem(itemId: string) {
		const currentItem = items.filter((item) => item._id === itemId)[0];
		const currentIndex = items.indexOf(currentItem);
		console.log(items);
		items[currentIndex].checked = !items[currentIndex].checked;
		setItems([...items]);
	}

	function removeItem(itemId: string) {
		const filteredItems = items.filter((item) => item._id !== itemId);
		setItems([...filteredItems]);
	}

	return (
		<>
			<PageStructure>
				<HeaderContainer>
					<h1>{list?.listName}</h1>
					<ButtonContainer>
						<Button variant="contained" onClick={handleShowMembers}>
							Members
						</Button>
						<Button
							variant="contained"
							onClick={handleOpenMemberForm}
						>
							+ Add member
						</Button>
					</ButtonContainer>
				</HeaderContainer>
				<ContentContainer>
					<SimplePaper>
						{items.length === 0 ? (
							<p style={{ textAlign: "center" }}>
								A lista está vazia...
							</p>
						) : (
							<CheckboxList
								items={items}
								onCheck={handleCheckProduct}
								onRemove={handleDeleteProduct}
							/>
						)}
						<Button
							sx={{
								margin: "0px auto 15px auto",
								display: "block",
							}}
							variant="contained"
							onClick={handleOpenItemForm}
						>
							Adicionar item
						</Button>
					</SimplePaper>
					{list ? <ChatBox listId={list._id} /> : null}
				</ContentContainer>
			</PageStructure>
			<FormDialog
				title="Adicionar novo item"
				fields={[
					{ id: "name", label: "Nome do item", type: "text" },
					{ id: "unit", label: "Unidade de medida", type: "select" }, //will be a select
					{ id: "quantity", label: "Quantidade", type: "text" },
					{ id: "price", label: "Preço/unidade", type: "text" },
				]}
				open={openItemForm}
				handleClose={handleCloseItemForm}
				handleSubmit={createNewItem}
			/>
			<FormDialog
				title="Adicionar membro"
				fields={[
					{ id: "username", label: "Nome do usuário", type: "text" },
				]}
				open={openMemberForm}
				handleClose={handleCloseMemberForm}
				handleSubmit={addMember}
			/>
			<MembersModal
				title="Todos os membros da lista"
				members={members}
				open={showMembers}
				handleClose={handleHideMembers}
			/>
		</>
	);
}
