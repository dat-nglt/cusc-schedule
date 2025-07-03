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
import AddSemesterModal from './AddSemesterModal';
import SemesterDetailModal from './SemesterDetailModal';
import EditSemesterModal from './EditSemesterModal';
import DeleteSemesterModal from './DeleteSemesterModal';
import useResponsive from '../../hooks/useResponsive';
import SemesterTable from './SemesterTable';
import { getAllSemesters } from '../../api/semesterAPI';

const Semester = () => {
    const { isSmallScreen, isMediumScreen } = useResponsive();

    // Dữ liệu mẫu cho danh sách chương trình đào tạo
    const [semesters, setSemesters] = useState([]);
    // State cho phân trang, tìm kiếm, lọc theo trạng thái và modal
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(8);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [editedSemester, setEditedSemester] = useState(null);
    const [semesterToDelete, setSemesterToDelete] = useState(null);

    const fetchSemesters = async () => {
        try {
            const response = await getAllSemesters();
            if (!response) {
                throw new Error('Lỗi khi tải danh sách học kỳ');
            }
            setSemesters(response.data.data);
        } catch (error) {
            console.error('Error fetching semesters:', error);
            // Hiển thị thông báo lỗi hoặc xử lý lỗi ở đây
        }
    };

    useEffect(() => {
        fetchSemesters();
    }, []);

    // Danh sách trạng thái để lọc
    const statuses = ['Đang triển khai', 'Tạm dừng', 'Kết thúc'];

    // Hàm xử lý khi nhấn nút Thêm chương trình
    const handleAddSemester = () => {
        setOpenAddModal(true);
    };

    // Hàm đóng modal thêm chương trình
    const handleCloseAddModal = () => {
        setOpenAddModal(false);
    };

    // Hàm thêm chương trình mới
    const handleAddNewSemester = (newSemester) => {
        setSemesters((prevSemesters) => {
            const updatedSemesters = [...prevSemesters, { ...newSemester }];
            return updatedSemesters;
        });
    };

    // Hàm xử lý khi nhấn nút chỉnh sửa
    const handleEditSemester = (id) => {
        const semesterToEdit = semesters.find((p) => p.semester_id === id);
        setEditedSemester(semesterToEdit);
        setOpenEditModal(true);
    };

    // Hàm đóng modal chỉnh sửa
    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setEditedSemester(null);
    };

    // Hàm lưu thay đổi sau khi chỉnh sửa
    const handleSaveEditedSemester = (updatedSemester) => {
        // Refresh data from server after successful update
        fetchSemesters();
    };


    // Hàm xử lý thay đổi trang
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Hàm xử lý xem chương trình
    const handleViewSemester = (id) => {
        const semester = semesters.find((p) => p.semester_id === id);
        setSelectedSemester(semester);
        setOpenDetail(true);
    };

    // Hàm xử lý xóa chương trình
    const handleDeleteSemester = (id) => {
        const semester = semesters.find((p) => p.semester_id === id);
        setSemesterToDelete(semester);
        setOpenDeleteModal(true);
    };

    // Hàm xác nhận xóa chương trình
    const confirmDeleteSemester = (id) => {
        setSemesters((prevSemesters) => {
            const updatedSemesters = prevSemesters.filter((semester) => semester.semester_id !== id);
            return updatedSemesters;
        });
        setOpenDeleteModal(false);
        setSemesterToDelete(null);
    };

    // Hàm đóng modal chi tiết
    const handleCloseDetail = () => {
        setOpenDetail(false);
        setSelectedSemester(null);
    };

    // Hàm đóng modal xóa
    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setSemesterToDelete(null);
    };

    // Lọc danh sách chương trình dựa trên từ khóa tìm kiếm và trạng thái
    const filteredSemesters = semesters.filter((semester) => {
        const matchesSearchTerm =
            semester.semester_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            semester.semester_name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = selectedStatus
            ? semester.status === selectedStatus
            : true;

        return matchesSearchTerm && matchesStatus;
    });

    // Tính toán dữ liệu hiển thị trên trang hiện tại
    const displayedSemesters = filteredSemesters.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ p: 3, zIndex: 10, height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
            {/* Main Content */}
            <Box sx={{ width: '100%', mb: 3 }}>
                {/* Bảng danh sách chương trình đào tạo */}
                <Card sx={{ flexGrow: 1 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
                            <Typography variant="h6">
                                Danh sách học kỳ
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {isSmallScreen ? (
                                    <IconButton
                                        color="primary"
                                        onClick={handleAddSemester}
                                        sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}
                                    >
                                        <AddIcon sx={{ color: '#fff' }} />
                                    </IconButton>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<AddIcon />}
                                        onClick={handleAddSemester}
                                        sx={{
                                            bgcolor: '#1976d2',
                                            '&:hover': { bgcolor: '#115293' },
                                            minWidth: isSmallScreen ? 100 : 150,
                                            height: '56px'
                                        }}
                                    >
                                        Thêm học kỳ
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
                                placeholder="Tìm kiếm theo mã, tên chương trình hoặc thời gian đào tạo..."
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
                        {filteredSemesters.length === 0 ? (
                            <Typography>Không có chương trình đào tạo nào để hiển thị.</Typography>
                        ) : (
                            <>
                                <SemesterTable
                                    displayedSemesters={displayedSemesters}
                                    isSmallScreen={isSmallScreen}
                                    isMediumScreen={isMediumScreen}
                                    handleViewSemester={handleViewSemester}
                                    handleEditSemester={handleEditSemester}
                                    handleDeleteSemester={handleDeleteSemester}
                                />
                                <TablePagination
                                    component="div"
                                    count={filteredSemesters.length}
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
            <SemesterDetailModal
                open={openDetail}
                onClose={handleCloseDetail}
                semester={selectedSemester}
            />
            <AddSemesterModal
                open={openAddModal}
                onClose={handleCloseAddModal}
                onAddSemester={handleAddNewSemester}
                existingSemesters={semesters}
            />
            <EditSemesterModal
                open={openEditModal}
                onClose={handleCloseEditModal}
                semester={editedSemester}
                onSave={handleSaveEditedSemester}
            />
            <DeleteSemesterModal
                open={openDeleteModal}
                onClose={handleCloseDeleteModal}
                onDelete={confirmDeleteSemester}
                semester={semesterToDelete}
            />
        </Box>
    );
};

export default Semester;