import React, { useState, useRef, useEffect } from 'react';
import { QueryEngine } from '@comunica/query-sparql';
import { useSession } from '@hooks';

const QueryUI = ({
  initialQuery = '',
  initialQueryUrl = '',
  queryResult = [],
  setQueryResult = () => {}
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [queryUrl, setQueryUrl] = useState(initialQueryUrl);
  const queryEngine = useRef();
  const bindingStream = useRef();
  const { session } = useSession();

  useEffect(() => {
    queryEngine.current = new QueryEngine();
  }, []);

  const runQuery = async (e) => {
    e.preventDefault();
    bindingStream.current = await queryEngine.current.queryBindings(query, {
      sources: [queryUrl],
      fetch: session.fetch
    });
    bindingStream.current.on('data', (binding) => {
      setQueryResult((old) => [...old, binding]);
    });
  };

  return (
    <div>
      <form onSubmit={runQuery}>
        <label htmlFor="query">
          Query:
          <input id="query" type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <br />
        <label htmlFor="root">
          Root URL:
          <input
            id="root"
            type="text"
            value={queryUrl}
            onChange={(e) => setQueryUrl(e.target.value)}
          />
        </label>
        <br />
        <input type="submit" value="Query" />
        <button type="button" onClick={() => setQueryResult([])}>
          Clear
        </button>
      </form>
      <div>
        {queryResult.map((result) => (
          <div>
            <p>Subject: {result.get('s').value}</p>
            <p>Predicate: {result.get('p').value}</p>
            <p>Object: {result.get('o').value}</p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default QueryUI;
