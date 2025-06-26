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
import AddStudentModal from './AddStudentModal';
import StudentDetailModal from './StudentDetailModal';
import EditStudentModal from './EditStudentModal';
import DeleteStudentModal from './DeleteStudentModal';
import useResponsive from '../../hooks/useResponsive';
import StudentTable from './StudentTable';
import { getAllStudents } from '../../api/studentAPI';

const Student = () => {
    const { isSmallScreen, isMediumScreen } = useResponsive();

    // Dữ liệu mẫu cho danh sách học viên
    const [students, setStudents] = useState([]);
    // State cho phân trang, tìm kiếm, lọc theo trạng thái và modal
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(8);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [editedStudent, setEditedStudent] = useState(null);
    const [studentToDelete, setStudentToDelete] = useState(null);

    // Danh sách trạng thái để lọc
    const statuses = ['Đang học', 'Tạm nghỉ', 'Tốt nghiệp', 'Bảo lưu'];


    const fetchStudents = async () => {
        try {
            const response = await getAllStudents();
            if (!response) {
                console.error("Không có dữ liệu học viên");
                return;
            }
            setStudents(response.data.data)
        } catch (error) {
            console.error("Lỗi khi tải danh sách học viên:", error);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [])

    // Hàm xử lý khi nhấn nút Thêm học viên
    const handleAddStudent = () => {
        setOpenAddModal(true);
    };

    // Hàm đóng modal thêm học viên
    const handleCloseAddModal = () => {
        setOpenAddModal(false);
    };

    // Hàm thêm học viên mới
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

    // Hàm xử lý xem học viên
    const handleViewStudent = (id) => {
        const student = students.find((s) => s.id === id);
        setSelectedStudent(student);
        setOpenDetail(true);
    };

    // Hàm xử lý xóa học viên
    const handleDeleteStudent = (id) => {
        const student = students.find((s) => s.id === id);
        setStudentToDelete(student);
        setOpenDeleteModal(true);
    };

    // Hàm xác nhận xóa học viên
    const confirmDeleteStudent = (id) => {
        setStudents((prevStudents) => {
            const updatedStudents = prevStudents.filter((student) => student.id !== id)
                .map((student, index) => ({ ...student, stt: index + 1 }));
            return updatedStudents;
        });
        setOpenDeleteModal(false);
        setStudentToDelete(null);
    };

    // Hàm đóng modal chi tiết
    const handleCloseDetail = () => {
        setOpenDetail(false);
        setSelectedStudent(null);
    };

    // Hàm đóng modal xóa
    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setStudentToDelete(null);
    };

    // Lọc danh sách học viên dựa trên từ khóa tìm kiếm và trạng thái
    const filteredStudents = students.filter((student) => {
        const matchesSearchTerm =
            student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.class.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = selectedStatus
            ? student.status === selectedStatus
            : true;

        return matchesSearchTerm && matchesStatus;
    });

    // Tính toán dữ liệu hiển thị trên trang hiện tại
    const displayedStudents = filteredStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ p: 3, zIndex: 10, height: 'calc(100vh -.64px)', overflowY: 'auto' }}>
            {/* Main Content */}
            <Box sx={{ width: '100%', mb: 3 }}>
                {/* Bảng danh sách học viên */}
                <Card sx={{ flexGrow: 1 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
                            <Typography variant="h6">
                                Danh sách học viên
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {isSmallScreen ? (
                                    <IconButton
                                        color="primary"
                                        onClick={handleAddStudent}
                                        sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}
                                    >
                                        <AddIcon sx={{ color: '# philanthropic' }} />
                                    </IconButton>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<AddIcon />}
                                        onClick={handleAddStudent}
                                        sx={{
                                            bgcolor: '#1976d2',
                                            '&:hover': { bgcolor: '#115293' },
                                            minWidth: isSmallScreen ? 100 : 150,
                                            height: '56px'
                                        }}
                                    >
                                        Thêm học viên
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
                            <Typography>Không có học viên nào để hiển thị.</Typography>
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
                existingStudents={students}
            />
            <EditStudentModal
                open={openEditModal}
                onClose={handleCloseEditModal}
                student={editedStudent}
                onSave={handleSaveEditedStudent}
            />
            <DeleteStudentModal
                open={openDeleteModal}
                onClose={handleCloseDeleteModal}
                onDelete={confirmDeleteStudent}
                student={studentToDelete}
            />
        </Box>
    );
};

export default Student;