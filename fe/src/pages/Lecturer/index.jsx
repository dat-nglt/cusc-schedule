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
import { getAllLecturers } from '../../api/lecturerAPI';
const Lecturer = () => {
    const { isSmallScreen, isMediumScreen } = useResponsive();

    // Dữ liệu mẫu cho danh sách giảng viên
    const [lecturers, setLecturers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllLecturers();
                if (!response) {
                    throw new Error('Lỗi khi tải danh sách giảng viên');
                }
                setLecturers(response.data.data);
            } catch (error) {
                console.error('Error fetching lecturers:', error);
                // Hiển thị thông báo lỗi hoặc xử lý lỗi ở đây
            }
        }; fetchData();
    }, []);

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

    // Danh sách trạng thái để lọc
    const statuses = ['Hoạt động', 'Tạm nghỉ'];

    // Hàm xử lý khi nhấn nút Thêm giảng viên
    const handleAddLecturer = () => {
        setOpenAddModal(true);
    };

    // Hàm đóng modal thêm giảng viên
    const handleCloseAddModal = () => {
        setOpenAddModal(false);
    };

    // Hàm thêm giảng viên mới
    const handleAddNewLecturer = (newLecturer) => {
        setLecturers((prevLecturers) => {
            const updatedLecturers = [...prevLecturers, { ...newLecturer, stt: prevLecturers.length + 1 }];
            return updatedLecturers;
        });
    };

    // Hàm xử lý khi nhấn nút chỉnh sửa
    const handleEditLecturer = (id) => {
        const lecturerToEdit = lecturers.find((l) => l.id === id);
        setEditedLecturer(lecturerToEdit);
        setOpenEditModal(true);
    };

    // Hàm đóng modal chỉnh sửa
    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setEditedLecturer(null);
    };

    // Hàm lưu thay đổi sau khi chỉnh sửa
    const handleSaveEditedLecturer = (updatedLecturer) => {
        setLecturers((prevLecturers) =>
            prevLecturers.map((lecturer) =>
                lecturer.id === updatedLecturer.id ? { ...lecturer, ...updatedLecturer } : lecturer
            )
        );
    };

    // Hàm xử lý thay đổi trang
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Hàm xử lý xem giảng viên
    const handleViewLecturer = (id) => {
        const lecturer = lecturers.find((l) => l.id === id);
        setSelectedLecturer(lecturer);
        setOpenDetail(true);
    };

    // Hàm xử lý xóa giảng viên
    const handleDeleteLecturer = (id) => {
        const lecturer = lecturers.find((l) => l.id === id);
        setLecturerToDelete(lecturer);
        setOpenDeleteModal(true);
    };

    // Hàm xác nhận xóa giảng viên
    const confirmDeleteLecturer = (id) => {
        setLecturers((prevLecturers) => {
            const updatedLecturers = prevLecturers.filter((lecturer) => lecturer.id !== id)
                .map((lecturer, index) => ({ ...lecturer, stt: index + 1 }));
            return updatedLecturers;
        });
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
        <Box sx={{ p: 3, zIndex: 10, height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
            {/* Main Content */}
            <Box sx={{ width: '100%', mb: 3 }}>
                {/* Bảng danh sách giảng viên */}
                <Card sx={{ flexGrow: 1 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
                            <Typography variant="h6">
                                Danh sách giảng viên
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {isSmallScreen ? (
                                    <IconButton
                                        color="primary"
                                        onClick={handleAddLecturer}
                                        sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}
                                    >
                                        <AddIcon sx={{ color: '#fff' }} />
                                    </IconButton>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<AddIcon />}
                                        onClick={handleAddLecturer}
                                        sx={{
                                            bgcolor: '#1976d2',
                                            '&:hover': { bgcolor: '#115293' },
                                            minWidth: isSmallScreen ? 100 : 150,
                                            height: '56px'
                                        }}
                                    >
                                        Thêm giảng viên
                                    </Button>
                                )}
                                <FormControl sx={{ minWidth: isSmallScreen ? 100 : 150 }} variant="outlined">
                                    <InputLabel id="status-filter-label">{isSmallScreen ? 'Lọc' : 'Lọc theo trạng thái'}</InputLabel>
                                    <Select
                                        labelId="status-filter-label"
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        label={isSmallScreen ? 'Lọc' : 'Lọc theo trạng thái'}
                                    >
                                        <MenuItem value="">Tất cả</MenuItem>
                                        {statuses.map((status) => (
                                            <MenuItem key={status} value={status}>
                                                {status}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Tìm kiếm theo mã, tên giảng viên hoặc môn giảng dạy..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                sx={{ bgcolor: '#fff' }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
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
            />
            <EditLecturerModal
                open={openEditModal}
                onClose={handleCloseEditModal}
                lecturer={editedLecturer}
                onSave={handleSaveEditedLecturer}
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