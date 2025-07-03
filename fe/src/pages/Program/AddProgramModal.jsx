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
import PreviewProgramModal from './PreviewProgramModal';
import { processExcelDataProgram } from '../../utils/ExcelValidation';

const availableTrainingDurations = [1, 2, 3, 4];

export default function AddProgramModal({ open, onClose, onAddProgram, existingPrograms, error, loading, message }) {
    const [newProgram, setNewProgram] = useState({
        program_id: '',
        program_name: '',
        training_duration: '',
        status: 'Đang triển khai',
    });

    const [localError, setLocalError] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProgram((prev) => ({ ...prev, [name]: value }));
        setLocalError('');
    };

    const handleSubmit = async () => {
        if (
            !newProgram.program_id ||
            !newProgram.program_name ||
            !newProgram.training_duration
        ) {
            setLocalError('Vui lòng điền đầy đủ thông tin!');
            return;
        }
        //kiểm tra mã Chuong trình có hợp lệ hay không
        const isDuplicate = existingPrograms.some(
            (program) => program.program_id === newProgram.program_id
        );
        if (isDuplicate) {
            setLocalError(`Mã chương trình "${newProgram.program_id}" đã tồn tại!`);
            return;
        }

        const programToAdd = {
            ...newProgram,
            id: Date.now(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        // Gọi hàm onAddProgram được truyền từ component cha
        await onAddProgram(programToAdd);

        setNewProgram({
            program_id: '',
            program_name: '',
            training_duration: '',
            status: 'Đang triển khai',
        });
        setLocalError('');
        onClose();
    };

    // Hàm xử lý import file Excel
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
            const processedData = processExcelDataProgram(jsonData, existingPrograms);

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

    const handleImportSuccess = (result) => {
        const { imported } = result;

        if (imported && imported.length > 0) {
            // Add imported programs to the list
            imported.forEach(program => onAddProgram(program));
            onClose();
        }

        setShowPreview(false);
        setPreviewData([]);
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
                        <Typography variant="h6">Thêm chương trình đào tạo mới</Typography>
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
                            label="Mã chương trình"
                            name="program_id"
                            value={newProgram.program_id}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            required
                        />
                        <TextField
                            label="Tên chương trình"
                            name="program_name"
                            value={newProgram.program_name}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            required
                        />
                        <FormControl fullWidth required>
                            <InputLabel>Thời gian đào tạo</InputLabel>
                            <Select
                                name="training_duration"
                                value={newProgram.training_duration}
                                onChange={handleChange}
                                label="Thời gian đào tạo"
                            >
                                {availableTrainingDurations.map((duration) => (
                                    <MenuItem key={duration} value={duration}>
                                        {duration} Năm
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth required>
                            <InputLabel>Trạng thái</InputLabel>
                            <Select
                                name="status"
                                value={newProgram.status}
                                onChange={handleChange}
                                label="Trạng thái"
                            >
                                <MenuItem value="Đang triển khai">Đang triển khai</MenuItem>
                                <MenuItem value="Tạm dừng">Tạm dừng</MenuItem>
                                <MenuItem value="Kết thúc">Kết thúc</MenuItem>
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
            <PreviewProgramModal
                open={showPreview}
                onClose={handleClosePreview}
                onImportSuccess={handleImportSuccess}
                previewData={previewData}
            />
        </>
    );
}