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

const TeachingSection = ({ data = [], semester = '2024-2025 HK3', showTotal = true }) => {
  const theme = useTheme();

  const sampleCourses = [
    {
      courseCode: "CT101",
      courseName: "Lập trình cơ bản",
      credits: 3,
      semester: "2024-2025 HK3",
    },
    {
      courseCode: "CT201",
      courseName: "Cơ sở dữ liệu",
      credits: 3,
      semester: "2024-2025 HK3",
    },
  ];

  const filteredCourses = data.length > 0 ? data.filter((course) => course.semester === semester) : sampleCourses;
  const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);

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
            Khóa học đang dạy
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <SemesterIcon color="action" fontSize="small" />
            <Typography variant="subtitle1" color="text.secondary" sx={{ pt: 0.3 }}>
              {semester || 'Chưa chọn học kỳ'}
            </Typography>
          </Stack>
        </Box>
      </Stack>

      {filteredCourses.length === 0 ? (
        <Box sx={{
          p: 4,
          textAlign: 'center',
          border: `1px dashed ${theme.palette.divider}`,
          borderRadius: 2,
        }}>
          <Typography variant="body1" color="text.secondary">
            Không có khóa học trong học kỳ này
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            mb: 2,
          }}>
            <Table aria-label="Danh sách khóa học">
              <TableHead>
                <TableRow sx={{
                  bgcolor: theme.palette.grey[100],
                  '& th': { fontWeight: 'bold' },
                }}>
                  <TableCell sx={{ width: '60%' }}>Khóa học</TableCell>
                  <TableCell align="right" sx={{ width: '40%' }}>Tín chỉ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCourses.map((course, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      '&:last-child td': { borderBottom: 0 },
                    }}
                  >
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight={500}>
                        {course.courseName}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                        <CodeIcon sx={{
                          fontSize: 16,
                          color: theme.palette.text.secondary,
                        }} />
                        <Typography variant="caption" color="text.secondary">
                          {course.courseCode}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={course.credits}
                        size="small"
                        sx={{
                          fontWeight: 'bold',
                          bgcolor: theme.palette.mode === 'dark'
                            ? theme.palette.primary.dark
                            : theme.palette.primary.light,
                          color: theme.palette.getContrastText(
                            theme.palette.mode === 'dark'
                              ? theme.palette.primary.dark
                              : theme.palette.primary.light
                          ),
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {showTotal && (
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              <Typography variant="subtitle1" fontWeight={500}>
                Tổng số tín chỉ
              </Typography>
              <Chip
                label={totalCredits}
                color="primary"
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  px: 1.5,
                }}
              />
            </Stack>
          )}
        </>
      )}
    </Paper>
  );
};

export default TeachingSection;