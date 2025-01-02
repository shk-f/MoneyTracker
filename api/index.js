const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
require('dotenv').config();
const Transaction = require('./models/transaction');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.post('/api/transaction', async (req,res) => {
  try {
    const {name, description, datetime, price} = req.body;
    const transaction = await Transaction.create({
      name, 
      description, 
      datetime,
      price: parseFloat(price)
    });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

app.get('/api/transactions', async(req,res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));