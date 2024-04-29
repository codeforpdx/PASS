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

  .page-blue,
  .page-weak-blue {
    color: #fff;
    font-weight: bold;
    padding: 8px 12px;
    border-radius: 4px;
    text-decoration: none;
    cursor: pointer;
    display: flex;
  }

  .page-blue {
    background-color: #0758ca;
    &:hover {
      background-color: #03295e;
    }
  }
  .page-weak-blue {
    background-color: #03295e;
    &:hover {
      background-color: #0758ca;
    }
  }

  .chevron {
    margin: 0 1rem;
  }

  .active-page {
    background-color: #0758ca;
    cursor: default;
  }
`;

export default PaginationContainer;
