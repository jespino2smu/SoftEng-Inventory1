import React from "react";
import {
  TextField,
  Autocomplete,
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery
} from "@mui/material";

type Item = {
  id: number;
  name: string;
  quantity: number;
};

const items: Item[] = [
  { id: 1, name: "Apples", quantity: 10 },
  { id: 2, name: "Bananas", quantity: 5 },
  { id: 3, name: "Oranges", quantity: 8 },
  { id: 4, name: "Public Authority for the Assessment of Compensation for Damages Resulting from the Iraqi Aggression ", quantity: 8 }
];

export default function AutocompleteDropdown() {
  const [value, setValue] = React.useState<Item | null>(null);
  const [inputValue, setInputValue] = React.useState<string>("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // New: set quantity column width smaller
  const qtyColumnWidth = isMobile ? "35px" : "50px";

  return (
    <Autocomplete<Item, false, false, false>
      options={items}
      getOptionLabel={(option) => option.name}
      value={value}
      inputValue={inputValue}
      onChange={(_, newValue) => setValue(newValue)}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      fullWidth
      disablePortal={isMobile}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select Item"
          fullWidth
          size={isMobile ? "small" : "medium"}
        />
      )}
      slotProps={{
        paper: {
          sx: {
            width: "100%",
            maxHeight: isMobile ? 300 : 420,
            overflow: "auto"
          }
        },
        listbox: { sx: { padding: 0 } }
      }}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          <Box
            display="grid"
            gridTemplateColumns={`${qtyColumnWidth} 1fr auto`}
            alignItems="center"
            width="100%"
            gap={isMobile ? 1 : 2}
            px={isMobile ? 1 : 2}
            py={isMobile ? 0.8 : 1.5}
            minHeight={isMobile ? 40 : 56}
          >
            <Typography
              variant={isMobile ? "body2" : "body1"}
              color="text.secondary"
              textAlign="right"
              sx={{ overflowWrap: "break-word" }}
            >
              {option.quantity}
            </Typography>

            <Typography
              variant={isMobile ? "body2" : "body1"}
              sx={{ overflowWrap: "break-word" }}
              textAlign="left"
            >
              {option.name}
            </Typography>

            <Button
              variant="contained"
              size={isMobile ? "small" : "medium"}
              sx={{
                minWidth: isMobile ? 40 : 64,
                padding: isMobile ? "4px 6px" : undefined
              }}
              onClick={(e) => {
                e.stopPropagation();
                console.log("Add clicked:", option);
              }}
            >
              {isMobile ? "+" : "Add"}
            </Button>
          </Box>
        </li>
      )}
      renderGroup={(params) =>
        !isMobile ? (
          <li key={params.key}>
            <Box
              position="sticky"
              top={0}
              zIndex={1}
              bgcolor="background.paper"
              borderBottom={`1px solid ${theme.palette.divider}`}
              display="grid"
              gridTemplateColumns={`${qtyColumnWidth} 1fr auto`}
              alignItems="center"
              px={2}
              py={1}
            >
              <Typography
                variant="caption"
                textAlign="right"
                color="text.secondary"
              >
                Qty
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Name
              </Typography>
              <Typography
                variant="caption"
                textAlign="center"
                color="text.secondary"
              >
                Action
              </Typography>
            </Box>
            <ul style={{ padding: 0, margin: 0 }}>{params.children}</ul>
          </li>
        ) : (
          <ul style={{ padding: 0, margin: 0 }}>{params.children}</ul>
        )
      }
      groupBy={() => "header"}
    />
  );
}