import {
    Box,
    Typography,
    Grid,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip
} from '@mui/material';
import {
    Warning,
    ChevronRight
} from '@mui/icons-material';

function RecentConflicts({ stats, recentConflicts }) {
    return (
        <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, minWidth: 200, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    Xung đột gần đây
                    {stats.conflicts > 0 && (
                        <Chip
                            label={stats.conflicts}
                            color="error"
                            size="small"
                            sx={{ ml: 1, verticalAlign: 'middle' }}
                        />
                    )}
                </Typography>

                {stats.conflicts === 0 ? (
                    <Box sx={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'text.secondary'
                    }}>
                        <Typography variant="body1" textAlign="center">
                            <CheckCircleOutlineIcon sx={{ fontSize: 40, mb: 1, color: 'success.main' }} />
                            <br />
                            Không có xung đột nào
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{
                        flex: 1,
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider'
                    }}>
                        <List sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            overflowY: 'auto',
                            p: 0,
                            '&::-webkit-scrollbar': {
                                width: '6px'
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'rgba(0,0,0,0.2)',
                                borderRadius: '3px'
                            }
                        }}>
                            {recentConflicts.map((conflict) => (
                                <ListItem
                                    key={conflict.id}
                                    sx={{
                                        borderLeft: '4px solid',
                                        borderColor: 'error.main',
                                        px: 2,
                                        py: 1.5,
                                        transition: 'background-color 0.2s ease',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 0, 0, 0.05)',
                                            cursor: 'pointer'
                                        },
                                        '& + &': {
                                            borderTop: '1px solid',
                                            borderColor: 'divider'
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                        <Warning color="error" fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle2" component="div">
                                                {conflict.type}: {conflict.name}
                                            </Typography>
                                        }
                                        secondary={
                                            <>
                                                <Typography
                                                    variant="caption"
                                                    component="div"
                                                    color="text.secondary"
                                                    sx={{ mt: 0.5 }}
                                                >
                                                    {new Date(conflict.time).toLocaleString()}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    component="div"
                                                    sx={{ mt: 0.5 }}
                                                >
                                                    {conflict.conflictWith}
                                                </Typography>
                                            </>
                                        }
                                        sx={{ my: 0 }}
                                    />
                                    <ChevronRight color="action" fontSize="small" />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}
            </Paper>
        </Grid>
    );
}

export default RecentConflicts;