import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoggedIn, setUserId, setToken, setLoading } from './slice/auth/authSlice';
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AccountSettings from "./pages/AccountSettings";
import Profile from "./pages/Profile";
import Forum from "./pages/Forum";
import Message from './pages/Message';

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    if (storedToken && storedUserId) {
      dispatch(setLoggedIn(true));
      dispatch(setUserId(storedUserId));
      dispatch(setToken(storedToken));
    }
    dispatch(setLoading(false));
  }, [dispatch]);

  return (
    <div className="App">
      <Router>
        <Dashboard />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account-settings" element={<AccountSettings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/chat" element={<Message />}>
            <Route path=":otherUserId" element={<Message />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;