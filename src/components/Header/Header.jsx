/* eslint-disable react/jsx-indent */
import React, { useState } from 'react';

function Header() {
  
  return (
    <nav className="navbar navbar-expand-lg navbar-light justify-content-between" style={{backgroundColor: "#009CE3"}}>
      <div className="col-2">
        <img src="/logo_apa.png" alt="logo" />
      </div>
      <div className="col-2  justify-content-center">
        <a className="navbar-brand text-white" href="/dashboard">Dashboard</a>
      </div>{/*
            <div className="col-2  justify-content-center">
        <a className="navbar-brand text-white" href="/seance">Création Séance</a>
      </div>
      */}

      <div className="col-2  justify-content-center">
        <a className="navbar-brand text-white" href="/patient">Gestion Patient</a>
      </div>
      <div className="col-2  justify-content-center">
        <a className="navbar-brand text-white" href="/donnees">Import Données</a>
      </div>
    </nav>
  );
}
export default Header;