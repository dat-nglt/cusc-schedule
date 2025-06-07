
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

const useResponsive = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md')); // < 900px
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('lg')); // < 1200px

  return { isSmallScreen, isMediumScreen };
};

export default useResponsive;