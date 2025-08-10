import React, { useState } from 'react';
import { Button, Typography, Box, Alert, Paper } from '@mui/material';
import api from '../services/api';

const ApiTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testApiConnection = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      const response = await api.get('/test/public');
      setTestResult({
        success: true,
        message: 'API connection successful!',
        data: response.data
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: error.message,
        error: error
      });
    } finally {
      setLoading(false);
    }
  };

  const testCors = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      const response = await api.get('/test/cors-test');
      setTestResult({
        success: true,
        message: 'CORS test successful!',
        data: response.data
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: error.message,
        error: error
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        API Connection Test
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Test API Endpoints
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button 
            variant="contained" 
            onClick={testApiConnection}
            disabled={loading}
          >
            {loading ? 'Testing...' : 'Test Public Endpoint'}
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={testCors}
            disabled={loading}
          >
            {loading ? 'Testing...' : 'Test CORS'}
          </Button>
        </Box>

        {testResult && (
          <Alert 
            severity={testResult.success ? 'success' : 'error'}
            sx={{ mb: 2 }}
          >
            <Typography variant="body1" gutterBottom>
              {testResult.message}
            </Typography>
            
            {testResult.data && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" component="pre" sx={{ 
                  backgroundColor: 'grey.100', 
                  p: 1, 
                  borderRadius: 1,
                  fontSize: '0.875rem'
                }}>
                  {JSON.stringify(testResult.data, null, 2)}
                </Typography>
              </Box>
            )}
          </Alert>
        )}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Troubleshooting
        </Typography>
        
        <Typography variant="body2" paragraph>
          If you're getting network errors:
        </Typography>
        
        <Box component="ul" sx={{ pl: 3 }}>
          <Typography component="li" variant="body2">
            Make sure the API server is running: <code>dotnet run --launch-profile http</code>
          </Typography>
          <Typography component="li" variant="body2">
            Check that the API is running on: <code>https://localhost:7146/</code>
          </Typography>
          <Typography component="li" variant="body2">
            Verify the React app is running on: <code>http://localhost:5173</code>
          </Typography>
          <Typography component="li" variant="body2">
            Check the browser console for CORS errors
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ApiTest; 