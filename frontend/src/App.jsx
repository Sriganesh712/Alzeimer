import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container, Box, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import theme from './theme';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import PredictionResults from './components/PredictionResults';

const API_URL = 'http://127.0.0.1:5000';

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleUpload = async (file) => {
    setLoading(true);
    setError(null);
    setResults(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResults(response.data);
      setSuccess(true);
    } catch (err) {
      console.error('Error uploading file:', err);
      
      if (err.response) {
        // Server responded with error
        setError(err.response.data.error || 'Failed to analyze image');
      } else if (err.request) {
        // Request made but no response
        setError('Cannot connect to server. Please ensure the backend is running at ' + API_URL);
      } else {
        // Other errors
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleCloseSuccess = () => {
    setSuccess(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Header />
        
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box
            sx={{
              textAlign: 'center',
              mb: 4,
            }}
          >
            <Box
              component="p"
              sx={{
                fontSize: '1.1rem',
                color: 'text.secondary',
                maxWidth: 700,
                margin: '0 auto',
                lineHeight: 1.6,
              }}
            >
              Upload a brain scan image to detect and classify Alzheimer's disease stages 
              using advanced deep learning models. Our ensemble approach combines CNN, ResNet, 
              and Inception models for accurate predictions.
            </Box>
          </Box>

          <Box sx={{ maxWidth: 800, margin: '0 auto' }}>
            <ImageUpload onUpload={handleUpload} loading={loading} />
            <PredictionResults results={results} />
          </Box>
        </Container>

        {/* Error Snackbar */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseError}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseError} severity="error" variant="filled">
            {error}
          </Alert>
        </Snackbar>

        {/* Success Snackbar */}
        <Snackbar
          open={success}
          autoHideDuration={3000}
          onClose={handleCloseSuccess}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSuccess} severity="success" variant="filled">
            Analysis completed successfully!
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;
