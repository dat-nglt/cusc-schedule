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

const availableDepartments = [
    'Khoa Công Nghệ Thông Tin',
    'Khoa Kỹ Thuật',
    'Khoa Quản Trị Kinh Doanh',
    'Khoa Công Nghệ Thực Phẩm',
    'Khoa Xây Dựng',
    'Khoa Cơ Khí',
    'Khoa Điện - Điện Tử'
];

const availableDegrees = [
    'Cử nhân',
    'Thạc sỹ',
    'Tiến sỹ',
    'Giáo sư',
    'Phó Giáo sư'
];

const validStatuses = ['Hoạt động', 'Tạm nghỉ'];

export default function AddLecturerModal({ open, onClose, onAddLecturer, existingLecturers }) {
    const [newLecturer, setNewLecturer] = useState({
        lecturer_id: '',
        name: '',
        email: '',
        day_of_birth: '',
        gender: '',
        address: '',
        phone_number: '',
        department: '',
        hire_date: '',
        degree: '',
        status: 'Hoạt động',
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewLecturer((prev) => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = () => {
        if (
            !newLecturer.lecturer_id ||
            !newLecturer.name ||
            !newLecturer.email ||
            !newLecturer.day_of_birth ||
            !newLecturer.gender ||
            !newLecturer.address ||
            !newLecturer.phone_number ||
            !newLecturer.department ||
            !newLecturer.hire_date ||
            !newLecturer.degree
        ) {
            setError('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        // Kiểm tra email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newLecturer.email)) {
            setError('Email không hợp lệ!');
            return;
        }

        // Kiểm tra số điện thoại format
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(newLecturer.phone_number)) {
            setError('Số điện thoại không hợp lệ!');
            return;
        }

        // Kiểm tra trùng mã giảng viên
        const isDuplicate = existingLecturers.some(
            (lecturer) => lecturer.lecturer_id === newLecturer.lecturer_id
        );
        if (isDuplicate) {
            setError(`Mã giảng viên "${newLecturer.lecturer_id}" đã tồn tại!`);
            return;
        }

        // Kiểm tra ngày hợp lệ
        const birthDate = new Date(newLecturer.day_of_birth);
        const hireDate = new Date(newLecturer.hire_date);
        const today = new Date();

        if (birthDate >= today) {
            setError('Ngày sinh không hợp lệ!');
            return;
        }

        if (hireDate > today) {
            setError('Ngày tuyển dụng không được là ngày tương lai!');
            return;
        }

        const lecturerToAdd = {
            ...newLecturer,
            id: Date.now(),
            google_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        onAddLecturer(lecturerToAdd);
        setNewLecturer({
            lecturer_id: '',
            name: '',
            email: '',
            day_of_birth: '',
            gender: '',
            address: '',
            phone_number: '',
            department: '',
            hire_date: '',
            degree: '',
            status: 'Hoạt động',
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
                const expectedHeader = ['Mã giảng viên', 'Họ tên', 'Email', 'Ngày sinh', 'Giới tính', 'Địa chỉ', 'Số điện thoại', 'Khoa', 'Ngày tuyển dụng', 'Bằng cấp', 'Trạng thái'];
                if (!expectedHeader.every((h, i) => h === header[i])) {
                    setError('Định dạng cột không đúng! Cần: Mã giảng viên, Họ tên, Email, Ngày sinh, Giới tính, Địa chỉ, Số điện thoại, Khoa, Ngày tuyển dụng, Bằng cấp, Trạng thái');
                    return;
                }

                const imported = [];
                const duplicated = [];
                const invalidRows = [];

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const phoneRegex = /^[0-9]{10,11}$/;

                json.slice(1).forEach((row, index) => {
                    const lecturer_id = row[0]?.toString().trim();
                    const name = row[1]?.toString().trim();
                    const email = row[2]?.toString().trim();
                    const day_of_birth = row[3]?.toString().trim();
                    const gender = row[4]?.toString().trim();
                    const address = row[5]?.toString().trim();
                    const phone_number = row[6]?.toString().trim();
                    const department = row[7]?.toString().trim();
                    const hire_date = row[8]?.toString().trim();
                    const degree = row[9]?.toString().trim();
                    const status = row[10]?.toString().trim() || 'Hoạt động';

                    // Kiểm tra dữ liệu hợp lệ
                    if (!lecturer_id || !name || !email || !day_of_birth || !gender || !address || !phone_number || !department || !hire_date || !degree) {
                        invalidRows.push(index + 2);
                        return;
                    }

                    if (!emailRegex.test(email)) {
                        invalidRows.push(index + 2);
                        return;
                    }

                    if (!phoneRegex.test(phone_number)) {
                        invalidRows.push(index + 2);
                        return;
                    }

                    if (!validStatuses.includes(status)) {
                        invalidRows.push(index + 2);
                        return;
                    }

                    if (!availableDepartments.includes(department)) {
                        invalidRows.push(index + 2);
                        return;
                    }

                    if (!availableDegrees.includes(degree)) {
                        invalidRows.push(index + 2);
                        return;
                    }

                    if (!['Nam', 'Nữ'].includes(gender)) {
                        invalidRows.push(index + 2);
                        return;
                    }

                    const isDuplicate = existingLecturers.some(
                        (lecturer) => lecturer.lecturer_id === lecturer_id
                    );

                    if (isDuplicate) {
                        duplicated.push(lecturer_id);
                    } else {
                        imported.push({
                            id: Date.now() + Math.random(),
                            lecturer_id,
                            name,
                            email,
                            day_of_birth,
                            gender,
                            address,
                            phone_number,
                            department,
                            hire_date,
                            degree,
                            status,
                            google_id: null,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                        });
                    }
                });

                let errorMessage = '';
                if (duplicated.length > 0) {
                    errorMessage += `Các mã giảng viên đã tồn tại và bị bỏ qua: ${duplicated.join(', ')}. `;
                }
                if (invalidRows.length > 0) {
                    errorMessage += `Các hàng không hợp lệ (thiếu dữ liệu hoặc giá trị không đúng): ${invalidRows.join(', ')}.`;
                }

                if (errorMessage) {
                    setError(errorMessage);
                }

                if (imported.length > 0) {
                    imported.forEach(onAddLecturer);
                    if (!errorMessage) {
                        onClose();
                    }
                } else if (!errorMessage) {
                    setError('Không có giảng viên hợp lệ nào để thêm!');
                }
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
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Thêm giảng viên mới</Typography>
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
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 2 }}>
                    <TextField
                        label="Mã giảng viên"
                        name="lecturer_id"
                        value={newLecturer.lecturer_id}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                    />
                    <TextField
                        label="Họ tên"
                        name="name"
                        value={newLecturer.name}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={newLecturer.email}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                    />
                    <TextField
                        label="Ngày sinh"
                        name="day_of_birth"
                        type="date"
                        value={newLecturer.day_of_birth}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                        InputLabelProps={{ shrink: true }}
                    />
                    <FormControl fullWidth required>
                        <InputLabel>Giới tính</InputLabel>
                        <Select
                            name="gender"
                            value={newLecturer.gender}
                            onChange={handleChange}
                            label="Giới tính"
                        >
                            <MenuItem value="Nam">Nam</MenuItem>
                            <MenuItem value="Nữ">Nữ</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Số điện thoại"
                        name="phone_number"
                        value={newLecturer.phone_number}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                    />
                    <TextField
                        label="Địa chỉ"
                        name="address"
                        value={newLecturer.address}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                        sx={{ gridColumn: { md: 'span 2' } }}
                    />
                    <FormControl fullWidth required>
                        <InputLabel>Khoa</InputLabel>
                        <Select
                            name="department"
                            value={newLecturer.department}
                            onChange={handleChange}
                            label="Khoa"
                        >
                            {availableDepartments.map((dept) => (
                                <MenuItem key={dept} value={dept}>
                                    {dept}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Ngày tuyển dụng"
                        name="hire_date"
                        type="date"
                        value={newLecturer.hire_date}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                        InputLabelProps={{ shrink: true }}
                    />
                    <FormControl fullWidth required>
                        <InputLabel>Bằng cấp</InputLabel>
                        <Select
                            name="degree"
                            value={newLecturer.degree}
                            onChange={handleChange}
                            label="Bằng cấp"
                        >
                            {availableDegrees.map((degree) => (
                                <MenuItem key={degree} value={degree}>
                                    {degree}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth required>
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                            name="status"
                            value={newLecturer.status}
                            onChange={handleChange}
                            label="Trạng thái"
                        >
                            <MenuItem value="Hoạt động">Hoạt động</MenuItem>
                            <MenuItem value="Tạm nghỉ">Tạm nghỉ</MenuItem>
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