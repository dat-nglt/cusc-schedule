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
import AddStudentModal from './AddStudentModal';
import StudentDetailModal from './StudentDetailModal';
import EditStudentModal from './EditStudentModal';
import useResponsive from '../../hooks/useResponsive';
import StudentTable from './StudentTable';

const Student = () => {
    const { isSmallScreen, isMediumScreen } = useResponsive();

    // Dữ liệu mẫu cho danh sách sinh viên
    const [students, setStudents] = useState([
        {
            id: 1,
            stt: 1,
            maHocVien: 'SV001',
            hoTen: 'Nguyễn Văn An',
            maLop: 'CNTT01',
            khoaHoc: 'Công nghệ thông tin',
            trangThai: 'Đang học',
            thoiGianTao: '2025-01-15 09:00',
            thoiGianCapNhat: '2025-01-20 14:30'
        },
        {
            id: 2,
            stt: 2,
            maHocVien: 'SV002',
            hoTen: 'Trần Thị Bình',
            maLop: 'CNTP01',
            khoaHoc: 'Công nghệ thực phẩm',
            trangThai: 'Đang học',
            thoiGianTao: '2025-01-16 10:15',
            thoiGianCapNhat: '2025-01-21 15:00'
        },
        {
            id: 3,
            stt: 3,
            maHocVien: 'SV003',
            hoTen: 'Lê Minh Cường',
            maLop: 'KTCN01',
            khoaHoc: 'Kỹ thuật cơ khí',
            trangThai: 'Tạm nghỉ',
            thoiGianTao: '2025-01-17 11:30',
            thoiGianCapNhat: '2025-01-22 09:45'
        },
        {
            id: 4,
            stt: 4,
            maHocVien: 'SV004',
            hoTen: 'Phạm Thị Dung',
            maLop: 'DIEN01',
            khoaHoc: 'Kỹ thuật điện',
            trangThai: 'Đang học',
            thoiGianTao: '2025-01-18 14:00',
            thoiGianCapNhat: '2025-01-23 13:15'
        },
        {
            id: 5,
            stt: 5,
            maHocVien: 'SV005',
            hoTen: 'Hoàng Văn Em',
            maLop: 'CNTT02',
            khoaHoc: 'Công nghệ thông tin',
            trangThai: 'Đang học',
            thoiGianTao: '2025-01-19 15:30',
            thoiGianCapNhat: '2025-01-24 10:20'
        },
        {
            id: 6,
            stt: 6,
            maHocVien: 'SV006',
            hoTen: 'Vũ Thị Phương',
            maLop: 'QLCN01',
            khoaHoc: 'Quản lý công nghiệp',
            trangThai: 'Đang học',
            thoiGianTao: '2025-01-20 09:45',
            thoiGianCapNhat: '2025-01-25 16:10'
        },
        {
            id: 7,
            stt: 7,
            maHocVien: 'SV007',
            hoTen: 'Đỗ Minh Giang',
            maLop: 'TUDH01',
            khoaHoc: 'Tự động hóa',
            trangThai: 'Đang học',
            thoiGianTao: '2025-01-21 11:00',
            thoiGianCapNhat: '2025-01-26 13:40'
        },
        {
            id: 8,
            stt: 8,
            maHocVien: 'SV008',
            hoTen: 'Bùi Thị Hạnh',
            maLop: 'QLXD01',
            khoaHoc: 'Quản lý xây dựng',
            trangThai: 'Tốt nghiệp',
            thoiGianTao: '2025-01-22 14:20',
            thoiGianCapNhat: '2025-01-27 15:55'
        },
        {
            id: 9,
            stt: 9,
            maHocVien: 'SV009',
            hoTen: 'Ngô Văn Ích',
            maLop: 'CNTT03',
            khoaHoc: 'Công nghệ thông tin',
            trangThai: 'Đang học',
            thoiGianTao: '2025-01-23 08:30',
            thoiGianCapNhat: '2025-01-28 12:10'
        },
        {
            id: 10,
            stt: 10,
            maHocVien: 'SV010',
            hoTen: 'Lý Thị Kim',
            maLop: 'DIEN02',
            khoaHoc: 'Kỹ thuật điện',
            trangThai: 'Đang học',
            thoiGianTao: '2025-01-24 09:10',
            thoiGianCapNhat: '2025-01-29 14:50'
        }
    ]);

    // State cho phân trang, tìm kiếm, lọc theo trạng thái và modal
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(8);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editedStudent, setEditedStudent] = useState(null);

    // Danh sách trạng thái để lọc
    const statuses = ['Đang học', 'Tạm nghỉ', 'Tốt nghiệp', 'Bảo lưu'];

    // Hàm xử lý khi nhấn nút Thêm sinh viên
    const handleAddStudent = () => {
        setOpenAddModal(true);
    };

    // Hàm đóng modal thêm sinh viên
    const handleCloseAddModal = () => {
        setOpenAddModal(false);
    };

    // Hàm thêm sinh viên mới
    const handleAddNewStudent = (newStudent) => {
        setStudents((prevStudents) => {
            const updatedStudents = [...prevStudents, { ...newStudent, stt: prevStudents.length + 1 }];
            return updatedStudents;
        });
    };

    // Hàm xử lý khi nhấn nút chỉnh sửa
    const handleEditStudent = (id) => {
        const studentToEdit = students.find((s) => s.id === id);
        setEditedStudent(studentToEdit);
        setOpenEditModal(true);
    };

    // Hàm đóng modal chỉnh sửa
    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setEditedStudent(null);
    };

    // Hàm lưu thay đổi sau khi chỉnh sửa
    const handleSaveEditedStudent = (updatedStudent) => {
        setStudents((prevStudents) =>
            prevStudents.map((student) =>
                student.id === updatedStudent.id ? { ...student, ...updatedStudent } : student
            )
        );
    };

    // Hàm xử lý thay đổi trang
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Hàm xử lý xem sinh viên
    const handleViewStudent = (id) => {
        const student = students.find((s) => s.id === id);
        setSelectedStudent(student);
        setOpenDetail(true);
    };

    // Hàm xử lý xóa sinh viên
    const handleDeleteStudent = (id) => {
        console.log(`Xóa sinh viên với ID: ${id}`);
        // Thêm logic xóa sinh viên
    };

    // Hàm đóng modal chi tiết
    const handleCloseDetail = () => {
        setOpenDetail(false);
        setSelectedStudent(null);
    };

    // Lọc danh sách sinh viên dựa trên từ khóa tìm kiếm và trạng thái
    const filteredStudents = students.filter((student) => {
        const matchesSearchTerm =
            student.maHocVien.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.maLop.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.khoaHoc.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = selectedStatus
            ? student.trangThai === selectedStatus
            : true;

        return matchesSearchTerm && matchesStatus;
    });

    // Tính toán dữ liệu hiển thị trên trang hiện tại
    const displayedStudents = filteredStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ p: 3, zIndex: 10, height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
            {/* Main Content */}
            <Box sx={{ width: '100%', mb: 3 }}>
                {/* Bảng danh sách sinh viên */}
                <Card sx={{ flexGrow: 1 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
                            <Typography variant="h6">
                                Danh sách sinh viên
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {isSmallScreen ? (
                                    <IconButton
                                        color="primary"
                                        onClick={handleAddStudent}
                                        sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}
                                    >
                                        <AddIcon sx={{ color: '#fff' }} />
                                    </IconButton>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<AddIcon />}
                                        onClick={handleAddStudent}
                                        sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}
                                    >
                                        Thêm sinh viên
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
                                placeholder="Tìm kiếm theo mã học viên, tên, mã lớp hoặc khóa học..."
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
                        {filteredStudents.length === 0 ? (
                            <Typography>Không có sinh viên nào để hiển thị.</Typography>
                        ) : (
                            <>
                                <StudentTable
                                    displayedStudents={displayedStudents}
                                    isSmallScreen={isSmallScreen}
                                    isMediumScreen={isMediumScreen}
                                    handleViewStudent={handleViewStudent}
                                    handleEditStudent={handleEditStudent}
                                    handleDeleteStudent={handleDeleteStudent}
                                />
                                <TablePagination
                                    component="div"
                                    count={filteredStudents.length}
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
            <StudentDetailModal
                open={openDetail}
                onClose={handleCloseDetail}
                student={selectedStudent}
            />
            <AddStudentModal
                open={openAddModal}
                onClose={handleCloseAddModal}
                onAddStudent={handleAddNewStudent}
            />
            <EditStudentModal
                open={openEditModal}
                onClose={handleCloseEditModal}
                student={editedStudent}
                onSave={handleSaveEditedStudent}
            />
        </Box>
    );
};

export default Student;