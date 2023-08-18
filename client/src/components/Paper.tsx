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
        flexDirection: "column",
        justifyContent: "space-between",
        flexWrap: "wrap",
        "& > :not(style)": {
          //m: 1,
          //width: 450,
          height: "100%",
        },
      }}
    >
      <Paper elevation={3}>
        {" "}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            "& > :last-child": {
              mt: "auto",
            },
            maxHeight: {
              xs: "500px", // or you can omit 'xs' if you want the default to be 'auto'
              md: "10000px",
            },
          }}
        >
          {props.children}
        </Box>
      </Paper>
    </Box>
  );
}
