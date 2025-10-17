import React from 'react';
import { QRCode } from 'qrcode.react';

const AppQR = () => {
  const appUrl = 'https://healthconnect-app.vercel.app';

  return (
    <div className="qr-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: '#1976d2',
          marginBottom: '30px',
          fontSize: '28px',
          fontWeight: '600'
        }}>
          Scan to open HealthConnect App
        </h1>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          display: 'inline-block'
        }}>
          <QRCode
            value={appUrl}
            size={280}
            level="H"
            includeMargin={true}
            renderAs="svg"
            style={{
              display: 'block',
              margin: '0 auto'
            }}
          />
        </div>
        
        <p style={{
          color: '#666',
          margin: '25px 0',
          fontSize: '16px',
          lineHeight: '1.5'
        }}>
          Open your phone's camera and point it at the QR code to access the HealthConnect app
        </p>
        
        <div style={{
          marginTop: '20px'
        }}>
          <a
            href={appUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: '#1976d2',
              color: 'white',
              padding: '12px 30px',
              borderRadius: '25px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '500',
              display: 'inline-block',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(25, 118, 210, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#1565c0';
              e.target.style.boxShadow = '0 4px 8px rgba(25, 118, 210, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#1976d2';
              e.target.style.boxShadow = '0 2px 4px rgba(25, 118, 210, 0.3)';
            }}
          >
            Download App
          </a>
        </div>
      </div>
    </div>
  );
};

export default AppQR;