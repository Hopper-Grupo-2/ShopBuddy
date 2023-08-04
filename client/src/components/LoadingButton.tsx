import { Button, ButtonProps, CircularProgress } from "@mui/material";
import { ReactNode } from "react";

interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
  children: ReactNode;
}

export default function LoadingButton({
  loading,
  children,
  ...props
}: LoadingButtonProps) {
  return (
    <Button {...props} disabled={loading}>
      {loading ? <CircularProgress size={24} /> : children}
    </Button>
  );
}