// React Imports
import React from 'react';
// Material UI Imports
import { Box, Typography, Button } from '@mui/material';

const ReusableHomeSection = ({ src, alt, title, description, button, href, label }) => {
    (
        <>
            <Box
                component="img"
                src={src}
                alt={alt}
                sx={{
                    width: { xs: '100%', sm: '75%', md: '65%' }
                }}
            />
            <Typography
                sx={{
                    color: 'Purple.dark',
                    fontSize: { xs: '2rem', sm: '3.5rem', md: '3rem' },
                    textAlign: 'center',
                    marginBottom: '24px'
                }}
            >
                <strong>{title}</strong>
            </Typography>
            <Typography
                sx={{
                    color: 'Purple.main',
                    fontSize: { sm: '1.5rem', md: '1.5rem' },
                    width: { md: '75%' },
                    marginBottom: '24px'
                }}
            >
                {description}
            </Typography>
            {button && (
                <Button
                    variant="contained"
                    href={href}
                    aria-label={label}
                    sx={{
                        my: '1rem',
                        color: 'Purple.main',
                        backgroundColor: 'Purple.light',
                        width: { xs: 1, sm: 1 / 3, md: 1 / 5 },
                        borderRadius: '25px'
                    }}
                >
                    {button}
                </Button>
            )}
        </>
    );
};

export default ReusableHomeSection;
