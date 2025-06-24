import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Card, 
  Table, 
  Button, 
  Space, 
  Popconfirm, 
  message, 
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Tabs
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UploadOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import LecturerImport from '../components/LecturerImport';
import { lecturerAPI } from '../api/lecturerAPI';
import dayjs from 'dayjs';

const { Content } = Layout;
const { Option } = Select;
const { TabPane } = Tabs;

const LecturerManagement = () => {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingLecturer, setEditingLecturer] = useState(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('list');

  // Load lecturers
  const loadLecturers = async () => {
    setLoading(true);
    try {
      const response = await lecturerAPI.getAll();
      setLecturers(response.data.data || []);
    } catch (error) {
      message.error('Lỗi khi tải danh sách giảng viên: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLecturers();
  }, []);

  // Refresh data when switching back to list tab
  const handleTabChange = (key) => {
    setActiveTab(key);
    if (key === 'list') {
      loadLecturers(); // Refresh data after import
    }
  };

  // Handle create/edit lecturer
  const handleSave = async (values) => {
    try {
      const lecturerData = {
        ...values,
        day_of_birth: values.day_of_birth ? values.day_of_birth.format('YYYY-MM-DD') : null,
        hire_date: values.hire_date ? values.hire_date.format('YYYY-MM-DD') : null,
      };

      if (editingLecturer) {
        await lecturerAPI.update(editingLecturer.lecturer_id, lecturerData);
        message.success('Cập nhật giảng viên thành công!');
      } else {
        await lecturerAPI.create(lecturerData);
        message.success('Thêm giảng viên thành công!');
      }

      setModalVisible(false);
      setEditingLecturer(null);
      form.resetFields();
      loadLecturers();
    } catch (error) {
      message.error('Lỗi khi lưu giảng viên: ' + (error.response?.data?.message || error.message));
    }
  };

  // Handle delete lecturer
  const handleDelete = async (lecturerId) => {
    try {
      await lecturerAPI.delete(lecturerId);
      message.success('Xóa giảng viên thành công!');
      loadLecturers();
    } catch (error) {
      message.error('Lỗi khi xóa giảng viên: ' + (error.response?.data?.message || error.message));
    }
  };

  // Open create modal
  const handleCreate = () => {
    setEditingLecturer(null);
    setModalVisible(true);
    form.resetFields();
  };

  // Open edit modal
  const handleEdit = (lecturer) => {
    setEditingLecturer(lecturer);
    setModalVisible(true);
    form.setFieldsValue({
      ...lecturer,
      day_of_birth: lecturer.day_of_birth ? dayjs(lecturer.day_of_birth) : null,
      hire_date: lecturer.hire_date ? dayjs(lecturer.hire_date) : null,
    });
  };

  // Table columns
  const columns = [
    {
      title: 'Mã GV',
      dataIndex: 'lecturer_id',
      key: 'lecturer_id',
      width: 100
    },
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'name',
      width: 150
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200
    },
    {
      title: 'Khoa/Bộ môn',
      dataIndex: 'department',
      key: 'department',
      width: 150
    },
    {
      title: 'Học vị',
      dataIndex: 'degree',
      key: 'degree',
      width: 100
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <span style={{ 
          color: status === 'active' ? '#52c41a' : '#ff4d4f' 
        }}>
          {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </span>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa giảng viên này?"
            onConfirm={() => handleDelete(record.lecturer_id)}
            okText="Có"
            cancelText="Không"
          >
            <Button 
              danger 
              size="small" 
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Layout>
      <Content style={{ padding: '24px' }}>
        <Card>
          <Tabs activeKey={activeTab} onChange={handleTabChange}>
            <TabPane 
              tab={
                <span>
                  <span>Danh sách Giảng viên</span>
                </span>
              } 
              key="list"
            >
              <div style={{ marginBottom: 16 }}>
                <Space>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={handleCreate}
                  >
                    Thêm Giảng viên
                  </Button>
                  <Button 
                    icon={<DownloadOutlined />}
                    onClick={() => setActiveTab('import')}
                  >
                    Import Excel
                  </Button>
                </Space>
              </div>

              <Table
                columns={columns}
                dataSource={lecturers}
                rowKey="lecturer_id"
                loading={loading}
                scroll={{ x: 1000 }}
                pagination={{
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => 
                    `${range[0]}-${range[1]} của ${total} giảng viên`,
                }}
              />
            </TabPane>

            <TabPane 
              tab={
                <span>
                  <UploadOutlined />
                  Import Excel
                </span>
              } 
              key="import"
            >
              <LecturerImport />
            </TabPane>
          </Tabs>
        </Card>

        {/* Create/Edit Modal */}
        <Modal
          title={editingLecturer ? 'Sửa Giảng viên' : 'Thêm Giảng viên'}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            setEditingLecturer(null);
            form.resetFields();
          }}
          footer={null}
          width={800}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            initialValues={{
              status: 'active'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Form.Item
                name="lecturer_id"
                label="Mã giảng viên"
                rules={[{ required: true, message: 'Vui lòng nhập mã giảng viên!' }]}
              >
                <Input disabled={!!editingLecturer} />
              </Form.Item>

              <Form.Item
                name="name"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="phone_number"
                label="Số điện thoại"
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="day_of_birth"
                label="Ngày sinh"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                name="gender"
                label="Giới tính"
              >
                <Select>
                  <Option value="Nam">Nam</Option>
                  <Option value="Nữ">Nữ</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="department"
                label="Khoa/Bộ môn"
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="degree"
                label="Học vị"
              >
                <Select>
                  <Option value="Tiến sỹ">Tiến sỹ</Option>
                  <Option value="Thạc sỹ">Thạc sỹ</Option>
                  <Option value="Cử nhân">Cử nhân</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="hire_date"
                label="Ngày tuyển dụng"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                name="status"
                label="Trạng thái"
              >
                <Select>
                  <Option value="active">Hoạt động</Option>
                  <Option value="inactive">Không hoạt động</Option>
                </Select>
              </Form.Item>
            </div>

            <Form.Item
              name="address"
              label="Địa chỉ"
            >
              <Input.TextArea rows={2} />
            </Form.Item>

            <Form.Item style={{ textAlign: 'right', marginTop: 24 }}>
              <Space>
                <Button onClick={() => {
                  setModalVisible(false);
                  setEditingLecturer(null);
                  form.resetFields();
                }}>
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingLecturer ? 'Cập nhật' : 'Thêm mới'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default LecturerManagement;
