import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  Button,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import BreakScheduleDetailModal from './BreakScheduleDetailModal';
import AddBreakScheduleModal from './AddBreakScheduleModal';
import EditBreakScheduleModal from './EditBreakScheduleModal';
import DeleteBreakScheduleModal from './DeleteBreakScheduleModal';
import useResponsive from '../../hooks/useResponsive';
import BreakScheduleTable from './BreakScheduleTable';
import { getBreakSchedules, getBreakScheduleById, addBreakSchedule, updateBreakSchedule, deleteBreakSchedule, listBreakSchedules } from '../../api/breakScheduleAPI';

// Hàm định dạng timestamp thành YYYY-MM-DD HH:MM:SS.sss+07
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}+07`;
};

const BreakSchedule = () => {
  const { isSmallScreen, isMediumScreen } = useResponsive();
  const theme = useTheme();
  const [breakSchedules, setBreakSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [openDetail, setOpenDetail] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedBreakSchedule, setSelectedBreakSchedule] = useState(null);

  const years = ['2021', '2022', '2023', '2024', '2025'];

  const fetchBreakSchedules = async () => {
    try {
      setLoading(true);
      const response = await getBreakSchedules();
      console.log('Phản hồi từ API (danh sách lịch nghỉ):', response);

      let breakSchedulesData = [];
      if (Array.isArray(response)) {
        breakSchedulesData = response.map((schedule, index) => ({
          stt: index + 1,
          break_id: schedule.break_id,
          break_type: schedule.break_type,
          break_start_date: schedule.break_start_date,
          break_end_date: schedule.break_end_date,
          created_at: formatTimestamp(schedule.created_at),
          updated_at: formatTimestamp(schedule.updated_at),
        }));
      } else if (response && typeof response === 'object' && Array.isArray(response.data)) {
        breakSchedulesData = response.data.map((schedule, index) => ({
          stt: index + 1,
          break_id: schedule.break_id,
          break_type: schedule.break_type,
          break_start_date: schedule.break_start_date,
          break_end_date: schedule.break_end_date,
          created_at: formatTimestamp(schedule.created_at),
          updated_at: formatTimestamp(schedule.updated_at),
        }));
      } else {
        throw new Error('Dữ liệu từ API không phải là mảng hợp lệ');
      }

      setBreakSchedules(breakSchedulesData);
      setLoading(false);
    } catch (err) {
      console.error('Lỗi chi tiết (danh sách lịch nghỉ):', err.message);
      setError(`Lỗi khi tải danh sách lịch nghỉ: ${err.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBreakSchedules();
  }, []);

  const handleViewBreakSchedule = async (break_id) => {
    try {
      setLoading(true);
      const response = await getBreakScheduleById(break_id);
      console.log('Phản hồi từ API (chi tiết lịch nghỉ):', response);

      let scheduleData = {};
      if (response && typeof response === 'object') {
        if (Array.isArray(response.data)) {
          scheduleData = response.data[0] || {};
        } else if (response.data) {
          scheduleData = response.data;
        } else {
          scheduleData = response;
        }
      } else {
        throw new Error('Dữ liệu từ API không phải là object hợp lệ');
      }

      setSelectedBreakSchedule({
        break_id: scheduleData.break_id,
        break_type: scheduleData.break_type,
        break_start_date: scheduleData.break_start_date,
        break_end_date: scheduleData.break_end_date,
        description: scheduleData.description || 'Không có dữ liệu',
        number_of_days: scheduleData.number_of_days,
        status: scheduleData.status || 'Không có dữ liệu',
        created_at: formatTimestamp(scheduleData.created_at),
        updated_at: formatTimestamp(scheduleData.updated_at),
      });
      setOpenDetail(true);
    } catch (err) {
      console.error('Lỗi khi lấy chi tiết:', err.message);
      setError(`Lỗi khi lấy chi tiết lịch nghỉ: ${err.message}`);
      setOpenDetail(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBreakSchedule = async (scheduleData) => {
    try {
      setLoading(true);
      console.log('Gửi dữ liệu thêm lịch nghỉ:', scheduleData);
      const response = await addBreakSchedule({
        break_id: scheduleData.break_id,
        break_type: scheduleData.break_type,
        break_start_date: scheduleData.break_start_date,
        break_end_date: scheduleData.break_end_date,
        description: scheduleData.description || '',
        number_of_days: scheduleData.number_of_days,
        status: scheduleData.status || 'inactive',
      });
      console.log('Phản hồi từ API (thêm):', response);

      const newSchedule = response.data || response;
      setBreakSchedules((prev) => [
        ...prev,
        {
          stt: prev.length + 1,
          break_id: newSchedule.break_id,
          break_type: newSchedule.break_type,
          break_start_date: newSchedule.break_start_date,
          break_end_date: newSchedule.break_end_date,
          created_at: formatTimestamp(newSchedule.created_at),
          updated_at: formatTimestamp(newSchedule.updated_at),
        },
      ]);
    } catch (err) {
      console.error('Lỗi khi thêm lịch nghỉ:', err.message, err.response?.data);
      setError(`Lỗi khi thêm lịch nghỉ: ${err.message} - ${err.response?.data?.message || 'Kiểm tra định dạng dữ liệu'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditBreakSchedule = (schedule) => {
    setSelectedBreakSchedule(schedule);
    setOpenEdit(true);
  };

  const handleSaveEditedBreakSchedule = async (scheduleData) => {
    try {
      setLoading(true);
      console.log('Gửi dữ liệu chỉnh sửa lịch nghỉ:', scheduleData);
      const response = await updateBreakSchedule(scheduleData.break_id, {
        break_id: scheduleData.break_id,
        break_type: scheduleData.break_type,
        break_start_date: scheduleData.break_start_date,
        break_end_date: scheduleData.break_end_date,
        description: scheduleData.description,
        number_of_days: scheduleData.number_of_days,
        status: scheduleData.status,
        updated_at: new Date().toISOString(),
      });
      console.log('Phản hồi từ API (chỉnh sửa):', response);

      await fetchBreakSchedules();
    } catch (err) {
      console.error('Lỗi khi chỉnh sửa lịch nghỉ:', err.message);
      setError(`Lỗi khi chỉnh sửa lịch nghỉ: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteModal = (schedule) => {
    if (!schedule || !schedule.break_id) {
      console.error('Invalid schedule data in handleOpenDeleteModal:', schedule);
      setError('Dữ liệu lịch nghỉ không hợp lệ');
      return;
    }
    setSelectedBreakSchedule(schedule);
    setOpenDelete(true);
  };

  const handleDeleteBreakSchedule = async (break_id) => {
    try {
      setLoading(true);
      if (!break_id) {
        console.error('Invalid breakId for deletion:', break_id);
        setError('Dữ liệu lịch nghỉ không hợp lệ');
        return;
      }
      console.log('Attempting to delete break schedule with break_id:', break_id);
      const response = await deleteBreakSchedule(break_id);
      console.log('Response from API (delete):', response);

      await fetchBreakSchedules();
    } catch (err) {
      console.error('Lỗi khi xóa lịch nghỉ:', err.message);
      setError(`Lỗi khi xóa lịch nghỉ: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const filteredBreakSchedules = breakSchedules.filter((schedule) => {
    const matchesSearchTerm =
      schedule.break_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.break_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = selectedYear
      ? schedule.break_start_date?.startsWith(selectedYear)
      : true;
    return matchesSearchTerm && matchesYear;
  });

  const displayedBreakSchedules = filteredBreakSchedules.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: 1, zIndex: 10, height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
      <Box sx={{ width: '100%', mb: 3 }}>
        <Card sx={{ flexGrow: 1 }}>
          <CardContent>
            <Box sx={{
              display: 'flex',
              flexDirection: isSmallScreen ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: isSmallScreen ? 'stretch' : 'center',
              mb: 3,
              gap: 2
            }}>
              <Typography variant="h5" fontWeight="600">
                Danh sách lịch nghỉ
              </Typography>

              <Box sx={{
                display: 'flex',
                gap: 2,
                flexDirection: isSmallScreen ? 'column' : 'row',
                width: isSmallScreen ? '100%' : 'auto'
              }}>
                <TextField
                  size="small"
                  placeholder="Tìm kiếm theo mã hoặc loại lịch nghỉ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    minWidth: 200,
                    backgroundColor: theme.palette.background.paper
                  }}
                />

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Năm</InputLabel>
                  <Select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    label="Năm"
                  >
                    <MenuItem value="">Tất cả</MenuItem>
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenAdd(true)}
                  sx={{ ml: isSmallScreen ? 0 : 'auto' }}
                >
                  Thêm lịch nghỉ
                </Button>
              </Box>
            </Box>
            {loading && <Typography>Loading...</Typography>}
            {error && <Typography color="error">{error}</Typography>}
            {filteredBreakSchedules.length === 0 && !loading && !error && (
              <Typography>Không có lịch nghỉ nào để hiển thị.</Typography>
            )}
            {!loading && !error && filteredBreakSchedules.length > 0 && (
              <>
                <BreakScheduleTable
                  displayedBreakSchedules={displayedBreakSchedules}
                  isSmallScreen={isSmallScreen}
                  isMediumScreen={isMediumScreen}
                  handleViewBreakSchedule={handleViewBreakSchedule}
                  handleEditBreakSchedule={handleEditBreakSchedule}
                  handleDeleteBreakSchedule={handleOpenDeleteModal}
                />
                <TablePagination
                  component="div"
                  count={filteredBreakSchedules.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[]}
                  labelDisplayedRows={({ from, to, count }) => `${from}-${to} trên ${count}`}
                />
              </>
            )}
          </CardContent>
        </Card>
      </Box>
      <BreakScheduleDetailModal
        open={openDetail}
        onClose={() => {
          setOpenDetail(false);
          setSelectedBreakSchedule(null);
        }}
        breakSchedule={selectedBreakSchedule}
      />
      <AddBreakScheduleModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onAddBreakSchedule={handleAddBreakSchedule}
        existingBreakSchedules={breakSchedules}
      />
      <EditBreakScheduleModal
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setSelectedBreakSchedule(null);
        }}
        breakSchedule={selectedBreakSchedule}
        onSave={handleSaveEditedBreakSchedule}
      />
      <DeleteBreakScheduleModal
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
          setSelectedBreakSchedule(null);
        }}
        onDelete={handleDeleteBreakSchedule}
        breakSchedule={selectedBreakSchedule}
      />
    </Box>
  );
};

export default BreakSchedule;