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
import Modal from '@mui/material/Modal';
// import SendIcon from '@mui/icons-material/Send';
// import AddIcon from '@mui/icons-material/Add';
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
// import Fab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import NavigationIcon from '@mui/icons-material/Navigation';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha, ThemeProvider } from '@mui/material/styles';
// import AccountCircle from '@mui/icons-material/AccountCircle';
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
import { randomTraderName, randomUpdatedDate } from '@mui/x-data-grid-generator';
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

// ----- ROWS -----

const rowTestData = [
  {
    id: 1,
    name: randomTraderName(),
    dateModified: randomUpdatedDate(),
    currentStatus: 'Completed',
    isPriority: true
  },
  {
    id: 2,
    name: randomTraderName(),
    dateModified: randomUpdatedDate(),
    currentStatus: 'To Do',
    isPriority: false
  },
  {
    id: 3,
    name: randomTraderName(),
    dateModified: randomUpdatedDate(),
    currentStatus: 'In Progress',
    isPriority: true
  },
  {
    id: 4,
    name: randomTraderName(),
    dateModified: randomUpdatedDate(),
    isPriority: true
  },
  { id: 5, name: randomTraderName(), dateModified: randomUpdatedDate(), isPriority: false },
  {
    id: 6,
    name: randomTraderName(),
    dateModified: randomUpdatedDate(),
    isPriority: true
  },
  { id: 7, name: randomTraderName(), dateModified: randomUpdatedDate(), isPriority: false },
  { id: 8, name: randomTraderName(), dateModified: randomUpdatedDate(), isPriority: false },
  { id: 9, name: randomTraderName(), dateModified: randomUpdatedDate(), isPriority: false }
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

const Mockup = () => {
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  // const handleOpen2 = () => setOpen2(true);
  const handleClose = () => setOpen(false);
  const handleClose2 = () => setOpen2(false);
  // const [selected, setSelected] = React.useState(false);
  const [rows, setRows] = React.useState(rowTestData);

  // ----- GRID ACTIONS -----

  const editClient = React.useCallback(
    (id) => () => {
      console.log('Edited!');
    },
    []
  );

  const togglePriority = React.useCallback(
    (id) => () => {
      setRows((prevRows) =>
        prevRows.map((row) => (row.id === id ? { ...row, isPriority: !row.isPriority } : row))
      );
    },
    []
  );

  // const changeStatus = React.useCallback(
  //   (id) => () => {
  //     console.log('Status changed!');
  //   },
  //   []
  // );

  const deleteClient = React.useCallback(
    (id) => () => {
      setTimeout(() => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      });
    },
    []
  );

  // ----- SUBMIT NEW CLIENT -----

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password')
    });
  };

  // ----- COLUMNS -----

  const columns = React.useMemo(
    () => [
      { field: 'id', headerName: 'ID', type: 'number', width: 50 },
      { field: 'name', headerName: 'Name', type: 'string', width: 150 },
      {
        field: 'dateModified',
        headerName: 'Date Modified',
        type: 'dateTime',
        width: 150
      },
      {
        field: 'currentStatus',
        headerName: 'Status',
        type: 'singleSelect',
        width: 100,
        valueOptions: ['Completed', 'In Progress', 'To Do']
      },
      { field: 'isPriority', headerName: 'Priority', type: 'boolean', width: 75 },
      {
        field: 'actions',
        type: 'actions',
        width: 80,
        getActions: (params) => [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit Client"
            onClick={editClient(params.id)}
            showInMenu
          />,
          <GridActionsCellItem
            icon={<CheckIcon />}
            label="Toggle Priority"
            onClick={togglePriority(params.id)}
            showInMenu
          />,
          // <GridActionsCellItem
          //   icon={<StarBorderIcon />}
          //   label="Change Status"
          //   onClick={changeStatus(params.id)}
          //   showInMenu
          // />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={deleteClient(params.id)}
            showInMenu
          />
        ]
      }
    ],
    [togglePriority]
  );

  return (
    <ThemeProvider theme={theme}>
      <NavBar />
      <Typography
        variant="h5"
        noWrap
        component="div"
        sx={{
          margin: '10px 10px -15px 10px',
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
      <Box sx={{ width: '100%', height: '70vh' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          // checkboxSelection
        />
      </Box>

      {/* ----- FOOTER ----- */}
      <Footer />
    </ThemeProvider>
  );
};

export default Mockup;
