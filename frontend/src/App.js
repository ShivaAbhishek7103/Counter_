import React, { useEffect, useContext, useReducer, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

// Counter context
const CounterContext = React.createContext();

// Reducer function for managing counter state
const counterReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return { count: action.count, mycount: action.mycount };
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'MYINCREMENT':
      return { ...state, mycount: state.mycount + 1 };
    case 'MYDECREMENT':
      return { ...state, mycount: state.mycount - 1 };
    default:
      return state;
  }
};

const Home = () => {
  const { state, dispatch } = useContext(CounterContext);

  const fetchCounter = useCallback(async () => {
    try {
      const response = await fetch('/api/counter');
      const data = await response.json();
      dispatch({ type: 'SET', count: data.count, mycount: data.mycount });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCounter();
  }, [fetchCounter]);

  return (
    <div>
      <h1>Counter Value: {state.count}</h1>
      <Link to="/counter">Counter</Link>
      <h1>My Counter Value: {state.mycount}</h1>
      <Link to="/mycounter">MyCounter</Link>
    </div>
  );
};

const Counter = () => {
  const { state, dispatch } = useContext(CounterContext);
  const navigate = useNavigate();

  const incrementCounter = useCallback(async () => {
    try {
      await fetch(`/api/counter/increment/count`, { method: 'POST' });
      dispatch({ type: 'INCREMENT' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const decrementCounter = useCallback(async () => {
    try {
      await fetch('/api/counter/decrement/count', { method: 'POST' });
      dispatch({ type: 'DECREMENT' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <div>
      <h2>Counter</h2>
      <p>Count: {state.count}</p>
      <p>My Count: {state.mycount}</p>
      <button onClick={() => incrementCounter()}>Increment count</button>
      <button onClick={() => decrementCounter()}>Decrement count</button>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};

const MyCounter = () => {
  const { state, dispatch } = useContext(CounterContext);
  const navigate = useNavigate();

  const incrementMyCounter = useCallback(async () => {
    try {
      await fetch(`/api/counter/increment/mycount`, { method: 'POST' });
      dispatch({ type: 'MYINCREMENT' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const decrementMyCounter = useCallback(async () => {
    try {
      await fetch(`/api/counter/decrement/mycount`, { method: 'POST' });
      dispatch({ type: 'MYDECREMENT' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <div>
      <h2>My Counter</h2>
      <p>Count: {state.count}</p>
      <p>My Count: {state.mycount}</p>
      <button onClick={() => incrementMyCounter()}>Increment mycount</button>
      <button onClick={() => decrementMyCounter()}>Decrement mycount</button>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(counterReducer, { count: 0, mycount: 0 });

  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/counter">Counter</Link>
              </li>
              <li>
                <Link to="/mycounter">My Counter</Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/counter" element={<Counter />} />
            <Route path="/mycounter" element={<MyCounter />} />
          </Routes>
        </div>
      </Router>
    </CounterContext.Provider>
  );
};

export default App;