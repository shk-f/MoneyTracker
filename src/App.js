import './App.css';
import { useEffect, useState } from "react";

function App() {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setdescription] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransac().then(setTransactions);
  }, []);

  async function getTransac() {
    try {
      const url = process.env.REACT_APP_API_URL + '/transactions';
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
      }
      
      return await res.json();
    } catch (err) {
      console.error('Error fetching transactions:', err);
      return []; 
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const url = process.env.REACT_APP_API_URL + '/transaction';
    const priceNumber = parseFloat(name.split(' ')[0]);

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        price: priceNumber,
        name: name.substring(name.split(' ')[0].length + 1),
        description,
        datetime,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.error) throw new Error(json.error);
        setName('');
        setdescription('');
        setDatetime('');
        getTransac().then(transactions => {
          setTransactions(transactions);
        });
      })
      .catch((err) => console.error('Error:', err));
  }

  let balance = 0;
  for (const t of transactions) {
    balance = balance + t.price;
  }

  return (
    <main>
      <h1>Rs.{balance}</h1>

      <form onSubmit={handleSubmit}>
        <div className="basic">
          <input
            type="text"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            placeholder="+200"
          />
          <input
            type="datetime-local"
            value={datetime}
            onChange={(ev) => setDatetime(ev.target.value)}
          />
        </div>

        <div className="description">
          <input
            type="text"
            value={description}
            onChange={(ev) => setdescription(ev.target.value)}
            placeholder="description"
          />
        </div>

        <button type="submit">New Transaction</button>
      </form>

      <div className="transactions">
        {transactions.length > 0 && transactions.map((transaction) => (
          <div className="transaction" key={transaction._id}>
            <div className="left">
              <div className="name">{transaction.name}</div>
              <div className="description">{transaction.description}</div>
            </div>
            <div className="right">
              <div className={"price " + (transaction.price < 0 ? 'red' : 'green')}>
                {transaction.price}
              </div>
              <div className="datetime">
                {new Date(transaction.datetime).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
