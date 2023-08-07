import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AlertDialog from "../../components/AlertDialog";

export default function InvitePage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    async function getInvite() {
      try {
        const response = await fetch(`/api/invites/${params.inviteId}`, {
          method: "GET",
          credentials: "include",
        });
        const responseObj = await response.json();

        if (response.ok) {
          const list = responseObj.data;
          navigate(`/list/${list._id}`);
        } else {
          throw responseObj.error;
        }
      } catch (error: any) {
        console.error(error.name, error.message);
        error.name === "Gone"
          ? setDialogMessage("Ops, esse convite não existe ou expirou.")
          : setDialogMessage(
              "Ops, algo deu errado! Tente novamente mais tarde."
            );

        setOpenDialog(true);
      }
    }

    getInvite();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <CircularProgress />
      <AlertDialog
        open={openDialog}
        onClose={() => {
          navigate("/");
        }}
        contentText={dialogMessage}
        buttonText="Fechar"
      />
    </Box>
  );
}
