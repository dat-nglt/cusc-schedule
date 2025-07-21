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
} from '@mui/icons-material';
import AddLecturerModal from './AddLecturerModal';
import LecturerDetailModal from './LecturerDetailModal';
import EditLecturerModal from './EditLecturerModal';
import DeleteLecturerModal from './DeleteLecturerModal';
import useResponsive from '../../hooks/useResponsive';
import LecturerTable from './LecturerTable';
import { toast } from 'react-toastify';
import { getAllLecturersAPI, getLecturerByIdAPI, createLecturerAPI, updateLecturer, deleteLecturer } from '../../api/lecturerAPI';
const Lecturer = () => {
    const { isSmallScreen, isMediumScreen } = useResponsive();
    const theme = useTheme()

    // Dữ liệu mẫu cho danh sách giảng viên
    const [lecturers, setLecturers] = useState([]);
    // State cho phân trang, tìm kiếm, lọc theo trạng thái và modal
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(8);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedLecturer, setSelectedLecturer] = useState(null);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editedLecturer, setEditedLecturer] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [lecturerToDelete, setLecturerToDelete] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    // Danh sách trạng thái để lọc
    const statuses = ['Đang giảng dạy', 'Tạm nghỉ', 'Đã nghỉ việc', 'Nghỉ hưu'];

    const fetchLecturers = async () => {
        try {
            setLoading(true);
            const response = await getAllLecturersAPI();
            if (!response && !response.data) {
                console.error("Không có dữ liệu giảng viên");
                return;
            }
            setLecturers(response.data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách giảng viên:", error);
        } finally {
            setLoading(false);
            setError('');
        }
    };

    useEffect(() => {
        fetchLecturers();
    }, []);

    // Hàm xử lý khi nhấn nút Thêm giảng viên
    const handleAddLecturer = () => {
        setOpenAddModal(true);
    };

    // Hàm thêm giảng viên mới
    const handleAddNewLecturer = async (newLecturer) => {
        try {
            setLoading(true);
            const response = await createLecturerAPI(newLecturer);
            if (response && response.data) {
                fetchLecturers(); // Tải lại danh sách giảng viên sau khi thêm thành công
                toast.success('Thêm giảng viên thành công!');
            }
        } catch (error) {
            console.error("Lỗi khi thêm giảng viên:", error);
            setError("Không thể thêm giảng viên. Vui lòng kiểm tra lại thông tin.");
            toast.error('Thêm giảng viên thất bại! Vui lòng kiểm tra lại thông tin.');
        } finally {
            setLoading(false);
            setError('');
        }
    };

    // Hàm đóng modal thêm giảng viên
    const handleCloseAddModal = () => {
        setOpenAddModal(false);
    };

    // Hàm mở modal chỉnh sửa
    const handleEditLecturer = async (id) => {
        try {
            setLoading(true);
            const response = await getLecturerByIdAPI(id);
            if (response && response.data) {
                setEditedLecturer(response.data);
                setOpenEditModal(true);
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin giảng viên để chỉnh sửa:", error);
            setError("Không thể lấy thông tin giảng viên để chỉnh sửa. Vui lòng thử lại.");
            toast.error('Lỗi khi lấy thông tin giảng viên để chỉnh sửa. Vui lòng thử lại.');
        } finally {
            setLoading(false);
            setError('');
        }
    };

    // Hàm đóng modal chỉnh sửa
    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setEditedLecturer(null);
    };

    // Hàm lưu thay đổi sau khi chỉnh sửa
    const handleSaveEditedLecturer = async (updatedLecturer) => {
        try {
            setLoading(true);
            const response = await updateLecturer(updatedLecturer.lecturer_id, updatedLecturer);
            if (response && response.data) {
                toast.success('Cập nhật giảng viên thành công!');
                fetchLecturers(); // Tải lại danh sách giảng viên sau khi cập nhật thành công
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật giảng viên:", error);
            setError("Không thể cập nhật giảng viên. Vui lòng kiểm tra lại thông tin.");
            toast.error('Cập nhật giảng viên thất bại! Vui lòng kiểm tra lại thông tin.');
        } finally {
            setLoading(false);
            setError('');
        }
    };

    // Hàm xử lý thay đổi trang
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Hàm xử lý xem giảng viên
    const handleViewLecturer = async (id) => {
        try {
            setLoading(true);
            const response = await getLecturerByIdAPI(id);
            if (response && response.data) {
                setSelectedLecturer(response.data);
                setOpenDetail(true);
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin chi tiết giảng viên:", error);
            setError("Không thể lấy thông tin chi tiết giảng viên. Vui lòng thử lại.");
            toast.error('Lỗi khi lấy thông tin chi tiết giảng viên. Vui lòng thử lại.');
        } finally {
            setLoading(false);
            setError('');
        }
    };

    // Hàm xử lý xóa giảng viên
    const handleDeleteLecturer = (id) => {
        const lecturer = lecturers.find((l) => l.lecturer_id === id);
        setLecturerToDelete(lecturer);
        setOpenDeleteModal(true);
    };

    // Hàm xác nhận xóa giảng viên
    const confirmDeleteLecturer = async (id) => {
        try {
            setLoading(true);
            const response = await deleteLecturer(id);
            if (response) {
                toast.success('Xóa giảng viên thành công!');
                fetchLecturers(); // Tải lại danh sách giảng viên sau khi xóa thành công
            }
        } catch (error) {
            console.error("Lỗi khi xóa giảng viên:", error);
            setError("Không thể xóa giảng viên. Vui lòng thử lại.");
            toast.error('Xóa giảng viên thất bại! Vui lòng thử lại.');
        } finally {
            setLoading(false);
            setOpenDeleteModal(false);
            setLecturerToDelete(null);
            setError('');
        }
    };

    // Hàm đóng modal chi tiết
    const handleCloseDetail = () => {
        setOpenDetail(false);
        setSelectedLecturer(null);
    };

    // Hàm đóng modal xóa
    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setLecturerToDelete(null);
    };


    // Lọc danh sách giảng viên dựa trên từ khóa tìm kiếm và trạng thái
    const filteredLecturers = lecturers.filter((lecturer) => {
        const matchesSearchTerm =
            lecturer.lecturer_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lecturer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lecturer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lecturer.phone_number?.toString().includes(searchTerm) ||
            lecturer.department?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = selectedStatus
            ? lecturer.status === selectedStatus
            : true;

        return matchesSearchTerm && matchesStatus;
    });

    // Tính toán dữ liệu hiển thị trên trang hiện tại
    const displayedLecturers = filteredLecturers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ p: 1, zIndex: 10, height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
            {/* Main Content */}
            <Box sx={{ width: '100%', mb: 3 }}>
                {/* Bảng danh sách giảng viên */}
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
                                Danh sách giảng viên
                            </Typography>

                            <Box sx={{
                                display: 'flex',
                                gap: 2,
                                flexDirection: isSmallScreen ? 'column' : 'row',
                                width: isSmallScreen ? '100%' : 'auto'
                            }}>
                                <TextField
                                    size="small"
                                    placeholder="Tìm kiếm theo mã, tên giảng viên hoặc môn giảng dạy..."
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
                                    <InputLabel>Trạng thái</InputLabel>
                                    <Select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        label="Trạng thái"
                                    >
                                        <MenuItem value="">Tất cả</MenuItem>
                                        {statuses.map((status) => (
                                            <MenuItem key={status} value={status}>
                                                {status}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={handleAddLecturer}
                                    sx={{ ml: isSmallScreen ? 0 : 'auto' }}
                                >
                                    Thêm giảng viên
                                </Button>
                            </Box>
                        </Box>
                        {filteredLecturers.length === 0 ? (
                            <Typography>Không có giảng viên nào để hiển thị.</Typography>
                        ) : (
                            <>
                                <LecturerTable
                                    displayedLecturers={displayedLecturers}
                                    isSmallScreen={isSmallScreen}
                                    isMediumScreen={isMediumScreen}
                                    handleViewLecturer={handleViewLecturer}
                                    handleEditLecturer={handleEditLecturer}
                                    handleDeleteLecturer={handleDeleteLecturer}
                                    loading={loading}
                                    error={error}
                                />
                                <TablePagination
                                    component="div"
                                    count={filteredLecturers.length}
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
            <LecturerDetailModal
                open={openDetail}
                onClose={handleCloseDetail}
                lecturer={selectedLecturer}
            />
            <AddLecturerModal
                open={openAddModal}
                onClose={handleCloseAddModal}
                onAddLecturer={handleAddNewLecturer}
                existingLecturers={lecturers}
                error={error}
                loading={loading}
                fetchLecturers={fetchLecturers}
            />
            <EditLecturerModal
                open={openEditModal}
                onClose={handleCloseEditModal}
                lecturer={editedLecturer}
                onSave={handleSaveEditedLecturer}
                error={error}
                loading={loading}
            />
            <DeleteLecturerModal
                open={openDeleteModal}
                onClose={handleCloseDeleteModal}
                onDelete={confirmDeleteLecturer}
                lecturer={lecturerToDelete}
            />
        </Box>
    );
};

export default Lecturer;