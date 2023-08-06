import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

// Defina o array de unidades de medida
const unitsOfMeasure = [
  { value: "Kg", label: "Quilograma (Kg)" },
  { value: "Ml", label: "Mililitro (Ml)" },
  { value: "g", label: "Grama (g)" },
  { value: "L", label: "Litro (L)" },
  { value: "m", label: "Metro (m)" },
  { value: "cm", label: "Centímetro (cm)" },
  { value: "und", label: "Unidade (und)" },
];

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
  initialValues?: Record<string, string>;
}

const FormDialog: React.FC<FormDialogProps> = (props: FormDialogProps) => {
  const emptyFormData: Record<string, string> = {
    name: "",
    unit: "",
    quantity: "",
    price: "",
  };

  let initialFormData: Record<string, string> = props.fields.reduce(
    (acc, field) => ({ ...acc, [field.id]: "" }),
    {}
  );

  if (props.initialValues) {
    initialFormData = props.initialValues;
  }

  const [formData, setFormData] =
    useState<Record<string, string>>(initialFormData);

  useEffect(() => {
    setFormData(props.initialValues || initialFormData);
  }, [props.initialValues]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [event.target.id]: event.target.value,
    }));
  };

  // Adicionado um novo tipo para o evento de mudança do Select
  type SelectChangeEvent = React.ChangeEvent<{
    name?: string;
    value: unknown;
  }>;

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name || ""]: value as string,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const success = await props.handleSubmit(formData);
    if (success) {
      setFormData(emptyFormData);
      props.handleClose();
    }
  };

  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>{props.title}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {props.fields.map((field) =>
            field.id === "unit" ? (
              // Campo de seleção (select) para "Unidade de medida"
              <FormControl key={field.id} fullWidth variant="standard">
                <InputLabel id={field.id + "-label"}>{field.label}</InputLabel>
                <Select
                  labelId={field.id + "-label"}
                  id={field.id}
                  name={field.id} // Adicionado o nome do campo para o handler funcionar corretamente
                  value={formData[field.id] || ""}
                  onChange={(event) =>
                    handleSelectChange(event as SelectChangeEvent)
                  }
                >
                  <MenuItem value="">Selecione a unidade de medida</MenuItem>
                  {unitsOfMeasure.map((unit) => (
                    <MenuItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              // Outros campos de texto permanecem iguais
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
            )
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose}>Cancelar</Button>
          <Button type="submit">Confirmar</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export { FormDialog };
