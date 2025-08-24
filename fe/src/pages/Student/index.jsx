import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
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
import AddStudentModal from './AddStudentModal';
import StudentDetailModal from './StudentDetailModal';
import EditStudentModal from './EditStudentModal';
import DeleteStudentModal from './DeleteStudentModal';
import useResponsive from '../../hooks/useResponsive';
import StudentTable from './StudentTable';
import { getAllStudentsAPI, createStudentAPI, updateStudentAPI, deleteStudentAPI } from '../../api/studentAPI';
import { toast } from 'react-toastify';
import { getClassesAPI } from '../../api/classAPI';
import TablePaginationLayout from '../../components/layout/TablePaginationLayout';
const Student = () => {
    const { isSmallScreen, isMediumScreen } = useResponsive();
    const theme = useTheme();

    // Dữ liệu mẫu cho danh sách học viên
    const [students, setStudents] = useState([]);
    const [existingAccounts, setExistingAccounts] = useState([]);
    const [classes, setClasses] = useState([]);
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Danh sách trạng thái để lọc
    const statuses = ['Đang học', 'Đã nghỉ học', 'Đã tốt nghiệp', 'Bảo lưu'];

    const fetchStudents = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllStudentsAPI();
            if (response && response.data) {
                console.log(response.data.students);
                
                setStudents(response.data.students);
                setExistingAccounts(response.data.allAccounts);
            } else {
                setStudents([]);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách học viên:", error);
            setError(error.response?.data?.message || "Không thể tải danh sách học viên. Vui lòng thử lại.");
            toast.error(error.response.data.message || "Không thể tải danh sách học viên. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const fetchClasses = async () => {
        setLoading(true);
        setError(null); // Đặt lại lỗi mỗi khi fetch
        try {
            const response = await getClassesAPI();

            if (response && response.data) {
                setClasses(response.data);
            } else {
                console.error("No class data found or invalid response format.");
                setClasses([]); // Đảm bảo state là mảng rỗng khi không có dữ liệu
                setError("Không có dữ liệu lớp học.");
            }
        } catch (error) {
            console.error("Lấy dữ liệu lớp học không thành công:", error.response?.data?.message);
            setError(error.response?.data?.message || "Lỗi khi tải danh sách lớp học. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
        fetchClasses();
    }, [])

    // Hàm mở modal Thêm 
    const handleAddStudentModal = () => {
        setOpenAddModal(true);
    };

    // Hàm thêm học viên mới
    const handleAddNewStudent = async (newStudent) => {
        setLoading(true);
        setError(null);

        try {
            const { data } = await createStudentAPI(newStudent);

            if (!data) {
                throw new Error("Không thể thêm học viên. Vui lòng thử lại.");
            }

            toast.success("Thêm học viên thành công!");
            await fetchStudents();

            // Chỉ reset và đóng modal khi thêm thành công
            setOpenAddModal(false);
            setEditedStudent(null);
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Không thể thêm học viên. Vui lòng thử lại.";
            console.error("Lỗi khi thêm học viên:", errorMessage);

            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };


    // Hàm đóng modal thêm học viên
    const handleCloseAddModal = () => {
        setOpenAddModal(false);
    };

    // Hàm mở modal chỉnh sửa
    const handleEditStudentModal = async (id) => {

        setLoading(true);
        setError(null);
        try {
            const studentToEdit = filteredStudents.find((s) => s.student_id === id);
            if (studentToEdit) {
                setEditedStudent(studentToEdit);
                setOpenEditModal(true);
                console.log(studentToEdit);
            }
            else {
                const errorMessage = "Không tìm thấy học viên để chỉnh sửa.";
                console.error(errorMessage);
                setError(errorMessage);
                toast.error(errorMessage);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Không thể mở modal chỉnh sửa học viên. Vui lòng thử lại.";
            console.error("Lỗi khi mở modal chỉnh sửa học viên:", errorMessage);
            setError(errorMessage);
            toast.error(errorMessage);
        }

        finally {
            setLoading(false);
        }
    };

    // Hàm lưu thay đổi sau khi chỉnh sửa
    const handleSaveEditedStudent = async (updatedStudent) => {
        try {
            setLoading(true);
            const response = await updateStudentAPI(updatedStudent.student_id, updatedStudent);
            if (response && response.data) {
                toast.success('Cập nhật học viên thành công!');
                fetchStudents(); // Tải lại danh sách học viên sau khi cập nhật thành công
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật học viên:", error);
            setError("Không thể cập nhật học viên. Vui lòng kiểm tra lại thông tin.");
            toast.error('Cập nhật học viên thất bại! Vui lòng kiểm tra lại thông tin.');
        } finally {
            setLoading(false);
        }
    };

    // Hàm đóng modal chỉnh sửa
    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setEditedStudent(null);
    };

    // Hàm mở modal chi tiết học viên
    const handleViewStudent = (id) => {
        setLoading(true);
        setError(null);

        try {
            const studentToView = students.find(student => student.student_id === id);

            if (studentToView) {
                setSelectedStudent(studentToView);

                setOpenDetail(true);
                console.log(studentToView);
            } else {
                const errorMessage = `Không tìm thấy học viên với ID: ${id}`;
                setError(errorMessage);
                toast.error(`Lỗi: ${errorMessage}`);
            }
        } catch (error) {
            const errorMessage = error.message || 'Đã xảy ra lỗi không xác định.';
            setError(errorMessage);
            toast.error(`Lỗi: ${errorMessage}`);
            console.error('Lỗi khi lấy thông tin học viên:', error);
        } finally {
            setLoading(false);
        }
    };

    // Hàm đóng modal chi tiết
    const handleCloseDetail = () => {
        setOpenDetail(false);
        setSelectedStudent(null);
    };


    // Hàm mở modal xóa
    const handleDeleteStudentModal = (id) => {
        const student = students.find((s) => s.student_id === id);
        setStudentToDelete(student);
        setOpenDeleteModal(true);
    };

    // Hàm xác nhận xóa học viên
    const confirmDeleteStudent = async (id) => {
        try {
            setLoading(true);
            const response = await deleteStudentAPI(id);
            if (response) {
                toast.success('Xóa học viên thành công!');
                fetchStudents(); // Tải lại danh sách học viên sau khi xóa thành công
            }
        } catch (error) {
            console.error("Lỗi khi xóa học viên:", error);
            error("Không thể xóa học viên. Vui lòng thử lại.");
            toast.error('Xóa học viên thất bại! Vui lòng thử lại.');
        } finally {
            setLoading(false);
            setOpenDeleteModal(false);
            setStudentToDelete(null);
        }
    };


    // Hàm đóng modal xóa
    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setStudentToDelete(null);
    };

    // Hàm xử lý thay đổi trang
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
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
        <Box sx={{ p: 1, zIndex: 10, height: 'calc(100vh -.64px)', overflowY: 'auto' }}>
            {/* Main Content */}
            <Box sx={{ width: '100%', mb: 3 }}>
                {/* Bảng danh sách học viên */}
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
                                Danh sách học viên
                            </Typography>

                            <Box sx={{
                                display: 'flex',
                                gap: 2,
                                flexDirection: isSmallScreen ? 'column' : 'row',
                                width: isSmallScreen ? '100%' : 'auto'
                            }}>
                                <TextField
                                    size="small"
                                    placeholder="Tìm kiếm theo mã học viên, tên, mã lớp hoặc khóa học..."
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
                                    onClick={handleAddStudentModal}
                                    sx={{ ml: isSmallScreen ? 0 : 'auto' }}
                                >
                                    Thêm học viên
                                </Button>
                            </Box>
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
                                    handleEditStudent={handleEditStudentModal}
                                    handleDeleteStudent={handleDeleteStudentModal}
                                    loading={loading}
                                    error={error}
                                />
                                <TablePaginationLayout
                                    count={filteredStudents.length}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    rowsPerPage={rowsPerPage}
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
                error={error}
                loading={loading}
            />
            <AddStudentModal
                open={openAddModal}
                onClose={handleCloseAddModal}
                onAddStudent={handleAddNewStudent}
                existingStudents={students}
                error={error}
                loading={loading}
                fetchStudents={fetchStudents}
                existingAccounts={existingAccounts}
                classes={classes}
            />
            <EditStudentModal
                open={openEditModal}
                onClose={handleCloseEditModal}
                student={editedStudent}
                onSave={handleSaveEditedStudent}
                error={error}
                loading={loading}
            />
            <DeleteStudentModal
                open={openDeleteModal}
                onClose={handleCloseDeleteModal}
                onDelete={confirmDeleteStudent}
                student={studentToDelete}
                error={error}
            />
        </Box>
    );
};

export default Student;