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
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import * as XLSX from 'xlsx';

const availableCourses = [
    'Công nghệ thông tin',
    'Công nghệ thực phẩm',
    'Kỹ thuật cơ khí',
    'Kỹ thuật điện',
    'Quản lý công nghiệp',
    'Tự động hóa',
    'Quản lý xây dựng',
    'Kỹ thuật điện tử',
    'An toàn thông tin'
];

const validStatuses = ['Đang học', 'Tạm nghỉ', 'Tốt nghiệp', 'Bảo lưu'];

export default function AddStudentModal({ open, onClose, onAddStudent, existingStudents }) {
    const [newStudent, setNewStudent] = useState({
        maHocVien: '',
        hoTen: '',
        maLop: '',
        khoaHoc: '',
        trangThai: 'Đang học',
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewStudent((prev) => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = () => {
        if (
            !newStudent.maHocVien ||
            !newStudent.hoTen ||
            !newStudent.maLop ||
            !newStudent.khoaHoc
        ) {
            setError('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        const isDuplicate = existingStudents.some(
            (student) => student.maHocVien === newStudent.maHocVien
        );
        if (isDuplicate) {
            setError(`Mã học viên "${newStudent.maHocVien}" đã tồn tại!`);
            return;
        }

        const currentDateTime = new Date().toISOString().slice(0, 16).replace('T', ' ');
        const studentToAdd = {
            id: Date.now(),
            stt: 0,
            maHocVien: newStudent.maHocVien,
            hoTen: newStudent.hoTen,
            maLop: newStudent.maLop,
            khoaHoc: newStudent.khoaHoc,
            trangThai: newStudent.trangThai,
            thoiGianTao: currentDateTime,
            thoiGianCapNhat: currentDateTime,
        };

        onAddStudent(studentToAdd);
        setNewStudent({
            maHocVien: '',
            hoTen: '',
            maLop: '',
            khoaHoc: '',
            trangThai: 'Đang học',
        });
        setError('');
        onClose();
    };

    const handleImportExcel = (e) => {
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

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const data = new Uint8Array(evt.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                if (!json || json.length <= 1) {
                    setError('File Excel không chứa dữ liệu hoặc thiếu hàng dữ liệu!');
                    return;
                }

                const header = json[0].map(h => h?.toString().trim());
                const expectedHeader = ['Mã học viên', 'Họ tên', 'Mã lớp', 'Khóa học', 'Trạng thái'];
                if (!expectedHeader.every((h, i) => h === header[i])) {
                    setError('Định dạng cột không đúng! Cần: Mã học viên, Họ tên, Mã lớp, Khóa học, Trạng thái');
                    return;
                }

                const imported = [];
                const duplicated = [];
                const invalidRows = [];

                json.slice(1).forEach((row, index) => {
                    const maHocVien = row[0]?.toString().trim();
                    const hoTen = row[1]?.toString().trim();
                    const maLop = row[2]?.toString().trim();
                    const khoaHoc = row[3]?.toString().trim();
                    const trangThai = row[4]?.toString().trim() || 'Đang học';

                    // Kiểm tra dữ liệu hợp lệ
                    if (!maHocVien || !hoTen || !maLop || !khoaHoc) {
                        invalidRows.push(index + 2);
                        return;
                    }

                    if (!availableCourses.includes(khoaHoc)) {
                        invalidRows.push(index + 2);
                        return;
                    }

                    if (!validStatuses.includes(trangThai)) {
                        invalidRows.push(index + 2);
                        return;
                    }

                    const isDuplicate = existingStudents.some(
                        (student) => student.maHocVien === maHocVien
                    );

                    if (isDuplicate) {
                        duplicated.push(maHocVien);
                    } else {
                        imported.push({
                            id: Date.now() + Math.random(),
                            stt: 0,
                            maHocVien,
                            hoTen,
                            maLop,
                            khoaHoc,
                            trangThai,
                            thoiGianTao: new Date().toISOString().slice(0, 16).replace('T', ' '),
                            thoiGianCapNhat: new Date().toISOString().slice(0, 16).replace('T', ' '),
                        });
                    }
                });

                let errorMessage = '';
                if (duplicated.length > 0) {
                    errorMessage += `Các mã học viên đã tồn tại và bị bỏ qua: ${duplicated.join(', ')}. `;
                }
                if (invalidRows.length > 0) {
                    errorMessage += `Các hàng không hợp lệ (thiếu dữ liệu hoặc giá trị không đúng): ${invalidRows.join(', ')}.`;
                }

                if (errorMessage) {
                    setError(errorMessage);
                }

                if (imported.length > 0) {
                    imported.forEach(onAddStudent);
                    if (!errorMessage) {
                        onClose();
                    }
                } else if (!errorMessage) {
                    setError('Không có học viên hợp lệ nào để thêm!');
                }

                console.log('Imported students:', imported);
                console.log('Duplicated students:', duplicated);
                console.log('Invalid rows:', invalidRows);
                console.log('Excel header:', header);
                console.log('Raw JSON data:', json);
            } catch (err) {
                console.error('Error reading Excel file:', err);
                setError(`Lỗi khi đọc file Excel: ${err.message}. Vui lòng kiểm tra định dạng file!`);
            }
        };

        reader.onerror = () => {
            setError('Lỗi khi đọc file Excel! Vui lòng thử lại.');
        };

        reader.readAsArrayBuffer(file);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Thêm học viên mới</Typography>
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
                        label="Mã học viên"
                        name="maHocVien"
                        value={newStudent.maHocVien}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                    />
                    <TextField
                        label="Họ tên"
                        name="hoTen"
                        value={newStudent.hoTen}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                    />
                    <TextField
                        label="Mã lớp"
                        name="maLop"
                        value={newStudent.maLop}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                    />
                    <FormControl fullWidth required>
                        <InputLabel>Khóa học</InputLabel>
                        <Select
                            name="khoaHoc"
                            value={newStudent.khoaHoc}
                            onChange={handleChange}
                            label="Khóa học"
                        >
                            {availableCourses.map((course) => (
                                <MenuItem key={course} value={course}>
                                    {course}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth required>
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                            name="trangThai"
                            value={newStudent.trangThai}
                            onChange={handleChange}
                            label="Trạng thái"
                        >
                            <MenuItem value="Đang học">Đang học</MenuItem>
                            <MenuItem value="Tạm nghỉ">Tạm nghỉ</MenuItem>
                            <MenuItem value="Tốt nghiệp">Tốt nghiệp</MenuItem>
                            <MenuItem value="Bảo lưu">Bảo lưu</MenuItem>
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
    );
}