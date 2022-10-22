import { useMutation } from '@apollo/client';
import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { REMOVE_TRADE } from '../../utils/mutations';
import { QUERY_ME, QUERY_TRADES } from '../../utils/queries';


// import { REMOVE_TRADE,  } from '../../utils/mutations';

const TradeList = ({
  trades,
  title,
  showTitle = true,
  showUsername = true,
}) => {
  const [deleteTrade, { data, loading, error}]= useMutation(REMOVE_TRADE, {
    update(cache, { data: { removeTrade } }) {
      try {
        const { trades } = cache.readQuery({ query: QUERY_TRADES });

        cache.writeQuery({
          query: QUERY_TRADES,
          data: { trades: trades.filter(oldTrade => oldTrade._id !== removeTrade._id) },
        });
      } catch (e) {
        console.error(e);
      }

      // update me object's cache
      const { me } = cache.readQuery({ query: QUERY_ME });
      cache.writeQuery({
        query: QUERY_ME,
        data: { me: { ...me, trades: me.trades.filter (oldTrade => oldTrade._id !== removeTrade._id)} },
      });
    }
  })
  console.log (trades)


  if (!trades.length) {
    return <h3>No Posts Yet</h3>;
  }



  return (
    <div>
      {showTitle && <h3>{title}</h3>}
      {trades &&
        trades.map((trade) => (
          <div key={trade._id} className="card mb-3">
            <h4 className="card-header bg-primary text-light p-2 m-0">
              {showUsername ? (
                <Link
                  className="text-light"
                  to={`/profiles/${trade.tradeAuthor}`}
                >
                  {trade.tradeAuthor} <br />
                  <span style={{ fontSize: '1rem' }}>
                  posted this {trade.createdAt}
                  </span>
                </Link>
              ) : (
                <>
                  <span style={{ fontSize: '1rem' }}>
                    You posted this on {trade.createdAt}
                  </span>
                  
                  
                </>
              )}
            </h4>
            <div className="card-body bg-light p-2">
              <p>{trade.tradeText}</p>
            </div>

            <Link
              className="btn btn-primary btn-block btn-squared"
              to={`/trades/${trade._id}`}
            >
              Respond if you’re interested.
            </Link>
          </div>
        ))}
    </div>
  );
};

export default TradeList;
