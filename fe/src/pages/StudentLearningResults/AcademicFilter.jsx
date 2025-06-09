import React from 'react';
import { Box, TextField, MenuItem, Button, InputAdornment, useTheme, useMediaQuery } from '@mui/material';
import { CalendarToday, FilterList, Book, Print, PictureAsPdf } from '@mui/icons-material';

function AcademicFilter({
    academicYear,
    setAcademicYear,
    semester,
    setSemester,
    onViewResults
}) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: 'background.paper',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid',
            borderColor: 'divider'
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                alignItems: { sm: 'flex-end' }
            }}>
                {/* Năm học */}
                <Box sx={{ flex: 1, minWidth: 160 }}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="Năm học"
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CalendarToday fontSize="small" color="action" />
                                </InputAdornment>
                            ),
                        }}
                    >
                        {['2023-2024', '2022-2023', '2021-2022'].map((year) => (
                            <MenuItem key={year} value={year}>{year}</MenuItem>
                        ))}
                    </TextField>
                </Box>

                {/* Học kỳ */}
                <Box sx={{ flex: 1, minWidth: 160 }}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="Học kỳ"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FilterList fontSize="small" color="action" />
                                </InputAdornment>
                            ),
                        }}
                    >
                        {[
                            { value: '1', label: 'Học kỳ 1' },
                            { value: '2', label: 'Học kỳ 2' },
                            { value: '3', label: 'Học kỳ Hè' }
                        ].map((item) => (
                            <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                        ))}
                    </TextField>
                </Box>
            </Box>

            {/* Action buttons */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'row', sm: 'row' },
                    gap: 2,
                    alignItems: 'center',
                    mt: { xs: 2, sm: 0 },
                    width: '100%',
                    justifyContent: { xs: 'space-between', sm: 'flex-start' },
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    size="medium"
                    onClick={onViewResults}
                    startIcon={!isMobile && <Book fontSize="small" />}
                    sx={{
                        flex: 1,
                        height: 40,
                        minWidth: 100,
                        borderRadius: 1,
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: { xs: '0.85rem', sm: '0.95rem' },
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        boxShadow: 'none',
                        background: 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)',
                        color: '#fff',
                        '&:hover': {
                            boxShadow: 'none',
                            background: 'linear-gradient(90deg, #1565c0 60%, #1976d2 100%)',
                        }
                    }}
                >
                    Xem kết quả
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    size="medium"
                    onClick={onViewResults}
                    startIcon={!isMobile && <Print fontSize="small" />}
                    sx={{
                        flex: 1,
                        height: 40,
                        minWidth: 100,
                        borderRadius: 1,
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: { xs: '0.85rem', sm: '0.95rem' },
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        boxShadow: 'none',
                        background: 'linear-gradient(90deg, #43a047 60%, #66bb6a 100%)',
                        color: '#fff',
                        '&:hover': {
                            boxShadow: 'none',
                            background: 'linear-gradient(90deg, #388e3c 60%, #43a047 100%)',
                        }
                    }}
                >
                    In kết quả
                </Button>
                <Button
                    variant="contained"
                    color="warning"
                    size="medium"
                    onClick={onViewResults}
                    startIcon={!isMobile && <PictureAsPdf fontSize="small" />}
                    sx={{
                        flex: 1,
                        height: 40,
                        minWidth: 100,
                        borderRadius: 1,
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: { xs: '0.85rem', sm: '0.95rem' },
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        boxShadow: 'none',
                        background: 'linear-gradient(90deg, #ffa000 60%, #ffd54f 100%)',
                        color: '#fff',
                        '&:hover': {
                            boxShadow: 'none',
                            background: 'linear-gradient(90deg, #ff8f00 60%, #ffa000 100%)',
                        }
                    }}
                >
                    Xuất PDF
                </Button>
            </Box>
        </Box>
    );
}

export default AcademicFilter;