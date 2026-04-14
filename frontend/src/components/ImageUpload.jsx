import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Button,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';

const ImageUpload = ({ onUpload, loading }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
          Upload Brain Scan Image
        </Typography>

        {!preview ? (
          <Box
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{
              border: isDragging ? '3px dashed' : '2px dashed',
              borderColor: isDragging ? 'primary.main' : 'divider',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              backgroundColor: isDragging ? 'action.hover' : 'background.paper',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'action.hover',
              },
            }}
          >
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="raised-button-file"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="raised-button-file">
              <Box sx={{ cursor: 'pointer' }}>
                <CloudUploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                <Typography variant="body1" gutterBottom>
                  Drag and drop an image here, or click to select
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Supported formats: PNG, JPG, JPEG, GIF, BMP
                </Typography>
              </Box>
            </label>
          </Box>
        ) : (
          <Box>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                maxWidth: 400,
                margin: '0 auto',
                mb: 2,
              }}
            >
              <img
                src={preview}
                alt="Preview"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 12,
                  boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <ImageIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
              {selectedFile.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                disabled={loading}
                fullWidth
                startIcon={loading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
              >
                {loading ? 'Analyzing...' : 'Analyze Image'}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleReset}
                disabled={loading}
              >
                Reset
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUpload;
