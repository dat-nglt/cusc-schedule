
import React, { useState, useEffect } from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    IconButton,
    Tooltip,
    Modal,
    Stack,
    Button,
    Typography,
    Chip // Dùng để hiển thị các bộ lọc đang hoạt động
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear'; // Thêm để xóa ô tìm kiếm
import { useTimetable } from '../../contexts/TimetableContext';

const ScheduleFilterBar = () => {
    const { currentFilter, setCurrentFilter } = useTimetable();

    // State riêng cho ô tìm kiếm
    const [searchTerm, setSearchTerm] = useState(currentFilter?.searchTerm || '');
    // State tạm thời cho các bộ lọc trong Modal
    const [tempSemester, setTempSemester] = useState(currentFilter?.semester || '');
    const [tempCourseType, setTempCourseType] = useState(currentFilter?.courseType || '');

    const [openModal, setOpenModal] = useState(false);

    // Đồng bộ searchTerm khi currentFilter.searchTerm từ context thay đổi bên ngoài
    useEffect(() => {
        setSearchTerm(currentFilter?.searchTerm || '');
    }, [currentFilter?.searchTerm]);

    // Đồng bộ các bộ lọc trong Modal khi currentFilter từ context thay đổi bên ngoài
    useEffect(() => {
        setTempSemester(currentFilter?.semester || '');
        setTempCourseType(currentFilter?.courseType || '');
    }, [currentFilter?.semester, currentFilter?.courseType]);


    // Xử lý tìm kiếm khi nhấn Enter hoặc click icon Search
    const handleSearchSubmit = () => {
        // Chỉ cập nhật searchTerm trong context, giữ nguyên các filter khác
        setCurrentFilter(prev => ({
            ...prev,
            searchTerm: searchTerm.trim() === '' ? undefined : searchTerm.trim()
        }));
    };

    // Xóa nội dung ô tìm kiếm
    const handleClearSearch = () => {
        setSearchTerm('');
        setCurrentFilter(prev => ({
            ...prev,
            searchTerm: undefined
        }));
    };

    // Mở Modal, cập nhật tempFilter với giá trị hiện tại của currentFilter
    const handleModalOpen = () => {
        setTempSemester(currentFilter?.semester || '');
        setTempCourseType(currentFilter?.courseType || '');
        setOpenModal(true);
    };

    // Đóng Modal
    const handleModalClose = () => {
        setOpenModal(false);
    };

    // Xử lý thay đổi trong Modal (cập nhật tempFilter)
    const handleTempFilterChange = (event) => {
        const { name, value } = event.target;
        if (name === 'semester') setTempSemester(value);
        if (name === 'courseType') setTempCourseType(value);
    };

    // Áp dụng các bộ lọc từ Modal vào context
    const applyFilters = () => {
        setCurrentFilter(prev => ({
            ...prev,
            semester: tempSemester === '' ? undefined : tempSemester,
            courseType: tempCourseType === '' ? undefined : tempCourseType
        }));
        setOpenModal(false);
    };

    // Đặt lại tất cả bộ lọc (kể cả tìm kiếm và trong Modal)
    const resetAllFilters = () => {
        setSearchTerm(''); // Xóa ô tìm kiếm
        setTempSemester(''); // Xóa trong Modal
        setTempCourseType(''); // Xóa trong Modal
        setCurrentFilter({}); // Đặt lại toàn bộ context filter
        setOpenModal(false);
    };

    // Lọc các bộ lọc đang hoạt động để hiển thị bằng Chip
    const activeFilters = [];
    if (currentFilter?.searchTerm) {
        activeFilters.push({ name: 'searchTerm', label: `Tìm: "${currentFilter.searchTerm}"` });
    }
    if (currentFilter?.semester) {
        const semesterLabel = {
            "HK1_2024": "Học kỳ 1 - 2024",
            "HK2_2024": "Học kỳ 2 - 2024",
            "HKHE_2025": "Học kỳ hè - 2025",
            // Thêm các kỳ khác nếu có
        }[currentFilter.semester] || currentFilter.semester;
        activeFilters.push({ name: 'semester', label: `Kỳ: ${semesterLabel}` });
    }
    if (currentFilter?.courseType) {
        const courseTypeLabel = {
            "LyThuyet": "Lý thuyết",
            "ThucHanh": "Thực hành",
            "DoAn": "Đồ án",
            // Thêm các loại khác nếu có
        }[currentFilter.courseType] || currentFilter.courseType;
        activeFilters.push({ name: 'courseType', label: `Loại: ${courseTypeLabel}` });
    }

    // Xóa một bộ lọc cụ thể từ Chip
    const handleRemoveFilterChip = (filterName) => {
        if (filterName === 'searchTerm') {
            setSearchTerm('');
            setCurrentFilter(prev => ({ ...prev, searchTerm: undefined }));
        } else if (filterName === 'semester') {
            setCurrentFilter(prev => ({ ...prev, semester: undefined }));
        } else if (filterName === 'courseType') {
            setCurrentFilter(prev => ({ ...prev, courseType: undefined }));
        }
    };


    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column', // Mặc định xếp dọc trên mobile
            gap: 1.5,
            borderRadius: 2,
            width: '100%'
        }}>
            {/* Thanh tìm kiếm và nút lọc */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%' }}>
                <TextField
                    size="small"
                    fullWidth
                    variant="outlined"
                    placeholder="Tìm kiếm môn học, phòng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                    InputProps={{
                        startAdornment: (
                            <IconButton size="small" onClick={handleSearchSubmit}>
                                <SearchIcon fontSize="small" />
                            </IconButton>
                        ),
                        endAdornment: (
                            searchTerm && ( // Chỉ hiện nút xóa khi có nội dung
                                <IconButton size="small" onClick={handleClearSearch}>
                                    <ClearIcon fontSize="small" />
                                </IconButton>
                            )
                        ),
                        sx: { '& .MuiInputBase-input': { py: 0.5 } } // Điều chỉnh padding cho input
                    }}
                />

                <Tooltip title="Bộ lọc nâng cao">
                    <IconButton
                        size="medium" // Tăng kích thước nút Filter
                        onClick={handleModalOpen}
                        // Đổi màu nút nếu có bất kỳ bộ lọc nào đang hoạt động
                        color={currentFilter && Object.keys(currentFilter).some(key => currentFilter[key] !== undefined) ? 'primary' : 'default'}                    >
                        <FilterAltIcon fontSize="medium" />
                    </IconButton>
                </Tooltip>
            </Stack>

            {/* Hiển thị các Chip cho bộ lọc đang hoạt động */}
            {activeFilters.length > 0 && (
                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                }}>
                    {activeFilters.map(filter => (
                        <Chip
                            key={filter.name}
                            label={filter.label}
                            onDelete={() => handleRemoveFilterChip(filter.name)}
                            color="info" // Màu sắc Chip khác để dễ phân biệt
                            variant="outlined"
                            size="small"
                        />
                    ))}
                    <Button
                        onClick={resetAllFilters}
                        size="small"
                        color="error"
                        sx={{ textTransform: 'none', ml: 0.5 }}
                    >
                        Xóa tất cả
                    </Button>
                </Box>
            )}


            {/* Filter Modal */}
            <Modal
                open={openModal}
                onClose={handleModalClose}
                aria-labelledby="filter-modal"
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Box sx={{
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 3,
                    borderRadius: 2, // Bo tròn hơn
                    width: { xs: '90%', sm: 400 },
                    maxHeight: '90vh',
                    overflow: 'auto',
                    outline: 'none', // Bỏ outline khi focus
                }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" component="h2">Bộ lọc nâng cao</Typography>
                        <IconButton onClick={handleModalClose}>
                            <CloseIcon />
                        </IconButton>
                    </Stack>

                    <Stack spacing={2}>
                        {/* Semester Filter */}
                        <FormControl fullWidth size="small">
                            <InputLabel>Kỳ học</InputLabel>
                            <Select
                                name="semester"
                                value={tempSemester}
                                label="Kỳ học"
                                onChange={handleTempFilterChange}
                            >
                                <MenuItem value="">Tất cả kỳ học</MenuItem>
                                <MenuItem value="HK1_2024">Học kỳ 1 (2024-2025)</MenuItem>
                                <MenuItem value="HK2_2024">Học kỳ 2 (2024-2025)</MenuItem>
                                <MenuItem value="HKHE_2025">Học kỳ hè (2025)</MenuItem>
                                <MenuItem value="HK1_2025">Học kỳ 1 (2025-2026)</MenuItem>
                                {/* Thêm các kỳ khác tại đây */}
                            </Select>
                        </FormControl>

                        {/* Course Type Filter */}
                        <FormControl fullWidth size="small">
                            <InputLabel>Loại môn học</InputLabel>
                            <Select
                                name="courseType"
                                value={tempCourseType}
                                label="Loại môn học"
                                onChange={handleTempFilterChange}
                            >
                                <MenuItem value="">Tất cả loại môn</MenuItem>
                                <MenuItem value="LyThuyet">Lý thuyết</MenuItem>
                                <MenuItem value="ThucHanh">Thực hành</MenuItem>
                                <MenuItem value="DoAn">Đồ án</MenuItem>
                                {/* Thêm các loại khác tại đây */}
                            </Select>
                        </FormControl>

                        {/* Action Buttons */}
                        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
                            <Button
                                variant="outlined"
                                onClick={resetAllFilters} // Đặt lại tất cả, bao gồm cả tìm kiếm
                                color="error"
                            >
                                Đặt lại
                            </Button>
                            <Button
                                variant="contained"
                                onClick={applyFilters}
                            >
                                Áp dụng
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Modal>
        </Box>
    );
};

export default ScheduleFilterBar;