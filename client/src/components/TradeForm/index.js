import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { ADD_TRADE } from '../../utils/mutations';
import { QUERY_TRADES, QUERY_ME } from '../../utils/queries';

import Auth from '../../utils/auth';

const TradeForm = () => {
  const [tradeText, setTradeText] = useState('');

  const [characterCount, setCharacterCount] = useState(0);

  const [addTrade, { error }] = useMutation(ADD_TRADE, {
    update(cache, { data: { addTrade } }) {
      try {
        const { trades } = cache.readQuery({ query: QUERY_TRADES });

        cache.writeQuery({
          query: QUERY_TRADES,
          data: { trades: [addTrade, ...trades] },
        });
      } catch (e) {
        console.error(e);
      }

      // update me object's cache
      const { me } = cache.readQuery({ query: QUERY_ME });
      cache.writeQuery({
        query: QUERY_ME,
        data: { me: { ...me, trades: [...me.trades, addTrade] } },
      });
    },
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await addTrade({
        variables: {
          tradeText,
          tradeAuthor: Auth.getProfile().data.username,
        },
      });

      setTradeText('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'tradeText' && value.length <= 280) {
      setTradeText(value);
      setCharacterCount(value.length);
    }
  };

  return (
    <div>
      <h3>What are you making?</h3>

      {Auth.loggedIn() ? (
        <>
          <p
            className={`m-0 ${
              characterCount === 280 || error ? 'text-danger' : ''
            }`}
          >
            Character Count: {characterCount}/280
          </p>
          <form
            className="flex-row justify-center justify-space-between-md align-center"
            onSubmit={handleFormSubmit}
          >
            <div className="col-12 col-lg-9">
              <textarea
                name="tradeText"
                placeholder="Here's a new recipe..."
                value={tradeText}
                className="form-input w-100"
                style={{ lineHeight: '1.5', resize: 'vertical' }}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="col-12 col-lg-3">
              <button className="btn btn-primary btn-block py-3" type="submit">
                Add Recipe
              </button>
            </div>
            {error && (
              <div className="col-12 my-3 bg-danger text-white p-3">
                {error.message}
              </div>
            )}
          </form>
        </>
      ) : (
        <p>
          You need to be logged in to share your recipe. Please{' '}
          <Link to="/login">login</Link> or <Link to="/signup">signup.</Link>
        </p>
      )}
    </div>
  );
};

export default TradeForm;
