import React from 'react';

export const StardustButton = ({ 
  children = "Launching Soon", 
  onClick, 
  className = "",
  ...props 
}: {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  [key: string]: any;
}) => {
  const buttonStyle = {
    '--white': '#e6f3ff',
    '--bg-light': '#ffb6d9',
    '--bg-dark': '#880e4f',
    '--radius': '100px',
    outline: 'none',
    cursor: 'pointer',
    border: 0,
    position: 'relative',
    borderRadius: 'var(--radius)',
    backgroundColor: 'var(--bg-light)',
    transition: 'all 0.2s ease',
    boxShadow: `
      inset 0 0.3rem 0.9rem rgba(255, 255, 255, 0.3),
      inset 0 -0.1rem 0.3rem rgba(0, 0, 0, 0.7),
      inset 0 -0.4rem 0.9rem rgba(255, 255, 255, 0.5),
      0 3rem 3rem rgba(0, 0, 0, 0.3),
      0 1rem 1rem -0.6rem rgba(0, 0, 0, 0.8)
    `,
  };

  const wrapStyle = {
    fontSize: '25px',
    fontWeight: 500,
    color: '#5a0035', // dark text color for baby pink light mode
    padding: '32px 45px',
    borderRadius: 'inherit',
    position: 'relative',
    overflow: 'hidden',
  };

  const pStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: 0,
    transition: 'all 0.2s ease',
    transform: 'translateY(2%)',
    maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 40%, transparent)',
  };

  const beforeAfterStyles = `
    .pearl-button {
      background-color: var(--bg-light) !important;
    }
    
    .pearl-button .wrap {
      color: #5a0035 !important;
    }

    .pearl-button .wrap::before,
    .pearl-button .wrap::after {
      content: "";
      position: absolute;
      transition: all 0.3s ease;
    }
    
    .pearl-button .wrap::before {
      left: -15%;
      right: -15%;
      bottom: 25%;
      top: -100%;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.25);
    }
    
    .pearl-button .wrap::after {
      left: 6%;
      right: 6%;
      top: 12%;
      bottom: 40%;
      border-radius: 22px 22px 0 0;
      box-shadow: inset 0 10px 8px -10px rgba(255, 255, 255, 0.6);
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.3) 0%,
        rgba(255, 255, 255, 0) 50%,
        rgba(255, 255, 255, 0) 100%
      );
    }
    
    .pearl-button .wrap p span:nth-child(2) {
      display: none;
    }
    
    .pearl-button:hover .wrap p span:nth-child(1) {
      display: none;
    }
    
    .pearl-button:hover .wrap p span:nth-child(2) {
      display: inline-block;
    }
    
    .pearl-button:hover {
      box-shadow:
        inset 0 0.3rem 0.5rem rgba(255, 182, 193, 0.6),
        inset 0 -0.1rem 0.3rem rgba(0, 0, 0, 0.4),
        inset 0 -0.4rem 0.9rem rgba(255, 105, 180, 0.8),
        0 12px 20px rgba(255, 105, 180, 0.4),
        0 4px 8px rgba(255, 105, 180, 0.1) !important;
    }
    
    .pearl-button:hover .wrap::before {
      transform: translateY(-5%);
    }
    
    .pearl-button:hover .wrap::after {
      opacity: 0.4;
      transform: translateY(5%);
    }
    
    .pearl-button:hover .wrap p {
      transform: translateY(-4%);
    }
    
    .pearl-button:active {
      transform: translateY(4px);
      box-shadow:
        inset 0 0.3rem 0.5rem rgba(255, 182, 193, 0.6),
        inset 0 -0.1rem 0.3rem rgba(0, 0, 0, 0.5),
        inset 0 -0.4rem 0.9rem rgba(255, 105, 180, 0.8),
        0 6px 10px rgba(255, 105, 180, 0.2) !important;
    }

    /* Dark Mode styling */
    @media (prefers-color-scheme: dark) {
      .pearl-button {
        background-color: var(--bg-dark) !important;
      }
      .pearl-button .wrap {
        color: #ffffff !important;
      }
    }

    .dark .pearl-button, [data-theme="dark"] .pearl-button {
      background-color: var(--bg-dark) !important;
    }

    .dark .pearl-button .wrap, [data-theme="dark"] .pearl-button .wrap {
      color: #ffffff !important;
    }
  `;

  return (
    <>
      <style>{beforeAfterStyles}</style>
      <button
        className={`pearl-button ${className}`}
        style={buttonStyle as React.CSSProperties}
        onClick={onClick}
        {...props}
      >
        <div className="wrap" style={wrapStyle}>
          <p style={pStyle}>
            <span>✧</span>
            <span>✦</span>
            {children}
          </p>
        </div>
      </button>
    </>
  );
};

// Demo component showing the button in action
export const StardustButtonDemo = () => {
  return (
    <div className="min-h-screen bg-slate-200 dark:bg-stone-900 w-full flex items-center justify-center font-sans">
      <StardustButton onClick={() => alert('Coming soon!')}>
        Launching Soon
      </StardustButton>
    </div>
  );
};
