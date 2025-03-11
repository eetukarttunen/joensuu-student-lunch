import React from 'react';
import './App.css';

const PageInfo = ({ errorMessage }) => (
  <div className="page-info-container">
    <p>
      Kaikki Joensuun alueen yliopisto- ja AMK-ruokaloiden listat samassa näkymässä! &#129382;
      <br />
      <br />
      Klikkaamalla ⭐-ikonia voit siirtää ravintolan listan ensimmäisten joukkoon. Listan piilottaminen onnistuu klikkaamalla ravintolan nimeä.
    </p>
    {errorMessage && (
      <div className="error-message">
        <p>{errorMessage}</p>
      </div>
    )}
  </div>
);

export default PageInfo;
