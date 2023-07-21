import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

interface CardProps {
	title: string;
	date: Date;
	total: number;
	action: () => void;
	deleteAction?: () => void;
}

export default function BasicCard(props: CardProps) {
	return (
		<Card sx={{ minWidth: 275, marginBottom: 2 }}>
			<CardContent>
				<Typography variant="h5" component="div">
					{props.title}
				</Typography>
				<Typography sx={{ mb: 1.5 }} color="text.secondary">
					{props.date.toUTCString()}
				</Typography>
				<Typography variant="h6">
					Total: R$ {props.total.toFixed(2).toString()}
				</Typography>
			</CardContent>
			<CardActions>
				<Grid container justifyContent="space-between">
					<Grid item>
						<Button size="medium" onClick={props.action}>
							Ver lista
						</Button>
					</Grid>
					<Grid item>
						<IconButton
							aria-label="delete"
							onClick={props.deleteAction}
						>
							<DeleteIcon />
						</IconButton>
					</Grid>
				</Grid>
			</CardActions>
		</Card>
	);
}
