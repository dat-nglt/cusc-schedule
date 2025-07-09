import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    TextField,
    Button,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import * as XLSX from 'xlsx';
import PreviewSemesterModal from './PreviewSemesterModal';
import { processExcelDataSemester } from '../../utils/ExcelValidation';

export default function AddSemesterModal({ open, onClose, onAddSemester, existingSemesters, error, loading, message, fetchSemesters, programs }) {
    const [newSemester, setNewSemester] = useState({
        semester_id: '',
        semester_name: '',
        start_date: '',
        end_date: '',
        status: 'Đang triển khai',
        program_id: '',
    });

    const [localError, setLocalError] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewSemester((prev) => ({ ...prev, [name]: value }));
        setLocalError('');
    };

    const handleSubmit = async () => {
        if (
            !newSemester.semester_id ||
            !newSemester.semester_name ||
            !newSemester.start_date ||
            !newSemester.end_date ||
            !newSemester.program_id
        ) {
            setLocalError('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        // Kiểm tra trùng mã học kỳ
        const isDuplicate = existingSemesters.some(
            (semester) => semester.semester_id === newSemester.semester_id
        );
        if (isDuplicate) {
            setLocalError(`Mã học kỳ "${newSemester.semester_id}" đã tồn tại!`);
            return;
        }

        // Kiểm tra ngày hợp lệ
        const startDate = new Date(newSemester.start_date);
        const endDate = new Date(newSemester.end_date);

        if (startDate >= endDate) {
            setLocalError('Ngày kết thúc phải sau ngày bắt đầu!');
            return;
        }

        const semesterToAdd = {
            ...newSemester,
            id: Date.now(),
            created_at: startDate.toISOString(),
            updated_at: endDate.toISOString(),
        };

        // Gọi hàm onAddSemester được truyền từ component cha
        await onAddSemester(semesterToAdd);

        setNewSemester({
            semester_id: '',
            semester_name: '',
            start_date: '',
            end_date: '',
            status: 'Đang triển khai',
            program_id: '',
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
            const processedData = processExcelDataSemester(jsonData, existingSemesters);

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
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Thêm học kỳ mới</Typography>
                        <label htmlFor="excel-upload">
                            <input
                                id="excel-upload"
                                type="file"
                                accept=".xlsx, .xls"
                                hidden
                                onChange={handleImportExcel}
                            />
                            <Button
                                variant="outlined"
                                component="span"
                                startIcon={<UploadFileIcon />}
                                size="small"
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
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="Mã học kỳ"
                            name="semester_id"
                            value={newSemester.semester_id}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            required
                        />
                        <TextField
                            label="Tên học kỳ"
                            name="semester_name"
                            value={newSemester.semester_name}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            required
                        />
                        <FormControl fullWidth required>
                            <InputLabel>Mã chương trình</InputLabel>
                            <Select
                                name="program_id"
                                value={newSemester.program_id}
                                onChange={handleChange}
                                label="Mã chương trình"
                            >
                                {programs?.map((program) => (
                                    <MenuItem key={program.id} value={program.program_id}>
                                        {program.program_id} - {program.program_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Ngày bắt đầu"
                            name="start_date"
                            type="date"
                            value={newSemester.start_date}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            required
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            label="Ngày kết thúc"
                            name="end_date"
                            type="date"
                            value={newSemester.end_date}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            required
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <FormControl fullWidth required>
                            <InputLabel>Trạng thái</InputLabel>
                            <Select
                                name="status"
                                value={newSemester.status}
                                onChange={handleChange}
                                label="Trạng thái"
                            >
                                <MenuItem value="Đang triển khai">Đang triển khai</MenuItem>
                                <MenuItem value="Đang mở đăng ký">Đang mở đăng ký</MenuItem>
                                <MenuItem value="Đang diễn ra">Đang diễn ra</MenuItem>
                                <MenuItem value="Tạm dừng">Tạm dừng</MenuItem>
                                <MenuItem value="Đã kết thúc">Đã kết thúc</MenuItem>
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
            <PreviewSemesterModal
                open={showPreview}
                onClose={handleClosePreview}
                previewData={previewData}
                fetchSemesters={fetchSemesters}
            />
        </>
    );
}
