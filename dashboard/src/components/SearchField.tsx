import { useState, useMemo, useEffect } from 'react';
import { Autocomplete, TextField, CircularProgress, Box } from '@mui/material';

import FlexSearch from "flexsearch";
import type { FlexSearchResult } from '../types/FlexSearchResult'


type Product = {
  ProductId: number;
  ProductName: string;
  Quantity: string;
};

interface SearchFieldProps {
  index: FlexSearch.Document<Product>;
}

const SearchField: React.FC<SearchFieldProps> = ({index}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

//   const search = (query: string): Product[] => {
//     if (!query.trim()) return [];

//     const tokens = query.toLowerCase().trim().split(/\s+/);
//     let results: number[] = [];

//     tokens.forEach((token, i) => {
//       const tokenResults = index.search(token, { field: "name", suggest: true });
//       const ids = tokenResults.flatMap((r) => r.result as number[]);

//       if (i === 0) {
//         results = ids;
//       } else {
//         // AND logic: keep only IDs that appear in all token searches
//         results = results.filter((id) => ids.includes(id));
//       }
//   });

//   // Map back to full objects
//   return results.map((id) => data.find((d) => d.id === id)!);
// };





  return (
    <Box sx={{ width: 400, p: 4 }}>
      <Autocomplete
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        options={options}
        loading={loading}
        getOptionLabel={(option) => option.ProductName}
        filterOptions={(x) => x} 
        // onInputChange={(_, value) => handleSearch(value)}

        onChange={(event, newValue: Product | null) => {
          if (newValue) {
            alert(`Selected Product ID: ${newValue.ProductId}\nQuantity: ${newValue.Quantity}`);
          }
          
        }}

        isOptionEqualToValue={(option, value) => option.ProductId === value.ProductId}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search (e.g. 'blue shirt')"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option.ProductId}>
            <Box>
              {option.ProductName}
              <Box component="span" sx={{ display: 'block', fontSize: '0.75rem', color: 'gray' }}>
              </Box>
            </Box>
          </li>
        )}
      />
    </Box>
  );
};

export default SearchField;