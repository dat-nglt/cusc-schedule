import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

const useResponsive = () => {
  const theme = useTheme();
  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // < 600px
  const isSmallScreen = useMediaQuery(theme.breakpoints.between('sm', 'md')); // 600px - 900px
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg')); // 900px - 1200px
  const isLargeScreen = !useMediaQuery(theme.breakpoints.up('xl')); // < 1400px (giả sử xl = 1400px)

  return { isExtraSmallScreen, isSmallScreen, isMediumScreen, isLargeScreen };
};

export default useResponsive;