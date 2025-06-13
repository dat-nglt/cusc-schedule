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
import AddLecturerModal from './AddLecturerModal';
import LecturerDetailModal from './LecturerDetailModal';
import EditLecturerModal from './EditLecturerModal';
import useResponsive from '../../hooks/useResponsive';
import LecturerTable from './LecturerTable';

const Lecturer = () => {
    const { isSmallScreen, isMediumScreen } = useResponsive();

    // Dữ liệu mẫu cho danh sách giảng viên
    const [lecturers, setLecturers] = useState([
        {
            id: 1,
            stt: 1,
            maGiangVien: 'GV001',
            hoTen: 'Nguyễn Văn An',
            monGiangDay: ['Hệ thống thông tin', 'Phân tích thiết kế hệ thống'],
            lienHe: { email: 'nva@cusc.edu.vn', soDienThoai: '0123456789' },
            trangThai: 'Hoạt động',
            thoiGianTao: '2025-01-15 09:00',
            thoiGianCapNhat: '2025-01-20 14:30'
        },
        {
            id: 2,
            stt: 2,
            maGiangVien: 'GV002',
            hoTen: 'Trần Thị Bình',
            monGiangDay: ['Công nghệ thực phẩm', 'Hóa học thực phẩm'],
            lienHe: { email: 'ttb@cusc.edu.vn', soDienThoai: '0123456790' },
            trangThai: 'Hoạt động',
            thoiGianTao: '2025-01-16 10:15',
            thoiGianCapNhat: '2025-01-21 15:00'
        },
        {
            id: 3,
            stt: 3,
            maGiangVien: 'GV003',
            hoTen: 'Lê Minh Cường',
            monGiangDay: ['Kỹ thuật hệ thống công nghiệp', 'Tự động hóa công nghiệp'],
            lienHe: { email: 'lmc@cusc.edu.vn', soDienThoai: '0123456791' },
            trangThai: 'Tạm nghỉ',
            thoiGianTao: '2025-01-17 11:30',
            thoiGianCapNhat: '2025-01-22 09:45'
        },
        {
            id: 4,
            stt: 4,
            maGiangVien: 'GV004',
            hoTen: 'Phạm Thị Dung',
            monGiangDay: ['Công nghệ kỹ thuật điện, điện tử', 'Mạch điện tử'],
            lienHe: { email: 'ptd@cusc.edu.vn', soDienThoai: '0123456792' },
            trangThai: 'Hoạt động',
            thoiGianTao: '2025-01-18 14:00',
            thoiGianCapNhat: '2025-01-23 13:15'
        },
        {
            id: 5,
            stt: 5,
            maGiangVien: 'GV005',
            hoTen: 'Hoàng Văn Em',
            monGiangDay: ['Kỹ thuật phần mềm', 'Lập trình Java'],
            lienHe: { email: 'hve@cusc.edu.vn', soDienThoai: '0123456793' },
            trangThai: 'Hoạt động',
            thoiGianTao: '2025-01-19 15:30',
            thoiGianCapNhat: '2025-01-24 10:20'
        },
        {
            id: 6,
            stt: 6,
            maGiangVien: 'GV006',
            hoTen: 'Vũ Thị Phương',
            monGiangDay: ['Quản lý công nghiệp', 'Quản trị doanh nghiệp'],
            lienHe: { email: 'vtp@cusc.edu.vn', soDienThoai: '0123456794' },
            trangThai: 'Hoạt động',
            thoiGianTao: '2025-01-20 09:45',
            thoiGianCapNhat: '2025-01-25 16:10'
        },
        {
            id: 7,
            stt: 7,
            maGiangVien: 'GV007',
            hoTen: 'Đỗ Minh Giang',
            monGiangDay: ['Công nghệ kỹ thuật điều khiển và tự động hóa', 'PLC'],
            lienHe: { email: 'dmg@cusc.edu.vn', soDienThoai: '0123456795' },
            trangThai: 'Hoạt động',
            thoiGianTao: '2025-01-21 11:00',
            thoiGianCapNhat: '2025-01-26 13:40'
        },
        {
            id: 8,
            stt: 8,
            maGiangVien: 'GV008',
            hoTen: 'Bùi Thị Hạnh',
            monGiangDay: ['Quản lý xây dựng', 'Kinh tế xây dựng'],
            lienHe: { email: 'bth@cusc.edu.vn', soDienThoai: '0123456796' },
            trangThai: 'Tạm nghỉ',
            thoiGianTao: '2025-01-22 14:20',
            thoiGianCapNhat: '2025-01-27 15:55'
        },
        {
            id: 9,
            stt: 9,
            maGiangVien: 'GV009',
            hoTen: 'Ngô Văn Ích',
            monGiangDay: ['Khoa học máy tính', 'Cấu trúc dữ liệu'],
            lienHe: { email: 'nvi@cusc.edu.vn', soDienThoai: '0123456797' },
            trangThai: 'Hoạt động',
            thoiGianTao: '2025-01-23 08:30',
            thoiGianCapNhat: '2025-01-28 12:10'
        },
        {
            id: 10,
            stt: 10,
            maGiangVien: 'GV010',
            hoTen: 'Lý Thị Kim',
            monGiangDay: ['Công nghệ kỹ thuật cơ điện tử', 'Robot học'],
            lienHe: { email: 'ltk@cusc.edu.vn', soDienThoai: '0123456798' },
            trangThai: 'Hoạt động',
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
    const [selectedLecturer, setSelectedLecturer] = useState(null);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editedLecturer, setEditedLecturer] = useState(null);

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
        console.log(`Xóa giảng viên với ID: ${id}`);
        // Thêm logic xóa giảng viên
    };

    // Hàm đóng modal chi tiết
    const handleCloseDetail = () => {
        setOpenDetail(false);
        setSelectedLecturer(null);
    };

    // Lọc danh sách giảng viên dựa trên từ khóa tìm kiếm và trạng thái
    const filteredLecturers = lecturers.filter((lecturer) => {
        const matchesSearchTerm =
            lecturer.maGiangVien.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lecturer.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lecturer.monGiangDay.some(mon => mon.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = selectedStatus
            ? lecturer.trangThai === selectedStatus
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
            />
            <EditLecturerModal
                open={openEditModal}
                onClose={handleCloseEditModal}
                lecturer={editedLecturer}
                onSave={handleSaveEditedLecturer}
            />
        </Box>
    );
};

export default Lecturer;