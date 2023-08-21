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
import { ButtonGroup, Button, Typography, Grid } from "@mui/material";

interface CheckboxListProps {
  items: Array<IItem>;
  onCheck: (itemId: string) => Promise<void>;
  onRemove: (itemId: string) => Promise<void>;
  onEdit: (itemId: string) => void;
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
          sx={{
            textDecoration: props.item.checked ? "line-through" : "none",
          }}
          id={props.labelId}
          primary={
            <Grid>
              <Typography fontWeight="bold" sx={{ p: "0px", m: "0px" }}>
                {props.item.name} {props.item.quantity} {props.item.unit}
                {props.item.price > 0 &&
                  ` R$ ${props.item.price.toFixed(2).replace(".", ",")}`}
              </Typography>
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
      case "price":
        return [...items].sort((a, b) => a.price - b.price);
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
        sx={{ marginBottom: "10px" }}
      >
        <Button
          variant={sortOption === "name" ? "contained" : "outlined"}
          onClick={() => handleSort("name")}
          sx={{ textTransform: "capitalize" }}
        >
          Nome
        </Button>
        <Button
          variant={sortOption === "unit" ? "contained" : "outlined"}
          onClick={() => handleSort("unit")}
          sx={{ textTransform: "capitalize" }}
        >
          Unidade
        </Button>
        <Button
          variant={sortOption === "price" ? "contained" : "outlined"}
          onClick={() => handleSort("price")}
          sx={{ textTransform: "capitalize" }}
        >
          Preço
        </Button>
        <Button
          variant={sortOption === "market" ? "contained" : "outlined"}
          onClick={() => handleSort("market")}
          sx={{ textTransform: "capitalize" }}
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
        {props.items.length === 0 ? (
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
