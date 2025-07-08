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
import AddSubjectModal from './AddSubjectModal';
import SubjectDetailModal from './SubjectDetailModal';
import EditSubjectModal from './EditSubjectModal';
import DeleteSubjectModal from './DeleteSubjectModal';
import useResponsive from '../../hooks/useResponsive';
import SubjectTable from './SubjectTable';
import { getAllSubjects, getSubjectById, createSubject, updateSubject, deleteSubject } from '../../api/subjectAPI';
import { getAllSemesters } from '../../api/semesterAPI';
const Subject = () => {
    const { isSmallScreen, isMediumScreen } = useResponsive();

    // Dữ liệu mẫu cho danh sách học phần
    const [subjects, setSubjects] = useState([]);
    const [semesters, setSemesters] = useState([]);
    // State cho phân trang, tìm kiếm, lọc theo trạng thái và modal
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(8);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [editedSubject, setEditedSubject] = useState(null);
    const [subjectToDelete, setSubjectToDelete] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Danh sách trạng thái để lọc
    const statuses = ['Hoạt động', 'Tạm dừng', 'Ngừng hoạt động'];

    // Hàm lấy danh sách học kỳ từ API
    const fetchSemesters = async () => {
        try {
            const response = await getAllSemesters();
            if (response && response.data) {
                setSemesters(response.data.data);
            } else {
                setError('Không có dữ liệu học kỳ');
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách học kỳ:', error);
            setError('Không thể lấy danh sách học kỳ. Vui lòng thử lại sau.');
        }
    };

    // Hàm lấy danh sách học phần từ API
    const fetchSubjects = async () => {
        try {
            setError('');
            setLoading(true);
            const response = await getAllSubjects();
            if (!response) {
                setError('Không có dữ liệu học phần');
                return;
            }
            setSubjects(response.data.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách học phần:', error);
            setError('Không thể lấy danh sách học phần. Vui lòng thử lại sau.');
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
        fetchSemesters();
    }, []);


    // Hàm xử lý khi nhấn nút Thêm học phần
    const handleAddSubject = () => {
        setOpenAddModal(true);
    };

    // Hàm đóng modal thêm học phần
    const handleCloseAddModal = () => {
        setOpenAddModal(false);
    };

    // Hàm thêm học phần mới
    const handleAddNewSubject = async (newSubject) => {
        try {
            setLoading(true);
            const response = await createSubject(newSubject);
            if (response && response.data) {
                setMessage("Thêm học phần thành công!");
                fetchSubjects(); // Tải lại danh sách học phần sau khi thêm thành công
            }
        } catch (error) {
            console.error("Lỗi khi thêm học phần:", error);
            setError("Không thể thêm học phần. Vui lòng kiểm tra lại thông tin.");
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý khi nhấn nút chỉnh sửa
    const handleEditSubject = async (id) => {
        try {
            setLoading(true);
            const response = await getSubjectById(id);
            if (response && response.data) {
                setEditedSubject(response.data.data);
                setOpenEditModal(true);
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin học phần để chỉnh sửa:", error);
            setError("Không thể lấy thông tin học phần để chỉnh sửa. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    // Hàm đóng modal chỉnh sửa
    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setEditedSubject(null);
    };

    // Hàm lưu thay đổi sau khi chỉnh sửa
    const handleSaveEditedSubject = async (updatedSubject) => {
        try {
            setLoading(true);
            const response = await updateSubject(updatedSubject.subject_id, updatedSubject);
            if (response && response.data) {
                setMessage("Cập nhật học phần thành công!");
                fetchSubjects(); // Tải lại danh sách học phần sau khi cập nhật thành công
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật học phần:", error);
            setError("Không thể cập nhật học phần. Vui lòng kiểm tra lại thông tin.");
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý thay đổi trang
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Hàm xử lý xem học phần
    const handleViewSubject = async (id) => {
        try {
            setLoading(true);
            const response = await getSubjectById(id);
            if (response && response.data) {
                setSelectedSubject(response.data.data);
                setOpenDetail(true);
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin chi tiết học phần:", error);
            setError("Không thể lấy thông tin chi tiết học phần. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý xóa học phần
    const handleDeleteSubject = (id) => {
        const subject = subjects.find((s) => s.subject_id === id);
        setSubjectToDelete(subject);
        setOpenDeleteModal(true);
    };

    // Hàm xác nhận xóa học phần
    const confirmDeleteSubject = async (id) => {
        try {
            setLoading(true);
            const response = await deleteSubject(id);
            if (response) {
                setMessage("Xóa học phần thành công!");
                fetchSubjects(); // Tải lại danh sách học phần sau khi xóa thành công
            }
        } catch (error) {
            console.error("Lỗi khi xóa học phần:", error);
            setError("Không thể xóa học phần. Vui lòng thử lại.");
        } finally {
            setLoading(false);
            setOpenDeleteModal(false);
            setSubjectToDelete(null);
        }
    };

    // Hàm đóng modal chi tiết
    const handleCloseDetail = () => {
        setOpenDetail(false);
        setSelectedSubject(null);
    };

    // Hàm đóng modal xóa
    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setSubjectToDelete(null);
    };

    // Lọc danh sách học phần dựa trên từ khóa tìm kiếm và trạng thái
    const filteredSubjects = subjects.filter((subject) => {
        const matchesSearchTerm =
            subject.subject_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subject.subject_name?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = selectedStatus
            ? subject.status === selectedStatus
            : true;

        return matchesSearchTerm && matchesStatus;
    });

    // Tính toán dữ liệu hiển thị trên trang hiện tại
    const displayedSubjects = filteredSubjects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ p: 3, zIndex: 10, height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
            {/* Main Content */}
            <Box sx={{ width: '100%', mb: 3 }}>
                {/* Bảng danh sách học phần */}
                <Card sx={{ flexGrow: 1 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
                            <Typography variant="h6">
                                Danh sách học phần
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {isSmallScreen ? (
                                    <IconButton
                                        color="primary"
                                        onClick={handleAddSubject}
                                        sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}
                                    >
                                        <AddIcon sx={{ color: '#fff' }} />
                                    </IconButton>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<AddIcon />}
                                        onClick={handleAddSubject}
                                        sx={{
                                            bgcolor: '#1976d2',
                                            '&:hover': { bgcolor: '#115293' },
                                            minWidth: isSmallScreen ? 100 : 150,
                                            height: '56px'
                                        }}
                                    >
                                        Thêm học phần
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
                                placeholder="Tìm kiếm theo mã học phần hoặc tên học phần..."
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
                        {filteredSubjects.length === 0 ? (
                            <Typography>Không có học phần nào để hiển thị.</Typography>
                        ) : (
                            <>
                                <SubjectTable
                                    displayedSubjects={displayedSubjects}
                                    isSmallScreen={isSmallScreen}
                                    isMediumScreen={isMediumScreen}
                                    handleViewSubject={handleViewSubject}
                                    handleEditSubject={handleEditSubject}
                                    handleDeleteSubject={handleDeleteSubject}
                                    loading={loading}
                                    error={error}
                                />
                                <TablePagination
                                    component="div"
                                    count={filteredSubjects.length}
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
            <SubjectDetailModal
                open={openDetail}
                onClose={handleCloseDetail}
                subject={selectedSubject}
            />
            <AddSubjectModal
                open={openAddModal}
                onClose={handleCloseAddModal}
                onAddSubject={handleAddNewSubject}
                existingSubjects={subjects}
                error={error}
                loading={loading}
                message={message}
                semesters={semesters}
            />
            <EditSubjectModal
                open={openEditModal}
                onClose={handleCloseEditModal}
                subject={editedSubject}
                onSave={handleSaveEditedSubject}
                error={error}
                loading={loading}
            />
            <DeleteSubjectModal
                open={openDeleteModal}
                onClose={handleCloseDeleteModal}
                onDelete={confirmDeleteSubject}
                subject={subjectToDelete}
            />
        </Box>
    );
};

export default Subject;