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
import { getAllSemesters, getSemesterById, createSemester, updateSemester, deleteSemester } from '../../api/semesterAPI';
import { toast } from 'react-toastify';
import { getAllPrograms } from '../../api/programAPI';

const Semester = () => {
    const { isSmallScreen, isMediumScreen } = useResponsive();

    // Dữ liệu mẫu cho danh sách học kỳ
    const [semesters, setSemesters] = useState([]);
    const [programs, setPrograms] = useState([]);
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Danh sách trạng thái để lọc
    const statuses = ['Đang triển khai', 'Đang mở đăng ký', 'Đang diễn ra', 'Tạm dừng', 'Đã kết thúc'];

    //hàm lấy danh sách chương trình từ API
    const fetchPrograms = async () => {
        try {
            const response = await getAllPrograms();
            if (!response) {
                console.error("Không có dữ liệu chương trình");
                return;
            }
            setPrograms(response.data.data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách chương trình:", error);
            throw error; // Ném lỗi để xử lý ở nơi gọi hàm
        }
    }
    // Hàm lấy danh sách học kỳ từ API
    const fetchSemesters = async () => {
        try {
            setLoading(true);
            const response = await getAllSemesters();
            if (!response) {
                console.error("Không có dữ liệu học kỳ");
                return;
            }
            setSemesters(response.data.data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách học kỳ:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSemesters();
        fetchPrograms();
    }, []);

    // Hàm xử lý khi nhấn nút Thêm học kỳ
    const handleAddSemester = () => {
        setOpenAddModal(true);
    };

    // Hàm đóng modal thêm học kỳ
    const handleCloseAddModal = () => {
        setOpenAddModal(false);
    };

    // Hàm thêm học kỳ mới
    const handleAddNewSemester = async (newSemester) => {
        try {
            setLoading(true);
            const response = await createSemester(newSemester);
            if (response && response.data) {
                toast.success('Thêm học kỳ thành công!')
                fetchSemesters(); // Tải lại danh sách học kỳ sau khi thêm thành công
            }
        } catch (error) {
            console.error("Lỗi khi thêm học kỳ:", error);
            setError("Không thể thêm học kỳ. Vui lòng kiểm tra lại thông tin.");
            toast.error('Thêm học kỳ thất bại! Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý khi nhấn nút chỉnh sửa
    const handleEditSemester = async (id) => {
        try {
            setLoading(true);
            const response = await getSemesterById(id);
            if (response && response.data) {
                setEditedSemester(response.data.data);
                setOpenEditModal(true);
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin học kỳ để chỉnh sửa:", error);
            setError("Không thể lấy thông tin học kỳ để chỉnh sửa. Vui lòng thử lại.");
            toast.error('Lỗi khi lấy thông tin học kỳ để chỉnh sửa. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    // Hàm đóng modal chỉnh sửa
    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setEditedSemester(null);
    };

    // Hàm lưu thay đổi sau khi chỉnh sửa
    const handleSaveEditedSemester = async (updatedSemester) => {
        try {
            setLoading(true);
            const response = await updateSemester(updatedSemester.semester_id, updatedSemester);
            if (response && response.data) {
                toast.success('Cập nhật học kỳ thành công!');
                fetchSemesters(); // Tải lại danh sách học kỳ sau khi cập nhật thành công
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật học kỳ:", error);
            setError("Không thể cập nhật học kỳ. Vui lòng kiểm tra lại thông tin.");
            toast.error('Cập nhật học kỳ thất bại! Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý thay đổi trang
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Hàm xử lý xem học kỳ
    const handleViewSemester = async (id) => {
        try {
            setLoading(true);
            const response = await getSemesterById(id);
            if (response && response.data) {
                setSelectedSemester(response.data.data);
                setOpenDetail(true);
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin chi tiết học kỳ:", error);
            setError("Không thể lấy thông tin chi tiết học kỳ. Vui lòng thử lại.");
            toast.error('Lỗi khi lấy thông tin chi tiết học kỳ. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý xóa học kỳ
    const handleDeleteSemester = (id) => {
        const semester = semesters.find((s) => s.semester_id === id);
        setSemesterToDelete(semester);
        setOpenDeleteModal(true);
    };

    // Hàm xác nhận xóa học kỳ
    const confirmDeleteSemester = async (id) => {
        try {
            setLoading(true);
            const response = await deleteSemester(id);
            if (response) {
                toast.success('Xóa học kỳ thành công!');
                fetchSemesters(); // Tải lại danh sách học kỳ sau khi xóa thành công
            }
        } catch (error) {
            console.error("Lỗi khi xóa học kỳ:", error);
            setError("Không thể xóa học kỳ. Vui lòng thử lại.");
            toast.error('Xóa học kỳ thất bại! Vui lòng thử lại.');
        } finally {
            setLoading(false);
            setOpenDeleteModal(false);
            setSemesterToDelete(null);
        }
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

    // Lọc danh sách học kỳ dựa trên từ khóa tìm kiếm và trạng thái
    const filteredSemesters = semesters.filter((semester) => {
        const matchesSearchTerm =
            semester.semester_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            semester.semester_name?.toLowerCase().includes(searchTerm.toLowerCase());

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
                {/* Bảng danh sách học kỳ */}
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
                                placeholder="Tìm kiếm theo mã, tên học kỳ..."
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
                            <Typography>Không có học kỳ nào để hiển thị.</Typography>
                        ) : (
                            <>
                                <SemesterTable
                                    displayedSemesters={displayedSemesters}
                                    isSmallScreen={isSmallScreen}
                                    isMediumScreen={isMediumScreen}
                                    handleViewSemester={handleViewSemester}
                                    handleEditSemester={handleEditSemester}
                                    handleDeleteSemester={handleDeleteSemester}
                                    loading={loading}
                                    error={error}
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
                error={error}
                loading={loading}
                fetchSemesters={fetchSemesters}
                programs={programs}
            />
            <EditSemesterModal
                open={openEditModal}
                onClose={handleCloseEditModal}
                semester={editedSemester}
                onSave={handleSaveEditedSemester}
                error={error}
                loading={loading}
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