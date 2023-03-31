import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import NavBar from './NavBar';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary
}));

const Mockup = () => (
  <>
    <NavBar />
    <br />
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        <Typography>
          <div>Clients Date Modified Priority</div>
        </Typography>
        <Item>Rachel Jan 1, 2022, Checkmark</Item>
        <Item>Rachel Jan 1, 2022, Checkmark</Item>
        <Item>Rachel Jan 1, 2022, Checkmark</Item>
        <Item>Rachel Jan 1, 2022, Checkmark</Item>
        <Item>Rachel Jan 1, 2022, Checkmark</Item>
        <Item>Rachel Jan 1, 2022, Checkmark</Item>
      </Stack>
    </Box>
  </>
);

export default Mockup;
