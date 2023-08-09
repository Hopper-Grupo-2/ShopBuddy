import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import GroupIcon from "@mui/icons-material/Group";
import { Box, CssBaseline, useMediaQuery, useTheme } from "@mui/material";
import IItem from "../interfaces/iItem";

interface CardProps {
  title: string;
  date: Date;
  total: number;
  products: IItem[];
  memberCount: number;
  action: () => void;
  deleteAction?: () => void;
  exitAction?: () => void;
  isOwner: boolean;
}

export default function ListCard(props: CardProps) {
  const purchasedProducts = props.products.filter((product) => product.checked);

  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(props.date);

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
    <CssBaseline>
      <Box
        sx={{
          width: "100%",
          backgroundColor: props.isOwner ? "#FF9900" : "#F9B344",
          borderRadius: "10px 10px 10px 10px",
          color: "white",
        }}
      >
        <Box
          sx={{
            padding: "10px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              height: "5rem",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
              }}
            >
              {props.title}
            </Typography>
          </Box>
          {props.isOwner && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <ManageAccountsIcon
                sx={{ color: "#444444", fontSize: "3.5rem" }}
              />
              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                Admin
              </Typography>
            </Box>
          )}
        </Box>
        <Card sx={{ borderRadius: "0px 0px 10px 10px" }}>
          <CardActionArea onClick={props.action}>
            <CardContent
              sx={{
                display: "flex",
                "&:last-child": {
                  paddingBottom: "10px",
                },
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ mb: "10px" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      lineHeight: "0.5rem",
                      color: "#444444",
                    }}
                  >
                    Progresso:
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "2rem",
                      color: "#444444",
                    }}
                  >
                    {purchasedProducts.length + "/" + props.products.length}{" "}
                    <Typography
                      variant="caption"
                      display="inline"
                      sx={{ fontWeight: "bold", fontSize: "1rem" }}
                    >
                      itens
                    </Typography>
                  </Typography>
                </Box>
                <Box sx={{ mb: "10px" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      lineHeight: "0.5rem",
                      color: "#444444",
                    }}
                  >
                    Total gasto:
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "2rem",
                      color: "#444444",
                    }}
                  >
                    <Typography
                      display="inline"
                      sx={{ fontWeight: "normal", fontSize: "2rem" }}
                    >
                      R${" "}
                    </Typography>
                    {props.total.toFixed(2).replace(".", ",")}
                  </Typography>
                </Box>
                <Box sx={{ mb: "5px" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      lineHeight: "0.5rem",
                      color: "#444444",
                    }}
                  >
                    Criada em:
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontSize: "1.3rem",
                      color: "#444444",
                    }}
                  >
                    {formattedDate}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    mr: "10px",
                  }}
                >
                  <GroupIcon sx={{ color: "#444444", fontSize: "2.5rem" }} />
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: "bold",
                      lineHeight: "1rem",
                      color: "#444444",
                    }}
                  >
                    {props.memberCount} membros
                  </Typography>
                </Box>
                <Box sx={{ display: "flex" }}>
                  {props.isOwner && (
                    <IconButton
                      aria-label="delete"
                      onClick={(event) => {
                        event.stopPropagation();
                        if (props.deleteAction) props.deleteAction();
                      }}
                    >
                      <DeleteIcon
                        sx={{ color: "#444444", fontSize: "2.0rem" }}
                      />
                    </IconButton>
                  )}
                  <IconButton
                    aria-label="exit"
                    onClick={(event) => {
                      event.stopPropagation();
                      if (props.exitAction) props.exitAction();
                    }}
                  >
                    <LogoutIcon sx={{ color: "#444444", fontSize: "2.0rem" }} />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>
    </CssBaseline>
  );
}
