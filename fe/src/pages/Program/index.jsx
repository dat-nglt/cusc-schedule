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
import AddProgramModal from './AddProgramModal';
import ProgramDetailModal from './ProgramDetailModal';
import EditProgramModal from './EditProgramModal';
import DeleteProgramModal from './DeleteProgramModal';
import useResponsive from '../../hooks/useResponsive';
import ProgramTable from './ProgramTable';
import { getAllPrograms, getProgramById, createProgram, updateProgram, deleteProgram } from '../../api/programAPI';

const Program = () => {
    const { isSmallScreen, isMediumScreen } = useResponsive();

    // Dữ liệu mẫu cho danh sách chương trình đào tạo
    const [programs, setPrograms] = useState([]);
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Danh sách trạng thái để lọc
    const statuses = ['Đang triển khai', 'Tạm dừng', 'Kết thúc'];

    const fetchPrograms = async () => {
        try {
            setLoading(true);
            const response = await getAllPrograms();
            if (!response) {
                console.error("Không có dữ liệu chương trình đào tạo");
                return;
            }
            setPrograms(response.data.data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách chương trình đào tạo:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrograms();
    }, []);

    // Hàm xử lý khi nhấn nút Thêm chương trình
    const handleAddProgram = () => {
        setOpenAddModal(true);
    };

    // Hàm thêm chương trình mới
    const handleAddNewProgram = async (newProgram) => {
        try {
            setLoading(true);
            const response = await createProgram(newProgram);
            if (response && response.data) {
                setMessage("Thêm chương trình đào tạo thành công!");
                fetchPrograms(); // Tải lại danh sách chương trình sau khi thêm thành công
            }
        } catch (error) {
            console.error("Lỗi khi thêm chương trình đào tạo:", error);
            setError("Không thể thêm chương trình đào tạo. Vui lòng kiểm tra lại thông tin.");
        } finally {
            setLoading(false);
        }
    };

    // Hàm đóng modal thêm chương trình
    const handleCloseAddModal = () => {
        setOpenAddModal(false);
    };

    // Hàm xử lý khi nhấn nút chỉnh sửa
    const handleEditProgram = async (id) => {
        try {
            setLoading(true);
            const response = await getProgramById(id);
            if (response && response.data) {
                setEditedProgram(response.data.data);
                setOpenEditModal(true);
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin chương trình đào tạo để chỉnh sửa:", error);
            setError("Không thể lấy thông tin chương trình đào tạo để chỉnh sửa. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    // Hàm đóng modal chỉnh sửa
    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setEditedProgram(null);
    };

    // Hàm lưu thay đổi sau khi chỉnh sửa
    const handleSaveEditedProgram = async (updatedProgram) => {
        try {
            setLoading(true);
            const response = await updateProgram(updatedProgram.program_id, updatedProgram);
            if (response && response.data) {
                setMessage("Cập nhật chương trình đào tạo thành công!");
                fetchPrograms(); // Tải lại danh sách chương trình sau khi cập nhật thành công
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật chương trình đào tạo:", error);
            setError("Không thể cập nhật chương trình đào tạo. Vui lòng kiểm tra lại thông tin.");
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý thay đổi trang
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Hàm xử lý xem chương trình
    const handleViewProgram = async (id) => {
        try {
            setLoading(true);
            const response = await getProgramById(id);
            if (response && response.data) {
                setSelectedProgram(response.data.data);
                setOpenDetail(true);
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin chi tiết chương trình đào tạo:", error);
            setError("Không thể lấy thông tin chi tiết chương trình đào tạo. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý xóa chương trình
    const handleDeleteProgram = (id) => {
        const program = programs.find((p) => p.program_id === id);
        setProgramToDelete(program);
        setOpenDeleteModal(true);
    };

    // Hàm xác nhận xóa chương trình
    const confirmDeleteProgram = async (id) => {
        try {
            setLoading(true);
            const response = await deleteProgram(id);
            if (response) {
                setMessage("Xóa chương trình đào tạo thành công!");
                fetchPrograms(); // Tải lại danh sách chương trình sau khi xóa thành công
            }
        } catch (error) {
            console.error("Lỗi khi xóa chương trình đào tạo:", error);
            setError("Không thể xóa chương trình đào tạo. Vui lòng thử lại.");
        } finally {
            setLoading(false);
            setOpenDeleteModal(false);
            setProgramToDelete(null);
        }
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
            program.program_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            program.program_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            program.training_duration?.toString().toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = selectedStatus
            ? program.status === selectedStatus
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
                                        sx={{
                                            bgcolor: '#1976d2',
                                            '&:hover': { bgcolor: '#115293' },
                                            minWidth: isSmallScreen ? 100 : 150,
                                            height: '56px'
                                        }}
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
                                    loading={loading}
                                    error={error}
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
                error={error}
                loading={loading}
                message={message}
            />
            <EditProgramModal
                open={openEditModal}
                onClose={handleCloseEditModal}
                program={editedProgram}
                onSave={handleSaveEditedProgram}
                error={error}
                loading={loading}
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