import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

interface PaperProps {
	children: React.ReactNode;
}

export default function SimplePaper(props: PaperProps) {
	return (
		<Box
			sx={{
				display: "flex",
				flexWrap: "wrap",
				"& > :not(style)": {
					m: 1,
					width: 350,
				},
			}}
		>
			<Paper elevation={3}>{props.children}</Paper>
		</Box>
	);
}
