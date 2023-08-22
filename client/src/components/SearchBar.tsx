import { InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
  onChange: (term: string) => void;
}

export default function SearchBar(props: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    props.onChange(event.target.value);
  };

  return (
    <TextField
      id="search"
      type="search"
      label="Busque uma de suas listas"
      value={searchTerm}
      onChange={handleChange}
      sx={{ minWidth: 350 }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
}
