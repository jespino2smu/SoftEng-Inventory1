import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { TextField } from "@mui/material";

type NumberStepperProps = {
  max: number;
  value: string;
  setValue: (value: string) => void;
  normalSize?: boolean;
};

const buttonColor: string = "#d8d8d8";
const focusColor: string = "#3d97f0";
const iconColor: string = "#4b82b9";



const IncrementField: React.FC<NumberStepperProps> = ({ max, value, setValue, normalSize}) => {
  const [focused, setFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = Number(e.target.value);
    
    if (e.target.value === '' || e.target.value === '.') {
      setValue("");
    } else if
    (!isNaN(Number(
          e.target.value.substring(0, e.target.value.length - 1)
      )) &&
      e.target.value[e.target.value.length - 1] === '.' ) {
      setValue(e.target.value);
    } else if (isNaN(Number(e.target.value))) {

    } else if (numericValue > max) {
      setValue(max.toString());
    } else {
      setValue(numericValue.toString());
    }
  };

  const increment = () => {
    const numericValue = Number(value);

    if (numericValue < max) {
      setValue((parseInt(value) + 1).toString());
    } else {
      setValue(max.toString());
    }
  };

  const decrement = () => {
    const numericValue = Number(value);
    
    if (numericValue > 1) {
      setValue((parseInt(value) - 1).toString());
    } else {
      setValue("0");
    }
  };

function myButton(borderRadius: string)
{
	return {
        padding: 0,
        border: focused ? "2px solid " + focusColor : 0,
        borderRight: focused ? "1.5px solid " + focusColor : 0,
          backgroundColor: buttonColor,
          color: "black",
          "&:hover": {
            backgroundColor: focusColor,
          },
          "& .MuiSvgIcon-root": {
            color: iconColor,
          },
		 
		borderRadius: borderRadius,
		width: normalSize? '40px' : '30px',
		height: normalSize? '44px' : {
            xs: "26px",
            sm: "32px",
            md: '40px',
        },
	};
}

function numberField()
{
	return ({
	  width: normalSize? '100%' : {
          lg: "70px",
          xs: '50px',
          sm: '50px'
        },
        "& .MuiInputBase-input": {
          textAlign: "center",
          fontSize: normalSize? '16px' : {
            xs: "10px",
            sm: "12px",
            md: "14px",
        }},
        "& .MuiInputBase-root:hover": {
          borderTop: "1.5px solid " + buttonColor,
          borderBottom: "1.5px solid " + buttonColor,
        },
        "& .MuiInputBase-root.Mui-focused": {
          borderTop: "2px solid " + focusColor,
          borderBottom: "2px solid " + focusColor,
        },
		
		  
        "& .MuiInputBase-root": {
          borderTop: "1.5px solid " + buttonColor,
          borderBottom: "1.5px solid " + buttonColor,
          padding: "4px 0",
          height: normalSize? '44px' :{
            xs: "26px",
            sm: "32px",
            md: '40px',
          },
        },
    });
}


  return (
    <>
        <IconButton onClick={decrement} sx={myButton(
            '6px 0 0 6px')}>
            <RemoveIcon />
        </IconButton>
        <TextField
            variant="standard"
            value={value}
            onChange={handleChange}
            InputProps={{ disableUnderline: true }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            sx={numberField()}
            slotProps={{
              htmlInput: {
                inputMode: "numeric",
                pattern: "[0-9]*"
              }
            }}
        />
        <IconButton onClick={increment} sx={
            myButton('0 6px 6px 0')}>
            <AddIcon />
        </IconButton>
      </>
  );
};

// const styles = {
//   button: {
//     padding: "8px 12px",
//     fontSize: "16px",
//     cursor: "pointer"
//   },
//   input: {
//     width: "60px",
//     textAlign: "center" as const,
//     padding: "6px"
//   }
// };

export default IncrementField;