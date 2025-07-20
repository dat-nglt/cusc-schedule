import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Typography, TextField, Button, Box, FormControl,
    InputLabel, Select, MenuItem, Alert, CircularProgress
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import * as XLSX from 'xlsx';
import PreviewSubjectModal from './PreviewSubjectModal';
import { processExcelDataSubject } from '../../utils/ExcelValidation';

export default function AddSubjectModal({ open, onClose, onAddSubject, existingSubjects = [], error, loading, message, semesters, fetchSubjects }) {
    const [newSubject, setNewSubject] = useState({
        subject_id: '',
        subject_name: '',
        credit: 0,
        theory_hours: 0,
        practice_hours: 0,
        status: 'Hoạt động',
        semester_id: null
    });

    const [localError, setLocalError] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewSubject((prev) => ({ ...prev, [name]: value }));
        setLocalError('');
    };

    const handleSubmit = async () => {
        if (
            !newSubject.subject_id ||
            !newSubject.subject_name ||
            newSubject.theory_hours < 0 ||
            newSubject.practice_hours < 0 ||
            newSubject.credit <= 0
        ) {
            setLocalError('Vui lòng điền đầy đủ thông tin hợp lệ!');
            return;
        }

        // Kiểm tra trùng mã học phần
        const isDuplicate = existingSubjects.some(subject => subject.subject_id === newSubject.subject_id);
        if (isDuplicate) {
            setLocalError(`Mã học phần "${newSubject.subject_id}" đã tồn tại!`);
            return;
        }

        // Kiểm tra logic số tín chỉ
        const totalHours = parseInt(newSubject.theory_hours) + parseInt(newSubject.practice_hours);
        if (totalHours === 0) {
            setLocalError('Tổng số tiết lý thuyết và thực hành phải lớn hơn 0!');
            return;
        }

        const subjectToAdd = {
            ...newSubject,
            id: Date.now(),
            credit: parseInt(newSubject.credit),
            theory_hours: parseInt(newSubject.theory_hours),
            practice_hours: parseInt(newSubject.practice_hours),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        // Gọi hàm onAddSubject được truyền từ component cha
        await onAddSubject(subjectToAdd);

        setNewSubject({
            subject_id: '',
            subject_name: '',
            credit: 0,
            theory_hours: 0,
            practice_hours: 0,
            status: 'Hoạt động',
            semester_id: ''
        });
        setLocalError('');
        onClose();
    };

    const handleImportExcel = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            setLocalError('Vui lòng chọn một file Excel!');
            return;
        }

        const validExtensions = ['.xlsx', '.xls'];
        const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
        if (!validExtensions.includes(fileExtension)) {
            setLocalError('Chỉ hỗ trợ file Excel (.xlsx, .xls)!');
            return;
        }

        try {
            setLocalError(''); // Clear previous errors

            // Đọc file Excel
            const arrayBuffer = await file.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Chuyển đổi sang JSON
            const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (rawData.length < 2) {
                setLocalError('File Excel phải có ít nhất 2 dòng (header + dữ liệu)!');
                return;
            }

            // Lấy header và data
            const headers = rawData[0];
            const dataRows = rawData.slice(1);

            // Chuyển đổi thành object với header làm key
            const jsonData = dataRows.map(row => {
                const obj = {};
                headers.forEach((header, index) => {
                    obj[header] = row[index] || '';
                });
                return obj;
            });

            // Xử lý và validate dữ liệu
            const processedData = processExcelDataSubject(jsonData, existingSubjects);

            if (processedData.length === 0) {
                setLocalError('Không có dữ liệu hợp lệ trong file Excel!');
                return;
            }

            // Hiển thị preview
            setPreviewData(processedData);
            setShowPreview(true);
            onClose();

        } catch (error) {
            console.error('Error reading Excel file:', error);
            setLocalError('Lỗi khi đọc file Excel! Vui lòng kiểm tra format file.');
        }

        // Reset file input
        e.target.value = '';
    };


    const handleClosePreview = () => {
        setShowPreview(false);
        setPreviewData([]);
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Thêm học phần mới</Typography>
                        <label htmlFor="upload-subject-excel">
                            <input
                                id="upload-subject-excel"
                                type="file"
                                hidden
                                accept=".xlsx, .xls"
                                onChange={handleImportExcel}
                            />
                            <Button
                                variant="outlined"
                                component="span"
                                size="small"
                                startIcon={<UploadFileIcon />}
                            >
                                Thêm tự động
                            </Button>
                        </label>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {(error || localError) && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error || localError}
                        </Alert>
                    )}
                    {message && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {message}
                        </Alert>
                    )}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 2 }}>
                        <TextField
                            label="Mã học phần"
                            name="subject_id"
                            value={newSubject.subject_id}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            required
                        />
                        <TextField
                            label="Tên học phần"
                            name="subject_name"
                            value={newSubject.subject_name}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            required
                        />
                        <TextField
                            label="Số tín chỉ"
                            name="credit"
                            type="number"
                            value={newSubject.credit}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            required
                            inputProps={{ min: 1 }}
                        />
                        <TextField
                            label="Số tiết lý thuyết"
                            name="theory_hours"
                            type="number"
                            value={newSubject.theory_hours}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            required
                            inputProps={{ min: 0 }}
                        />
                        <TextField
                            label="Số tiết thực hành"
                            name="practice_hours"
                            type="number"
                            value={newSubject.practice_hours}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            required
                            inputProps={{ min: 0 }}
                        />
                        <FormControl fullWidth required>
                            <InputLabel>Học kỳ</InputLabel>
                            <Select
                                name="semester_id"
                                value={newSubject.semester_id}
                                onChange={handleChange}
                                label="Học kỳ"
                            >
                                {semesters.length > 0 ? (
                                    semesters.map((semester) => (
                                        <MenuItem key={semester.semester_id} value={semester.semester_id}>
                                            {semester.semester_id} - {semester.semester_name}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>
                                        Chưa có mã học kỳ nào
                                    </MenuItem>
                                )}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth required>
                            <InputLabel>Trạng thái</InputLabel>
                            <Select
                                name="status"
                                value={newSubject.status}
                                onChange={handleChange}
                                label="Trạng thái"
                            >
                                <MenuItem value="Hoạt động">Hoạt động</MenuItem>
                                <MenuItem value="Tạm dừng">Tạm dừng</MenuItem>
                                <MenuItem value="Ngừng hoạt động">Ngừng hoạt động</MenuItem>
                            </Select>
                        </FormControl>

                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} variant="outlined" sx={{ color: '#1976d2' }} disabled={loading}>
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {loading ? 'Đang thêm...' : 'Thêm'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Preview Modal */}
            <PreviewSubjectModal
                open={showPreview}
                onClose={handleClosePreview}
                previewData={previewData}
                fetchSubjects={fetchSubjects} // Gọi lại hàm fetch để cập nhật danh sách học kỳ
                semesters={semesters}
            />
        </>
    );
}
