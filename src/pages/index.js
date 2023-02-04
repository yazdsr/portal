import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import { CustomerListResults } from '../components/customer/customer-list-results';
import { CustomerListToolbar } from '../components/customer/customer-list-toolbar';
import { DashboardLayout } from '../components/dashboard-layout';
import axios from 'axios'
import { masterUrl } from '../constants/urls';

const Page = () => {
  const [users, setUsers] = useState([])
  const [snkOpen, setSnkOpen] = useState(false)
  const [snkSev, setSnkSev] = useState("info")
  const [snkMsg, setSnkMsg] = useState("")
  useEffect(() => {
    let token = window.localStorage.getItem("token")
    axios.get(`http://${masterUrl}/v1/users`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        setUsers(res.data)
      }).catch(err => {
        setSnkSev("error")
        setSnkOpen(true)
        setSnkMsg("error while fetching users data")
      })
  })
  return <>
    <Head>
      <title>
        Yazd SR Portal | Dashboard
      </title>
    </Head>
    {snkOpen ? <SnkBr open={snkOpen} sev={snkSev} msg={snkMsg}/> : <></>}
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth={false}>
        <CustomerListToolbar />
        <Box sx={{ mt: 3 }}>
          <CustomerListResults customers={users} />
        </Box>
      </Container>
    </Box>
  </>
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
