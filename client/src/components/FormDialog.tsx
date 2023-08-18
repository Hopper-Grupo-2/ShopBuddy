import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
interface FormField {
  id: string;
  label: string;
  type: string;
}

interface FormDialogProps {
  title: string;
  fields: FormField[];
  open: boolean;
  handleClose: () => void;
  handleSubmit: (formData: Record<string, string>) => Promise<boolean>;
}

const itemDialogTitleStyle = {
  backgroundColor: "#FF9900",
  color: "#FFF",
  fontWeight: "bold",
  padding: "5px 10px",
};

const FormDialog: React.FC<FormDialogProps> = (props: FormDialogProps) => {
  const initialFormData: Record<string, string> = props.fields.reduce(
    (acc, field) => ({ ...acc, [field.id]: "" }),
    {}
  );
  const [formData, setFormData] =
    useState<Record<string, string>>(initialFormData);

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [event.target.id]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    const success = await props.handleSubmit(formData);
    if (success) {
      setFormData(initialFormData);
      props.handleClose();
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle
        sx={{
          ...itemDialogTitleStyle,
        }}
      >
        {props.title}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {props.fields.map((field) => (
            <TextField
              autoFocus
              margin="dense"
              key={field.id}
              id={field.id}
              label={field.label}
              type={field.type}
              fullWidth
              variant="standard"
              value={formData[field.id] || ""}
              onChange={handleChange}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={props.handleClose}
            sx={{
              fontWeight: "bold",
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            type="submit"
            sx={{
              color: "#FFF",
              fontWeight: "bold",
            }}
            disabled={isLoading}
          >
            Confirmar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export { FormDialog };
