import React, { useState } from 'react';
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

const Subject = () => {
    const { isSmallScreen, isMediumScreen } = useResponsive();

    // Dữ liệu mẫu cho danh sách học phần
    const [subjects, setSubjects] = useState([
        {
            id: 1,
            stt: 1,
            maHocPhan: 'HP001',
            tenHocPhan: 'Lập trình C++',
            soTietLyThuyet: 30,
            soTietThucHanh: 30,
            trangThai: 'Đang hoạt động',
            thoiGianTao: '2025-01-15 09:00',
            thoiGianCapNhat: '2025-01-20 14:30'
        },
        {
            id: 2,
            stt: 2,
            maHocPhan: 'HP002',
            tenHocPhan: 'Cơ sở dữ liệu',
            soTietLyThuyet: 45,
            soTietThucHanh: 15,
            trangThai: 'Đang hoạt động',
            thoiGianTao: '2025-01-16 10:15',
            thoiGianCapNhat: '2025-01-21 15:00'
        },
        {
            id: 3,
            stt: 3,
            maHocPhan: 'HP003',
            tenHocPhan: 'Mạng máy tính',
            soTietLyThuyet: 40,
            soTietThucHanh: 20,
            trangThai: 'Tạm dừng',
            thoiGianTao: '2025-01-17 11:30',
            thoiGianCapNhat: '2025-01-22 09:45'
        },
        {
            id: 4,
            stt: 4,
            maHocPhan: 'HP004',
            tenHocPhan: 'Hệ điều hành',
            soTietLyThuyet: 35,
            soTietThucHanh: 25,
            trangThai: 'Đang hoạt động',
            thoiGianTao: '2025-01-18 14:00',
            thoiGianCapNhat: '2025-01-23 13:15'
        },
        {
            id: 5,
            stt: 5,
            maHocPhan: 'HP005',
            tenHocPhan: 'Toán rời rạc',
            soTietLyThuyet: 50,
            soTietThucHanh: 10,
            trangThai: 'Đang hoạt động',
            thoiGianTao: '2025-01-19 15:30',
            thoiGianCapNhat: '2025-01-24 10:20'
        }
    ]);

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

    // Danh sách trạng thái để lọc
    const statuses = ['Đang hoạt động', 'Tạm dừng', 'Ngừng hoạt động'];

    // Hàm xử lý khi nhấn nút Thêm học phần
    const handleAddSubject = () => {
        setOpenAddModal(true);
    };

    // Hàm đóng modal thêm học phần
    const handleCloseAddModal = () => {
        setOpenAddModal(false);
    };

    // Hàm thêm học phần mới
    const handleAddNewSubject = (newSubject) => {
        setSubjects((prevSubjects) => {
            const updatedSubjects = [...prevSubjects, { ...newSubject, stt: prevSubjects.length + 1 }];
            return updatedSubjects;
        });
    };

    // Hàm xử lý khi nhấn nút chỉnh sửa
    const handleEditSubject = (id) => {
        const subjectToEdit = subjects.find((s) => s.id === id);
        setEditedSubject(subjectToEdit);
        setOpenEditModal(true);
    };

    // Hàm đóng modal chỉnh sửa
    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setEditedSubject(null);
    };

    // Hàm lưu thay đổi sau khi chỉnh sửa
    const handleSaveEditedSubject = (updatedSubject) => {
        setSubjects((prevSubjects) =>
            prevSubjects.map((subject) =>
                subject.id === updatedSubject.id ? { ...subject, ...updatedSubject } : subject
            )
        );
    };

    // Hàm xử lý thay đổi trang
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Hàm xử lý xem học phần
    const handleViewSubject = (id) => {
        const subject = subjects.find((s) => s.id === id);
        setSelectedSubject(subject);
        setOpenDetail(true);
    };

    // Hàm xử lý xóa học phần
    const handleDeleteSubject = (id) => {
        const subject = subjects.find((s) => s.id === id);
        setSubjectToDelete(subject);
        setOpenDeleteModal(true);
    };

    // Hàm xác nhận xóa học phần
    const confirmDeleteSubject = (id) => {
        setSubjects((prevSubjects) => {
            const updatedSubjects = prevSubjects.filter((subject) => subject.id !== id)
                .map((subject, index) => ({ ...subject, stt: index + 1 }));
            return updatedSubjects;
        });
        setOpenDeleteModal(false);
        setSubjectToDelete(null);
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
            subject.maHocPhan.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subject.tenHocPhan.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = selectedStatus
            ? subject.trangThai === selectedStatus
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
                                        sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}
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
            />
            <EditSubjectModal
                open={openEditModal}
                onClose={handleCloseEditModal}
                subject={editedSubject}
                onSave={handleSaveEditedSubject}
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