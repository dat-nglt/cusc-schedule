import React, { useState } from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    ButtonGroup,
    TextField,
    IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import ViewDayIcon from '@mui/icons-material/ViewDay';
import { useTimetable } from '../../contexts/TimetableContext';

const ScheduleFilterBar = () => {
    const { currentFilter, setCurrentFilter } = useTimetable(); // Giả sử context có quản lý bộ lọc
    const [searchTerm, setSearchTerm] = useState('');

    const handleFilterChange = (event) => {
        setCurrentFilter({
            ...currentFilter,
            [event.target.name]: event.target.value
        });
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        // Có thể thêm debounce để tránh gọi API quá nhiều
        // setCurrentFilter({ ...currentFilter, searchTerm: event.target.value });
    };

    const handleApplySearch = () => {
        setCurrentFilter({ ...currentFilter, searchTerm: searchTerm });
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                alignItems: { xs: 'flex-start', sm: 'center' },
                flexWrap: 'wrap',
                p: 1, // Padding for the paper
            }}
        >
            {/* Search Input */}
            <TextField
                label="Tìm kiếm môn học, lớp, phòng..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyPress={(e) => { if (e.key === 'Enter') handleApplySearch(); }}
                InputProps={{
                    endAdornment: (
                        <IconButton onClick={handleApplySearch} edge="end">
                            <SearchIcon />
                        </IconButton>
                    ),
                }}
                sx={{ minWidth: { xs: '100%', sm: '200px' }, flexGrow: 1 }}
            />

            {/* Semester Filter */}
            <FormControl sx={{ minWidth: { xs: '100%', sm: 150 } }} size="small">
                <InputLabel>Học kỳ</InputLabel>
                <Select
                    name="semester"
                    value={currentFilter?.semester || ''}
                    label="Học kỳ"
                    onChange={handleFilterChange}
                >
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="HK1_2025">Học kỳ 1 (2025)</MenuItem>
                    <MenuItem value="HK2_2025">Học kỳ 2 (2025)</MenuItem>
                    <MenuItem value="HKHE_2025">Học kỳ hè (2025)</MenuItem>
                </Select>
            </FormControl>

            {/* Subject Type Filter */}
            <FormControl sx={{ minWidth: { xs: '100%', sm: 150 } }} size="small">
                <InputLabel>Loại môn</InputLabel>
                <Select
                    name="courseType"
                    value={currentFilter?.courseType || ''}
                    label="Loại môn"
                    onChange={handleFilterChange}
                >
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="Lý thuyết">Lý thuyết</MenuItem>
                    <MenuItem value="Thực hành">Thực hành</MenuItem>
                    <MenuItem value="Seminar">Seminar</MenuItem>
                </Select>
            </FormControl>

            {/* Class Filter - Specific to Lecturer */}
            <FormControl sx={{ minWidth: { xs: '100%', sm: 150 } }} size="small">
                <InputLabel>Lớp</InputLabel>
                <Select
                    name="classFilter"
                    value={currentFilter?.classFilter || ''}
                    label="Lớp"
                    onChange={handleFilterChange}
                >
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="CT01">CT01</MenuItem>
                    <MenuItem value="CT02">CT02</MenuItem>
                    <MenuItem value="CT03">CT03</MenuItem>
                    <MenuItem value="TH01">TH01</MenuItem>
                    <MenuItem value="TH02">TH02</MenuItem>
                </Select>
            </FormControl>

            {/* Status Filter */}
            <FormControl sx={{ minWidth: { xs: '100%', sm: 120 } }} size="small">
                <InputLabel>Trạng thái</InputLabel>
                <Select
                    name="status"
                    value={currentFilter?.status || ''}
                    label="Trạng thái"
                    onChange={handleFilterChange}
                >
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="scheduled">Đã lên lịch</MenuItem>
                    <MenuItem value="completed">Đã hoàn thành</MenuItem>
                    <MenuItem value="cancelled">Đã hủy</MenuItem>
                    <MenuItem value="rescheduled">Đã dời lịch</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
};

export default ScheduleFilterBar;
