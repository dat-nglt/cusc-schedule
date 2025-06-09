import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  Box,
  Typography,
  useTheme,
  Paper,
  MenuItem,
  FormControl,
  Select,
  Chip,
  Stack,
  alpha
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SchoolIcon from '@mui/icons-material/School';

const SubjectGPAChart = ({ data = [] }) => {
  const theme = useTheme();
  const [selectedSemester, setSelectedSemester] = useState('');

  // Extract unique semesters from data
  const semesters = [...new Set(data.map(item => item.semester))];
  if (semesters.length > 0 && !selectedSemester) {
    setSelectedSemester(semesters[0]);
  }

  // Filter data by selected semester
  const filteredData = data.filter(item => item.semester === selectedSemester);

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper elevation={3} sx={{
          p: 2,
          bgcolor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`
        }}>
          <Typography variant="subtitle2" fontWeight="bold">{label}</Typography>
          <Stack direction="row" spacing={1} mt={1}>
            <Chip
              label={`GPA: ${payload[0].value.toFixed(2)}`}
              size="small"
              color="primary"
            />
            <Chip
              label={`${payload[0].payload.credits} tín chỉ`}
              size="small"
              variant="outlined"
            />
          </Stack>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper elevation={0} sx={{
      p: 3,
      borderRadius: 3,
      bgcolor: 'background.paper',
      height: '100%'
    }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3
      }}>
        <Typography variant="h6" sx={{
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center'
        }}>
          <SchoolIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
          Điểm môn học theo học kỳ
        </Typography>

        {semesters.length > 0 && (
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              sx={{
                borderRadius: 2,
                bgcolor: 'background.paper'
              }}
            >
              {semesters.map((semester) => (
                <MenuItem key={semester} value={semester}>
                  {semester}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      {filteredData.length === 0 ? (
        <Box sx={{
          height: 300,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.secondary'
        }}>
          <Typography>Không có dữ liệu cho học kỳ này</Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ height: 350, mt: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredData}
                layout="vertical"
                margin={{
                  top: 20,
                  right: 20,
                  left: 40,
                  bottom: 20,
                }}
                barSize={24}
              >
                <CartesianGrid
                  horizontal={false}
                  stroke={theme.palette.divider}
                />
                <XAxis
                  type="number"
                  domain={[0, 4]}
                  ticks={[0, 1, 2, 3, 4]}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  dataKey="subjectName"
                  type="category"
                  width={120}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: theme.palette.action.hover }}
                />
                <Bar dataKey="gpa">
                  {filteredData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.gpa >= 3.5
                          ? theme.palette.success.main
                          : entry.gpa >= 2.0
                            ? theme.palette.warning.main
                            : theme.palette.error.main
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>

          <Stack
            direction="row"
            spacing={1}
            justifyContent="flex-end"
            sx={{ mt: 2 }}
          >
            <Chip
              icon={<TrendingUpIcon fontSize="small" />}
              label="Xuất sắc (≥3.5)"
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.success.main, 0.1),
                color: theme.palette.success.dark
              }}
            />
            <Chip
              label="Trung bình (2.0-3.4)"
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.warning.main, 0.1),
                color: theme.palette.warning.dark
              }}
            />
            <Chip
              label="Yếu (<2.0)"
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.dark
              }}
            />
          </Stack>
        </>
      )}
    </Paper>
  );
};

export default SubjectGPAChart;