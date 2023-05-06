/* ----- NEW CLIENT DIALOG BOX -----

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
</Dialog> */

// ----- FOOTER -----

// const AppFooter = (props) => (
//   <ThemeProvider theme={theme}>
//     {/* <CssBaseline /> */}
//     <Typography
//       variant="body2"
//       color="text.secondary"
//       align="center"
//       sx={{
//         backgroundColor: 'white',
//         position: 'flex',
//         bottom: 0,
//         left: 0,
//         right: 0,
//         // marginBottom: '10px',
//         // marginTop: '10px',
//         padding: '10px',
//         borderTop: '1px solid black'
//       }}
//       {...props}
//     >
//       {'Copyright © '}
//       <Link color="inherit" href="https://www.codeforpdx.org/" target="_blank">
//         codeForPDX
//       </Link>{' '}
//       {new Date().getFullYear()}
//     </Typography>
//   </ThemeProvider>
// );

// ----- MOCKUPHOMESCREEN UNUSED -----

// const Mockup = () => {
//   return (
//     <div style={{ height: 300, width: '100%' }}>
//       <DataGrid columns={columns} rows={rows} />
//     </div>
//   );
// };

/* <ButtonGroup variant="contained" aria-label="outlined primary button group">
  <Button startIcon={<AddIcon />} onClick={handleOpen2}>
    Add
  </Button>
  <Button variant="outlined" startIcon={<DeleteIcon />} onClick={handleOpen}>
    Delete
  </Button>
</ButtonGroup> */

/* - MY CASES - */

/* <Icon baseClassName="fas" className="fa-plus-circle" color="primary" /> */

/* <Typography
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
</Typography> */

/* - FLOATING ACTION BUTTON - */

/* <Fab color="primary" aria-label="add">
        <AddIcon />
      </Fab> */

// ----- -----

/* <Card variant="outlined">
<Container component="main" maxWidth="xs">
  <Box
    sx={{
      marginTop: 5,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    }}
  >
    <section id="logout" className="panel">
      <div className="row">
        <label id="labelLogout" htmlFor="btnLogout">
          Click the following logout button to log out of your pod:{' '}
        </label>
        <LogoutButton>
          // <button type="submit">Logout</button>
          <Button variant="contained" type="submit" color="error" size="large">
            Logout
          </Button>{' '}
        </LogoutButton>

        <p className="labelStatus" role="alert">
          Your session is now logged in with the WebID [
          <a href={session.info.webId} target="_blank" rel="noreferrer">
            {session.info.webId}
          </a>
          ].
        </p>
      </div>
    </section>
  </Box>
</Container>
</Card> */

// ----- MOCKUP UNUSED -----

/* - HAMBURGER MENU BUTTON - */

/* <IconButton
  size="large"
  edge="start"
  color="inherit"
  aria-label="open drawer"
  sx={{ mr: 2 }}
>
  <MenuIcon />
</IconButton> */

/* <StarIcon /> */
/* <StarBorderIcon /> */

/* - TOGGLE BUTTON - */
/* <ToggleButton
  value="check"
  selected={selected}
  onChange={() => {
    setSelected(!selected);
  }}
>
  <CheckIcon />
</ToggleButton>; */
