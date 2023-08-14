import PageStructure from "../../components/PageStructure";
import { useParams } from "react-router-dom";
import SimplePaper from "../../components/Paper";
import { useNavigate } from "react-router-dom";
import CheckboxList from "../../components/CheckboxList";
import IItem from "../../interfaces/iItem";
import { useState, useEffect, useContext } from "react";
import Button from "@mui/material/Button";
import IList from "../../interfaces/iList";
import { ItemFormDialog } from "../../components/ItemFormDialog";
import ChatBox from "../../components/ChatBox";
import styled from "@emotion/styled";
import { MembersModal } from "../../components/MembersModal";
import IUser from "../../interfaces/iUser";
import { SocketContext } from "../../contexts/SocketContext";
import { UserContext } from "../../contexts/UserContext";
import AlertDialog from "../../components/AlertDialog";
import { NotificationsContext } from "../../contexts/NotificationsContext";
import { MemberFormDialog } from "../../components/MemberFormDialog";
import { Box } from "@mui/material";

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

export default function List() {
  const params = useParams();
  const [list, setList] = useState<IList>();
  const [items, setItems] = useState<Array<IItem>>([]);
  const [openItemForm, setOpenItemForm] = useState(false);
  const [openEditItemForm, setOpenEditItemForm] = useState(false);
  const [productId, setProductIdToEdit] = useState<string | null>(null);
  const [openMemberForm, setOpenMemberForm] = useState(false);
  const [isListOwner, setIsListOwner] = useState(false);
  const [initialFormData, setInitialFormData] = useState<
    Record<string, string>
  >({});
  const userContext = useContext(UserContext);
  const socketContext = useContext(SocketContext);
  const notificationsContext = useContext(NotificationsContext);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  // create use state to save members
  const [members, setMembers] = useState<Array<IUser>>([]);
  // members
  const [showMembers, setShowMembers] = useState(false);
  const navigate = useNavigate();
  const fetchMembers = async () => {
    console.log("esse é o list id:", params.listId);
    const response = await fetch(`/api/lists/${params.listId}/members`, {
      method: "GET",
      credentials: "include", // Ensure credentials are sent
    });

    if (response.ok) {
      const membersData = await response.json();
      console.log("members:", membersData);
      setMembers(membersData.data as IUser[]);
    }
  };
  const fetchList = async () => {
    try {
      const response = await fetch(`/api/lists/${params.listId}`, {
        method: "GET",
        credentials: "include", // Ensure credentials are sent
      });

      // if (response.status === 403) {
      //   console.log("Usuário não é membro da lista.");
      //   setDialogMessage("Erro: você não é membro da lista.");
      //   setOpenDialog(true);
      //   navigate("/");
      //   return;
      // }

      if (response.ok) {
        const listData = await response.json();
        setList(listData.data);
        setItems(listData.data.products);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      // setDialogMessage("Erro na requisição. Tente novamente.");
      // setOpenDialog(true);
      navigate("/");
    }
  };

  useEffect(() => {
    fetchList();
    fetchMembers();
    notificationsContext?.readListNotifications(params.listId ?? "");
  }, []);

  useEffect(() => {
    fetchList();
    fetchMembers();
    notificationsContext?.readListNotifications(params.listId ?? "");
  }, []);

  useEffect(() => {
    if (list && userContext?.user?._id === list.owner) {
      setIsListOwner(true);
    } else {
      setIsListOwner(false);
    }
  }, [list, userContext?.user?._id]);

  const handleRemoveMember = async (memberId: String) => {
    try {
      const response = await fetch(
        `/api/lists/${params.listId}/members/${memberId}`,
        {
          method: "DELETE",
          credentials: "include", // Ensure credentials are sent
        }
      );

      const userData = await response.json();
      if (response.ok) {
        //console.log("members after delete:", userData.data);
        setMembers(userData.data as IUser[]);
      } else {
        throw userData.error;
      }
    } catch (error: any) {
      console.error(error.name, error.message);
      setDialogMessage("Erro na remoção do usuário, tente novamente!");
      setOpenDialog(true);
      return false;
    }
  };

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
        socketContext.socket.emit(
          "exitList",
          params.listId,
          userContext?.user?._id
        );
      console.log("exit list was emitted");
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

  const handleOpenEditItemForm = (itemId: string) => {
    setProductIdToEdit(itemId);

    const productToEdit = items.find((item) => item._id === itemId);

    if (productToEdit) {
      const initialValues: Record<string, string> = {
        name: productToEdit.name,
        unit: productToEdit.unit,
        quantity: productToEdit.quantity.toString(),
        price: productToEdit.price.toString(),
        market: productToEdit.market,
      };

      setInitialFormData(initialValues);
      setOpenEditItemForm(true);
    }
  };

  const handleCloseEditItemForm = () => {
    setInitialFormData({});
    setOpenEditItemForm(false);
  };

  const createNewItem = async (formData: Record<string, string>) => {
    try {
      const response = await fetch(`/api/lists/${params.listId}/products`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData["name"],
          quantity: formData["quantity"],
          unit: formData["unit"],
          price: formData["price"] === "" ? 0 : formData["price"],
          market: formData["market"],
          checked: false,
        }),
      });

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
      setDialogMessage("Erro ao adicionar o item. Tente novamente!");
      setOpenDialog(true);
      return false;
    }
  };

  const addMember = async (formData: Record<string, string>) => {
    try {
      const response = await fetch(`/api/lists/${params.listId}/members`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData["username"],
        }),
      });

      const responseObj = await response.json();
      if (response.ok) {
        fetchMembers();
        return true;
      } else {
        throw responseObj.error;
      }
    } catch (error: any) {
      console.error(error.name, error.message);
      setDialogMessage("Usuário inexistente. Tente novamente!");
      setOpenDialog(true);
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
      setDialogMessage("Erro ao excluir o item. Tente novamente!");
      setOpenDialog(true);
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
      setDialogMessage("Erro ao marcar o item. Tente novamente!");
      setOpenDialog(true);
    }
  };

  const handleEditProduct = async (formData: Record<string, string>) => {
    try {
      const response = await fetch(
        `/api/lists/${list?._id}/products/${productId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData["name"],
            quantity: formData["quantity"],
            unit: formData["unit"],
            price: formData["price"] === "" ? 0 : formData["price"],
            market: formData["market"],
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
      setDialogMessage("Erro ao editar o item. Tente novamente!");
      setOpenDialog(true);
      return false;
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

    socketContext.socket.on("deleteMember", (members: Array<IUser>) => {
      setMembers(members);
    });

    /* socketContext.socket.on("listNotification", (_) => {
      notificationsContext?.readListNotifications(params.listId ?? "");
    }) */

    return () => {
      socketContext.socket?.off("addProduct");
      socketContext.socket?.off("checkProduct");
      socketContext.socket?.off("deleteProduct");
      socketContext.socket?.off("deleteMember");
    };
  }, [socketContext?.socket, items, members]);

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

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <PageStructure>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          margin="30px"
        >
          <HeaderContainer>
            <h1>{list?.listName}</h1>
            <ButtonContainer>
              <Button variant="contained" onClick={handleShowMembers}>
                Membros
              </Button>
              {isListOwner && (
                <Button variant="contained" onClick={handleOpenMemberForm}>
                  + Adicionar membros
                </Button>
              )}
            </ButtonContainer>
          </HeaderContainer>
          <ContentContainer>
            <SimplePaper>
              {items.length === 0 ? (
                <p style={{ textAlign: "center" }}>A lista está vazia...</p>
              ) : (
                <CheckboxList
                  items={items}
                  onCheck={handleCheckProduct}
                  onRemove={handleDeleteProduct}
                  onEdit={handleOpenEditItemForm}
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
        </Box>
      </PageStructure>
      <ItemFormDialog
        title="Adicionar novo item"
        fields={[
          { id: "name", label: "Nome do item", type: "text" },
          { id: "unit", label: "Unidade de medida", type: "select" },
          { id: "quantity", label: "Quantidade", type: "text" },
          { id: "price", label: "Preço/unidade", type: "text" },
          { id: "market", label: "Local da compra", type: "text" },
        ]}
        open={openItemForm}
        handleClose={handleCloseItemForm}
        handleSubmit={createNewItem}
      />
      <MemberFormDialog
        title="Adicionar membro"
        fields={[{ id: "username", label: "Nome do usuário", type: "text" }]}
        open={openMemberForm}
        handleClose={handleCloseMemberForm}
        handleSubmit={addMember}
      />
      <MembersModal
        title="Membros"
        members={members}
        open={showMembers}
        handleClose={handleHideMembers}
        handleMember={handleRemoveMember}
        isOwner={isListOwner}
      />
      <ItemFormDialog
        title="Editar item"
        fields={[
          { id: "name", label: "Nome do item", type: "text" },
          { id: "unit", label: "Unidade de medida", type: "text" },
          { id: "quantity", label: "Quantidade", type: "text" },
          { id: "price", label: "Preço/unidade", type: "text" },
          { id: "market", label: "Local da compra", type: "text" },
        ]}
        open={openEditItemForm}
        handleClose={handleCloseEditItemForm}
        handleSubmit={handleEditProduct}
        initialValues={initialFormData}
      />
      <AlertDialog
        open={openDialog}
        onClose={handleCloseDialog}
        contentText={dialogMessage}
        buttonText="Fechar"
      />
    </>
  );
}
