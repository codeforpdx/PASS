/* eslint-disable no-unused-vars */
import * as React from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Modal from '@mui/material/Modal';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import ToggleButton from '@mui/material/ToggleButton';
import Icon from '@mui/material/Icon';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Fab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NavigationIcon from '@mui/icons-material/Navigation';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha, ThemeProvider } from '@mui/material/styles';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import MailIcon from '@mui/icons-material/Mail';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreIcon from '@mui/icons-material/MoreVert';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Toolbar from '@mui/material/Toolbar';
import { randomName, randomUpdatedDate } from '@mui/x-data-grid-generator';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import Footer from './Footer';
import NavBar from './NavBar';
import theme from '../../theme';

// ----- SEARCH BAR COMPONENTS -----

const Search = styled('div')(() => ({
  position: 'relative',
  color: 'primary',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.05)
  },
  marginRight: theme.spacing(0),
  marginLeft: theme.spacing(0),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(0),
    width: 'auto'
  }
}));

const SearchIconWrapper = styled('div')(() => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const StyledInputBase = styled(InputBase)(() => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '50ch'
    }
  }
}));

// ----- COLUMNS -----

const columns = [
  { field: 'id', headerName: 'ID', type: 'number', width: 50 },
  { field: 'name', headerName: 'Name', type: 'string', width: 150 },
  {
    field: 'dateModified',
    headerName: 'Date Modified',
    type: 'dateTime',
    width: 150
  },
  { field: 'isPriority', headerName: 'Priority', type: 'boolean', width: 75 },
  {
    field: 'TEST',
    headerName: 'SELECT TEST',
    type: 'singleSelect',
    width: 120,
    valueOptions: ['Bulgaria', 'Netherlands', 'France', 'United Kingdom', 'Spain', 'Brazil']
  }
];

// ----- ROWS -----

const rows = [
  {
    id: 1,
    name: 'test name',
    dateModified: randomUpdatedDate(),
    isPriority: true,
    TEST: 'Spain'
  },
  {
    id: 2,
    name: 'test name',
    dateModified: randomUpdatedDate(),
    isPriority: false,
    TEST: 'France'
  },
  {
    id: 3,
    name: 'test name',
    dateModified: randomUpdatedDate(),
    isPriority: true,
    TEST: 'Brazil'
  },
  {
    id: 4,
    name: 'test name',
    dateModified: randomUpdatedDate(),
    isPriority: true
  },
  { id: 5, name: 'test name', dateModified: randomUpdatedDate(), isPriority: false },
  {
    id: 6,
    name: 'test name',
    dateModified: randomUpdatedDate(),
    isPriority: true
  },
  { id: 7, name: 'test name', dateModified: randomUpdatedDate(), isPriority: false },
  { id: 8, name: 'test name', dateModified: randomUpdatedDate(), isPriority: false },
  { id: 9, name: 'test name', dateModified: randomUpdatedDate(), isPriority: false }
];

// ----- MODAL STYLE -----

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

// ----- TYPESCRIPT VERSION -----
// const togglePriority = React.useCallback(
//   (id: GridRowId) => () => {
//     setRows((prevRows) =>
//       prevRows.map((row) => (row.id === id ? { ...row, isAdmin: !row.isAdmin } : row))
//     );
//   },
//   []
// );

// const togglePriority = React.useCallback(
//   (id) => () => {
//     setRows((prevRows) =>
//       prevRows.map((row) => (row.id === id ? { ...row, isPriority: !row.isPriority } : row))
//     );
//   },
//   []
// );

const Mockup = () => {
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  // const handleOpen2 = () => setOpen2(true);
  const handleClose = () => setOpen(false);
  const handleClose2 = () => setOpen2(false);
  // const [selected, setSelected] = React.useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password')
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <NavBar />
      {/* <Icon baseClassName="fas" className="fa-plus-circle" color="primary" /> */}
      {/* <br /> */}
      <Typography
        variant="h5"
        noWrap
        component="div"
        // align="center"
        sx={{
          // backgroundColor: 'white',
          // position: 'fixed',
          // bottom: 0,
          // left: 0,
          // right: 0,
          margin: '10px 10px -15px 10px',
          // padding: '10 10 10 10',
          fontWeight: 'bold',
          position: 'relative'
        }}
      >
        My Cases
      </Typography>

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
          {/* <ButtonGroup variant="contained" aria-label="outlined primary button group">
            <Button startIcon={<AddIcon />} onClick={handleOpen2}>
              Add
            </Button>
            <Button variant="outlined" startIcon={<DeleteIcon />} onClick={handleOpen}>
              Delete
            </Button>
          </ButtonGroup> */}

          {/* ----- NEW CLIENT DIALOG BOX ----- */}
          <div>
            <Dialog open={open2} onClose={handleClose2}>
              <DialogTitle align="center">Add new client</DialogTitle>
              <DialogContent>
                <DialogContentText>Enter new client details below</DialogContentText>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      autoComplete="family-name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose2}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
          </div>

          {/* ----- DELETE CLIENT MODAL ----- */}
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
        </Typography>
      </div>

      {/* ----- SEARCH BAR ----- */}
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
      </Search>

      {/* ----- DATA GRID ----- */}
      <Box sx={{ width: '100%', height: '90vh' }}>
        {/* <div style={{ height: '90vh' }}> */}
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          // checkboxSelection
        />
        {/* </div> */}
      </Box>

      {/* ----- FLOATING ACTION BUTTON ----- */}
      {/* <Fab color="primary" aria-label="add">
        <AddIcon />
      </Fab> */}

      {/* ----- FOOTER ----- */}
      <Footer />
    </ThemeProvider>
  );
};

// const Mockup = () => {
//   return (
//     <div style={{ height: 300, width: '100%' }}>
//       <DataGrid columns={columns} rows={rows} />
//     </div>
//   );
// };

export default Mockup;
