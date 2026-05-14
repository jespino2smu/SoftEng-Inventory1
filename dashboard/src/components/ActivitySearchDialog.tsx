import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchField from "./SearchField";
import api from "../api/api";

type ColorState = {
  red: boolean;
  yellow: boolean;
  blue: boolean;
};

export type Data = {
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  colors: ColorState;
};

type ActivitySearchDialogProps = {
  open: boolean;
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  colors: ColorState;

  field: any;
  updateField: (e: any) => void;

  onNameChange: (name: string, value: any) => void;
  onStartDateChange: (date: any) => void;
  onEndDateChange: (date: any) => void;
  onColorsChange: (name: string, colors: ColorState) => void;

  onOk: () => void;
  onCancel: () => void;
};

const ActivitySearchDialog: React.FC<ActivitySearchDialogProps> = ({
  open,
  name,
  startDate,
  endDate,
  colors,

  field,
  updateField,

  onNameChange,
  onStartDateChange,
  onEndDateChange,
  onColorsChange,
  onOk,
  onCancel,
}) => {
  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

  };

  const [productSuggestions, setProductSuggestions] = useState<any[]>([]);
    const [searchFieldValidity, setSearchFieldValidity] = useState<boolean>(false);
    
  useEffect(() => {
    updateData();
  }, []);

  async function updateData() {
    let response: any = await api.post('/stocks/get-products', {
      activity: 'Inventory',
    });

      // let n = "";
      // Object.keys(response.data[0]).forEach(key0 => {
      //   //n += `${key0}: ${response.data[0][key0]}\n`;
      //   Object.keys(response.data[0][key0]).forEach(key1 => {
      //      n += `${key1}: ${response.data[0][key0][key1]}\n`;
      //   });
      // });
      // alert(n);

    setProductSuggestions(response.data[0]);

    response = await api.post('/stocks/get-staff');
    // let s = "";
    // for (let i = 0; i < response.data.length; i++) {
    //   s += "\n";
    //   Object.keys(response.data[i]).forEach(key => {
    //     s += "    " + key + ": " + response.data[i][key] + "\n";
    //   })
    // }
    // alert(s);

    //setStaffList(response.data);
    //alert(JSON.stringify(response.data));
  }


  function handleSearchSuggestionClick(id: number, name: string) {
    // alert(id + " " + name);
    const data = {
      target: {
        name: 'productId',
        value: id
      }
    }
    updateField(data);
    // setCurrentProduct(prev => ({
    //   ...prev,
    //   ProductId: id,
    //   Name: name
    // }));
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog
        open={open}
        onClose={onCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{color:'black'}}>Search</DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            
            <SearchField
                data={productSuggestions}
                setValidity={setSearchFieldValidity}
                onSuggestionPicked={handleSearchSuggestionClick}/>

            <TextField
              name="name"
              label="Name"
              fullWidth
              value={field.name}
              onChange={updateField}
            />

            <DatePicker
              name="startDate"
              label="Start Date"
              value={field.startDate}
              onChange={onStartDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />

            <DatePicker
              name="endDate"
              label="End Date"
              value={field.endDate}
              onChange={onEndDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />

            {/* Checkboxes */}
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={colors.red}
                    onChange={handleCheckboxChange}
                    name="red"
                  />
                }
                label="Red"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={colors.yellow}
                    onChange={handleCheckboxChange}
                    name="yellow"
                  />
                }
                label="Yellow"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={colors.blue}
                    onChange={handleCheckboxChange}
                    name="blue"
                  />
                }
                label="Blue"
              />
            </FormGroup>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onCancel}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={onOk}
          >
            Search
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default ActivitySearchDialog;

function setCurrentProduct(arg0: (prev: any) => any) {
    throw new Error("Function not implemented.");
}
function setProductSuggestions(arg0: any) {
    throw new Error("Function not implemented.");
}

