import React from 'react';
import {
    Box, Typography, Chip, Grid, Divider, LinearProgress,
    Accordion, AccordionSummary, AccordionDetails, Paper
} from '@mui/material';
import { Assessment, CompareArrows, TrendingFlat, ExpandMore } from '@mui/icons-material';

// Đặt các component phụ và hàm helper ở ngoài function chính để tránh redeclare
const getRankingColor = (ranking) => {
    switch (ranking) {
        case 'Xuất sắc': return { background: '#e8f5e9', color: '#2e7d32' };
        case 'Giỏi': return { background: '#e3f2fd', color: '#1565c0' };
        case 'Khá': return { background: '#fff8e1', color: '#ff8f00' };
        default: return { background: '#f5f5f5', color: '#424242' };
    }
};

const StatCardSimple = ({ label, value, unit }) => (
    <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'background.default', textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{label}</Typography>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {value} <Typography component="span" variant="caption">{unit}</Typography>
        </Typography>
    </Box>
);

const ComparisonCard = ({ subject, isMobile = false }) => (
    <Box sx={{
        minWidth: isMobile ? 'auto' : 240,
        flex: isMobile ? 'auto' : 1,
        p: 2,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.default'
    }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, textAlign: 'center' }}>{subject.name}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>{subject.credits} tín chỉ</Typography>
        <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}><Typography variant="body2">Cá nhân</Typography><Typography variant="body2" fontWeight={500}>{subject.studentScore.toFixed(1)}</Typography></Box>
            <LinearProgress variant="determinate" value={(subject.studentScore / 10) * 100} color="primary" sx={{ height: 8, borderRadius: 4 }} />
        </Box>
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}><Typography variant="body2">Trung bình Lớp</Typography><Typography variant="body2" fontWeight={500}>{subject.classAverage.toFixed(1)}</Typography></Box>
            <LinearProgress variant="determinate" value={(subject.classAverage / 10) * 100} color="secondary" sx={{ height: 8, borderRadius: 4, backgroundColor: (theme) => theme.palette.grey[300], '& .MuiLinearProgress-bar': { backgroundColor: (theme) => theme.palette.secondary.light } }} />
        </Box>
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed', borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
            <Chip size="small" icon={<TrendingFlat sx={{ transform: subject.studentScore >= subject.classAverage ? 'none' : 'scaleX(-1)', color: subject.studentScore >= subject.classAverage ? 'success.main' : 'error.main' }} />} label={`${Math.abs(subject.studentScore - subject.classAverage).toFixed(1)} điểm ${subject.studentScore >= subject.classAverage ? 'cao hơn' : 'thấp hơn'}`} sx={{ backgroundColor: subject.studentScore >= subject.classAverage ? 'success.light' : 'error.light', color: subject.studentScore >= subject.classAverage ? 'success.dark' : 'error.dark', fontWeight: 500 }} />
        </Box>
    </Box>
);

function PerformanceComparison({ studentStats, classAverages }) {
    // Desktop
    const DesktopView = (
        <Grid container spacing={1} alignItems="stretch">
            <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
                <Box sx={{
                    p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper', height: '100%', display: 'flex', flexDirection: 'column', flex: 1
                }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                        <Assessment sx={{ mr: 1, color: 'primary.main' }} /> Thống Kê Học Tập
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', backgroundColor: 'primary.lighter', borderRadius: 2, py: 3, px: 2, mb: 2 }}>
                        <Typography variant="body2" color="primary.dark" sx={{ mb: 1 }}>Điểm TB Tích Lũy</Typography>
                        <Typography variant="h2" component="div" sx={{ fontWeight: 700, color: 'primary.main', lineHeight: 1.1 }}>{studentStats.gpa}</Typography>
                        <Chip label={studentStats.ranking} size="small" sx={{ mt: 1.5, fontWeight: 500, backgroundColor: getRankingColor(studentStats.ranking).background, color: getRankingColor(studentStats.ranking).color, border: '1px solid', borderColor: getRankingColor(studentStats.ranking).color }} />
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={6}><StatCardSimple label="Số học phần" value={studentStats.coursesTaken} unit="môn" /></Grid>
                        <Grid item xs={6}><StatCardSimple label="Tín chỉ tích lũy" value={`${studentStats.creditsCompleted}/${studentStats.creditsTotal}`} unit="TC" /></Grid>
                    </Grid>
                </Box>
            </Grid>
            <Grid item xs={12} md={8} sx={{ display: 'flex', flex: 1 }}>
                <Box sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper', height: '100%', flex: 1 }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                        <CompareArrows sx={{ mr: 1, color: 'secondary.main' }} /> So Sánh Kết Quả Học Tập
                    </Typography>
                    <Box sx={{ display: 'flex', overflowX: 'auto', pb: 2, gap: 3, '&::-webkit-scrollbar': { height: 8 }, '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' }, '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 4 } }}>
                        {classAverages.map((subject, index) => (
                            <ComparisonCard key={index} subject={subject} />
                        ))}
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
    // Mobile
    const MobileView = (
        <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
            <Grid item xs={12} md={4}>
                <Box sx={{
                    p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper', height: '100%', display: 'flex', flexDirection: 'column'
                }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                        <Assessment sx={{ mr: 1, color: 'primary.main' }} /> Thống Kê Học Tập
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', backgroundColor: 'primary.lighter', borderRadius: 2, py: 3, px: 2, mb: 2 }}>
                        <Typography variant="body2" color="primary.dark" sx={{ mb: 1 }}>Điểm TB Tích Lũy</Typography>
                        <Typography variant="h2" component="div" sx={{ fontWeight: 700, color: 'primary.main', lineHeight: 1.1 }}>{studentStats.gpa}</Typography>
                        <Chip label={studentStats.ranking} size="small" sx={{ mt: 1.5, fontWeight: 500, backgroundColor: getRankingColor(studentStats.ranking).background, color: getRankingColor(studentStats.ranking).color, border: '1px solid', borderColor: getRankingColor(studentStats.ranking).color }} />
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={6}><StatCardSimple label="Số học phần" value={studentStats.coursesTaken} unit="môn" /></Grid>
                        <Grid item xs={6}><StatCardSimple label="Tín chỉ tích lũy" value={`${studentStats.creditsCompleted}/${studentStats.creditsTotal}`} unit="TC" /></Grid>
                    </Grid>
                </Box>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Accordion elevation={0} sx={{ '&.MuiAccordion-root:before': { display: 'none' }, backgroundColor: 'transparent' }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                        <CompareArrows sx={{ mr: 1, color: 'secondary.main' }} /> Chi tiết So sánh với Lớp
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {classAverages.map((subject, index) => (
                            <ComparisonCard key={index} subject={subject} isMobile={true} />
                        ))}
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Paper>
    );
    return (
        <Box>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>{DesktopView}</Box>
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>{MobileView}</Box>
        </Box>
    );
}

export default PerformanceComparison;