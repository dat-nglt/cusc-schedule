import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const MainContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  gap: 2,
  overflowY: 'scroll',
});

export default MainContainer;
