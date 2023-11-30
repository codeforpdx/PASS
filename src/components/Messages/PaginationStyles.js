import styled from 'styled-components';

const PaginationContainer = styled.div`
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    list-style-type: none;
    gap: 3px;
  }

  .page-green,
  .page-red {
    color: #fff;
    font-weight: bold;
    padding: 8px 12px;
    border-radius: 4px;
    text-decoration: none;
    cursor: pointer;
    display: flex;
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

  .chevron {
    margin: 0 1rem;
  }

  .active-page {
    background-color: #017969;
    cursor: default;
  }
`;

export default PaginationContainer;
