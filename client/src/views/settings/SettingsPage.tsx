import { CssBaseline, Typography } from "@mui/material";
import PageStructure from "../../components/PageStructure";
import UserForm from "../../components/UserForm";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Open Sans, Arial, sans-serif", // Defina a fonte desejada aqui
  },
});

export default function Settings() {
  return (
    <>
      <PageStructure>
        <ThemeProvider theme={theme}>
          <CssBaseline>
            <Box sx={{ margin: "0px 350px 0px 350px" }}>
              <Box
                sx={{
                  width: "100%",
                  backgroundColor: "#FF9900",
                  borderRadius: "10px 10px 0px 0px",
                  color: "white",
                  boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.2)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box sx={{ padding: "10px 20px" }}>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    Edite as informações do seu usuário
                  </Typography>
                </Box>

                <Box
                  sx={{ padding: "10px 60px 10px 60px", background: "white" }}
                >
                  <UserForm />
                </Box>
              </Box>
            </Box>
          </CssBaseline>
        </ThemeProvider>
      </PageStructure>
    </>
  );
}
