import { CssBaseline, Typography } from "@mui/material";
import PageStructure from "../../components/PageStructure";
import UserForm from "../../components/UserForm";
import Box from "@mui/material/Box";

export default function Settings() {
  return (
    <>
      <PageStructure>
        <CssBaseline>
          <Box display="flex" justifyContent="center" margin="30px">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: "10px 10px 10px 10px",
                color: "white",
                boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "flex-start",
                  backgroundColor: "#FF9900",
                  borderRadius: "10px 10px 0px 0px",
                  color: "white",
                  height: "5rem",
                  padding: "10px 20px",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  Edite suas informações de usuário
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  padding: "10px 60px 10px 60px",
                  background: "white",
                  borderRadius: "10px 10px 10px 10px",
                }}
              >
                <UserForm />
              </Box>
            </Box>
          </Box>
        </CssBaseline>
      </PageStructure>
    </>
  );
}
