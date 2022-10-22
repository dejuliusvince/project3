const db = require('../config/connection');
const { User, Trade } = require('../models');
const userSeeds = require('./userSeeds.json');
const tradeSeeds = require('./tradeSeeds.json');


db.once('open', async () => {
  try {
    await Trade.deleteMany({});
    await User.deleteMany({});

    await User.create(userSeeds);

    for (let i = 0; i < tradeSeeds.length; i++) {
      const { _id, tradeAuthor } = await Trade.create(tradeSeeds[i]);
      const user = await User.findOneAndUpdate(
        { username: tradeAuthor },
        {
          $addToSet: {
            trades: _id,
          },
        }
      );
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log('all done!');
  process.exit(0);
});
