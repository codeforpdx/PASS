import * as React from 'react';
import Box from '@mui/material/Box';
// import Checkbox from '@mui/material/Checkbox';
// import Paper from '@mui/material/Paper';
// import Stack from '@mui/material/Stack';
// import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import DeleteIcon from '@mui/icons-material/Delete';
// import SendIcon from '@mui/icons-material/Send';
import { DataGrid } from '@mui/x-data-grid';
import Modal from '@mui/material/Modal';
import AddIcon from '@mui/icons-material/Add';
// import CheckIcon from '@mui/icons-material/Check';
// import ToggleButton from '@mui/material/ToggleButton';
// import Icon from '@mui/material/Icon';
// import StarIcon from '@mui/icons-material/Star';
// import StarBorderIcon from '@mui/icons-material/StarBorder';
import { ThemeProvider } from '@mui/material/styles';
import Footer from './Footer';
import NavBar from './NavBar';
import theme from '../../theme';

const columns = [
  { field: 'id', headerName: 'ID', width: 50 },
  { field: 'firstName', headerName: 'First Name', width: 130 },
  { field: 'lastName', headerName: 'Last Name', width: 130 },
  {
    field: 'dateCreated',
    headerName: 'Date Created',
    width: 130
  },
  { field: 'priority', headerName: 'Priority', width: 75 }
];

const rows = [
  {
    id: 1,
    lastName: 'Smith',
    firstName: 'John',
    dateCreated: 'Jan 1, 2023',
    priority: '⭐'
  },
  {
    id: 2,
    lastName: 'Smith',
    firstName: 'Jane',
    dateCreated: 'Jan 1, 2023',
    priority: ''
  },
  {
    id: 3,
    lastName: 'Smith',
    firstName: 'Jane',
    dateCreated: 'Jan 1, 2023',
    priority: ''
  },
  { id: 4, lastName: 'Smith', firstName: 'John', dateCreated: 'Jan 1, 2023', priority: '⭐' },
  { id: 5, lastName: 'Smith', firstName: 'John', dateCreated: 'Jan 1, 2023', priority: '' },
  { id: 6, lastName: 'Smith', firstName: 'John', dateCreated: 'Jan 1, 2023', priority: '⭐' },
  { id: 7, lastName: 'Smith', firstName: 'Jane', dateCreated: 'Jan 1, 2023', priority: '' },
  { id: 8, lastName: 'Smith', firstName: 'John', dateCreated: 'Jan 1, 2023', priority: '' },
  { id: 9, lastName: 'Smith', firstName: 'Jane', dateCreated: 'Jan 1, 2023', priority: '⭐' }
];

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 350,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

// const addUser = () => {};

const Mockup = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // const [selected, setSelected] = React.useState(false);

  return (
    <ThemeProvider theme={theme}>
      <NavBar />
      {/* <Icon baseClassName="fas" className="fa-plus-circle" color="primary" /> */}
      {/* <StarIcon /> */}
      {/* <StarBorderIcon /> */}
      <br />
      {/* ----- BUTTON ROW ----- */}
      <div>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="right"
          noWrap
          sx={{ flex: 1 }}
        >
          <ButtonGroup variant="contained" aria-label="outlined primary button group">
            <Button startIcon={<AddIcon />}>Add</Button>
            <Button variant="outlined" startIcon={<DeleteIcon />} onClick={handleOpen}>
              Delete
            </Button>
          </ButtonGroup>
          {/* ----- MODAL ----- */}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle} align="center">
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Are you sure you want to delete?
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                WARNING: This action cannot be undone!
              </Typography>
              <br />
              <Button variant="contained" onClick={handleClose}>
                Confirm
              </Button>
            </Box>
          </Modal>
          <br />
          {/* ----- TOGGLE BUTTON ----- */}
          {/* <ToggleButton
            value="check"
            selected={selected}
            onChange={() => {
              setSelected(!selected);
            }}
          >
            <CheckIcon />
          </ToggleButton> */}
        </Typography>
      </div>
      {/* ----- DATA GRID ----- */}
      <Box sx={{ width: '100%' }}>
        <div style={{ height: 500 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
          />
        </div>
      </Box>
      {/* ----- FOOTER ----- */}
      <Footer />
    </ThemeProvider>
  );
};

export default Mockup;
