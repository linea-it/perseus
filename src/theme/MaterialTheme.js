import { createMuiTheme } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';

const primary = '#34465d';
const secondary = '#34465a';

const theme = createMuiTheme({
  palette: {
    primary: { main: primary },
    secondary: { main: secondary },
    background: primary,
    tab: secondary,
  },
  typography: {
    fontSize: 16,
  },
});

export default theme;
