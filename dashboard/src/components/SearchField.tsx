import React, { useState, useEffect } from "react";
import { TextField, Autocomplete, InputAdornment, useMediaQuery } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { Document } from "flexsearch";

import { type Product } from '../types/Product';

// Create a FlexSearch Document index
const index = new Document<{
    ProductId: number;
    Name: string;
  }>({
  document: {
    id: "ProductId",
    index: ["Name"],
    store: ["ProductId", "Name"],
  },
  preset: "match",
  tokenize: "forward",
  cache: true,
  encode: (str: string) => str.toLowerCase().split(/\s+/),
});

interface SearchComponentProps {
  data: Product[];
  setValidity: (value: boolean) => void;
  onSuggestionPicked: (id: number, name: string) => void;
}

export const SearchField: React.FC<SearchComponentProps> = ({ data, setValidity, onSuggestionPicked }) => {
  const [options, setOptions] = useState<Product[]>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const existingIds = data.map((item) => item.ProductId);
    existingIds.forEach((id) => index.remove(id));

    data.forEach((item) => index.add(item));
  }, [data, index]);

  useEffect(() => {
    if (inputValue) {
      const results = index.search(inputValue, { enrich: true });

      const flattened = results.flatMap((r) => r.result.map((doc: any) => doc.doc));
      setOptions(flattened);
    } else {
      setOptions([]);
    }
  }, [inputValue, index]);


  function validateField(value: string) {
    //alert(value);
    const product = options.find(option => option.Name === value);

    if (product) {
      onSuggestionPicked(product.ProductId, product.Name);
      setValidity(true);
    } else {
      setValidity(false);
    }
    setInputValue(value);
  }


  
  return (
    <Autocomplete
      freeSolo
      options={options}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.Name
      }
      // inputValue={inputValue}
      // onInputChange={(event, newInputValue) => setInputValue(newInputValue) }
      // onChange={(event, value) => {
      //   if (value && typeof value !== "string") {
      //     onSuggestionPicked(value.ProductId, value.Name);
      //     // alert(`ID: ${value.ProductId}\nName: ${value.Name}`);
      //   }
        
      onInputChange={(event, newInputValue) => {
        validateField(newInputValue)
        //setInputValue(newInputValue);
        if (false) {
          event;
        }
      }}
      onChange={(event, value) => {
        if (value && typeof value !== "string") {
          onSuggestionPicked(value.ProductId, value.Name);
          setValidity(true);
          // alert(`ID: ${value.ProductId}\nName: ${value.Name}`);
          if (false) {
            event;
          }
        }
      }}

      slotProps={{
        listbox : {
          style: {
            maxHeight: useMediaQuery("(orientation: portrait)")?
            '75vh' : '62vh',
            overflowY: "auto",
          },
        }
      }}

      popupIcon={null}

      renderInput={(params) => (
        <TextField
          {...params}
          label="Search"
          
          variant="outlined"

          slotProps={{
            input: {
              ...params.InputProps,

              startAdornment: (
                <>
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>

                  {params.InputProps.startAdornment}
                </>
              ),
            }
          }}
        />
      )}
    />
  );
};

export default SearchField;