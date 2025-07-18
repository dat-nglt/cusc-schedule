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
    Avatar,
    Tabs,
    Tab,
    IconButton
} from '@mui/material';
import {
    People as PeopleIcon,
    Close as CloseIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    CheckCircle as CheckCircleIcon,
    Block as BlockIcon
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

function TeacherDetailsModal({ open, onClose, lecturerData }) {
    const [tabValue, setTabValue] = useState(0);

    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PeopleIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">Chi tiết giảng viên</Typography>
                </Box>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Tabs value={tabValue} onChange={handleChangeTab} aria-label="teacher tabs">
                    <Tab label="Danh sách giảng viên" {...a11yProps(0)} />
                    <Tab label="Lịch giảng dạy" {...a11yProps(1)} />
                </Tabs>
                <TabPanel value={tabValue} index={0}>
                    {!lecturerData || lecturerData.length === 0 ? (
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
                                        <TableCell>Mã GV</TableCell>
                                        <TableCell>Họ và tên</TableCell>
                                        <TableCell>Bộ môn/Khoa</TableCell>
                                        <TableCell>Môn giảng dạy</TableCell>
                                        <TableCell>Liên hệ</TableCell>
                                        <TableCell>Trạng thái</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {lecturerData.map((lecturer) => (
                                        <TableRow key={lecturer.lecturer_id}>
                                            <TableCell>{lecturer.lecturer_id}</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                                                        {lecturer.name.charAt(0)}
                                                    </Avatar>
                                                    {lecturer.name}
                                                </Box>
                                            </TableCell>
                                            <TableCell>{lecturer.department}</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {lecturer.subjects.slice(0, 3).map(subject => (
                                                        <Chip key={subject.subject_id} label={subject.subject_name} size="small" />
                                                    ))}
                                                    {lecturer.subjects.length > 3 && (
                                                        <Chip
                                                            label={`+${lecturer.subjects.length - 3}`}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <EmailIcon fontSize="small" sx={{ mr: 0.5 }} />
                                                        <Typography variant="body2">{lecturer.account?.email || 'N/A'}</Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <PhoneIcon fontSize="small" sx={{ mr: 0.5 }} />
                                                        <Typography variant="body2">{lecturer.phone_number || 'N/A'}</Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={lecturer.status === 'Đang công tác' ? <CheckCircleIcon /> : <BlockIcon />}
                                                    label={lecturer.status}
                                                    color={lecturer.status === 'Đang công tác' ? 'success' : 'error'}
                                                    size="small"
                                                />
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
                        Lịch giảng dạy của các giảng viên sẽ được hiển thị tại đây.
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
};

export default TeacherDetailsModal;