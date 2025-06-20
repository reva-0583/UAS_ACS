import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={styles.body}>
      <h1 style={styles.heading}>ToDo List App</h1>
      <div style={styles.buttonGroup}>
        <Button
          variant="contained"
          color="primary"
          sx={styles.button}
          onClick={() => navigate('/login')}
        >
          Login
        </Button>
        <Button
          variant="outlined"
          color="primary"
          sx={styles.button}
          onClick={() => navigate('/register')}
        >
          Register
        </Button>
      </div>
    </div>
  )
}

const styles = {
  body: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    height: '97vh',
    background: 'transparent',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: '#333',
  },
  heading: {
    fontSize: '64px',
    marginBottom: '40px',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    height: '50px',
    width: '130px',
    fontSize: '18px',
    fontWeight: 'bold',
    borderRadius: '8px',
    textTransform: 'none',
  },
}
