import React, { useState, useEffect } from "react";
import { TextField, Autocomplete, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import FlexSearch, { Document } from "flexsearch";

// Define the item type
export type Item = {
  ProductId: number;
  ProductName: string;
}

// Create a FlexSearch Document index
const index = new Document<Item>({
  document: {
    id: "ProductId",
    index: ["ProductName"], // you can add more fields here
    store: ["ProductId", "ProductName"],
  },
  preset: "match",     // preset includes tokenization + encoding
  tokenize: "forward", // prefix search
  encode: (str: string) => str.toLowerCase().split(/\s+/),
});

interface SearchComponentProps {
  data: Item[];
}

export const SearchTestComponent: React.FC<SearchComponentProps> = ({ data }) => {
  const [options, setOptions] = useState<Item[]>([]);
  const [inputValue, setInputValue] = useState("");

  // Rebuild the index whenever the data changes
  useEffect(() => {
    // Remove all existing docs first
    // FlexSearch Document does not have clear(), so we remove by ID
    const existingIds = data.map((item) => item.ProductId);
    existingIds.forEach((id) => index.remove(id));

    // Add all items
    data.forEach((item) => index.add(item));
  }, [data, index]);

  // Update search results when inputValue changes
  useEffect(() => {
    if (inputValue) {
      const results = index.search(inputValue, { enrich: true });
      // flatten enriched results to get full documents
      const flattened = results.flatMap((r) => r.result.map((doc: any) => doc.doc));
      setOptions(flattened);
    } else {
      setOptions([]);
    }
  }, [inputValue, index]);

  return (
<Autocomplete
  freeSolo
  options={options}
  getOptionLabel={(option) =>
    typeof option === "string" ? option : option.ProductName
  }
  inputValue={inputValue}
  onInputChange={(event, newInputValue) => setInputValue(newInputValue) }
  onChange={(event, value) => {
    if (value && typeof value !== "string") {
      alert(`ID: ${value.ProductId}\nName: ${value.ProductName}`);
    }
  }}

  popupIcon={null}

  renderInput={(params) => (
    <TextField
      {...params}
      label="Search"
      variant="outlined"
      InputProps={{
        ...params.InputProps,

        startAdornment: (
          <>
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>

            {params.InputProps.startAdornment}
          </>
        ),
      }}
    />
  )}
/>
  );
};

