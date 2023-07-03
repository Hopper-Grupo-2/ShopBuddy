import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

interface CardProps {
	title: string;
	date: Date;
	total: number;
	action: () => void;
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
				<Button size="medium" onClick={props.action}>
					Ver lista
				</Button>
			</CardActions>
		</Card>
	);
}
