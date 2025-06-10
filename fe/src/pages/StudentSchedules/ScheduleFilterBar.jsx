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

    // const handleViewModeChange = (mode) => {
    //     setCurrentFilter({ ...currentFilter, viewMode: mode });
    // };

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
                label="Tìm kiếm môn học, phòng..."
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
                <InputLabel>Kỳ học</InputLabel>
                <Select
                    name="semester"
                    value={currentFilter?.semester || ''}
                    label="Kỳ học"
                    onChange={handleFilterChange}
                >
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="HK1_2024">Học kỳ 1 (2024)</MenuItem>
                    <MenuItem value="HK2_2024">Học kỳ 2 (2024)</MenuItem>
                    <MenuItem value="HKHE_2025">Học kỳ hè (2025)</MenuItem>
                </Select>
            </FormControl>

            {/* Course Type Filter */}
            <FormControl sx={{ minWidth: { xs: '100%', sm: 150 } }} size="small">
                <InputLabel>Loại môn</InputLabel>
                <Select
                    name="courseType"
                    value={currentFilter?.courseType || ''}
                    label="Loại môn"
                    onChange={handleFilterChange}
                >
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="LyThuyet">Lý thuyết</MenuItem>
                    <MenuItem value="ThucHanh">Thực hành</MenuItem>
                    <MenuItem value="DoAn">Đồ án</MenuItem>
                </Select>
            </FormControl>

            {/* View Mode Buttons (Optional, if you have day/month views) */}
            {/* <ButtonGroup variant="outlined" aria-label="view mode">
                <Button
                    startIcon={<ViewWeekIcon />}
                    onClick={() => handleViewModeChange('week')}
                    variant={currentFilter?.viewMode === 'week' ? 'contained' : 'outlined'}
                >
                    Tuần
                </Button>
                <Button
                    startIcon={<ViewDayIcon />}
                    onClick={() => handleViewModeChange('day')}
                    variant={currentFilter?.viewMode === 'day' ? 'contained' : 'outlined'}
                >
                    Ngày
                </Button>
                <Button
                    startIcon={<EventNoteIcon />}
                    onClick={() => handleViewModeChange('month')}
                    variant={currentFilter?.viewMode === 'month' ? 'contained' : 'outlined'}
                >
                    Tháng
                </Button>
            </ButtonGroup> */}
        </Box>
    );
};

export default ScheduleFilterBar;