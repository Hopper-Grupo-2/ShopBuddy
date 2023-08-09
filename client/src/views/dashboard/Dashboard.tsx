import PageStructure from "../../components/PageStructure";
import Button from "@mui/material/Button";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { FormDialog } from "../../components/FormDialog";
import IList from "../../interfaces/iList";
import { UserContext } from "../../contexts/UserContext";
import AlertDialog from "../../components/AlertDialog";
import ListCard from "../../components/ListCard";
import { Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function Dashboard() {
  const navigate = useNavigate();

  const [lists, setLists] = useState<IList[]>([]);
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const [openListForm, setOpenListForm] = useState(false);
  const context = useContext(UserContext);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const userContext = useContext(UserContext);

  useEffect(() => {
    const fetchLists = async () => {
      const response = await fetch(`/api/lists/user/${context?.user?._id}`, {
        method: "GET",
        credentials: "include", // Ensure credentials are sent
      });

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
        setDialogMessage("Lista criada com sucesso!");
        setOpenDialog(true);
        setFetchTrigger(!fetchTrigger);
        return true;
      } else {
        throw responseObj.error;
      }
    } catch (error: any) {
      console.error(error.name, error.message);
      setDialogMessage("Erro ao criar a lista, tente novamente!");
      setOpenDialog(true);
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
        setDialogMessage("Lista apagada com sucesso!");
        setOpenDialog(true);
        //return true;
      } else {
        throw responseObj.error;
      }
    } catch (error: any) {
      console.error(error.name, error.message);
      setDialogMessage(
        "Desculpe, apenas administradores da lista podem deleta-la."
      );
      setOpenDialog(true);
      //return false;
    }
  };

  const exitList = async (
    listId: string,
    listName: string,
    listOwner: string,
    memberId: string | undefined
  ) => {
    let message = "";

    if (memberId === listOwner) {
      message = `Deseja realmente sair da lista ${listName}? Se houver outros usuários, sua liderança passará para o primeiro, senão, a lista será apagada.`;
    } else {
      message = `Deseja realmente sair da lista ${listName}?`;
    }

    if (!confirm(`${message}`)) return;

    try {
      const response = await fetch(`/api/lists/${listId}/members/${memberId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseObj = await response.json();

      if (response.ok) {
        setFetchTrigger(!fetchTrigger);
        setDialogMessage("Você saiu da lista com sucesso!");
        setOpenDialog(true);
      } else {
        throw responseObj.error;
      }
    } catch (error: any) {
      console.error(error.name, error.message);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <PageStructure>
        <Button
          variant="contained"
          onClick={handleOpenListForm}
          sx={{
            backgroundColor: "#FF9900",
            textTransform: "capitalize",
            fontWeight: "bold",
            fontSize: "1.25rem",
            color: "#FFF",
            margin: "30px 0px",
          }}
        >
          <AddIcon sx={{ fontWeight: "bold", mr: "10px", fontSize: "2rem" }} />
          Nova lista
        </Button>
        <Grid container spacing={4} justifyContent="center">
          {lists
            .slice()
            .reverse()
            .map((list) => (
              <Grid
                item
                sm={12}
                md={6}
                lg={4}
                xl={3}
                key={list._id}
                sx={{ minWidth: "375px" }}
              >
                <ListCard
                  key={list._id}
                  title={list.listName}
                  date={new Date(list.createdAt)}
                  total={list.products.reduce((acc, product) => {
                    if (
                      product.unit === "Kg" ||
                      product.unit === "L" ||
                      product.unit === "Ml" ||
                      product.unit === "und"
                    ) {
                      return acc + product.price * product.quantity;
                    } else {
                      return acc + product.price;
                    }
                  }, 0)}
                  products={list.products}
                  memberCount={list.members.length}
                  action={() => {
                    navigate("/list/" + list._id);
                  }}
                  deleteAction={() => {
                    deleteList(list._id, list.listName);
                  }}
                  exitAction={() =>
                    exitList(
                      list._id,
                      list.listName,
                      list.owner,
                      userContext?.user?._id
                    )
                  }
                  isOwner={list.owner === userContext?.user?._id}
                />
              </Grid>
            ))}
        </Grid>
      </PageStructure>
      <FormDialog
        title="Adicionar nova lista"
        fields={[{ id: "listName", label: "Nome da lista", type: "text" }]}
        open={openListForm}
        handleClose={handleCloseListForm}
        handleSubmit={createNewList}
      ></FormDialog>

      <AlertDialog
        open={openDialog}
        onClose={handleCloseDialog}
        contentText={dialogMessage}
        buttonText="Fechar"
      />
    </>
  );
}
