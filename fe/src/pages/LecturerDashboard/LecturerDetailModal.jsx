import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  Chip,
  Avatar,
  useTheme,
  alpha,
  useMediaQuery,
} from '@mui/material';
import {
  Close,
  School,
  Person,
  Business,
  Email,
  Phone,
  LocationOn,
  AccessTime,
  Assignment,
  Notifications,
} from '@mui/icons-material';

const LecturerDetailModal = ({ openModal, handleCloseModal, lecturerInfo }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const InfoItem = ({ icon, label, value, sx }) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        flexBasis: { xs: '100%', sm: 'calc(50% - 16px)' },
        minWidth: { xs: '100%', sm: 'calc(50% - 16px)' },
        flexGrow: 1,
        gap: 1.5,
        p: { xs: 1.5, sm: 1 },
        borderRadius: 2,
        bgcolor: alpha(theme.palette.grey[100], 0.8),
        border: `1px solid ${theme.palette.divider}`,
        boxSizing: 'border-box',
        ...sx,
      }}
    >
      <Box sx={{
        width: 35,
        height: 35,
        borderRadius: '10px',
        bgcolor: alpha(theme.palette.primary.main, 0.1),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {React.cloneElement(icon, {
          fontSize: 'small',
          sx: { color: theme.palette.primary.main },
        })}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            fontWeight: 500,
            lineHeight: 1.2,
            display: 'block',
          }}
        >
          {label}
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 500,
            color: theme.palette.text.primary,
            mt: 0.5,
            fontSize: { xs: '0.875rem', sm: '0.9375rem' },
          }}
        >
          {value || '---'}
        </Typography>
      </Box>
    </Box>
  );

  const SectionTitle = ({ icon, title }) => (
    <Typography
      variant="subtitle2"
      sx={{
        mb: 2,
        display: 'flex',
        alignItems: 'center',
        color: theme.palette.primary.dark,
        fontWeight: 600,
        pb: 1,
        borderBottom: `1px dashed ${alpha(theme.palette.divider, 0.5)}`,
      }}
    >
      {React.cloneElement(icon, { sx: { mr: 1, fontSize: 18 } })}
      {title}
    </Typography>
  );

  return (
    <Dialog
      open={openModal}
      onClose={handleCloseModal}
      fullWidth
      maxWidth={false} // Loại bỏ maxWidth cố định, tự điều chỉnh
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden',
          margin: isMobile ? '8px' : '32px', // Margin linh hoạt
          top: isMobile ? '8px' : '25px', // Điều chỉnh top dựa trên chiều cao header
          maxHeight: `calc(100vh - ${isMobile ? '16px' : '120px'})`, // Trừ chiều cao header và margin
          width: isMobile ? '95%' : '80%', // Tăng chiều rộng
          maxWidth: isMobile ? '450px' : '800px', // Tăng giới hạn tối đa
          zIndex: 1500, // Giữ z-index cao
        },
      }}
    >
      <DialogTitle sx={{
        py: { xs: 1.5, sm: 2 },
        px: { xs: 2, sm: 3 },
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white',
        position: 'relative',
      }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            Hồ sơ giảng viên
          </Typography>
          <IconButton
            onClick={handleCloseModal}
            sx={{
              color: 'white',
              '&:hover': {
                bgcolor: alpha('#fff', 0.1),
              },
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0, overflowY: 'auto' }}> {/* Thêm scroll nếu cần */}
        <Box sx={{ p: { xs: 2, sm: 3 }, pt: { xs: 3, sm: 4 } }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 3,
            flexDirection: { xs: 'column', sm: 'row' },
            textAlign: { xs: 'center', sm: 'left' },
          }}>
            <Avatar
              src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
              sx={{
                width: { xs: 60, sm: 70 },
                height: { xs: 60, sm: 70 },
                mr: { xs: 0, sm: 2 },
                mb: { xs: 2, sm: 0 },
                border: `3px solid ${alpha(theme.palette.primary.light, 0.3)}`,
                bgcolor: theme.palette.primary.light,
                flexShrink: 0,
              }}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom sx={{ fontSize: { xs: '1.125rem', sm: '1.375rem' } }}>
                {lecturerInfo.name}
              </Typography>
              <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: { xs: 0.5, sm: 1 },
                justifyContent: { xs: 'center', sm: 'flex-start' },
              }}>
                <Chip
                  label={lecturerInfo.id}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    color: theme.palette.secondary.dark,
                    fontSize: { xs: '0.6rem', sm: '0.75rem' },
                  }}
                />
                <Chip
                  label={lecturerInfo.department}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.dark,
                    fontSize: { xs: '0.6rem', sm: '0.75rem' },
                  }}
                />
                <Chip
                  label={lecturerInfo.degree}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.dark,
                    fontSize: { xs: '0.6rem', sm: '0.75rem' },
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 2, sm: 2 },
          }}>
            <Box sx={{
              flex: 1,
              p: { xs: 1, sm: 1.5 },
              bgcolor: alpha(theme.palette.background.paper, 0.9),
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
            }}>
              <SectionTitle icon={<Person />} title="Thông tin cá nhân" />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, sm: 1.5 } }}>
                <InfoItem icon={<Person />} label="Giới tính" value={lecturerInfo.gender === 'male' ? 'Nam' : 'Nữ'} />
                <InfoItem icon={<AccessTime />} label="Ngày sinh" value={lecturerInfo.dob} />
              </Box>
            </Box>
            <Box sx={{
              flex: 1,
              p: { xs: 1, sm: 1.5 },
              bgcolor: alpha(theme.palette.background.paper, 0.9),
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
            }}>
              <SectionTitle icon={<Person />} title="Thông tin nghiệp vụ" />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, sm: 1.5 } }}>
                <InfoItem icon={<School />} label="Học vị" value={lecturerInfo.degree} />
                <InfoItem icon={<LocationOn />} label="Khoa" value={lecturerInfo.department} />
              </Box>
            </Box>

            <Box sx={{
              p: { xs: 1, sm: 1.5 },
              flex: 1,
              bgcolor: alpha(theme.palette.background.paper, 0.9),
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
            }}>
              <SectionTitle icon={<Phone />} title="Liên hệ" />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, sm: 1.5 } }}>
                <InfoItem icon={<Email />} label="Email" value={lecturerInfo.email} />
                <InfoItem icon={<Phone />} label="Điện thoại" value={lecturerInfo.phone} />
                <InfoItem icon={<LocationOn />} label="Địa chỉ liên hệ" value={lecturerInfo.contactAddress} />
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: { xs: 1.5, sm: 2 }, justifyContent: 'flex-end' }}>
        <Button
          onClick={handleCloseModal}
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: { xs: 1.5, sm: 2 },
            textTransform: 'none',
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
          }}
        >
          Đóng
        </Button>
        <Button
          variant="contained"
          sx={{
            borderRadius: 2,
            px: { xs: 1.5, sm: 2 },
            textTransform: 'none',
            bgcolor: theme.palette.primary.main,
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
            },
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
          }}
        >
          In hồ sơ
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LecturerDetailModal;