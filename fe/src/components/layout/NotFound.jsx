import React from "react";
import { Box, Typography, Button, Container, useTheme } from "@mui/material";
import {
    SentimentVeryDissatisfied as ErrorIcon,
    Home as HomeIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                    textAlign: "center",
                    p: 3,
                }}
            >
                <ErrorIcon
                    sx={{
                        fontSize: 100,
                        color: theme.palette.error.main,
                        mb: 2,
                    }}
                />

                <Typography
                    variant="h1"
                    sx={{
                        fontSize: { xs: "2.5rem", sm: "3rem", md: "4rem" },
                        fontWeight: 700,
                        mb: 2,
                    }}
                >
                    404
                </Typography>

                <Typography
                    variant="h4"
                    sx={{
                        mb: 3,
                        color: theme.palette.text.secondary,
                    }}
                >
                    Oops! Không tìm thấy trang này!
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        mb: 4,
                        maxWidth: "600px",
                    }}
                >
                    Trang mà bạn đang tìm kiếm không tồn tại hoặc đã bị xóa. Vui lòng kiểm
                    tra lại đường dẫn hoặc quay lại trang chính để tiếp tục duyệt web.
                </Typography>

                <Button
                    variant="contained"
                    size="large"
                    startIcon={<HomeIcon />}
                    onClick={() => navigate("/home")}
                    sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        fontSize: "1rem",
                    }}
                >
                    Về trang chính
                </Button>
            </Box>
        </Container>
    );
};

export default NotFound;
