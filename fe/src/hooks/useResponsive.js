import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

const useResponsive = () => {
  const theme = useTheme();
  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // < 700px
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md')); // < 900px
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('lg')); // < 1200px
  const isLargeScreen = useMediaQuery(theme.breakpoints.down('xl')); // < 1400px

  return { isExtraSmallScreen, isSmallScreen, isMediumScreen, isLargeScreen };
};

export default useResponsive;