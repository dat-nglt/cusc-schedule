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
    Avatar,
    Divider, // Thêm Divider để phân cách
    IconButton, // Thêm IconButton cho các icon
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // Icon đóng modal
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; // Icon tải file lên
import * as XLSX from 'xlsx';
import PreviewLecturerModal from './PreviewLecturerModal';
import { processExcelDataLecturer } from '../../utils/ExcelValidation';

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

const AddLecturerModal = ({ open, onClose, onAddLecturer, existingLecturers, error, loading, message, fetchLecturers, subjects }) => {
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
        academic_rank: '',
        status: 'Đang giảng dạy',
        subjects: [],
    });

    const [localError, setLocalError] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewLecturer((prev) => ({ ...prev, [name]: value }));
        setLocalError(''); // Xóa lỗi cục bộ khi người dùng bắt đầu nhập
    };

    const handleSubmit = async () => {
        // Validation logic
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
            !newLecturer.degree ||
            !newLecturer.subjects.length
        ) {
            setLocalError('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newLecturer.email)) {
            setLocalError('Email không hợp lệ!');
            return;
        }

        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(newLecturer.phone_number)) {
            setLocalError('Số điện thoại không hợp lệ (10-11 chữ số)!');
            return;
        }

        const isDuplicateId = existingLecturers.some(
            (lecturer) => lecturer.lecturer_id === newLecturer.lecturer_id
        );
        if (isDuplicateId) {
            setLocalError(`Mã giảng viên "${newLecturer.lecturer_id}" đã tồn tại!`);
            return;
        }

        const isEmailDuplicate = existingLecturers.some(
            (lecturer) => lecturer.email === newLecturer.email
        );
        if (isEmailDuplicate) {
            setLocalError(`Email "${newLecturer.email}" đã tồn tại!`);
            return;
        }

        const isPhoneDuplicate = existingLecturers.some(
            (lecturer) => lecturer.phone_number === newLecturer.phone_number
        );
        if (isPhoneDuplicate) {
            setLocalError(`Số điện thoại "${newLecturer.phone_number}" đã tồn tại!`);
            return;
        }

        const birthDate = new Date(newLecturer.day_of_birth);
        const hireDate = new Date(newLecturer.hire_date);
        const today = new Date();

        if (birthDate >= today) {
            setLocalError('Ngày sinh không hợp lệ (không được là ngày tương lai hoặc hôm nay)!');
            return;
        }
        // Validate age (e.g., must be at least 18 years old)
        const minBirthDate = new Date();
        minBirthDate.setFullYear(minBirthDate.getFullYear() - 18);
        if (birthDate > minBirthDate) {
            setLocalError('Giảng viên phải đủ 18 tuổi!');
            return;
        }


        if (hireDate > today) {
            setLocalError('Ngày tuyển dụng không được là ngày tương lai!');
            return;
        }
        // Hire date must not be before birth date
        if (hireDate < birthDate) {
            setLocalError('Ngày tuyển dụng không thể trước ngày sinh!');
            return;
        }

        const lecturerToAdd = {
            ...newLecturer,
            // id: Date.now(), // ID nên được tạo từ phía backend hoặc là một UUID chuẩn
            google_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        await onAddLecturer(lecturerToAdd);
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
            status: 'Đang giảng dạy',
            subjects: [],
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
            e.target.value = ''; // Clear file input
            return;
        }

        try {
            setLocalError('');

            const arrayBuffer = await file.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (rawData.length < 2) {
                setLocalError('File Excel phải có ít nhất 2 dòng (header + dữ liệu)!');
                e.target.value = '';
                return;
            }

            const headers = rawData[0];
            const dataRows = rawData.slice(1);

            const jsonData = dataRows.map(row => {
                const obj = {};
                headers.forEach((header, index) => {
                    obj[header] = row[index] || '';
                });
                return obj;
            });

            // Pass existingLecturers to validate for duplicates in Excel data
            const processedData = processExcelDataLecturer(jsonData, existingLecturers);

            if (processedData.length === 0) {
                setLocalError('Không có dữ liệu hợp lệ nào được tìm thấy trong file Excel!');
                e.target.value = '';
                return;
            }

            setPreviewData(processedData);
            setShowPreview(true);
            // onClose(); // Không đóng modal chính nếu muốn người dùng thấy lỗi và tùy chọn lại

        } catch (error) {
            console.error('Error reading Excel file:', error);
            setLocalError('Lỗi khi đọc file Excel! Vui lòng kiểm tra định dạng hoặc nội dung file.');
        } finally {
            e.target.value = ''; // Luôn xóa giá trị của input file sau khi xử lý
        }
    };

    const handleClosePreview = () => {
        setShowPreview(false);
        setPreviewData([]);
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                {/* Header của Dialog */}
                <DialogTitle sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'primary.main',
                    color: 'white',
                    p: 2,
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                            src="https://sanvieclamcantho.com/upload/imagelogo/trung-tam-cong-nghe-phan-mem-dai-hoc-can-tho1573111986.png"
                            alt="Logo"
                            sx={{
                                width: 40, // Kích thước nhỏ hơn một chút
                                height: 40,
                                mr: 1.5, // Khoảng cách với tiêu đề
                                border: '2px solid white',
                                boxShadow: 1
                            }}
                        />
                        <Typography variant="h6" fontWeight="bold">
                            THÊM GIẢNG VIÊN MỚI
                        </Typography>
                    </Box>
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{ color: 'white' }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 3, mt: 1 }}>
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

                    {/* Form nhập liệu thủ công */}
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, // Dùng sm thay cho md để responsive tốt hơn trên màn hình nhỏ
                        gap: 2,
                        mt: 2,
                        }}>
                        <TextField
                            label="Mã giảng viên"
                            name="lecturer_id"
                            value={newLecturer.lecturer_id}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            required
                            size="small"
                        />
                        <TextField
                            label="Họ tên"
                            name="name"
                            value={newLecturer.name}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            required
                            size="small"
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
                            size="small"
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
                            size="small"
                        />
                        <FormControl fullWidth required size="small">
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
                            size="small"
                        />
                        <TextField
                            label="Địa chỉ"
                            name="address"
                            value={newLecturer.address}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            required
                            sx={{ gridColumn: { sm: 'span 2' } }} // Chiếm 2 cột trên màn hình sm trở lên
                            size="small"
                        />
                        <FormControl fullWidth required size="small">
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
                            size="small"
                        />
                        <FormControl fullWidth required size="small">
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
                        <FormControl fullWidth required size="small">
                            <InputLabel>Trạng thái</InputLabel>
                            <Select
                                name="status"
                                value={newLecturer.status}
                                onChange={handleChange}
                                label="Trạng thái"
                            >
                                <MenuItem value="Đang giảng dạy">Đang giảng dạy</MenuItem>
                                <MenuItem value="Tạm nghỉ">Tạm nghỉ</MenuItem>
                                <MenuItem value="Đã nghỉ việc">Đã nghỉ việc</MenuItem>
                                <MenuItem value="Nghỉ hưu">Nghỉ hưu</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth required>
                            <InputLabel>Môn giảng dạy</InputLabel>
                            <Select
                                name="subjects"
                                value={newLecturer.subjects}
                                onChange={handleChange}
                                label="Môn giảng dạy"
                                multiple
                                renderValue={(selected) =>
                                    selected.map(id =>
                                        subjects?.find(subject => subject.subject_id === id)?.subject_name
                                    ).join(', ')
                                }
                            >
                                {subjects && subjects.length > 0 ? (
                                    subjects.map((subject) => (
                                        <MenuItem key={subject.subject_id} value={subject.subject_id}>
                                            {subject.subject_id} - {subject.subject_name}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>
                                        <em>Không có môn học nào</em>
                                    </MenuItem>
                                )} 

                            </Select>
                        </FormControl>
                    </Box>

                </DialogContent>

                <DialogActions sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Nút Nhập từ Excel nằm riêng biệt và rõ ràng hơn */}
                    <Box>
                        <label htmlFor="excel-upload-button">
                            <input
                                id="excel-upload-button"
                                type="file"
                                accept=".xlsx, .xls"
                                hidden
                                onChange={handleImportExcel}
                            />
                            <Button
                                variant="contained"
                                component="span"
                                startIcon={<CloudUploadIcon />}
                                sx={{ backgroundColor: '#28a745', '&:hover': { backgroundColor: '#218838' } }} // Màu xanh lá cây
                            >
                                Nhập từ Excel
                            </Button>
                        </label>
                    </Box>

                    {/* Các nút hành động chính */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            onClick={onClose}
                            variant="outlined"
                            color="inherit"
                            disabled={loading}
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                            {loading ? 'Đang thêm...' : 'Thêm giảng viên'}
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog >

            <PreviewLecturerModal
                open={showPreview}
                onClose={handleClosePreview}
                previewData={previewData}
                fetchLecturers={fetchLecturers}
                subjects={subjects}
            />
        </>
    );
}

export default AddLecturerModal;