// React Imports
import React from 'react'
// Material UI Imports
import { Box } from '@mui/system'
import { Typography } from '@mui/material';

const ReusableKeyFeatures = ({icon, title, description}) =>{
    (
        <>
        <Box
        sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "14px",
            textAlign: "center"
            
        }}
        >
            {icon}
            <Typography
            sx={{
                marginLeft: "8px",
                color: "Purple.main",
                fontSize: { xs: "1rem", sm: "1.25rem"}
            }}
            ><strong>{title}</strong>
            </Typography>
        </Box>
        <Typography
        sx={{
            width: { xs:"90%", md: "65%"},
            textAlign: "center",
            fontSize: { xs: ".85rem", sm: "1rem", md: "1.25rem"},
            color: "Purple.text",
            marginBottom: "50px"
        }}
        >
            {description}
        </Typography>
        </>
    )
}

export default ReusableKeyFeatures