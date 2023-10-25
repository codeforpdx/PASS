import mediaQuery from 'css-mediaquery';

const createMatchMedia = (width) => (query) => ({
  matches: mediaQuery.match(query, { width }),
  addListener: () => {},
  removeListener: () => {}
});

export default createMatchMedia;
