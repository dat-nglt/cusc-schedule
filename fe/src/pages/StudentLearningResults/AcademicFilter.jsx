import React, { useState } from 'react';
import {
    Box,
    TextField,
    MenuItem,
    Button,
    InputAdornment,
    useTheme,
    useMediaQuery,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    IconButton,
    Grid, // Import IconButton to add a close button
} from '@mui/material';
import {
    CalendarToday,
    FilterAlt,
    Search,
    Print,
    PictureAsPdf,
    FilterList,
    Close, // Import Close icon for the modal
} from '@mui/icons-material';

const AcademicFilterAndActions = ({ academicYear, setAcademicYear, semester, setSemester, onViewResults }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [openFilterModal, setOpenFilterModal] = useState(false);
    const [tempAcademicYear, setTempAcademicYear] = useState(academicYear);
    const [tempSemester, setTempSemester] = useState(semester);

    const academicYears = ['2023-2024', '2022-2023', '2021-2022'];
    const semesters = [
        { value: '1', label: 'Học kỳ 1' },
        { value: '2', label: 'Học kỳ 2' },
        { value: '3', label: 'Học kỳ Hè' }
    ];

    const handleOpenFilterModal = () => {
        setTempAcademicYear(academicYear);
        setTempSemester(semester);
        setOpenFilterModal(true);
    };

    const handleCloseFilterModal = () => {
        setOpenFilterModal(false);
    };

    const handleApplyFilters = () => {
        setAcademicYear(tempAcademicYear);
        setSemester(tempSemester);
        handleCloseFilterModal();
        // onViewResults(); // Uncomment if you want to trigger view results after applying filters
    };

    return (
        <Box
            sx={{
                borderRadius: '8px',
                border: `1px solid ${theme.palette.divider}`,
                p: isMobile ? 1.5 : 2,
                backgroundColor: theme.palette.background.paper,
            }}
        >
            <Stack
                direction="row"
                spacing={isMobile ? 1 : 2}
                alignItems="center"
                justifyContent="space-between"
            >
                {/* Filter Button to open Modal */}
                <Button
                    variant="outlined"
                    size="medium"
                    onClick={handleOpenFilterModal}
                    startIcon={<FilterList />}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        borderRadius: '6px',
                        py: 0.8,
                        flexShrink: 0,
                        px: isMobile ? 1.5 : 2,
                    }}
                >
                    {isMobile ? 'Lọc' : 'Bộ lọc'}
                </Button>

                {/* Main Action Buttons */}
                <Stack
                    direction="row"
                    spacing={isMobile ? 0.5 : 1}
                    alignItems="center"
                    sx={{ flexGrow: 1, justifyContent: 'flex-end' }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        size="medium"
                        onClick={onViewResults}
                        startIcon={<Search fontSize="small" />}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: '6px',
                            boxShadow: 'none',
                            background: theme.palette.primary.main,
                            '&:hover': { background: theme.palette.primary.dark, boxShadow: 'none' },
                            py: 0.8,
                            whiteSpace: 'nowrap',
                            minWidth: isMobile ? 'auto' : '80px',
                            px: isMobile ? 1.2 : 1.5
                        }}
                    >
                        {isMobile ? 'Xem' : 'Xem kết quả'}
                    </Button>

                    <Button
                        variant="outlined"
                        color="primary"
                        size="medium"
                        onClick={onViewResults}
                        startIcon={<Print fontSize="small" />}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: '6px',
                            py: 0.8,
                            minWidth: 'auto',
                            px: isMobile ? 1.2 : 1.5,
                        }}
                    >
                        {isMobile ? 'In' : 'In kết quả'}
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        size="medium"
                        onClick={onViewResults}
                        startIcon={<PictureAsPdf fontSize="small" />}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: '6px',
                            py: 0.8,
                            minWidth: 'auto',
                            px: isMobile ? 1.2 : 1.5,
                        }}
                    >
                        {isMobile ? 'PDF' : 'Xuất PDF'}
                    </Button>
                </Stack>
            </Stack>

            {/* Filter Modal - Tối giản hóa */}
            <Dialog
                open={openFilterModal}
                onClose={handleCloseFilterModal}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 1, // Vẫn giữ bo góc nhẹ nhàng
                        background: 'rgba(255, 255, 255, 0.95)', // Nền gần trắng, hơi trong suốt
                        backdropFilter: 'blur(8px)', // Giảm mức độ blur để nhẹ hơn
                        boxShadow: 'none', // Hoàn toàn không bóng đổ
                        border: `1px solid ${theme.palette.divider}`, // Đường viền mỏng để định hình
                        overflow: 'hidden',
                    },
                }}
            >
                {/* Header - Cực kỳ tối giản */}
                <Box
                    sx={{
                        display: 'flex', // Sử dụng flexbox thay vì Grid để gọn hơn
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 1.5, // Giảm padding dọc
                        px: 2, // Giảm padding ngang
                        borderBottom: `1px solid ${theme.palette.divider}`, // Đường kẻ mỏng
                        // Loại bỏ gradient và hiệu ứng ánh sáng để tối giản tuyệt đối
                        // Đảm bảo màu chữ mặc định của theme
                    }}
                >
                    <Typography
                        variant="h6" // Giữ h6 cho tiêu đề, nhưng có thể cân nhắc body1 nếu muốn nhỏ hơn
                        component="span"
                        fontWeight={600}
                        sx={{
                            color: theme.palette.text.primary, // Màu chữ mặc định
                            letterSpacing: 'normal', // Bỏ letterSpacing nếu muốn tinh tế hơn
                        }}
                    >
                        Bộ lọc
                    </Typography>
                    <IconButton
                        onClick={handleCloseFilterModal}
                        size="small" // Kích thước nhỏ
                        sx={{
                            color: theme.palette.action.active, // Màu icon tinh tế
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover, // Hover nhẹ nhàng
                            },
                            p: 0.5, // Padding nhỏ cho icon
                        }}
                    >
                        <Close fontSize="small" />
                    </IconButton>
                </Box>

                {/* Content - Tập trung vào input */}
                <DialogContent sx={{ px: 2.5, py: 2.5 }}> {/* Điều chỉnh padding */}
                    <Stack spacing={2}> {/* Khoảng cách giữa các trường */}
                        {/* Năm học Field */}
                        <Box>
                            {/* Loại bỏ Typography cho label riêng, dùng label của TextField */}
                            <TextField
                                select
                                fullWidth
                                size="small"
                                label="Năm học" // Dùng label của TextField
                                value={tempAcademicYear}
                                onChange={(e) => setTempAcademicYear(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ mr: 0.5 }}> {/* Giảm mr */}
                                            <CalendarToday fontSize="small" color="action" />
                                        </InputAdornment>
                                    ),
                                    // Bỏ OutlinedInput nếu muốn input không có viền rõ ràng, hoặc giữ để dễ nhìn
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px', // Bo góc
                                        // Loại bỏ borderColor mặc định nếu muốn phẳng hơn
                                        // '& fieldset': { borderColor: 'transparent' }, // Ví dụ làm viền trong suốt
                                        // '&:hover fieldset': { borderColor: theme.palette.divider },
                                    },
                                }}
                            >
                                {academicYears.map((year) => (
                                    <MenuItem key={year} value={year}>
                                        <Typography variant="body2">{year}</Typography>
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>

                        {/* Học kỳ Field */}
                        <Box>
                            {/* Loại bỏ Typography cho label riêng */}
                            <TextField
                                select
                                fullWidth
                                size="small"
                                label="Học kỳ" // Dùng label của TextField
                                value={tempSemester}
                                onChange={(e) => setTempSemester(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ mr: 0.5 }}> {/* Giảm mr */}
                                            <FilterAlt fontSize="small" color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px', // Bo góc
                                    },
                                }}
                            >
                                {semesters.map((item) => (
                                    <MenuItem key={item.value} value={item.value}>
                                        <Typography variant="body2">{item.label}</Typography>
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                    </Stack>
                </DialogContent>

                {/* Actions - Cực kỳ tối giản */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end', // Căn phải
                        gap: 1, // Giảm khoảng cách giữa các nút
                        px: 2, // Giảm padding ngang
                        py: 1.5, // Giảm padding dọc
                        borderTop: `1px solid ${theme.palette.divider}`, // Đường kẻ mỏng
                        // Loại bỏ màu nền đặc biệt
                        // background: 'rgba(255, 255, 255, 0.7)', // Nếu muốn hiệu ứng trong suốt
                    }}
                >
                    <Button
                        onClick={handleCloseFilterModal}
                        variant="text" // Nút text để cực kỳ nhẹ nhàng
                        sx={{
                            fontWeight: 500,
                            color: theme.palette.text.secondary, // Màu xám tinh tế
                            borderRadius: '6px', // Bo góc
                            px: 1.5,
                            py: 0.7,
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover, // Hover nhẹ
                            }
                        }}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleApplyFilters}
                        variant="contained"
                        disableElevation // Đảm bảo không có bóng đổ
                        size="small" // Kích thước nhỏ
                        sx={{
                            fontWeight: 600,
                            borderRadius: '6px',
                            // Dùng màu primary mặc định thay vì gradient để đơn giản
                            background: theme.palette.primary.main,
                            '&:hover': {
                                background: theme.palette.primary.dark,
                            },
                            px: 2,
                            py: 0.7,
                        }}
                    >
                        Áp dụng
                    </Button>
                </Box>
            </Dialog>
        </Box>
    );
};

export default AcademicFilterAndActions;