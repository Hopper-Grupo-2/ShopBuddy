import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import IItem from "../interfaces/iItem";

interface CheckboxListProps {
	items: Array<IItem>;
	onCheck: (itemId: number) => void;
	onRemove: (itemId: number) => void;
}

export default function CheckboxList(props: CheckboxListProps) {
	return (
		<List
			sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
		>
			{props.items.map((item) => {
				const labelId = `checkbox-list-label-${item.id}`;

				return (
					<ListItem
						key={item.id}
						secondaryAction={
							<IconButton
								edge="end"
								aria-label="delete"
								onClick={() => {
									props.onRemove(item.id);
								}}
							>
								<DeleteIcon />
							</IconButton>
						}
						disablePadding
					>
						<ListItemButton
							role={undefined}
							onClick={() => {
								props.onCheck(item.id);
							}}
							dense
						>
							<ListItemIcon>
								<Checkbox
									edge="start"
									checked={item.checked}
									tabIndex={-1}
									disableRipple
									inputProps={{ "aria-labelledby": labelId }}
								/>
							</ListItemIcon>
							<ListItemText
								sx={{
									textDecoration: item.checked
										? "line-through"
										: "none",
								}}
								id={labelId}
								primary={`${item.name} ${item.quantity} ${
									item.unit
								} R$${(item.unitPrice * item.quantity)
									.toFixed(2)
									.replace(".", ",")}`}
							/>
						</ListItemButton>
					</ListItem>
				);
			})}
		</List>
	);
}
