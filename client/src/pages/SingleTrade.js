import React, {useState} from 'react';

// Import the `useParams()` hook
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';

import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';

import { QUERY_SINGLE_TRADE, QUERY_ME, QUERY_TRADES } from '../utils/queries';
import { UPDATE_TRADE } from '../utils/mutations';

const SingleTrade = () => {
  // Use `useParams()` to retrieve value of the route parameter `:profileId`
  const { tradeId } = useParams();
  const [tradeText, setTradeText] = useState("")
  const { loading, data } = useQuery(QUERY_SINGLE_TRADE, {
    // pass URL parameter
    variables: { tradeId: tradeId },
  });

  const trade = data?.trade || {};

  let [updateTrade, {}]= useMutation(UPDATE_TRADE, {
    update(cache, { data: { updateTrade } }) {
      try {
        const { trades } = cache.readQuery({ query: QUERY_TRADES });

        cache.writeQuery({
          query: QUERY_TRADES,
          data: { trades: trades.filter(oldTrade => oldTrade._id !== updateTrade._id) },
        });
      } catch (e) {
        console.error(e);
      }

      // update me object's cache
      const { me } = cache.readQuery({ query: QUERY_ME });
      cache.writeQuery({
        query: QUERY_ME,
        data: { me: { ...me, trades: me.trades.filter (oldTrade => oldTrade._id !== updateTrade._id)} },
      });
    }
  })

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="my-3">
      <h3 className="card-header bg-dark text-light p-2 m-0">
        {trade.tradeAuthor} <br />
        <span style={{ fontSize: '1rem' }}>
          posted on {trade.createdAt}
        </span>
      </h3>
      <div className="bg-light py-4">
        <blockquote
          className="p-4"
          style={{
            fontSize: '1.5rem',
            fontStyle: 'italic',
            lineHeight: '1.5',
          }}
        >
          <textarea onChange={(event)=>setTradeText(event.target.value)}>{trade.tradeText}</textarea>
        </blockquote>
        <div>
            <button className="btn btn-primary btn-block" onClick={() => updateTrade({variables: { tradeId: tradeId, tradeText: tradeText }})}>Edit</button>
                 
            </div>
      </div>

      <div className="my-5">
        <CommentList comments={trade.comments} />
      </div>
      <div className="m-3 p-4" style={{ border: '1px dotted #1a1a1a' }}>
        <CommentForm tradeId={trade._id} />
      </div>
    </div>
  );
};

export default SingleTrade;
