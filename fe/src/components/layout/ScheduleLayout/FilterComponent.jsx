import React, { useState, useEffect, useContext } from 'react';
import {
    Paper,
    Box,
    Typography,
    FormControl,
    Select,
    MenuItem,
    alpha,
    Chip,
    InputLabel,
    OutlinedInput
} from '@mui/material';
import FilterIcon from '@mui/icons-material/FilterList';
import { useTheme } from '@mui/material/styles';
import { ScheduleContext } from '../../../contexts/ScheduleContext';
import { getClassesAPI } from '../../../api/classAPI';
import { getAllLecturersAPI } from '../../../api/lecturerAPI';
import { getAllRoomAPI } from '../../../api/roomAPI';

const FilterComponent = () => {
    const { setFilterOption, setFilterValue } = useContext(ScheduleContext);
    const theme = useTheme();
    const [filterType, setFilterType] = useState('classes');

    // Dữ liệu mẫu - trong thực tế sẽ lấy từ API ho props
    const [lecturers, setLecturers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [selectedItem, setSelectedItem] = useState('');

    const fetchLecturers = async () => {
        try {
            const response = await getAllLecturersAPI();
            if (response.success === true) {
                setLecturers(
                    response.data.lecturers.map(lecturer => ({
                        id: lecturer.lecturer_id,
                        name: lecturer.name
                    }))
                );
            }

        } catch (error) {
            console.error('Lỗi khi lấy danh sách giảng viên:', error);
        }
    }
    const fetchClasses = async () => {
        try {
            const response = await getClassesAPI();
            if (response.success === true) {
                setClasses(
                    response.data.map(classes => ({
                        id: classes.class_id,
                        name: classes.class_name
                    }))
                );
            }

        } catch (error) {
            console.error('Lỗi khi lấy danh sách lớp:', error);
        }
    }

    const fetchRooms = async () => {
        try {
            const response = await getAllRoomAPI();
            if (response.success === true) {
                // Map dữ liệu phòng học về dạng { id, name }
                setRooms(
                    response.data.map(room => ({
                        id: room.room_id,
                        name: room.room_name
                    }))
                );
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách lớp:', error);
        }
    }
    // Giả lập dữ liệu (trong thực tế sẽ fetch từ API)
    useEffect(() => {
        fetchLecturers();
        fetchClasses();
        fetchRooms();
    }, []);
    useEffect(() => {
        if (classes.length > 0) {
            setSelectedItem(classes[0].id);
            setFilterValue(classes[0].id);
        }
    }, [classes]);

    const handleFilterTypeChange = (event) => {
        const newFilterType = event.target.value;
        setFilterOption(newFilterType);
        setFilterType(newFilterType);
        setSelectedItem(''); // Reset selected item khi thay đổi loại filter
        setFilterValue(''); // Reset filter value trong context
    };

    const handleItemChange = (event) => {
        const value = event.target.value;
        setSelectedItem(value);
        setFilterValue(null);
        setFilterValue(value);
    };

    const getAvailableItems = () => {
        switch (filterType) {
            case 'lecturers':
                return lecturers;
            case 'classes':
                return classes;
            case 'rooms':
                return rooms;
            default:
                return [];
        }
    };

    const getLabel = () => {
        switch (filterType) {
            case 'lecturers':
                return 'Giảng viên';
            case 'classes':
                return 'Lớp học';
            case 'rooms':
                return 'Phòng học';
            default:
                return '';
        }
    };

    const handleClearFilter = () => {
        setSelectedItem('');
        setFilterValue('');
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                borderRadius: '12px',
                bgcolor: 'background.paper',
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)'
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <FilterIcon
                    fontSize="small"
                    sx={{
                        color: theme.palette.primary.main,
                        mr: 1
                    }}
                />
                <Typography
                    variant="subtitle1"
                    fontWeight="600"
                    color="text.primary"
                >
                    Bộ lọc dữ liệu
                </Typography>
            </Box>

            {/* Filter type selection */}
            <FormControl fullWidth sx={{ mb: filterType !== 'all' ? 2 : 0 }}>
                <InputLabel id="filter-type-label">Loại lọc</InputLabel>
                <Select
                    labelId="filter-type-label"
                    value={filterType}
                    onChange={handleFilterTypeChange}
                    label="Loại lọc"
                    size="small"
                    sx={{
                        bgcolor: 'background.paper',
                        borderRadius: '8px',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.divider,
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.light,
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                            borderWidth: '1px',
                        },
                        '& .MuiSelect-select': {
                            py: 1.25,
                            pl: 1.5,
                        }
                    }}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                mt: 1,
                                borderRadius: '8px',
                                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                                '& .MuiMenuItem-root': {
                                    px: 2,
                                    py: 1,
                                    fontSize: '0.875rem',
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                    },
                                    '&.Mui-selected': {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.16),
                                        '&:hover': {
                                            backgroundColor: alpha(theme.palette.primary.main, 0.24),
                                        }
                                    }
                                }
                            }
                        }
                    }}
                >
                    <MenuItem
                        value="classes"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            '&:before': {
                                content: '""',
                                display: 'inline-block',
                                width: 12,
                                height: 12,
                                borderRadius: '2px',
                                backgroundColor: theme.palette.secondary.main,
                                mr: 1.5
                            }
                        }}
                    >
                        Theo lớp học
                    </MenuItem>
                    <MenuItem
                        value="lecturers"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            '&:before': {
                                content: '""',
                                display: 'inline-block',
                                width: 12,
                                height: 12,
                                borderRadius: '2px',
                                backgroundColor: theme.palette.info.main,
                                mr: 1.5
                            }
                        }}
                    >
                        Theo giảng viên
                    </MenuItem>
                    <MenuItem
                        value="rooms"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            '&:before': {
                                content: '""',
                                display: 'inline-block',
                                width: 12,
                                height: 12,
                                borderRadius: '2px',
                                backgroundColor: theme.palette.warning.main,
                                mr: 1.5
                            }
                        }}
                    >
                        Theo phòng học
                    </MenuItem>
                </Select>
            </FormControl>

            {/* Dynamic item selection based on filter type */}
            {filterType !== 'all' && (
                <FormControl fullWidth>
                    <InputLabel id="items-select-label">{getLabel()}</InputLabel>
                    <Select
                        labelId="items-select-label"
                        value={selectedItem}
                        onChange={handleItemChange}
                        input={<OutlinedInput label={getLabel()} />}
                        renderValue={(selected) => {
                            if (!selected) return <em>Chọn {getLabel().toLowerCase()}...</em>;

                            const item = getAvailableItems().find(item => item.id === selected);
                            return (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Chip
                                        label={item?.name || selected}
                                        size="small"
                                        onDelete={handleClearFilter}
                                        sx={{
                                            backgroundColor: alpha(theme.palette.primary.main, 0.12),
                                            color: theme.palette.primary.dark,
                                        }}
                                    />
                                </Box>
                            );
                        }}
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    maxHeight: 300,
                                    mt: 1,
                                    borderRadius: '8px',
                                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                                }
                            }
                        }}
                    >
                        <MenuItem value="">
                            <em>Không chọn</em>
                        </MenuItem>
                        {getAvailableItems().map((item) => (
                            <MenuItem
                                key={item.id}
                                value={item.id}
                                sx={{
                                    py: 1,
                                    '&.Mui-selected': {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.12),
                                    }
                                }}
                            >
                                {item.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
        </Paper>
    );
};

export default FilterComponent;