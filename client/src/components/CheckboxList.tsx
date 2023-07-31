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
          />
        </ListItemIcon>
        <ListItemText
          sx={{
            textDecoration: props.item.checked ? "line-through" : "none",
          }}
          id={props.labelId}
          primary={`${props.item.name} ${props.item.quantity} ${
            props.item.unit
          } R$${(props.item.price * props.item.quantity)
            .toFixed(2)
            .replace(".", ",")}`}
        />
      </ListItemButton>
    </ListItem>
  );
}

export default function CheckboxList(props: CheckboxListProps) {
  return (
    <List
      sx={{
        width: "100%",
        height: "calc(70vh - 120px)",
        bgcolor: "background.paper",
        overflowY: "auto",
      }}
    >
      {props.items.map((item) => {
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
      })}
    </List>
  );
}
