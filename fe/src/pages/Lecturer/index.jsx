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
import AddLecturerModal from './AddLecturerModal';
import LecturerDetailModal from './LecturerDetailModal';
import EditLecturerModal from './EditLecturerModal';
import DeleteLecturerModal from './DeleteLecturerModal';
import useResponsive from '../../hooks/useResponsive';
import LecturerTable from './LecturerTable';
import { toast } from 'react-toastify';
import { getAllLecturersAPI, createLecturerAPI, updateLecturerAPI, deleteLecturerAPI } from '../../api/lecturerAPI';
import { getAllSubjectsAPI } from '../../api/subjectAPI';
import TablePaginationLayout from '../../components/layout/TablePaginationLayout';
import * as XLSX from 'xlsx';

const Lecturer = () => {
    const { isSmallScreen, isMediumScreen } = useResponsive();
    const theme = useTheme()
    const [lecturers, setLecturers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(7);
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

    const statuses = ['Đang giảng dạy', 'Tạm nghỉ', 'Đã nghỉ việc', 'Nghỉ hưu'];

    const fetchLecturers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllLecturersAPI();
            if (response && response.data) {
                setLecturers(response.data);
            } else {
                setLecturers([]);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách giảng viên:", error);
            setError("Không thể tải danh sách giảng viên. Vui lòng thử lại.");
            toast.error('Lỗi khi tải danh sách giảng viên. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const fetchSubjects = async () => {
        setLoading(true);
        setError(null); // Đặt lại trạng thái lỗi
        try {
            const response = await getAllSubjectsAPI();
            if (response && response.data) {
                setSubjects(response.data);
            } else {
                setSubjects([]);
                console.warn("API không trả về dữ liệu môn học.");
            }
        } catch (err) {
            console.error("Lỗi khi tải danh sách môn học:", err);
            setError("Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại.");
            setSubjects([]); // Xóa dữ liệu cũ khi có lỗi
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLecturers();
        fetchSubjects();
    }, []);

    const handleAddLecturer = () => {
        setOpenAddModal(true);
    };

    const handleAddNewLecturer = async (newLecturer, subjects = [], busySlots = [], semesterBusySlots = []) => {
        try {
            setLoading(true);
            const response = await createLecturerAPI(newLecturer, subjects, busySlots, semesterBusySlots);
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

    const handleCloseAddModal = () => {
        setOpenAddModal(false);
    };

    // Hàm mở modal chỉnh sửa
    const handleEditLecturer = (id) => {
        try {
            const lecturerToEdit = lecturers.find(lecturer => lecturer.lecturer_id === id);

            if (lecturerToEdit) {
                setEditedLecturer({ ...lecturerToEdit });
                setOpenEditModal(true); // Mở modal chỉnh sửa
            } else {
                console.error("Không tìm thấy giảng viên để chỉnh sửa với ID:", id);
                setError("Không tìm thấy thông tin giảng viên này.");
            }
        } catch (err) {
            console.error("Lỗi khi chuẩn bị chỉnh sửa giảng viên:", err);
            setError("Đã xảy ra lỗi hệ thống. Vui lòng thử lại.");
        }
    };

    // Hàm đóng modal chỉnh sửa
    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setEditedLecturer(null);
    };

    // Hàm lưu thay đổi sau khi chỉnh sửa
    const handleSaveEditedLecturer = async (updatedLecturer, subjects = [], busySlots = [], semesterBusySlots = []) => {
        setLoading(true);
        setError(null); // Đặt lại trạng thái lỗi
        try {
            const response = await updateLecturerAPI(updatedLecturer.lecturer_id, updatedLecturer, subjects, busySlots, semesterBusySlots);

            if (response && response.data) {
                setLecturers(prevLecturers =>
                    prevLecturers.map(lecturer =>
                        lecturer.lecturer_id === updatedLecturer.lecturer_id
                            ? { ...lecturer, ...updatedLecturer } // Cập nhật đối tượng đã chỉnh sửa
                            : lecturer // Giữ nguyên các đối tượng khác
                    )
                );
                setOpenEditModal(false);
                setEditedLecturer(null);
                toast.success('Cập nhật giảng viên thành công!');
            } else {
                throw new Error(response.message || 'Cập nhật thất bại');
            }
        } catch (err) {
            console.error("Lỗi khi cập nhật giảng viên:", err.response?.data?.message || err.message);
            setError(err.response?.data?.message || err.message);
            toast.error(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };


    // Hàm xử lý thay đổi trang
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleViewLecturer = (id) => {
        try {
            const lecturerFound = lecturers.find(lecturer => lecturer.lecturer_id === id);

            if (lecturerFound) {
                setSelectedLecturer(lecturerFound);
                setOpenDetail(true); // Mở modal hoặc panel hiển thị chi tiết
            } else {
                console.error("Không tìm thấy giảng viên với ID:", id);
                setError("Không tìm thấy thông tin giảng viên này.");
            }
        } catch (err) {
            console.error("Lỗi khi xem chi tiết giảng viên:", err);
            setError("Đã xảy ra lỗi hệ thống.");
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
            const response = await deleteLecturerAPI(id);
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

    // Export lecturers to Excel
    const handleExportExcel = () => {
        // Prepare data for export (filteredLecturers)
        const data = filteredLecturers.map(l => ({
            'Mã giảng viên': l.lecturer_id,
            'Tên': l.name,
            'Email': l.email,
            'Số điện thoại': l.phone_number,
            'Khoa/Bộ môn': l.department,
            'Trạng thái': l.status,
        }));
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Giảng viên');
        XLSX.writeFile(workbook, 'danh_sach_giang_vien.xlsx');
    };

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
                                <Button
                                    variant="outlined"
                                    color="success"
                                    onClick={handleExportExcel}
                                >
                                    Xuất Excel
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

                                <TablePaginationLayout
                                    count={filteredLecturers.length}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    rowsPerPage={rowsPerPage}
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
                subjects={subjects}
            />
            <EditLecturerModal
                open={openEditModal}
                onClose={handleCloseEditModal}
                lecturer={editedLecturer}
                onSave={handleSaveEditedLecturer}
                error={error}
                loading={loading}
                subjects={subjects}
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

