import React from 'react';
import { Link } from 'react-router-dom';
// uncomment import underneath and link it to the button on line 38

import { REMOVE_TRADE,  } from '../../utils/mutations';

const TradeList = ({
  trades,
  title,
  showTitle = true,
  showUsername = true,
}) => {
  if (!trades.length) {
    return <h3>No Recipes Yet</h3>;
  }

  // create function that handles removing a trade



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
                    shared this recipe {trade.createdAt}
                  </span>
                </Link>
              ) : (
                <>
                  <span style={{ fontSize: '1rem' }}>
                    You shared this recipe on {trade.createdAt}
                  </span>
                  
                  {/* <Link to={`/remove/${item._id}`}>
                  <button>X</button></Link> */}
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
              Join the discussion on this recipe.
            </Link>
          </div>
        ))}
    </div>
  );
};

export default TradeList;
