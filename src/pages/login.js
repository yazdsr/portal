import Head from 'next/head';
import Router from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { masterUrl } from '../constants/urls';
import SnkBr from '../components/snackbar';
import { useEffect, useState } from 'react';


const Login = () => {
  useEffect(() => {
    let token = window.localStorage.getItem("token")
    if (token) {
      Router.push("/").catch(console.error)
    }
  }, [])
  const [snkOpen, setSnkOpen] = useState(false)
  const [snkSev, setSnkSev] = useState("info")
  const [snkMsg, setSnkMsg] = useState("")

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    validationSchema: Yup.object({
      username: Yup
        .string()
        .max(255)
        .required('Username is required'),
      password: Yup
        .string()
        .max(255)
        .required('Password is required')
    }),
    onSubmit: () => {
      setSnkOpen(false)
      console.log(formik.values.username, formik.values.password)
      axios.post(`${masterUrl}/v1/login`, {
        username: formik.values.username,
        password: formik.values.password
      }).then(res => {
        setSnkSev("success")
        setSnkOpen(true)
        setSnkMsg("Successfull Login")
        window.localStorage.setItem("token", res.data.token)
        Router
        .push('/')
        .catch(console.error);
      }).catch(err => {
        setSnkSev("error")
        setSnkOpen(true)
        setSnkMsg(err?.response?.data?.message)
      })
      formik.setSubmitting(false)
    }
  });

  return (
    <>
      <Head>
        <title>Login | Yazd Server Room</title>
      </Head>
      <SnkBr open={snkOpen} sev={snkSev} msg={snkMsg} setOpen={setSnkOpen}/>
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          minHeight: '100%'
        }}
      >
        <Container maxWidth="sm">
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ my: 3 }}>
              <Typography
                color="textPrimary"
                variant="h4"
              >
                Sign in
              </Typography>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="body2"
              >
                Sign in on the internal Yazd Server Room Portal
              </Typography>
            </Box>
            <Grid
              container
              spacing={3}
            >

            </Grid>
            <TextField
              error={Boolean(formik.touched.username && formik.errors.username)}
              fullWidth
              helperText={formik.touched.username && formik.errors.username}
              label="Username"
              margin="normal"
              name="username"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.username}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Password"
              margin="normal"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
              variant="outlined"
            />
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Login
              </Button>
            </Box>
          </form>
        </Container>
      </Box>
    </>
  );
};

export default Login;
