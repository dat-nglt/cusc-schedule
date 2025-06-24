import React, { useState } from 'react';
import { 
  Button, 
  Upload, 
  Progress, 
  Alert, 
  Table, 
  Space, 
  Card, 
  Typography, 
  Divider,
  Tag,
  Modal,
  message
} from 'antd';
import { 
  UploadOutlined, 
  DownloadOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { lecturerAPI } from '../api/lecturerAPI';

const { Title, Text } = Typography;
const { Dragger } = Upload;

const LecturerImport = () => {
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);  const [fileList, setFileList] = useState([]);
  const [showResultModal, setShowResultModal] = useState(false);

  // Download template Excel
  const handleDownloadTemplate = async () => {
    try {
      message.loading('Đang tải template...', 1);
      const response = await lecturerAPI.downloadTemplate();
      
      // Tạo blob URL và download
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'lecturer_template.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      message.success('Tải template thành công!');
    } catch (error) {
      message.error('Lỗi khi tải template: ' + (error.response?.data?.message || error.message));
    }
  };

  // Import Excel file
  const handleImport = async (file) => {
    setImporting(true);
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append('excel_file', file);

      const response = await lecturerAPI.importFromExcel(formData);
      
      setImportResult(response.data);
      setShowResultModal(true);
      
      // Reset file list after successful import
      setFileList([]);
      
      // Show success message
      const { summary } = response.data.data;
      if (summary.errors === 0) {
        message.success(`Import thành công ${summary.success} giảng viên!`);
      } else {
        message.warning(`Import hoàn tất: ${summary.success} thành công, ${summary.errors} lỗi!`);
      }
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      message.error('Lỗi khi import: ' + errorMsg);
      setImportResult({
        status: 'error',
        message: errorMsg
      });
    } finally {
      setImporting(false);
    }
  };

  // Upload props
  const uploadProps = {
    name: 'excel_file',
    multiple: false,
    fileList,
    beforeUpload: (file) => {
      // Validate file type
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                     file.type === 'application/vnd.ms-excel' ||
                     file.name.endsWith('.xlsx') || 
                     file.name.endsWith('.xls');
      
      if (!isExcel) {
        message.error('Chỉ chấp nhận file Excel (.xlsx, .xls)!');
        return false;
      }

      // Validate file size (5MB)
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('File phải nhỏ hơn 5MB!');
        return false;
      }

      setFileList([file]);
      return false; // Prevent auto upload
    },
    onRemove: () => {
      setFileList([]);
    }
  };

  // Success records columns
  const successColumns = [
    {
      title: 'Dòng',
      dataIndex: 'row',
      key: 'row',
      width: 80
    },
    {
      title: 'Mã GV',
      dataIndex: 'lecturer_id',
      key: 'lecturer_id'
    },
    {
      title: 'Tên giảng viên',
      dataIndex: 'name',  
      key: 'name'
    }
  ];

  // Error records columns
  const errorColumns = [
    {
      title: 'Dòng',
      dataIndex: 'row',
      key: 'row',
      width: 80
    },
    {
      title: 'Mã GV',
      dataIndex: 'lecturer_id',
      key: 'lecturer_id'
    },
    {
      title: 'Lỗi',
      dataIndex: 'error',
      key: 'error',
      render: (text) => <Text type="danger">{text}</Text>
    }
  ];

  return (
    <div style={{ padding: '24px', background: '#f5f5f5' }}>
      <Card>
        <Title level={3}>
          <UploadOutlined /> Import Giảng viên từ Excel
        </Title>
        
        <Alert
          message="Hướng dẫn sử dụng"
          description={
            <div>
              <p>1. Tải xuống file template Excel mẫu</p>
              <p>2. Điền thông tin giảng viên vào file template</p>
              <p>3. Upload file Excel đã hoàn thành để import</p>
              <p><strong>Lưu ý:</strong> File phải có định dạng .xlsx hoặc .xls và kích thước &lt; 5MB</p>
            </div>
          }
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Download Template Section */}
          <Card size="small" title="Bước 1: Tải Template Excel">
            <Space>
              <Button 
                type="primary" 
                icon={<DownloadOutlined />}
                onClick={handleDownloadTemplate}
              >
                Tải Template Excel
              </Button>
              <Text type="secondary">Template chứa cấu trúc dữ liệu mẫu</Text>
            </Space>
          </Card>

          {/* Upload File Section */}
          <Card size="small" title="Bước 2: Upload File Excel">
            <Dragger {...uploadProps} style={{ marginBottom: 16 }}>
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">Click hoặc kéo thả file Excel vào đây</p>
              <p className="ant-upload-hint">
                Hỗ trợ file .xlsx và .xls, tối đa 5MB
              </p>
            </Dragger>

            <Space>
              <Button 
                type="primary"
                loading={importing}
                disabled={fileList.length === 0}
                onClick={() => handleImport(fileList[0])}
              >
                {importing ? 'Đang Import...' : 'Bắt đầu Import'}
              </Button>
              
              {importing && (
                <Text type="secondary">Đang xử lý file, vui lòng đợi...</Text>
              )}
            </Space>
          </Card>

          {/* Import Result */}
          {importResult && importResult.status !== 'error' && (
            <Card size="small" title="Kết quả Import">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <Tag color="blue" icon={<InfoCircleOutlined />}>
                    Tổng: {importResult.data.summary.total}
                  </Tag>
                  <Tag color="green" icon={<CheckCircleOutlined />}>
                    Thành công: {importResult.data.summary.success}
                  </Tag>
                  <Tag color="red" icon={<CloseCircleOutlined />}>
                    Lỗi: {importResult.data.summary.errors}
                  </Tag>
                </div>

                {importResult.data.summary.total > 0 && (
                  <Button 
                    type="link" 
                    onClick={() => setShowResultModal(true)}
                  >
                    Xem chi tiết kết quả
                  </Button>
                )}
              </Space>
            </Card>
          )}

          {/* Error Alert */}
          {importResult && importResult.status === 'error' && (
            <Alert
              message="Lỗi Import"
              description={importResult.message}
              type="error"
              showIcon
            />
          )}
        </Space>
      </Card>

      {/* Result Detail Modal */}
      <Modal
        title="Chi tiết kết quả Import"
        open={showResultModal}
        onCancel={() => setShowResultModal(false)}
        footer={[
          <Button key="close" onClick={() => setShowResultModal(false)}>
            Đóng
          </Button>
        ]}
        width={800}
      >
        {importResult && importResult.data && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Summary */}
            <div>
              <Title level={5}>Tổng kết</Title>
              <Space>
                <Tag color="blue">Tổng: {importResult.data.summary.total}</Tag>
                <Tag color="green">Thành công: {importResult.data.summary.success}</Tag>
                <Tag color="red">Lỗi: {importResult.data.summary.errors}</Tag>
              </Space>
            </div>

            <Divider />

            {/* Success Records */}
            {importResult.data.successRecords.length > 0 && (
              <div>
                <Title level={5} style={{ color: '#52c41a' }}>
                  <CheckCircleOutlined /> Bản ghi thành công ({importResult.data.successRecords.length})
                </Title>
                <Table
                  columns={successColumns}
                  dataSource={importResult.data.successRecords}
                  rowKey="row"
                  size="small"
                  pagination={{ pageSize: 5 }}
                />
              </div>
            )}

            {/* Error Records */}
            {importResult.data.errorRecords.length > 0 && (
              <div>
                <Title level={5} style={{ color: '#ff4d4f' }}>
                  <CloseCircleOutlined /> Bản ghi lỗi ({importResult.data.errorRecords.length})
                </Title>
                <Table
                  columns={errorColumns}
                  dataSource={importResult.data.errorRecords}
                  rowKey="row"
                  size="small"
                  pagination={{ pageSize: 5 }}
                />
              </div>
            )}
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default LecturerImport;
