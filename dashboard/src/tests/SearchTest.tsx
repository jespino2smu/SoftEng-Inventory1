import { useState, useMemo, useEffect } from 'react';
import { Autocomplete, TextField, CircularProgress, Box } from '@mui/material';
import { Document } from 'flexsearch';

interface Product {
  id: number;
  name: string;
  quantity: number;
}

interface FlexSearchResult {
  field: string;
  result: {
    id: number | string;
    doc: Product;
  }[];
}

export default function SearchField() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const data: Product[] = [
    { id: 1, name: "Blue Cotton Shirt", quantity: 10 },
    { id: 2, name: "Black Leather Jacket", quantity: 20 },
    { id: 3, name: "White Running Shoes", quantity: 30 },
    { id: 4, name: "Blue Denim Jeans", quantity: 40 },
    { id: 5, name: "Red Cotton Scarf", quantity: 50 },
  ];

  const index = useMemo(() => {
    return new (Document as any)({
      document: {
        id: "id",
        index: ["name", "category"],
        store: true, 
      },
      tokenize: "forward",
      context: true,
    });
  }, []);

  useEffect(() => {
    data.forEach((item) => index.add(item));
  }, [index]);

  const handleSearch = (query: string) => {
    if (!query) {
      setOptions([]);
      return;
    }

    setLoading(true);

    const rawResults = index.search(query, {
      enrich: true,
      suggest: true,
      bool: "and",
    } as any);

    // Double cast (unknown -> FlexSearchResult[]) to bypass deep union errors
    const results = (rawResults as unknown) as FlexSearchResult[];

    // FlexSearch returns an array of results for EACH field indexed
    const flatResults = results.flatMap((res) => 
      res.result ? res.result.map((r) => r.doc) : []
    );

    // Remove duplicates based on ID (if a term matches name AND category)
    // const uniqueResults = Array.from(
    //   new Map(flatResults.map((item) =>
    //     [item.id, item])).values()
    // );
    // setOptions(uniqueResults);

    setOptions(flatResults);
    setLoading(false);
  };

  return (
    <Box sx={{ width: 400, p: 4 }}>
      <Autocomplete
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        options={options}
        loading={loading}
        getOptionLabel={(option) => option.name}
        filterOptions={(x) => x} 
        onInputChange={(_, value) => handleSearch(value)}

        onChange={(event, newValue: Product | null) => {
          if (newValue) {
            alert(`Selected Product ID: ${newValue.id}\nQuantity: ${newValue.quantity}`);
          }
          
        }}

        isOptionEqualToValue={(option, value) => option.id === value.id}
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
          <li {...props} key={option.id}>
            <Box>
              {option.name}
              <Box component="span" sx={{ display: 'block', fontSize: '0.75rem', color: 'gray' }}>
              </Box>
            </Box>
          </li>
        )}
      />
    </Box>
  );
};