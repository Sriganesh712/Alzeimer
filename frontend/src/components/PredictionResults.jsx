import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import { getSeverityColor } from '../theme';

const PredictionResults = ({ results }) => {
  if (!results) return null;

  const getIcon = (label) => {
    switch (label) {
      case 'NonDemented':
        return <CheckCircleIcon sx={{ color: 'success.main' }} />;
      case 'VeryMildDemented':
        return <InfoIcon sx={{ color: 'info.main' }} />;
      case 'MildDemented':
        return <InfoIcon sx={{ color: 'warning.light' }} />;
      case 'ModerateDemented':
        return <WarningIcon sx={{ color: 'warning.main' }} />;
      default:
        return <ErrorIcon sx={{ color: 'error.main' }} />;
    }
  };

  const formatLabel = (label) => {
    return label.replace(/([A-Z])/g, ' $1').trim();
  };

  const ModelCard = ({ title, data, isEnsemble = false }) => {
    if (data.error) {
      return (
        <Card elevation={isEnsemble ? 3 : 1} sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {title}
            </Typography>
            <Typography color="error">{data.error}</Typography>
          </CardContent>
        </Card>
      );
    }

    const color = getSeverityColor(data.label);

    return (
      <Card
        elevation={isEnsemble ? 4 : 2}
        sx={{
          height: '100%',
          border: isEnsemble ? 3 : 0,
          borderColor: isEnsemble ? 'primary.main' : 'transparent',
          position: 'relative',
          overflow: 'visible',
        }}
      >
        {isEnsemble && (
          <Chip
            label="Ensemble Prediction"
            color="primary"
            size="small"
            sx={{
              position: 'absolute',
              top: -12,
              left: '50%',
              transform: 'translateX(-50%)',
              fontWeight: 600,
            }}
          />
        )}
        <CardContent>
          <Typography
            variant={isEnsemble ? 'h5' : 'h6'}
            gutterBottom
            sx={{ fontWeight: isEnsemble ? 600 : 500, mt: isEnsemble ? 1 : 0 }}
          >
            {title}
          </Typography>

          <Box sx={{ my: 3, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              {getIcon(data.label)}
              <Typography
                variant={isEnsemble ? 'h4' : 'h5'}
                sx={{
                  ml: 1,
                  fontWeight: 600,
                  color: color,
                }}
              >
                {formatLabel(data.label)}
              </Typography>
            </Box>

            {data.probabilities ? (
              <Box sx={{ mt: 3, textAlign: 'left' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Class Confidence Breakdown
                </Typography>
                {Object.entries(data.probabilities).map(([cls, prob]) => {
                  const probColor = getSeverityColor(cls);
                  return (
                    <Box key={cls} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">{formatLabel(cls)}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {(prob * 100).toFixed(2)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={prob * 100}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'action.hover',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: probColor,
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>
                  );
                })}
              </Box>
            ) : (
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Confidence Level
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={data.confidence * 100}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: 'action.hover',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: color,
                      borderRadius: 5,
                    },
                  }}
                />
                <Typography
                  variant={isEnsemble ? 'h5' : 'h6'}
                  sx={{ mt: 1, fontWeight: 600, color: color }}
                >
                  {(data.confidence * 100).toFixed(2)}%
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Analysis Results
      </Typography>

      {/* Ensemble Result - Featured */}
      <Box sx={{ mb: 4 }}>
        <ModelCard title="Final Diagnosis" data={results.ensemble} isEnsemble={true} />
      </Box>

      <Divider sx={{ my: 4 }} />
      <Box sx={{ mt: 3, p: 2, backgroundColor: 'action.hover', borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Note:</strong> This analysis is for research and educational purposes only. 
          Please consult with qualified healthcare professionals for medical diagnosis and treatment.
        </Typography>
      </Box>
    </Box>
  );
};

export default PredictionResults;
