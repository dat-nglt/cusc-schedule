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
    Tabs,
    Tab,
    IconButton
} from '@mui/material';
import {
    School as SchoolIcon,
    Close as CloseIcon,
    Person as PersonIcon,
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

function ClassDetailsModal({ open, onClose, classes }) {
    const [tabValue, setTabValue] = useState(0);

    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SchoolIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">Chi tiết lớp học</Typography>
                </Box>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Tabs value={tabValue} onChange={handleChangeTab} aria-label="class tabs">
                    <Tab label="Danh sách lớp" {...a11yProps(0)} />
                    <Tab label="Lịch học" {...a11yProps(1)} />
                    <Tab label="Môn học" {...a11yProps(2)} />
                </Tabs>
                <TabPanel value={tabValue} index={0}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Mã lớp</TableCell>
                                    <TableCell>Tên lớp</TableCell>
                                    <TableCell>Chuyên ngành</TableCell>
                                    <TableCell>Khóa học</TableCell>
                                    <TableCell>Sĩ số</TableCell>
                                    <TableCell>Cố vấn học tập</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {classes.map((classItem) => (
                                    <TableRow key={classItem.id}>
                                        <TableCell>{classItem.code}</TableCell>
                                        <TableCell>{classItem.name}</TableCell>
                                        <TableCell>{classItem.major}</TableCell>
                                        <TableCell>{classItem.course}</TableCell>
                                        <TableCell>{classItem.studentCount}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <PersonIcon fontSize="small" sx={{ mr: 0.5 }} />
                                                {classItem.advisor}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <Typography variant="body1" paragraph>
                        Lịch học của các lớp sẽ được hiển thị tại đây.
                    </Typography>
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                    <Typography variant="body1" paragraph>
                        Danh sách môn học của các lớp sẽ được hiển thị tại đây.
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

export default ClassDetailsModal;