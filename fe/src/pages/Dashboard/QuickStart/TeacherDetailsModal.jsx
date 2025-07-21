import React, { useState } from 'react';
import {
    useTheme,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Table,
} from '@mui/material';

function TeacherDetailsModal(classData) {
    const theme = useTheme();
    return (
        <TableContainer component={Paper} elevation={0}>
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                        <TableCell>Mã lớp</TableCell>
                        <TableCell>Tên môn học</TableCell>
                        <TableCell>Số SV</TableCell>
                        <TableCell>Giảng viên</TableCell>
                        <TableCell>Lịch học</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {classData.map((cls) => (
                        <TableRow key={cls.id}>
                            <TableCell>{cls.code}</TableCell>
                            <TableCell>{cls.name}</TableCell>
                            <TableCell>{cls.students}</TableCell>
                            <TableCell>{cls.teacher}</TableCell>
                            <TableCell>{cls.schedule}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default TeacherDetailsModal;