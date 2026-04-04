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

  // ---------------------------------------
  // Search functionality

  const [inputValue, setInputValue] = useState('');
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


  useEffect(() => {
    if (inputValue.length < 1) {
      setOptions([]);
      return;
    }

    setLoading(true);
    const rawResults = index.search(inputValue, { enrich: true, bool: "and", suggest: true } as any);
    const results = (rawResults as unknown) as FlexSearchResult[];
    
    const flatResults = results.flatMap((res) => res.result ? res.result.map((r) => r.doc) : []);
    const uniqueResults = Array.from(new Map(flatResults.map((item) => [item.id, item])).values());

    setOptions(uniqueResults);
    setLoading(false);
  }, [inputValue, index]);
  
  // ---------------------------------------

return (
    <Box sx={{ width: 500, p: 4 }}>
      <Autocomplete
        value={null}
        inputValue={inputValue}
        onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
        
        options={options}
        loading={loading}
        
        onChange={(event, newValue: Product | null) => {
          if (newValue) {
            alert(`Selected Product ID: ${newValue.id}\nQuantity: ${newValue.quantity}`);
            
            setInputValue(''); 
          }
        }}

        filterOptions={(x) => x}
        getOptionLabel={(option) => option.name || ""}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search and Clear"
            placeholder="Search..."
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
        renderOption={(props, option) => {
          const { key, ...otherProps } = props as any;
          return (
            <li key={option.id} {...otherProps}>
              <Box>
                {option.name}
              </Box>
            </li>
          );
        }}
      />
    </Box>
  );
};