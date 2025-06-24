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
    Chip,
    OutlinedInput,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import * as XLSX from 'xlsx';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const availableSubjects = [
    'Hệ thống thông tin', 'Phân tích thiết kế hệ thống', 'Công nghệ thực phẩm',
    'Hóa học thực phẩm', 'Kỹ thuật hệ thống công nghiệp', 'Tự động hóa công nghiệp',
    'Công nghệ kỹ thuật điện, điện tử', 'Mạch điện tử', 'Kỹ thuật phần mềm',
    'Lập trình Java', 'Quản lý công nghiệp', 'Quản trị doanh nghiệp',
    'Công nghệ kỹ thuật điều khiển và tự động hóa', 'PLC', 'Quản lý xây dựng',
    'Kinh tế xây dựng', 'Khoa học máy tính', 'Cấu trúc dữ liệu',
    'Công nghệ kỹ thuật cơ điện tử', 'Robot học'
];

const validStatuses = ['Hoạt động', 'Tạm nghỉ', 'Đang dạy'];

export default function AddLecturerModal({ open, onClose, onAddLecturer, existingLecturers }) {
    const [newLecturer, setNewLecturer] = useState({
        maGiangVien: '',
        hoTen: '',
        monGiangDay: [],
        email: '',
        soDienThoai: '',
        trangThai: 'Hoạt động',
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewLecturer((prev) => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubjectChange = (event) => {
        const { value } = event.target;
        setNewLecturer((prev) => ({
            ...prev,
            monGiangDay: typeof value === 'string' ? value.split(',') : value,
        }));
        setError('');
    };

    const handleSubmit = () => {
        if (
            !newLecturer.maGiangVien ||
            !newLecturer.hoTen ||
            newLecturer.monGiangDay.length === 0 ||
            !newLecturer.email ||
            !newLecturer.soDienThoai
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
        if (!phoneRegex.test(newLecturer.soDienThoai)) {
            setError('Số điện thoại không hợp lệ!');
            return;
        }

        // Kiểm tra trùng mã giảng viên
        const isDuplicate = existingLecturers.some(
            (lecturer) => lecturer.maGiangVien === newLecturer.maGiangVien
        );
        if (isDuplicate) {
            setError(`Mã giảng viên "${newLecturer.maGiangVien}" đã tồn tại!`);
            return;
        }

        const currentDateTime = new Date().toISOString().slice(0, 16).replace('T', ' ');
        const lecturerToAdd = {
            id: Date.now(),
            stt: 0,
            maGiangVien: newLecturer.maGiangVien,
            hoTen: newLecturer.hoTen,
            monGiangDay: newLecturer.monGiangDay,
            lienHe: {
                email: newLecturer.email,
                soDienThoai: newLecturer.soDienThoai
            },
            trangThai: newLecturer.trangThai,
            thoiGianTao: currentDateTime,
            thoiGianCapNhat: currentDateTime,
        };

        onAddLecturer(lecturerToAdd);
        setNewLecturer({
            maGiangVien: '',
            hoTen: '',
            monGiangDay: [],
            email: '',
            soDienThoai: '',
            trangThai: 'Hoạt động',
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
                const expectedHeader = ['Mã giảng viên', 'Họ tên', 'Môn giảng dạy', 'Email', 'Số điện thoại', 'Trạng thái'];
                if (!expectedHeader.every((h, i) => h === header[i])) {
                    setError('Định dạng cột không đúng! Cần: Mã giảng viên, Họ tên, Môn giảng dạy, Email, Số điện thoại, Trạng thái');
                    return;
                }

                const imported = [];
                const duplicated = [];
                const invalidRows = [];

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const phoneRegex = /^[0-9]{10,11}$/;

                json.slice(1).forEach((row, index) => {
                    const maGiangVien = row[0]?.toString().trim();
                    const hoTen = row[1]?.toString().trim();
                    const monGiangDay = row[2]?.toString().trim().split(',').map(s => s.trim()).filter(s => s);
                    const email = row[3]?.toString().trim();
                    const soDienThoai = row[4]?.toString().trim();
                    const trangThai = row[5]?.toString().trim() || 'Hoạt động';

                    // Kiểm tra dữ liệu hợp lệ
                    if (!maGiangVien || !hoTen || !monGiangDay.length || !email || !soDienThoai) {
                        invalidRows.push(index + 2);
                        return;
                    }

                    if (!emailRegex.test(email)) {
                        invalidRows.push(index + 2);
                        return;
                    }

                    if (!phoneRegex.test(soDienThoai)) {
                        invalidRows.push(index + 2);
                        return;
                    }

                    if (!validStatuses.includes(trangThai)) {
                        invalidRows.push(index + 2);
                        return;
                    }

                    if (!monGiangDay.every(subject => availableSubjects.includes(subject))) {
                        invalidRows.push(index + 2);
                        return;
                    }

                    const isDuplicate = existingLecturers.some(
                        (lecturer) => lecturer.maGiangVien === maGiangVien
                    );

                    if (isDuplicate) {
                        duplicated.push(maGiangVien);
                    } else {
                        imported.push({
                            id: Date.now() + Math.random(),
                            stt: 0,
                            maGiangVien,
                            hoTen,
                            monGiangDay,
                            lienHe: {
                                email,
                                soDienThoai
                            },
                            trangThai,
                            thoiGianTao: new Date().toISOString().slice(0, 16).replace('T', ' '),
                            thoiGianCapNhat: new Date().toISOString().slice(0, 16).replace('T', ' '),
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

                console.log('Imported lecturers:', imported);
                console.log('Duplicated lecturers:', duplicated);
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
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <TextField
                        label="Mã giảng viên"
                        name="maGiangVien"
                        value={newLecturer.maGiangVien}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                    />
                    <TextField
                        label="Họ tên"
                        name="hoTen"
                        value={newLecturer.hoTen}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                    />
                    <FormControl fullWidth required>
                        <InputLabel>Môn giảng dạy</InputLabel>
                        <Select
                            multiple
                            value={newLecturer.monGiangDay}
                            onChange={handleSubjectChange}
                            input={<OutlinedInput label="Môn giảng dạy" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} size="small" />
                                    ))}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                        >
                            {availableSubjects.map((subject) => (
                                <MenuItem key={subject} value={subject}>
                                    {subject}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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
                        label="Số điện thoại"
                        name="soDienThoai"
                        value={newLecturer.soDienThoai}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                    />
                    <FormControl fullWidth required>
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                            name="trangThai"
                            value={newLecturer.trangThai}
                            onChange={handleChange}
                            label="Trạng thái"
                        >
                            <MenuItem value="Hoạt động">Hoạt động</MenuItem>
                            <MenuItem value="Tạm nghỉ">Tạm nghỉ</MenuItem>
                            <MenuItem value="Đang dạy">Đang dạy</MenuItem>
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