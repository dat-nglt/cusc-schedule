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
import AddProgramModal from './AddProgramModal';
import ProgramDetailModal from './ProgramDetailModal';
import EditProgramModal from './EditProgramModal';
import DeleteProgramModal from './DeleteProgramModal';
import useResponsive from '../../hooks/useResponsive';
import ProgramTable from './ProgramTable';

const Program = () => {
    const { isSmallScreen, isMediumScreen } = useResponsive();

    // Dữ liệu mẫu cho danh sách chương trình đào tạo
    const [programs, setPrograms] = useState([
        {
            id: 1,
            stt: 1,
            maChuongTrinh: 'CT001',
            tenChuongTrinh: 'Kỹ thuật phần mềm',
            thoiGianDaoTao: '4 năm',
            trangThai: 'Đang triển khai',
            thoiGianTao: '2025-01-15 09:00',
            thoiGianCapNhat: '2025-01-20 14:30'
        },
        {
            id: 2,
            stt: 2,
            maChuongTrinh: 'CT002',
            tenChuongTrinh: 'Công nghệ thực phẩm',
            thoiGianDaoTao: '4 năm',
            trangThai: 'Đang triển khai',
            thoiGianTao: '2025-01-16 10:15',
            thoiGianCapNhat: '2025-01-21 15:00'
        },
        {
            id: 3,
            stt: 3,
            maChuongTrinh: 'CT003',
            tenChuongTrinh: 'Kỹ thuật hệ thống công nghiệp',
            thoiGianDaoTao: '4 năm',
            trangThai: 'Tạm dừng',
            thoiGianTao: '2025-01-17 11:30',
            thoiGianCapNhat: '2025-01-22 09:45'
        },
        {
            id: 4,
            stt: 4,
            maChuongTrinh: 'CT004',
            tenChuongTrinh: 'Công nghệ kỹ thuật điện, điện tử',
            thoiGianDaoTao: '4 năm',
            trangThai: 'Đang triển khai',
            thoiGianTao: '2025-01-18 14:00',
            thoiGianCapNhat: '2025-01-23 13:15'
        },
        {
            id: 5,
            stt: 5,
            maChuongTrinh: 'CT005',
            tenChuongTrinh: 'Quản lý công nghiệp',
            thoiGianDaoTao: '3.5 năm',
            trangThai: 'Đang triển khai',
            thoiGianTao: '2025-01-19 15:30',
            thoiGianCapNhat: '2025-01-24 10:20'
        },
        {
            id: 6,
            stt: 6,
            maChuongTrinh: 'CT006',
            tenChuongTrinh: 'Công nghệ kỹ thuật điều khiển và tự động hóa',
            thoiGianDaoTao: '4 năm',
            trangThai: 'Đang triển khai',
            thoiGianTao: '2025-01-20 09:45',
            thoiGianCapNhat: '2025-01-25 16:10'
        },
        {
            id: 7,
            stt: 7,
            maChuongTrinh: 'CT007',
            tenChuongTrinh: 'Quản lý xây dựng',
            thoiGianDaoTao: '4 năm',
            trangThai: 'Tạm dừng',
            thoiGianTao: '2025-01-21 11:00',
            thoiGianCapNhat: '2025-01-26 13:40'
        },
        {
            id: 8,
            stt: 8,
            maChuongTrinh: 'CT008',
            tenChuongTrinh: 'Khoa học máy tính',
            thoiGianDaoTao: '4 năm',
            trangThai: 'Đang triển khai',
            thoiGianTao: '2025-01-22 14:20',
            thoiGianCapNhat: '2025-01-27 15:55'
        },
        {
            id: 9,
            stt: 9,
            maChuongTrinh: 'CT009',
            tenChuongTrinh: 'Công nghệ kỹ thuật cơ điện tử',
            thoiGianDaoTao: '4 năm',
            trangThai: 'Đang triển khai',
            thoiGianTao: '2025-01-23 08:30',
            thoiGianCapNhat: '2025-01-28 12:10'
        },
        {
            id: 10,
            stt: 10,
            maChuongTrinh: 'CT010',
            tenChuongTrinh: 'Kỹ thuật phần mềm (Chất lượng cao)',
            thoiGianDaoTao: '4.5 năm',
            trangThai: 'Đang triển khai',
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
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [editedProgram, setEditedProgram] = useState(null);
    const [programToDelete, setProgramToDelete] = useState(null);

    // Danh sách trạng thái để lọc
    const statuses = ['Đang triển khai', 'Tạm dừng', 'Kết thúc'];

    // Hàm xử lý khi nhấn nút Thêm chương trình
    const handleAddProgram = () => {
        setOpenAddModal(true);
    };

    // Hàm đóng modal thêm chương trình
    const handleCloseAddModal = () => {
        setOpenAddModal(false);
    };

    // Hàm thêm chương trình mới
    const handleAddNewProgram = (newProgram) => {
        setPrograms((prevPrograms) => {
            const updatedPrograms = [...prevPrograms, { ...newProgram, stt: prevPrograms.length + 1 }];
            return updatedPrograms;
        });
    };

    // Hàm xử lý khi nhấn nút chỉnh sửa
    const handleEditProgram = (id) => {
        const programToEdit = programs.find((p) => p.id === id);
        setEditedProgram(programToEdit);
        setOpenEditModal(true);
    };

    // Hàm đóng modal chỉnh sửa
    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setEditedProgram(null);
    };

    // Hàm lưu thay đổi sau khi chỉnh sửa
    const handleSaveEditedProgram = (updatedProgram) => {
        setPrograms((prevPrograms) =>
            prevPrograms.map((program) =>
                program.id === updatedProgram.id ? { ...program, ...updatedProgram } : program
            )
        );
    };

    // Hàm xử lý thay đổi trang
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Hàm xử lý xem chương trình
    const handleViewProgram = (id) => {
        const program = programs.find((p) => p.id === id);
        setSelectedProgram(program);
        setOpenDetail(true);
    };

    // Hàm xử lý xóa chương trình
    const handleDeleteProgram = (id) => {
        const program = programs.find((p) => p.id === id);
        setProgramToDelete(program);
        setOpenDeleteModal(true);
    };

    // Hàm xác nhận xóa chương trình
    const confirmDeleteProgram = (id) => {
        setPrograms((prevPrograms) => {
            const updatedPrograms = prevPrograms.filter((program) => program.id !== id)
                .map((program, index) => ({ ...program, stt: index + 1 }));
            return updatedPrograms;
        });
        setOpenDeleteModal(false);
        setProgramToDelete(null);
    };

    // Hàm đóng modal chi tiết
    const handleCloseDetail = () => {
        setOpenDetail(false);
        setSelectedProgram(null);
    };

    // Hàm đóng modal xóa
    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setProgramToDelete(null);
    };

    // Lọc danh sách chương trình dựa trên từ khóa tìm kiếm và trạng thái
    const filteredPrograms = programs.filter((program) => {
        const matchesSearchTerm =
            program.maChuongTrinh.toLowerCase().includes(searchTerm.toLowerCase()) ||
            program.tenChuongTrinh.toLowerCase().includes(searchTerm.toLowerCase()) ||
            program.thoiGianDaoTao.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = selectedStatus
            ? program.trangThai === selectedStatus
            : true;

        return matchesSearchTerm && matchesStatus;
    });

    // Tính toán dữ liệu hiển thị trên trang hiện tại
    const displayedPrograms = filteredPrograms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ p: 3, zIndex: 10, height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
            {/* Main Content */}
            <Box sx={{ width: '100%', mb: 3 }}>
                {/* Bảng danh sách chương trình đào tạo */}
                <Card sx={{ flexGrow: 1 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
                            <Typography variant="h6">
                                Danh sách chương trình đào tạo
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {isSmallScreen ? (
                                    <IconButton
                                        color="primary"
                                        onClick={handleAddProgram}
                                        sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}
                                    >
                                        <AddIcon sx={{ color: '#fff' }} />
                                    </IconButton>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<AddIcon />}
                                        onClick={handleAddProgram}
                                        sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}
                                    >
                                        Thêm chương trình
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
                        {filteredPrograms.length === 0 ? (
                            <Typography>Không có chương trình đào tạo nào để hiển thị.</Typography>
                        ) : (
                            <>
                                <ProgramTable
                                    displayedPrograms={displayedPrograms}
                                    isSmallScreen={isSmallScreen}
                                    isMediumScreen={isMediumScreen}
                                    handleViewProgram={handleViewProgram}
                                    handleEditProgram={handleEditProgram}
                                    handleDeleteProgram={handleDeleteProgram}
                                />
                                <TablePagination
                                    component="div"
                                    count={filteredPrograms.length}
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
            <ProgramDetailModal
                open={openDetail}
                onClose={handleCloseDetail}
                program={selectedProgram}
            />
            <AddProgramModal
                open={openAddModal}
                onClose={handleCloseAddModal}
                onAddProgram={handleAddNewProgram}
                existingPrograms={programs}
            />
            <EditProgramModal
                open={openEditModal}
                onClose={handleCloseEditModal}
                program={editedProgram}
                onSave={handleSaveEditedProgram}
            />
            <DeleteProgramModal
                open={openDeleteModal}
                onClose={handleCloseDeleteModal}
                onDelete={confirmDeleteProgram}
                program={programToDelete}
            />
        </Box>
    );
};

export default Program;