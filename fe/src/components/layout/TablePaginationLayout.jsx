import { TablePagination } from '@mui/material';
import React from 'react';

const TablePaginationLayout = ({count, page, rowsPerPage, onPageChange}) => {
    return (
        <TablePagination
            component="div"
            count={count}
            page={page}
            onPageChange={onPageChange}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[]}
            labelDisplayedRows={({ from, to, count }) => (
                <span style={{ fontSize: '0.875rem', color: '#555' }}>
                    Hiển thị <b>{from}-{to}</b> trong tổng số <b>{count}</b> mục
                </span>
            )}
            sx={{
                borderTop: '1px solid rgba(224, 224, 224, 1)',
                '& .MuiTablePagination-actions': {
                    marginLeft: '8px',
                    '& button': {
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        padding: '5px 10px',
                        '&:hover': {
                            backgroundColor: '#f5f5f5'
                        },
                        '&.Mui-disabled': {
                            opacity: 0.5
                        }
                    }
                },
                '& .MuiTablePagination-selectLabel': {
                    fontSize: '0.875rem',
                    color: '#555'
                },
                '& .MuiTablePagination-displayedRows': {
                    fontSize: '0.875rem',
                    color: '#555'
                }
            }}
        />
    );
}

export default TablePaginationLayout;