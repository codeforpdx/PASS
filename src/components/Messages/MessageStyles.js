import styled from 'styled-components';

export const StyledButton = styled('button')({
  width: '150px',
  height: '60px',
  backgroundColor: '#017969',
  borderColor: 'black',
  borderRadius: '5px',
  cursor: 'pointer',
  '&:hover': {
    filter: 'brightness(0.9)'
  },
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '18px'
});

export const StyledButton2 = styled('button')({
  gridColumn: 'span 2',
  width: '100px',
  height: '30px',
  justifySelf: 'center',
  cursor: 'pointer',
  backgroundColor: '#017969',
  border: 'none',
  borderRadius: '5px',
  color: '#fff',
  fontWeight: 'bold',
  '&:hover': {
    filter: 'brightness(0.9)'
  }
});

export const PaginationContainer = styled.div`
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    list-style-type: none;
    gap: 3px;
  }

  .page-green,
  .page-red,
  .page-yellow {
    color: #fff;
    font-weight: bold;
    padding: 8px 16px;
    border-radius: 4px;
    text-decoration: none;
    cursor: pointer;
  }

  .page-green {
    background-color: #74b0a8;
    &:hover {
      background-color: #017969;
    }
  }

  .page-red {
    background-color: #bf7c84;
    &:hover {
      background-color: #961020;
    }
  }

  .page-yellow {
    background-color: #e3d2a0;
    &:hover {
      background-color: #debc59;
    }
  }

  .chevron {
    margin: 0 1.5rem;
  }

  .active-page {
    background-color: #017969;
    color: #debc59;
    cursor: default;
  }
`;

export const StyledPreview = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  border: '2px solid black',
  borderRadius: '10px',
  padding: '5px',
  cursor: 'pointer',
  '&:hover': {
    boxShadow: '2px 3px 2px rgba(0, 0, 0, .4)'
  }
});

export const StyledDate = styled('p')({
  margin: 0,
  padding: 0
});

export const StyledHeader = styled('h1')({
  margin: 0,
  padding: 0,
  fontSize: '1.2rem'
});

export const StyledHeader2 = styled('h1')({
  gridColumn: 'span 2'
});

export const StyledOverlay = styled('div')({
  height: '100vh',
  width: '100vw',
  backgroundColor: 'rgb(128, 128, 128, .7)',
  backdropFilter: 'blur(2px)',
  zIndex: 99,
  top: '0%',
  left: '0%',
  position: 'fixed'
});

export const StyledForm = styled('form')({
  display: 'grid',
  backgroundColor: '#fff',
  gridTemplateColumns: '150px 400px',
  gap: '10px',
  margin: '20px',
  border: '2px solid black',
  borderRadius: '8px',
  padding: '20px',
  alignItems: 'center',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 99
});

export const CancelButton = styled('button')({
  gridColumn: '2 / 3',
  width: '150px',
  justifySelf: 'end',
  height: '35px',
  backgroundColor: 'red',
  borderRadius: '5px',
  border: 'none',
  fontWeight: 'bold',
  cursor: 'pointer',
  '&:hover': {
    filter: 'brightness(0.9)'
  }
});

export const StyledNotice = styled('p')({
  gridColumn: 'span 2',
  fontStyle: 'italic'
});

export const StyledError = styled('p')({
  gridColumn: 'span 2',
  fontStyle: 'italic',
  color: 'red',
  justifySelf: 'center'
});

export const StyledSuccess = styled('p')({
  gridColumn: 'span 2',
  fontStyle: 'italic',
  color: 'green',
  justifySelf: 'center'
});

export const StyledInput = styled('input')({
  height: '30px'
});

export const StyledTextArea = styled('textarea')({
  height: '200px'
});
