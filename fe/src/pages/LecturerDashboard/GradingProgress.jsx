import { CircularProgress, Box, Typography, Paper } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';


const GradingProgress = () => {
  const theme = useTheme();
  const gradingData = [
    { course: 'Lập trình Web', total: 45, graded: 32 },
    { course: 'Cơ sở dữ liệu', total: 60, graded: 15 }
  ];

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" gutterBottom>
        Tiến độ chấm bài
      </Typography>
      
      {gradingData.map((item, index) => (
        <Box key={index} sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>{item.course}</Typography>
            <Typography>{item.graded}/{item.total}</Typography>
          </Box>
          <CircularProgress
            variant="determinate"
            value={(item.graded / item.total) * 100}
            size={60}
            thickness={5}
            sx={{ 
              color: theme.palette.primary.main,
              display: 'block',
              mx: 'auto'
            }}
          />
        </Box>
      ))}
    </Paper>
  );
};

export default GradingProgress; // Thêm dòng này nếu chưa có