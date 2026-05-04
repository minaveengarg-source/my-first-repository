import { useState } from 'react';

export default function CounterApp() {
  const [count, setCount] = useState(0);

  // Increment by 1
  const increment = () => {
    setCount(count + 1);
  };

  // Decrement by 1 (prevents negative values)
  const decrement = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  // Reset to 0
  const reset = () => {
    setCount(0);
  };

  // Step increment by 5
  const incrementByFive = () => {
    setCount(count + 5);
  };

  // Step decrement by 5 (prevents negative values)
  const decrementByFive = () => {
    if (count >= 5) {
      setCount(count - 5);
    } else {
      setCount(0);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Counter Application</h1>
        <p style={styles.subtitle}>React.js Internship - Day 1</p>
        
        <div style={styles.displayBox}>
          <span style={styles.countText}>{count}</span>
        </div>

        <div style={styles.buttonGroup}>
          <h3 style={styles.sectionTitle}>Basic Controls</h3>
          <div style={styles.buttonRow}>
            <button style={styles.buttonDecrement} onClick={decrement}>
              - Decrement
            </button>
            <button style={styles.buttonReset} onClick={reset}>
              🔄 Reset
            </button>
            <button style={styles.buttonIncrement} onClick={increment}>
              + Increment
            </button>
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <h3 style={styles.sectionTitle}>Step Controls (±5)</h3>
          <div style={styles.buttonRow}>
            <button style={styles.buttonStepDown} onClick={decrementByFive}>
              -5
            </button>
            <button style={styles.buttonStepUp} onClick={incrementByFive}>
              +5
            </button>
          </div>
        </div>

        <div style={styles.infoBox}>
          <p style={styles.infoText}>
            ✅ Prevents negative values<br />
            ✅ Step increment/decrement by 5
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f4f8',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '40px',
    maxWidth: '500px',
    width: '100%',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: '8px',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '14px',
    color: '#718096',
    textAlign: 'center',
    marginBottom: '30px',
  },
  displayBox: {
    backgroundColor: '#edf2f7',
    borderRadius: '8px',
    padding: '40px',
    marginBottom: '30px',
    textAlign: 'center',
  },
  countText: {
    fontSize: '72px',
    fontWeight: 'bold',
    color: '#2d3748',
  },
  buttonGroup: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '16px',
    color: '#4a5568',
    marginBottom: '12px',
    fontWeight: '600',
  },
  buttonRow: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
  },
  buttonIncrement: {
    backgroundColor: '#48bb78',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonDecrement: {
    backgroundColor: '#f56565',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonReset: {
    backgroundColor: '#4299e1',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonStepUp: {
    backgroundColor: '#38a169',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '12px 32px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonStepDown: {
    backgroundColor: '#e53e3e',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '12px 32px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  infoBox: {
    backgroundColor: '#f7fafc',
    border: '2px solid #e2e8f0',
    borderRadius: '6px',
    padding: '16px',
    marginTop: '20px',
  },
  infoText: {
    fontSize: '14px',
    color: '#4a5568',
    margin: 0,
    lineHeight: '1.6',
  },
};
