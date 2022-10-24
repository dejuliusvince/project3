import React from 'react';
import { useQuery } from '@apollo/client';

import TradeList from '../components/TradeList';
import TradeForm from '../components/TradeForm';

import { QUERY_TRADES } from '../utils/queries';

const Home = () => {
  const { loading, data } = useQuery(QUERY_TRADES);
  const trades = data?.trades || [];

  return (
    <main>
      <div className="flex-row justify-center">
        <div
          className="col-12 col-md-10 mb-3 p-3"
          style={{ border: '1px dotted #1a1a1a' }}
        >
          <TradeForm />
        </div>
        <div className="col-12 col-md-8 mb-3">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <TradeList
              trades={trades}
              title="Community thread:"
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
