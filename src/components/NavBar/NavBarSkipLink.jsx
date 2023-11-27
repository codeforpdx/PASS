import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';

const NavBarSkipLink = () => {
  const [showSkipLink, setShowSkipLink] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Tab') {
        setShowSkipLink(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div style={{ position: 'absolute', top: -9999 }}>
      {showSkipLink && (
        <Button
          href="#main-content"
          variant="contained"
          color="primary"
          style={{
            position: 'fixed',
            top: '10px',
            left: '10px',
            zIndex: 999,
            transform: showSkipLink ? 'translateY(0%)' : 'translateY(-100%)',
            transition: 'transform 0.3s'
          }}
        >
          Skip to main content
        </Button>
      )}
    </div>
  );
};

export default NavBarSkipLink;
