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
import { Box, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchBar from "../../components/SearchBar";
import ConfirmDialog from "../../components/ConfirmDialog";
import { SocketContext } from "../../contexts/SocketContext";

export default function Dashboard() {
  const navigate = useNavigate();

  const [lists, setLists] = useState<IList[]>([]);
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const [openListForm, setOpenListForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const context = useContext(UserContext);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [onConfirm, setOnConfirm] = useState(() => () => {});

  const userContext = useContext(UserContext);
  const socketContext = useContext(SocketContext);

  useEffect(() => {
    const fetchLists = async () => {
      const response = await fetch(`/api/lists/user/${context?.user?._id}`, {
        method: "GET",
        credentials: "include",
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

  const deleteList = async (listId: string) => {
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
      let errorMessage = "";
      if (
        error.name === "BadRequest" &&
        error.message === "Cannot delete list with members"
      ) {
        errorMessage = "Lista com membros não pode ser excluída";
      } else {
        errorMessage = "Erro ao tentar apagar a lista";
      }
      setDialogMessage(errorMessage);
      setOpenDialog(true);
      //return false;
    }
  };

  const exitList = async (listId: string, memberId: string | undefined) => {
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

  useEffect(() => {
    if (!socketContext?.socket) return;

    socketContext.socket.on("addedToList", () => {
      setFetchTrigger(!fetchTrigger);
    });

    socketContext.socket.on("deletedFromList", () => {
      setFetchTrigger(!fetchTrigger);
    });

    return () => {
      socketContext.socket?.off("addedToList");
      socketContext.socket?.off("deletedFromList");
    };
  }, [socketContext?.socket]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOpenConfirmDialog(false);
  };

  return (
    <>
      <PageStructure>
        <Box
          display="flex"
          justifyContent="center"
          flexWrap="wrap"
          sx={{ flex: 1, width: "100%", margin: "30px 0px", gap: "30px" }}
        >
          <SearchBar onChange={setSearchTerm} />
          <Button
            variant="contained"
            onClick={handleOpenListForm}
            sx={{
              backgroundColor: "#FF9900",
              textTransform: "capitalize",
              fontWeight: "bold",
              fontSize: "1.25rem",
              whiteSpace: "nowrap",
              color: "#FFF",
            }}
          >
            <AddIcon
              sx={{ fontWeight: "bold", mr: "15px", fontSize: "2rem" }}
            />
            Nova lista
          </Button>
        </Box>
        <Grid container spacing={4} justifyContent="center">
          {lists
            .slice()
            .reverse()
            .map((list) => {
              if (
                list.listName.toLowerCase().includes(searchTerm.toLowerCase())
              )
                return (
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
                          product.unit === "kg" ||
                          product.unit === "L" ||
                          product.unit === "ml" ||
                          product.unit === "un" ||
                          product.unit === "m" ||
                          product.unit === "cm"
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
                        setDialogMessage(
                          `Deseja realmente apagar a lista ${list.listName}?`
                        );
                        setOnConfirm(() => () => {
                          deleteList(list._id);
                        });
                        setOpenConfirmDialog(true);
                      }}
                      exitAction={() => {
                        setDialogMessage(
                          `Deseja realmente sair da lista ${list.listName}?`
                        );
                        setOnConfirm(() => () => {
                          exitList(list._id, userContext?.user?._id);
                        });
                        setOpenConfirmDialog(true);
                      }}
                      isOwner={list.owner === userContext?.user?._id}
                    />
                  </Grid>
                );
            })}
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
      <ConfirmDialog
        open={openConfirmDialog}
        onClose={handleCloseDialog}
        onConfirm={onConfirm}
        contentText={dialogMessage}
      />
    </>
  );
}
