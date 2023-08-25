import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import PendingIcon from "@mui/icons-material/Pending";
import EditIcon from "@mui/icons-material/Edit";
import IItem from "../interfaces/iItem";
import { useState } from "react";
import { ButtonGroup, Button, Typography, Grid, Box } from "@mui/material";
import LoadingIndicator from "./LoadingIndicator";

interface CheckboxListProps {
  items: Array<IItem>;
  onCheck: (itemId: string) => Promise<void>;
  onRemove: (itemId: string) => Promise<void>;
  onEdit: (itemId: string) => void;
  isLoading: boolean;
}

interface CheckboxListItemProps {
  item: IItem;
  labelId: string;
  onCheck: (itemId: string) => Promise<void>;
  onRemove: (itemId: string) => Promise<void>;
  onEdit: (itemId: string) => void;
}

function CheckboxListItem(props: CheckboxListItemProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <ListItem
      key={props.item._id}
      secondaryAction={
        <>
          <IconButton
            edge="end"
            aria-label="edit"
            onClick={() => {
              setIsEditing(true);
              props.onEdit(props.item._id);
              setIsEditing(false);
            }}
          >
            {isEditing ? <PendingIcon /> : <EditIcon />}
          </IconButton>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={async () => {
              setIsDeleting(true);
              await props.onRemove(props.item._id);
              setIsDeleting(false);
            }}
          >
            {isDeleting ? <PendingIcon /> : <DeleteIcon />}
          </IconButton>
        </>
      }
      disablePadding
    >
      <ListItemButton
        role={undefined}
        onClick={async () => {
          setIsChecking(true);
          await props.onCheck(props.item._id);
          setIsChecking(false);
        }}
        disabled={isChecking}
        dense
      >
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={props.item.checked}
            tabIndex={-1}
            disableRipple
            inputProps={{ "aria-labelledby": props.labelId }}
            color="secondary"
          />
        </ListItemIcon>
        {/* Aqui está um comentário para quem for fazer esse componente:
            O PREÇO DEVE SER ESCONDIDO CASO SEJA ZERO REAIS */}
        <ListItemText
          id={props.labelId}
          primary={
            <Grid>
              <Box
                display="flex"
                flexWrap="wrap"
                alignItems="baseline"
                sx={{ p: "0px", m: "0px" }}
              >
                <Typography
                  fontWeight="bold"
                  sx={{
                    mr: "8px",
                    textDecoration: props.item.checked
                      ? "line-through"
                      : "none",
                  }}
                >
                  {props.item.name}
                </Typography>
                <Typography sx={{ mr: "2px" }}>
                  {props.item.quantity}
                </Typography>
                <Typography sx={{ fontSize: "0.8rem", mr: "8px" }}>
                  {props.item.unit}
                </Typography>
                {props.item.price > 0 && (
                  <>
                    <Typography sx={{ mr: "8px" }}>
                      {`R$ ${props.item.price.toFixed(2).replace(".", ",")}`}
                    </Typography>
                    {props.item.quantity > 1 && (
                      <Typography color="gray" sx={{ fontSize: "0.8rem" }}>
                        {`(total: R$${(props.item.price * props.item.quantity)
                          .toFixed(2)
                          .replace(".", ",")})`}
                      </Typography>
                    )}
                  </>
                )}
              </Box>
              <Typography
                variant="subtitle2"
                color="gray"
                sx={{ p: "0px", m: "0px" }}
              >
                {props.item.market}
              </Typography>
            </Grid>
          }
        />
      </ListItemButton>
    </ListItem>
  );
}

export default function CheckboxList(props: CheckboxListProps) {
  const [sortOption, setSortOption] = useState("name");

  const handleSort = (option: string) => {
    setSortOption(option);
  };

  const sortItems = (items: Array<IItem>) => {
    switch (sortOption) {
      case "name":
        return [...items].sort((a, b) => a.name.localeCompare(b.name));
      case "unitPrice":
        return [...items].sort((a, b) => a.price - b.price);
      case "totalPrice":
        return [...items].sort(
          (a, b) => a.price * a.quantity - b.price * b.quantity
        );
      case "unit":
        return [...items].sort((a, b) => a.unit.localeCompare(b.unit));
      case "market":
        return [...items].sort((a, b) => {
          const marketComparison = a.market.localeCompare(b.market);
          if (marketComparison === 0) {
            return a.name.localeCompare(b.name);
          } else {
            return marketComparison;
          }
        });
      default:
        return items;
    }
  };
  return (
    <>
      <ButtonGroup
        color="primary"
        aria-label="outlined primary button group"
        sx={{
          width: "100%",
          marginBottom: "10px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          flexGrow: 1,
        }}
      >
        {}
        <Button
          variant={sortOption === "name" ? "contained" : "outlined"}
          onClick={() => handleSort("name")}
          sx={{ flexGrow: 1, textTransform: "capitalize" }}
        >
          Nome
        </Button>
        <Button
          variant={sortOption === "unit" ? "contained" : "outlined"}
          onClick={() => handleSort("unit")}
          sx={{ flexGrow: 1, textTransform: "capitalize" }}
        >
          Unidade
        </Button>
        <Button
          variant={sortOption === "unitPrice" ? "contained" : "outlined"}
          onClick={() => handleSort("unitPrice")}
          sx={{ flexGrow: 1, textTransform: "capitalize" }}
        >
          Preço unitário
        </Button>
        <Button
          variant={sortOption === "totalPrice" ? "contained" : "outlined"}
          onClick={() => handleSort("totalPrice")}
          sx={{ flexGrow: 1, textTransform: "capitalize" }}
        >
          Preço total
        </Button>
        <Button
          variant={sortOption === "market" ? "contained" : "outlined"}
          onClick={() => handleSort("market")}
          sx={{ flexGrow: 1, textTransform: "capitalize" }}
        >
          Mercado
        </Button>
      </ButtonGroup>
      <List
        sx={{
          width: "100%",
          height: "calc(70vh - 120px)",
          bgcolor: "background.paper",
          overflowY: "auto",
        }}
      >
        {props.isLoading ? (
          <LoadingIndicator></LoadingIndicator>
        ) : props.items.length === 0 ? (
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            A lista está vazia...
          </Typography>
        ) : (
          sortItems(props.items).map((item) => {
            const labelId = `checkbox-list-label-${item._id}`;
            return (
              <CheckboxListItem
                key={item._id}
                item={item}
                labelId={labelId}
                onCheck={props.onCheck}
                onRemove={props.onRemove}
                onEdit={props.onEdit}
              />
            );
          })
        )}
      </List>
    </>
  );
}
