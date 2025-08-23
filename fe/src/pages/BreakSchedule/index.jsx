import React, { useState, useEffect } from "react";
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
  useTheme, // Import useTheme for consistency
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
} from "@mui/icons-material"; // Only need Add and Search as others are for table
import BreakScheduleDetailModal from "./BreakScheduleDetailModal";
import AddBreakScheduleModal from "./AddBreakScheduleModal";
import EditBreakScheduleModal from "./EditBreakScheduleModal";
import DeleteBreakScheduleModal from "./DeleteBreakScheduleModal";
import useResponsive from "../../hooks/useResponsive";
import BreakScheduleTable from "./BreakScheduleTable";
import { toast } from "react-toastify";
import {
  getBreakSchedulesAPI,
  getBreakScheduleByIdAPI,
  addBreakScheduleAPI,
  updateBreakScheduleAPI,
  deleteBreakScheduleAPI,
} from "../../api/breakScheduleAPI";
import TablePaginationLayout from '../../components/layout/TablePaginationLayout';


// Hàm định dạng timestamp thành YYYY-MM-DD HH:MM:SS.sss+07
const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const milliseconds = String(date.getMilliseconds()).padStart(3, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}+07`;
};

const BreakSchedule = () => {
  const { isSmallScreen, isMediumScreen } = useResponsive();
  const theme = useTheme(); // Use theme for consistency with Subject component

  const [breakSchedules, setBreakSchedules] = useState([]);
  const [loading, setLoading] = useState(false); // Default to false
  const [error, setError] = useState(''); // Default to empty string
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedBreakSchedule, setSelectedBreakSchedule] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false); // Renamed for consistency
  const [openEditModal, setOpenEditModal] = useState(false); // Renamed for consistency
  const [openDeleteModal, setOpenDeleteModal] = useState(false); // Renamed for consistency

  const years = ["2021", "2022", "2023", "2024", "2025"]; // Example years

  // Function to fetch break schedules from API
  const fetchBreakSchedules = async () => {
    try {
      setError(''); // Clear previous errors
      setLoading(true);
      const response = await getBreakSchedulesAPI();
      if (response && response.data) {
        // Assuming response.data is an array or has a 'data' property that is an array
        setBreakSchedules(response.data || response.data);
      } else {
        setError('Không có dữ liệu lịch nghỉ');
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách lịch nghỉ:", err);
      setError('Không thể tải danh sách lịch nghỉ. Vui lòng thử lại sau.');
      toast.error('Không thể tải danh sách lịch nghỉ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBreakSchedules();
  }, []);

  // Handler for adding a new break schedule
  const handleAddBreakSchedule = () => {
    setOpenAddModal(true);
  };

  // Handler for closing the Add Break Schedule modal
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  // Handler for confirming and adding a new break schedule via API
  const handleAddNewBreakSchedule = async (newSchedule) => {
    try {
      setLoading(true);
      const response = await addBreakScheduleAPI(newSchedule);
      if (response && response.data) {
        toast.success('Lịch nghỉ đã được thêm thành công!');
        fetchBreakSchedules(); // Reload the list
      }
    } catch (err) {
      console.error("Lỗi khi thêm lịch nghỉ:", err);
      setError("Không thể thêm lịch nghỉ. Vui lòng kiểm tra lại thông tin.");
      toast.error("Không thể thêm lịch nghỉ. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
      handleCloseAddModal(); // Close modal after attempt
    }
  };

  // Handler for viewing a break schedule
  const handleViewBreakSchedule = async (id) => {
    try {
      setLoading(true);
      const response = await getBreakScheduleByIdAPI(id);
      if (response && response.data) {
        setSelectedBreakSchedule(response.data || response.data);
        setOpenDetail(true);
      }
    } catch (err) {
      console.error("Lỗi khi lấy thông tin chi tiết lịch nghỉ:", err);
      setError("Không thể lấy thông tin chi tiết lịch nghỉ. Vui lòng thử lại.");
      toast.error("Không thể lấy thông tin chi tiết lịch nghỉ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Handler for closing the Detail modal
  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedBreakSchedule(null);
  };

  // Handler for opening the Edit modal
  const handleEditBreakSchedule = async (id) => {
    try {
      setLoading(true);
      const response = await getBreakScheduleByIdAPI(id);
      if (response && response.data) {
        setSelectedBreakSchedule(response.data || response.data);
        setOpenEditModal(true);
      }
    } catch (err) {
      console.error("Lỗi khi lấy thông tin lịch nghỉ để chỉnh sửa:", err);
      setError("Không thể lấy thông tin lịch nghỉ để chỉnh sửa. Vui lòng thử lại.");
      toast.error("Không thể lấy thông tin lịch nghỉ để chỉnh sửa. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Handler for closing the Edit modal
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedBreakSchedule(null);
  };

  // Handler for saving edited break schedule
  const handleSaveEditedBreakSchedule = async (updatedSchedule) => {
    try {
      setLoading(true);
      const response = await updateBreakScheduleAPI(updatedSchedule.break_id, updatedSchedule);
      if (response && response.data) {
        toast.success('Lịch nghỉ đã được cập nhật thành công!');
        fetchBreakSchedules(); // Reload the list
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật lịch nghỉ:", err);
      setError("Không thể cập nhật lịch nghỉ. Vui lòng kiểm tra lại thông tin.");
      toast.error("Không thể cập nhật lịch nghỉ. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
      handleCloseEditModal(); // Close modal after attempt
    }
  };

  // Handler for opening the Delete confirmation modal
  const handleDeleteBreakSchedule = (id) => {
    const schedule = breakSchedules.find((s) => s.break_id === id);
    setSelectedBreakSchedule(schedule);
    setOpenDeleteModal(true);
  };

  // Handler for closing the Delete modal
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedBreakSchedule(null);
  };

  // Handler for confirming and deleting a break schedule
  const confirmDeleteBreakSchedule = async (id) => {
    try {
      setLoading(true);
      const response = await deleteBreakScheduleAPI(id);
      if (response) {
        toast.success('Lịch nghỉ đã được xóa thành công!');
        fetchBreakSchedules(); // Reload the list
      }
    } catch (err) {
      console.error("Lỗi khi xóa lịch nghỉ:", err);
      setError("Không thể xóa lịch nghỉ. Vui lòng thử lại.");
      toast.error("Không thể xóa lịch nghỉ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
      handleCloseDeleteModal(); // Close modal after attempt
    }
  };

  // Handler for page change in pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Filter break schedules based on search term and selected year
  const filteredBreakSchedules = breakSchedules.filter((schedule) => {
    const matchesSearchTerm =
      schedule.break_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.break_type?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesYear = selectedYear
      ? new Date(schedule.break_start_date).getFullYear().toString() === selectedYear
      : true;

    return matchesSearchTerm && matchesYear;
  });

  // Calculate displayed break schedules for current page
  const displayedBreakSchedules = filteredBreakSchedules.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 1, zIndex: 10, height: "calc(100vh - 64px)", overflowY: "auto" }}>
      {/* Main Content */}
      <Box sx={{ width: "100%", mb: 3 }}>
        {/* Break Schedule List Card */}
        <Card sx={{ flexGrow: 1 }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: isSmallScreen ? "column" : "row",
                justifyContent: "space-between",
                alignItems: isSmallScreen ? "stretch" : "center",
                mb: 3,
                gap: 2,
              }}
            >
              <Typography variant="h5" fontWeight="600">
                Danh sách lịch nghỉ
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: isSmallScreen ? "column" : "row",
                  width: isSmallScreen ? "100%" : "auto",
                }}
              >
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
                    backgroundColor: theme.palette.background.paper, // Consistent theme usage
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
                  onClick={handleAddBreakSchedule}
                  sx={{ ml: isSmallScreen ? 0 : "auto" }}
                >
                  Thêm lịch nghỉ
                </Button>
              </Box>
            </Box>
            {loading ? (
              <Typography>Đang tải dữ liệu...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : filteredBreakSchedules.length === 0 ? (
              <Typography>Không có lịch nghỉ nào để hiển thị.</Typography>
            ) : (
              <>
                <BreakScheduleTable
                  displayedBreakSchedules={displayedBreakSchedules}
                  isSmallScreen={isSmallScreen}
                  isMediumScreen={isMediumScreen}
                  handleViewBreakSchedule={handleViewBreakSchedule}
                  handleEditBreakSchedule={handleEditBreakSchedule}
                  handleDeleteBreakSchedule={handleDeleteBreakSchedule}
                  formatTimestamp={formatTimestamp} // Pass formatTimestamp to table
                />
                <TablePaginationLayout
                  count={filteredBreakSchedules.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                />

              </>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Modals */}
      <BreakScheduleDetailModal
        open={openDetail}
        onClose={handleCloseDetail}
        breakSchedule={selectedBreakSchedule}
      />
      <AddBreakScheduleModal
        open={openAddModal}
        onClose={handleCloseAddModal}
        onAddBreakSchedule={handleAddNewBreakSchedule}
        existingBreakSchedules={breakSchedules}
        error={error} // Pass error and loading for consistent feedback in modals
        loading={loading}
      />
      <EditBreakScheduleModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        breakSchedule={selectedBreakSchedule}
        onSave={handleSaveEditedBreakSchedule}
        error={error}
        loading={loading}
      />
      <DeleteBreakScheduleModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        onDelete={confirmDeleteBreakSchedule}
        breakSchedule={selectedBreakSchedule}
      />
    </Box>
  );
};

export default BreakSchedule;