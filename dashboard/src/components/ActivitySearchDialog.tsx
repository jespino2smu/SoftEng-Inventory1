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
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchField from "./SearchField";


import { Clear } from '@mui/icons-material';

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

  field: any;
  updateField: (e: any) => void;
  setStaff: (value: number) => void;
  updateCheckBox: (e: any) => void;

  onNameChange: (name: string, value: any) => void;
  onStartDateChange: (date: any) => void;
  onEndDateChange: (date: any) => void;

  onSearch: () => void;
  onCancel: () => void;
};

const ActivitySearchDialog: React.FC<ActivitySearchDialogProps> = ({
  open,

  field,
  updateField,
  setStaff,
  updateCheckBox,

  onStartDateChange,
  onEndDateChange,
  onSearch,
  onCancel,
}) => {
  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

  };

  const [productSuggestions, setProductSuggestions] = useState<any[]>([]);
  const [searchFieldValidity, setSearchFieldValidity] = useState<boolean>(false);
  
  
  const [currentStaff, setCurrentStaff] = useState<any>({
    id: null, name: ""
  });
  const [openStaffDialog, setOpenStaffDialog] = useState<boolean>(false);
  const [staffList, setStaffList] = useState<any[]>([
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
  { id: 4, name: "David" },
])

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

    let s = "";
    for (let i = 0; i < response.data.length; i++) {
      s += "\n";
      Object.keys(response.data[i]).forEach(key => {
        s += "    " + key + ": " + response.data[i][key] + "\n";
      })
    }
    //alert(s);
    setStaffList(response.data);

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
    <>
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
                displayProductName
                data={productSuggestions}
                setValidity={setSearchFieldValidity}
                onSuggestionPicked={handleSearchSuggestionClick}/>

            <TextField
              name="name"
              label="Staff Name"
              fullWidth
              value={currentStaff.name}
              onClick={() => {
                setOpenStaffDialog(true);
              }}
              slotProps={{
                input: {
                  readOnly: true,
                  endAdornment: currentStaff.name !== "" ? (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentStaff({
                            id: null, name: ""
                          })}}
                      >
                        <Clear />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }
              }}
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

            <Typography variant="caption" sx={{ mb: 0, pb: 0, fontWeight: 'bold' }}>Activity Types:</Typography>
            {/* Checkboxes */}
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    name="dispatch"
                    checked={field.dispatch}
                    onChange={updateCheckBox}
                  />
                }
                label="Dispatch"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    name="inventory"
                    checked={field.inventory}
                    onChange={updateCheckBox}
                  />
                }
                label="Inventory"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    name="received"
                    checked={field.received}
                    onChange={updateCheckBox}
                  />
                }
                label="Received"
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
            onClick={onSearch}
          >
            Search
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>

      <Dialog
        open={openStaffDialog}
        onClose={() => setOpenStaffDialog(false)}
        fullWidth>
        <DialogTitle sx={{color: 'black'}}>Select a Name</DialogTitle>

        <DialogContent>
          <Table>
            <TableBody>
              {staffList.map((staff: any, index: number) => (
                <TableRow
                  key={index}
                  hover
                  // selected={tempSelected === staff}
                  onClick={() => {
                    const staffName = staff.LastName + " " + staff.FirstName + (staff.MiddleInitial? " " + staff.MiddleInitial + "." : "");

                    setStaff(staff.StaffId);

                    setCurrentStaff({
                      staffId: staff.StaffId,
                      name: staffName
                    });
                    setOpenStaffDialog(false);
                  }}
                  sx={{
                    cursor: "pointer",
                  }}
                >
                  <TableCell>{staff.LastName}, {staff.FirstName}{staff.MiddleInitial? " " + staff.MiddleInitial + "." : ""}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => {
              setOpenStaffDialog(false);
            }}>Back</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ActivitySearchDialog;
