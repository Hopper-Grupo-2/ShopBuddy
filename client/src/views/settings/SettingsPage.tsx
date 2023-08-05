import { Container, CssBaseline, Typography } from "@mui/material";
import PageStructure from "../../components/PageStructure";
import UserForm from "../../components/UserForm";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default function Settings() {
  const theme = useTheme();
  const isBetweenMdAndLg = useMediaQuery(theme.breakpoints.between("md", "xl")); // Verifica se está no breakpoint "md" personalizado
  const isBetweenLgAndXl = useMediaQuery(theme.breakpoints.between("lg", "xl"));
  const screenWidth = window.innerWidth;

  let calculatedMargin = "0px"; // Valor padrão

  if (isBetweenMdAndLg) {
    calculatedMargin = `${
      (screenWidth - theme.breakpoints.values.md) *
      (100 / (theme.breakpoints.values.lg - theme.breakpoints.values.md))
    }px`;
  } else if (isBetweenLgAndXl) {
    calculatedMargin = `${
      (screenWidth - theme.breakpoints.values.lg) *
      (100 / (theme.breakpoints.values.xl - theme.breakpoints.values.lg))
    }px`;
  }

  return (
    <>
      <PageStructure>
        <CssBaseline>
          <Box margin={`50px ${calculatedMargin}`}>
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
                margin: "20px 0px",
              }}
            >
              <Box sx={{ padding: "10px 20px" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  Edite as informações do seu usuário
                </Typography>
              </Box>

              <Box sx={{ padding: "10px 60px 10px 60px", background: "white" }}>
                <UserForm />
              </Box>
            </Box>
          </Box>
        </CssBaseline>
      </PageStructure>
    </>
  );
}
