import Head from 'next/head';
import { Container, Typography } from '@mui/material';
import { DashboardLayout } from '../components/dashboard-layout';
import { useState } from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField
} from '@mui/material';
import axios from 'axios';
import { masterUrl } from '../constants/urls';
import Router from 'next/router';
import SnkBr from '../components/snackbar';

const servers = [
  {
    value: 1,
    label: 'Server 1: 192.168.214.2'
  },
  {
    value: 2,
    label: 'Server 2: 192.168.214.3'
  },
  {
    value: 3,
    label: 'Server 3: 192.168.214.4'
  },
  {
    value: 4,
    label: 'Server 4: 192.168.214.5'
  }
];


const AddUser = () => {
  const [values, setValues] = useState({
    full_name: '',
    username: '',
    password: '',
    server_id: 1,
  });
  const [snkOpen, setSnkOpen] = useState(false)
  const [snkSev, setSnkSev] = useState("info")
  const [snkMsg, setSnkMsg] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    let token = window.localStorage.getItem("token")
    setSubmitting(true)
    axios.post(`http://${masterUrl}/v1/users`, {
      full_name: values.full_name,
      username: values.username,
      password: values.password,
      server_id: parseInt(values.server_id),
      valid_until: value.toISOString()
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      console.log(res)
      setSnkSev("success")
      setSnkOpen(true)
      setSnkMsg(res?.data?.message)
      setSubmitting(false)

      Router
        .push('/')
        .catch(console.error);
    }).catch(err => {
      setSnkSev("error")
      setSnkOpen(true)
      setSnkMsg(err?.response?.data?.message || err?.response?.data)
      console.log(err)
      setSubmitting(false)

    })
  }

  const [value, setValue] = useState(dayjs());

  const handleDateChange = (newValue) => {
    setValue(newValue);
  };
  return <>
    <Head>
      <title>
        Yazd SR Portal | Add User
      </title>
    </Head>
    <SnkBr open={snkOpen} sev={snkSev} msg={snkMsg} setOpen={setSnkOpen}/>

    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="lg">
        <Typography
          sx={{ mb: 3 }}
          variant="h4"
        >
          Add User
        </Typography>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={12}
            md={12}
            xs={12}
          >
            <form
              autoComplete="off"
              noValidate
              onSubmit={handleSubmit}
            >
              <Card>
                <Divider />
                <CardContent>
                  <Grid
                    container
                    spacing={3}
                  >
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        fullWidth
                        label="Full name"
                        name="full_name"
                        onChange={handleChange}
                        required
                        value={values.full_name}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        fullWidth
                        label="username"
                        name="username"
                        helperText="-- user can login with this username"
                        onChange={handleChange}
                        required
                        value={values.username}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        fullWidth
                        label="Password"
                        helperText="-- user can login with this password"
                        name="password"
                        onChange={handleChange}
                        required
                        type="password"
                        value={values.password}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        fullWidth
                        label="Select Server"
                        name="server_id"
                        onChange={handleChange}
                        required
                        select
                        SelectProps={{ native: true }}
                        value={values.server_id}
                        variant="outlined"
                      >
                        {servers.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid
                      item
                      md={12}
                      xs={12}
                    >
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileDatePicker
                          label="Due Date"
                          inputFormat="MM/DD/YYYY"
                          value={value}
                          onChange={handleDateChange}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </Grid>

                  </Grid>
                </CardContent>
                <Divider />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    p: 2
                  }}
                >
                  <Button
                    color="primary"
                    variant="contained"
                    type='submit'
                    disabled={submitting}
                  >
                    Save details
                  </Button>
                </Box>
              </Card>
            </form>
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
};

AddUser.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default AddUser;
