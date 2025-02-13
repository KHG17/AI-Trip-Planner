import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreateTrip from './create-trip';
import Header from './components/custom/Header';
import { Toaster } from './components/ui/sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ViewTrip from './view-trip/[tripId]/index'
import MyTrips from './my-trips';

const root = document.getElementById('root');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <BrowserRouter>
        <Header />
        <Toaster />
        <Routes>
          <Route path='/' element = {<App />}/>
          <Route path='/create-trip' element = {<CreateTrip />}/>
          <Route path='/view-trip/:tripId' element = {<ViewTrip />}/>
          <Route path='/my-trips' element = {<MyTrips />}/>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
