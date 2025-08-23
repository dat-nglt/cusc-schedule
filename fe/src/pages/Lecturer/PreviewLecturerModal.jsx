import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Tooltip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { importLecturersAPI } from '../../api/lecturerAPI';
import { getRowStatus, getErrorChip } from '../../components/ui/ErrorChip';

export default function PreviewLecturerModal({ open, onClose, previewData, fetchLecturers, subjects }) {
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState('');
  const [importMessage, setImportMessage] = useState('');

  // Validate preview data with subject checking
  const validatePreviewData = (data) => {
    return data.map(row => {
      let errors = row.errors || [];

      // Nếu đã có lỗi từ trước, chỉ giữ lại lỗi đầu tiên để tránh spam lỗi
      if (errors.length > 0) {
        errors = [errors[0]];
      } else {
        // Kiểm tra nếu dòng có danh sách mã môn giảng dạy
        if (row.subjectIds && row.subjectIds.length > 0) {
          const invalidSubjects = row.subjectIds.filter(subjectId => {
            return subjects && !subjects.some(subject => subject.subject_id === subjectId.trim());
          });
          // Nếu có mã môn giảng dạy không hợp lệ, tạo thông báo lỗi
          if (invalidSubjects.length > 0) {
            errors = [`Mã môn giảng dạy "${invalidSubjects.join(', ')}" không tồn tại trong hệ thống`];
          }
        }
      }

      return {
        ...row, // Giữ nguyên tất cả thuộc tính của dòng
        errors // Cập nhật mảng lỗi mới
      };
    });
  };

  // Validate data with subject checking
  const validatedData = validatePreviewData(previewData);
  const validRows = validatedData.filter((row) => getRowStatus(row) === "valid");
  const errorRows = validatedData.filter((row) => getRowStatus(row) === "error");

  const handleConfirmImport = async () => {
    if (validRows.length === 0) {
      setImportError("Không có dữ liệu hợp lệ!");
      return;
    }

    setIsImporting(true);
    setImportError("");
    setImportMessage("");

    try {
      // Tạo file Excel tạm thời chỉ với dữ liệu hợp lệ
      const validData = validRows.map(row => {
        const { errors: _errors, rowIndex: _rowIndex, ...lecturerData } = row;
        return lecturerData;
      });
      console.log('Valid data to import:', validData);
      // Gọi API import với dữ liệu đã được validate
      const response = await importLecturersAPI(validData);

      if (response.data) {
        setImportMessage(`Thêm thành công ${validRows.length} giảng viên`);
        setImportError("");
        fetchLecturers(); // Cập nhật danh sách giảng viên sau khi thêm thành công
        // Delay để người dùng thấy thông báo thành công trước khi đóng modal
        setTimeout(() => {
          setImportMessage("");
          onClose();
        }, 1500);
      } else {
        setImportError(
          response.data?.message || "Có lỗi xảy ra khi thêm dữ liệu!"
        );
      }
    } catch (error) {
      console.error("Error importing data:", error);
      setImportError(
        error.message || "Lỗi khi thêm dữ liệu! Vui lòng thử lại."
      );
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Typography >Xem trước dữ liệu đã nhập</Typography>
      </DialogTitle>
      <DialogContent>
        {importError && (
          <Typography color="error" sx={{ mb: 2 }}>
            {importError}
          </Typography>
        )}
        {importMessage && (
          <div style={{
            marginBottom: '16px',
            fontWeight: 'bold',
            color: 'success.main',
            fontSize: '16px',
            padding: '8px',
            backgroundColor: '#f1f8e9',
            border: '1px solid #4caf50',
            borderRadius: '4px'
          }}>
            {importMessage}
          </div>
        )}

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Chip
              icon={<CheckCircleIcon />}
              label={`Hợp lệ: ${validRows.length}`}
              color="success"
              variant="outlined"
            />
            <Chip
              icon={<ErrorIcon />}
              label={`Không hợp lệ: ${errorRows.length}`}
              color="error"
              variant="outlined"
            />
            <Chip
              label={`Tổng cộng: ${previewData.length}`}
              variant="outlined"
            />
          </Box>
        </Box>

        {/* Hiển thị dữ liệu hợp lệ */}
        {validRows.length > 0 && (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" color="success.main">
                Dữ liệu hợp lệ ({validRows.length} dòng)
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Mã GV</TableCell>
                      <TableCell>Họ tên</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Giới tính</TableCell>
                      <TableCell>SĐT</TableCell>
                      <TableCell>Mã môn giảng dạy</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {validRows.map((lecturer, index) => (
                      <TableRow key={index}>
                        <TableCell>{lecturer.lecturer_id}</TableCell>
                        <TableCell>{lecturer.name}</TableCell>
                        <TableCell>{lecturer.email}</TableCell>
                        <TableCell>
                          {lecturer.gender === "male"
                            ? "Nam"
                            : lecturer.gender === "female"
                              ? "Nữ"
                              : lecturer.gender}
                        </TableCell>
                        <TableCell>{lecturer.phone_number}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {lecturer.subjectIds && lecturer.subjectIds.length > 0
                              ? lecturer.subjectIds.map((subjectId, idx) => (
                                <Chip
                                  key={idx}
                                  label={subjectId}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: '0.75rem' }}
                                />
                              ))
                              : <Typography variant="body2" color="text.secondary">-</Typography>}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Hiển thị dữ liệu có lỗi */}
        {errorRows.length > 0 && (
          <Accordion defaultExpanded sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" color="error.main">
                Dữ liệu không hợp lệ ({errorRows.length} dòng)
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Mã GV</TableCell>
                      <TableCell>Họ tên</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>SĐT</TableCell>
                      <TableCell>môn giảng dạy</TableCell>
                      <TableCell>Lỗi</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {errorRows.map((lecturer, index) => (
                      <TableRow
                        key={index}
                        sx={{ bgcolor: 'error.lighter' }}
                      >
                        <TableCell>{lecturer.lecturer_id || '-'}</TableCell>
                        <TableCell>{lecturer.name || '-'}</TableCell>
                        <TableCell>{lecturer.email || '-'}</TableCell>
                        <TableCell>{lecturer.phone_number || '-'}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {lecturer.subjectIds && lecturer.subjectIds.length > 0
                              ? lecturer.subjectIds.map((subjectId, idx) => (
                                <Chip
                                  key={idx}
                                  label={subjectId}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: '0.75rem' }}
                                />
                              ))
                              : <Typography variant="body2" color="text.secondary">-</Typography>}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                            {lecturer.errors.map((error) => getErrorChip(error, 'giảng viên'))}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Hủy
        </Button>
        <Button
          onClick={handleConfirmImport}
          variant="contained"
          disabled={validRows.length === 0 || isImporting || importMessage}
          sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}
        >
          {isImporting ? 'Đang thêm...' :
            importMessage ? 'Đã thêm thành công' :
              `Thêm ${validRows.length} giảng viên`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}