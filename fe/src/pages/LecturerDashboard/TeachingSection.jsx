import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  useTheme,
  Stack,
  Divider,
  alpha,
} from '@mui/material';
import {
  School as SchoolIcon,
  Code as CodeIcon,
  CreditScore as CreditIcon,
  CalendarMonth as SemesterIcon,
} from '@mui/icons-material';

const TeachingSection = ({ data = [], semester, showTotal = true }) => {
  const theme = useTheme();

  return (
    <Paper elevation={0} sx={{
      p: 3,
      borderRadius: 3,
      bgcolor: 'background.paper',
    }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <SchoolIcon color="primary" sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="h6" fontWeight="bold">
            Học phần đang dạy
          </Typography>
        </Box>
      </Stack>

      {data.length === 0 ? (
        <Box sx={{
          p: 4,
          textAlign: 'center',
          border: `1px dashed ${theme.palette.divider}`,
          borderRadius: 2,
        }}>
          <Typography variant="body1" color="text.secondary">
            Không có học phần trong học kỳ này
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            mb: 2,
          }}>
            <Table aria-label="Danh sách học phần">
              <TableHead>
                <TableRow sx={{
                  bgcolor: theme.palette.grey[100],
                  '& th': { fontWeight: 'bold' },
                }}>
                  <TableCell sx={{ width: '100%' }}>Học phần</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((course, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      '&:last-child td': { borderBottom: 0 },
                    }}
                  >
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight={500}>
                        {course.subject_name || course.courseName}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                        <CodeIcon sx={{
                          fontSize: 16,
                          color: theme.palette.text.secondary,
                        }} />
                        <Typography variant="caption" color="text.secondary">
                          {course.subject_id || course.courseCode}
                        </Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Paper>
  );
};

export default TeachingSection;