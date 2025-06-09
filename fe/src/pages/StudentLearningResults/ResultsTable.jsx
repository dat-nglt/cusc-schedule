import React from 'react';
import { Box, Table, TableHead, TableRow, TableCell, TableBody, Typography, Chip, Paper, Grid } from '@mui/material';

// Tiêu đề bảng được định nghĩa ở đây để tái sử dụng
const tableHeaders = [
    { label: 'Mã HP', align: 'left', width: '10%' },
    { label: 'Tên Học Phần', align: 'left', width: '30%' },
    { label: 'TC', align: 'center', width: '8%' },
    { label: 'Giữa Kỳ', align: 'center', width: '12%' },
    { label: 'Cuối Kỳ', align: 'center', width: '12%' },
    { label: 'Điểm TB', align: 'center', width: '12%' },
    { label: 'Kết Quả', align: 'center', width: '16%' }
];

function ResultsTable({ data = [] }) {
    // Hàm render một mục chi tiết cho giao diện mobile
    const renderMobileDetailItem = (label, value, sx = {}) => (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">{label}:</Typography>
            <Typography variant="body2" sx={sx}>{value}</Typography>
        </Box>
    );

    return (
        <Box>
            {/* === GIAO DIỆN DESKTOP: BẢNG === */}
            {/* Ẩn trên màn hình nhỏ (xs, sm) và hiển thị trên màn hình vừa (md) trở lên */}
            <Box sx={{
                display: { xs: 'none', md: 'block' }, // Điểm mấu chốt của responsive
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
            }}>
                <Table sx={{ minWidth: 650 }} aria-label="student results desktop">
                    <TableHead sx={{ bgcolor: 'primary.main' }}>
                        <TableRow>
                            {tableHeaders.map((header) => (
                                <TableCell
                                    key={header.label}
                                    align={header.align}
                                    sx={{
                                        width: header.width,
                                        color: 'common.white',
                                        fontWeight: 600,
                                        py: 1.5,
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    {header.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow
                                key={row.code}
                                sx={{
                                    '&:nth-of-type(even)': { bgcolor: 'action.hover' },
                                    '&:hover': { bgcolor: 'primary.lighter' }
                                }}
                            >
                                <TableCell sx={{ py: 1.5, fontSize: '0.875rem' }}>{row.code}</TableCell>
                                <TableCell sx={{ py: 1.5, fontSize: '0.875rem' }}>{row.name}</TableCell>
                                <TableCell align="center" sx={{ py: 1.5, fontSize: '0.875rem' }}>{row.credit}</TableCell>
                                <TableCell align="center" sx={{ py: 1.5, fontSize: '0.875rem' }}>{row.midterm}</TableCell>
                                <TableCell align="center" sx={{ py: 1.5, fontSize: '0.875rem' }}>{row.final}</TableCell>
                                <TableCell
                                    align="center"
                                    sx={{
                                        py: 1.5,
                                        fontWeight: 600,
                                        color: row.average >= 5 ? 'success.main' : 'error.main',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    {row.average}
                                </TableCell>
                                <TableCell align="center" sx={{ py: 1.5 }}>
                                    <Chip
                                        label={row.status}
                                        size="small"
                                        sx={{
                                            fontWeight: 500,
                                            minWidth: 70,
                                            backgroundColor: row.status === 'Đạt' ? 'success.light' : 'error.light',
                                            color: row.status === 'Đạt' ? 'success.dark' : 'error.dark'
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>

            {/* === GIAO DIỆN MOBILE: DANH SÁCH THẺ === */}
            {/* Hiển thị trên màn hình nhỏ (xs, sm) và ẩn trên màn hình vừa (md) trở lên */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                {data.map((row) => (
                    <Paper
                        key={row.code}
                        elevation={2}
                        sx={{
                            p: 2,
                            mb: 2,
                            borderRadius: 2,
                            borderLeft: 5,
                            borderColor: row.status === 'Đạt' ? 'success.main' : 'error.main'
                        }}
                    >
                        {/* Phần đầu của thẻ: Tên học phần và Trạng thái */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                            <Typography variant="subtitle1" component="div" sx={{ fontWeight: 600, pr: 1 }}>
                                {row.name}
                            </Typography>
                            <Chip
                                label={row.status}
                                size="small"
                                sx={{
                                    fontWeight: 500,
                                    minWidth: 70,
                                    backgroundColor: row.status === 'Đạt' ? 'success.light' : 'error.light',
                                    color: row.status === 'Đạt' ? 'success.dark' : 'error.dark'
                                }}
                            />
                        </Box>
                        
                        {/* Phần thân của thẻ: Các chi tiết khác */}
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                {renderMobileDetailItem('Mã HP', row.code)}
                            </Grid>
                             <Grid item xs={6}>
                                {renderMobileDetailItem('Số TC', row.credit, { fontWeight: 500 })}
                            </Grid>
                            <Grid item xs={6}>
                                {renderMobileDetailItem('Giữa kỳ', row.midterm)}
                            </Grid>
                             <Grid item xs={6}>
                                {renderMobileDetailItem('Cuối kỳ', row.final)}
                            </Grid>
                             <Grid item xs={12}>
                                {renderMobileDetailItem('Điểm TB', row.average, { 
                                     fontWeight: 600,
                                     fontSize: '1rem',
                                     color: row.average >= 5 ? 'success.main' : 'error.main'
                                })}
                            </Grid>
                        </Grid>
                    </Paper>
                ))}
            </Box>

            {/* === THÔNG BÁO KHÔNG CÓ DỮ LIỆU === */}
            {/* Phần này được giữ nguyên vì nó hoạt động cho cả hai giao diện */}
            {data.length === 0 && (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    py: 4,
                    bgcolor: 'background.default',
                    border: '1px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                }}>
                    <Typography color="text.secondary">Không có dữ liệu kết quả học tập</Typography>
                </Box>
            )}
        </Box>
    );
}

export default ResultsTable;