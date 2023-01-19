import {
  Box,
  Button, Typography
} from '@mui/material';
import NextLink from 'next/link';


export const CustomerListToolbar = (props) => (
  <Box {...props}>
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        m: -1
      }}
    >
      <Typography
        sx={{ m: 1 }}
        variant="h4"
      >
        Users
      </Typography>
      <Box sx={{ m: 1 }}>
        <NextLink
          href="/adduser"
          passHref
        >
          <Button
            color="primary"
            variant="contained"
          >
            Add User
          </Button>
        </NextLink>
      </Box>
    </Box>
  </Box >
);
