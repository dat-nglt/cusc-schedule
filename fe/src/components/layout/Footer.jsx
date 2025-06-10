import React from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Link,
    List,
    ListItem,
    ListItemIcon,
    useTheme,
    useMediaQuery,
    ImageList,
    ImageListItem
} from '@mui/material';
import {
    Email,
    Phone,
    LocationOn,
    Article,
    School,
    MenuBook
} from '@mui/icons-material';

const Footer = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const contactInfo = [
        { icon: <LocationOn fontSize="small" />, text: '01 Lý Tự Trọng, Quận Ninh Kiều, TP. Cần Thơ' },
        { icon: <Phone fontSize="small" />, text: '+84 292 383 5581 | Hotline: 0901900665' },
        { icon: <Email fontSize="small" />, text: 'cusc@ctu.edu.vn' }
    ];

    const quickLinks = [
        {
            title: 'Tin tức',
            items: ['Tin tức hoạt động', 'Hoạt động ngoại khoá', 'Giáo dục & Công nghệ']
        },
        {
            title: 'Tuyển sinh',
            items: ['Ghi danh trực tuyến', 'Lịch tuyển sinh']
        },
        {
            title: 'Chương trinh đào tạo',
            items: ['Lập trình viên quốc tế', 'Quản trị mạng', 'Phát triển ứng dụng web']
        },
        {
            title: 'Cao đẳng - Liên thông',
            items: ['Quyết định', 'Quy định', 'Thời khoá biểu',]
        }
    ];

    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[100],
                color: theme.palette.text.primary,
                py: 4,
                borderTop: `1px solid ${theme.palette.divider}`
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    {/* Contact Info & Map */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            mb: 2,
                            fontSize: isMobile ? '1rem' : '1.1rem'
                        }}>
                            Trung tâm Công nghệ phần mềm
                        </Typography>

                        <List dense sx={{ mb: 2 }}>
                            {contactInfo.map((item, index) => (
                                <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                                    <ListItemIcon sx={{ minWidth: 32, color: theme.palette.primary.main }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                                        {item.text}
                                    </Typography>
                                </ListItem>
                            ))}
                        </List>
                    </Grid>

                    {/* Quick Links */}
                    <Grid item xs={12} md={6}>
                        <Grid container spacing={2}>
                            {quickLinks.map((section, index) => (
                                <Grid item xs={6} sm={4} key={index}>
                                    <Typography variant="subtitle2" sx={{
                                        fontWeight: 600,
                                        mb: 1,
                                        fontSize: '0.95rem',
                                        color: theme.palette.primary.main
                                    }}>
                                        {section.title}
                                    </Typography>
                                    <List dense>
                                        {section.items.map((item, itemIndex) => (
                                            <ListItem key={itemIndex} sx={{ px: 0, py: 0.5 }}>
                                                <Link
                                                    href="#"
                                                    color="inherit"
                                                    underline="hover"
                                                    sx={{
                                                        fontSize: '0.85rem',
                                                        '&:hover': {
                                                            color: theme.palette.primary.main
                                                        }
                                                    }}
                                                >
                                                    {item}
                                                </Link>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>

                <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', mt: 1, gap: 1 }}>
                    <Box sx={{
                        flex: 1,
                        display: isMobile ? 'none' : 'block',
                        overflow: 'hidden',
                        mt: 1,
                        borderRadius: 1,

                    }}>
                        <img
                            src={`https://cusc.vn/admin/app/uploads/2025/03/AVATAR_CUSC-1.jpg`}
                            loading="lazy"
                            style={{ height: '200px', width: '100%', objectFit: 'cover', }}
                        />
                    </Box>


                    {/* Map Embed - Compact Size */}
                    <Box sx={{
                        height: 200,
                        flex: 2,
                        borderRadius: 1,
                        overflow: 'hidden',
                        border: `1px solid ${theme.palette.divider}`
                    }}>
                        <iframe
                            title="CUSC Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.715321942829!2d105.7832143152609!3d10.031958075925012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0883d1a9e0a6b%3A0x4a0c5f5e5e5e5e5e!2sCan%20Tho%20University!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                        />
                    </Box>
                </Box>

                {/* Copyright */}
                <Box sx={{
                    mt: 3,
                    pt: 2,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    textAlign: 'center'
                }}>
                    <Typography variant="body2" sx={{
                        fontSize: '0.75rem',
                        color: theme.palette.text.secondary
                    }}>
                        © {new Date().getFullYear()} CUSC - Đại học Cần Thơ
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;