import { useEffect, useState } from "react";
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
  Autocomplete,
  Typography,
  Box,
} from "@mui/material";
import IItem from "../interfaces/iItem";

// this has to be redone at a later date to
// always be compatible with the backend
const unitsOfMeasure = [
  { value: "Kg", label: "Quilograma (Kg)" },
  { value: "Ml", label: "Mililitro (Ml)" },
  { value: "gramas", label: "Grama (g)" },
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

const ItemFormDialog: React.FC<FormDialogProps> = (props: FormDialogProps) => {
  const initialFormData: Record<string, string> =
    props.initialValues ??
    props.fields.reduce((acc, field) => ({ ...acc, [field.id]: "" }), {});

  const [formData, setFormData] =
    useState<Record<string, string>>(initialFormData);

  useEffect(() => {
    if (!props.initialValues) return;
    setFormData(props.initialValues);
  }, [props.initialValues]);

  useEffect(() => {
    if (!props.open) {
      setFormData(initialFormData);
    }
  }, [props.open]);

  const [items, setItems] = useState<IItem[]>([]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [event.target.id]: event.target.value,
    }));
  };

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
    if (validateForm()) {
      const success = await props.handleSubmit(formData);
      if (success) {
        props.handleClose();
      }
    }
  };

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!props.open) {
      setFormErrors({});
    }
  }, [props.open]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    props.fields.forEach((field) => {
      if (!formData[field.id] && field.id !== "market") {
        errors[field.id] = `${field.label} é obrigatório.`;
      }

      if (
        (field.id === "name" || field.id === "market") &&
        ((formData[field.id].length < 3 && formData[field.id].length > 0) ||
          formData[field.id].length > 30)
      ) {
        errors[field.id] = `O ${field.label} deve ter entre 3 e 30 caracteres.`;
      }

      if (
        (field.id === "quantity" || field.id === "price") &&
        formData[field.id].length > 0
      ) {
        if (!/^\d*(\.\d+)?$/.test(formData[field.id])) {
          errors[field.id] = `${field.label} deve ser um número válido.`;
        } else if (parseFloat(formData[field.id]) <= 0) {
          errors[
            field.id
          ] = `${field.label} deve ser um número positivo válido.`;
        }
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const preventExtraInput = (event: React.KeyboardEvent) => {
    const target = event.target as HTMLInputElement;
    if (
      event.key === "," ||
      (event.key === "." && target.value.includes("."))
    ) {
      event.preventDefault();
    }
  };

  const autocompleteProps = {
    options: items,
  };

  const handleAutocompleteOptions = async (_: any, newInputValue: string) => {
    setFormData((prevFormData) => ({ ...prevFormData, name: newInputValue }));

    console.log(newInputValue);
    if (newInputValue.length < 1) return;
    try {
      const response = await fetch(
        `/api/lists/products/search/${newInputValue}`
      );
      const responseObj = await response.json();
      if (response.ok) {
        const products: IItem[] = responseObj.data;
        const newAutocompleteOptions = products;
        console.log(newAutocompleteOptions);
        setItems(products);
      } else {
        throw responseObj.error;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectProduct = (
    _: any,
    selectedProduct: IItem | string | null
  ) => {
    const product = items.find((item) => item === selectedProduct);

    if (!product) return;

    console.log(formData);
    setFormData((prevFormData) => {
      let newFormData = { ...prevFormData };
      Object.keys(prevFormData).forEach((key) => {
        console.log(key, product[key as keyof IItem]);
        //if (key in product)
        if (key !== "quantity")
          newFormData[key] = String(product[key as keyof IItem] ?? "");
      });
      return newFormData;
    });
  };

  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>{props.title}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {props.fields.map((field) =>
            field.id === "unit" ? (
              <FormControl key={field.id} fullWidth variant="standard">
                <InputLabel id={field.id + "-label"}>{field.label}</InputLabel>
                <Select
                  labelId={field.id + "-label"}
                  id={field.id}
                  name={field.id}
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
            ) : field.id === "name" ? (
              <Autocomplete
                {...autocompleteProps}
                key={field.id + "autocomplete"}
                id="autocomplete"
                freeSolo
                disableClearable
                value={formData[field.id] || ""}
                getOptionLabel={(option) =>
                  typeof option === "string" ? option : option.name
                }
                isOptionEqualToValue={(option, value) =>
                  option._id === value._id
                }
                renderOption={(props, option) => {
                  return (
                    <li {...props} key={option._id}>
                      <Box display="flex" justifyContent="flex-start">
                        <Typography variant="body1" sx={{ mr: "16px" }}>
                          {option.name}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="textSecondary"
                          sx={{ mr: "16px" }}
                        >
                          {option.market}
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                          R$ {option.price.toFixed(2).toString()}
                        </Typography>
                      </Box>
                    </li>
                  );
                }}
                onInputChange={handleAutocompleteOptions}
                onChange={handleSelectProduct}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    autoFocus
                    margin="dense"
                    key={field.id}
                    id={field.id}
                    label={field.label}
                    type={field.type}
                    fullWidth
                    variant="standard"
                    error={Boolean(formErrors[field.id])}
                    helperText={formErrors[field.id]}
                    onKeyDown={preventExtraInput}
                  />
                )}
              />
            ) : (
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
                error={Boolean(formErrors[field.id])}
                helperText={formErrors[field.id]}
                onKeyDown={preventExtraInput}
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

export { ItemFormDialog };
