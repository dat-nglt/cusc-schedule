import React, { useState } from 'react';
import {
    Box,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Tabs,
    Tab,
    IconButton
} from '@mui/material';
import {
    Book as BookIcon,
    Close as CloseIcon,
    CheckCircle as CheckCircleIcon,
    Block as BlockIcon,
    AccessTime as AccessTimeIcon,
    School as SchoolIcon
} from '@mui/icons-material';
import PropTypes from 'prop-types';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function SubjectDetailsModal({ open, onClose, subjectData }) {
    const [tabValue, setTabValue] = useState(0);

    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <BookIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">Chi tiết học phần</Typography>
                </Box>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Tabs value={tabValue} onChange={handleChangeTab} aria-label="subject tabs">
                    <Tab label="Danh sách học phần" {...a11yProps(0)} />
                    <Tab label="Lịch giảng dạy" {...a11yProps(1)} />
                </Tabs>
                <TabPanel value={tabValue} index={0}>
                    {!subjectData || subjectData.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="body1" color="text.secondary">
                                Chưa có dữ liệu
                            </Typography>
                        </Box>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Mã học phần</TableCell>
                                        <TableCell>Tên học phần</TableCell>
                                        <TableCell>Số tín chỉ</TableCell>
                                        <TableCell>Số tiết</TableCell>
                                        <TableCell>Học kỳ</TableCell>
                                        <TableCell>Trạng thái</TableCell>
                                        <TableCell>Ngày tạo</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {subjectData.map((subject) => (
                                        <TableRow key={subject.subject_id}>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="bold">
                                                    {subject.subject_id}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <SchoolIcon sx={{ width: 20, height: 20, mr: 1, color: 'primary.main' }} />
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {subject.subject_name}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={`${subject.credit} tín chỉ`}
                                                    size="small"
                                                    color="info"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: 'primary.main' }} />
                                                        <Typography variant="caption">
                                                            LT: {subject.theory_hours}h
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: 'secondary.main' }} />
                                                        <Typography variant="caption">
                                                            TH: {subject.practice_hours}h
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={subject.semester_id}
                                                    size="small"
                                                    color="secondary"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={subject.status === 'Hoạt động' ? <CheckCircleIcon /> : <BlockIcon />}
                                                    label={subject.status}
                                                    color={subject.status === 'Hoạt động' ? 'success' : 'error'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {new Date(subject.created_at).toLocaleDateString('vi-VN')}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <Typography variant="body1" paragraph>
                        Lịch giảng dạy của các học phần sẽ được hiển thị tại đây.
                    </Typography>
                </TabPanel>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
}
