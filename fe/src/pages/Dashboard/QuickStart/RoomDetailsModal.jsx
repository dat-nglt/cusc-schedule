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
    MeetingRoom as RoomIcon,

    Close as CloseIcon,
    Computer as ComputerIcon,
    Air as AirIcon,
    Construction as ConstructionIcon,
    CheckCircle as CheckCircleIcon,
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

const RoomDetailsModal = ({ open, onClose, rooms }) => {
    const [tabValue, setTabValue] = useState(0);

    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <RoomIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">Chi tiết phòng học</Typography>
                </Box>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Tabs value={tabValue} onChange={handleChangeTab} aria-label="room tabs">
                    <Tab label="Danh sách phòng" {...a11yProps(0)} />
                    <Tab label="Thống kê sử dụng" {...a11yProps(1)} />
                </Tabs>
                <TabPanel value={tabValue} index={0}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Mã phòng</TableCell>
                                    <TableCell>Tên phòng</TableCell>
                                    <TableCell>Loại phòng</TableCell>
                                    <TableCell>Sức chứa</TableCell>
                                    <TableCell>Thiết bị</TableCell>
                                    <TableCell>Tình trạng</TableCell>
                                    <TableCell>Tòa nhà</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rooms.map((room) => (
                                    <TableRow key={room.id}>
                                        <TableCell>{room.code}</TableCell>
                                        <TableCell>{room.name}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={room.type}
                                                size="small"
                                                color={
                                                    room.type === 'Thực hành' ? 'primary' :
                                                        room.type === 'Lý thuyết' ? 'secondary' :
                                                            'info'
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>{room.capacity}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {room.equipment.includes('Máy chiếu') && <ComputerIcon color="action" />}
                                                {room.equipment.includes('Điều hòa') && <AirIcon color="action" />}
                                                {room.equipment.includes('Bảng thông minh') && <RoomIcon color="action" />}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={room.status === 'Hoạt động' ? <CheckCircleIcon /> : <ConstructionIcon />}
                                                label={room.status}
                                                color={room.status === 'Hoạt động' ? 'success' : 'warning'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{room.building}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <Typography variant="body1" paragraph>
                        Biểu đồ và thống kê sử dụng phòng sẽ được hiển thị tại đây.
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

export default RoomDetailsModal;