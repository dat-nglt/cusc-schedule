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
    IconButton,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import * as XLSX from 'xlsx';
import PreviewSemesterModal from './PreviewSemesterModal';
import { processExcelDataSemester } from '../../utils/ExcelValidation';

export default function AddSemesterModal({ open, onClose, onAddSemester, existingSemesters }) {
    const [newSemester, setNewSemester] = useState({
        semester_id: '',
        semester_name: '',
        start_date: '',
        end_date: '',
        status: 'Đang triển khai',
    });

    const [error, setError] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState([]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewSemester((prev) => ({ ...prev, [name]: value }));
        setError('');
    }

    const handleSubmit = () => {
        if (
            !newSemester.semester_id ||
            !newSemester.semester_name ||
            !newSemester.start_date ||
            !newSemester.end_date
        ) {
            setError('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        //kiểm tra mã học kỳ có hợp lệ hay không
        const isDuplicate = existingSemesters.some(
            (semester) => semester.semester_id === newSemester.semester_id
        );
        if (isDuplicate) {
            setError(`Mã học kỳ "${newSemester.semester_id}" đã tồn tại!`);
            return;
        }

        const semesterToAdd = {
            ...newSemester,
            created_at: new Date(newSemester.start_date),
            updated_at: new Date(newSemester.end_date),
        };
        onAddSemester(semesterToAdd);
        setNewSemester({
            semester_id: '',
            semester_name: '',
            start_date: '',
            end_date: '',
            status: 'Đang triển khai',
        });
        setError('');
        onClose();
    };

    //hàm xử lý import file Excel
    const handleImportExcel = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            setError('Vui lòng chọn một file Excel!');
            return;
        }

        const validExtensions = ['.xlsx', '.xls'];
        const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
        if (!validExtensions.includes(fileExtension)) {
            setError('Chỉ hỗ trợ file Excel (.xlsx, .xls)!');
            return;
        }

        try {
            setError(''); // Clear previous errors
            // Đọc file Excel
            const arrayBuffer = await file.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Chuyển đổi sang JSON
            const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (rawData.length < 2) {
                setError('File Excel phải có ít nhất 2 dòng (header + dữ liệu)!');
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
                setError('Không có dữ liệu hợp lệ trong file Excel!');
                return;
            }

            // Hiển thị preview
            setPreviewData(processedData);
            setShowPreview(true);
            onClose();

        } catch (error) {
            console.error('Error reading Excel file:', error);
            setError('Lỗi khi đọc file Excel! Vui lòng kiểm tra format file.');
        }

        // Reset file input
        e.target.value = '';
    };

    const handleImportSuccess = (result) => {
        const { imported, message: resultMessage } = result;

        if (imported && imported.length > 0) {
            // Add imported lecturers to the list
            imported.forEach(semester => onAddSemester(semester));

            // Hiển thị thông báo thành công
            // setMessage(`Thêm thành công ${imported.length} chương trình đào tạo!`);
            setError('');
            onClose();
        } else if (resultMessage) {
            setError(resultMessage);
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
                    {error && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
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
                                <MenuItem value="Tạm dừng">Tạm dừng</MenuItem>
                                <MenuItem value="Kết thúc">Kết thúc</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} variant="outlined" sx={{ color: '#1976d2' }}>
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}>
                        Thêm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Preview Modal */}
            <PreviewSemesterModal
                open={showPreview}
                onClose={handleClosePreview}
                previewData={previewData}
                onImportSuccess={handleImportSuccess}
            />
        </>
    )
}
