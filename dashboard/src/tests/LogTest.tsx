import { useState } from 'react';
import { 
Box, Typography, TextField, Button
} from '@mui/material';

import { post } from '../components/api';

export const LogTest = () => {
    const [info, setInfo] = useState({
        message: "John",
        something: 25
    });

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setInfo((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const buttonClick = async () => {
        alert("E: " + info.message);
        const result = await post('/users/test', {
            test: info.message,
        });
    }

    return (
        <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>Reports</Typography>
        
        <TextField fullWidth variant="outlined"
            label="Do"
            name="message"
            value={info.message}
            onChange={handleChange}
            sx={{ mb: 3, cursor: 'pointer' }}
        />
        <Button onClick={buttonClick}>Log</Button>
        </Box>
    );
};