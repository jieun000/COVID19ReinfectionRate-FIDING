import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import Main from './components/Main';
import Menu1 from './components/Menu1';


const App = () => {
  return (
    <div>
      <Header />
      
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Main />} />
        <Route component={Menu1} path="/menu1" exact />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;