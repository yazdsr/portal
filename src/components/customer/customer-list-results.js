import { useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Card,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  IconButton
} from '@mui/material';
import axios from 'axios';
import { masterUrl } from '../../constants/urls';
import SnkBr from '../snackbar';
import Link from 'next/link';
import { DeleteForeverOutlined } from '@material-ui/icons';
import dayjs from 'dayjs';


export const CustomerListResults = () => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const [snkOpen, setSnkOpen] = useState(false)
  const [snkSev, setSnkSev] = useState("info")
  const [snkMsg, setSnkMsg] = useState("")
  const [customers, setCustomers] = useState([])

  const handleSelectAll = (event) => {
    let newSelectedCustomerIds;

    if (event.target.checked) {
      newSelectedCustomerIds = customers.map((customer) => customer.id);
    } else {
      newSelectedCustomerIds = [];
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const fetchCustomers = () => {
    let token = window.localStorage.getItem("token")
    axios.get(`${masterUrl}/v1/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        setCustomers(res.data)
      }).catch(err => {
        setSnkSev("error")
        setSnkOpen(true)
        setSnkMsg("error while fetching users data")
      })
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCustomerIds.indexOf(id);
    let newSelectedCustomerIds = [];

    if (selectedIndex === -1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds, id);
    } else if (selectedIndex === 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(1));
    } else if (selectedIndex === selectedCustomerIds.length - 1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(0, selectedIndex),
        selectedCustomerIds.slice(selectedIndex + 1)
      );
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const disable = (id) => {
    let token = window.localStorage.getItem("token")
    axios.patch(`${masterUrl}/v1/users/${id}/disable`, {
      id
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      fetchCustomers()
      setSnkSev("success")
      setSnkOpen(true)
      setSnkMsg(res?.data?.message)
    }).catch(err => {
      setSnkSev("error")
      setSnkOpen(true)
      setSnkMsg(err?.response?.data?.message)
    })
  }
  const activate = (id) => {
    let token = window.localStorage.getItem("token")
    axios.patch(`${masterUrl}/v1/users/${id}/activate`, {
      id
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      fetchCustomers()
      setSnkSev("success")
      setSnkOpen(true)
      setSnkMsg(res?.data?.message)
    }).catch(err => {
      setSnkSev("error")
      setSnkOpen(true)
      setSnkMsg(err?.response?.data?.message)
    })
  }

  const delUser = (id) => {
    let token = window.localStorage.getItem("token")
    axios.delete(`${masterUrl}/v1/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      fetchCustomers()
      setSnkSev("success")
      setSnkOpen(true)
      setSnkMsg(res?.data?.message)
    }).catch(err => {
      setSnkSev("error")
      setSnkOpen(true)
      setSnkMsg(err?.response?.data?.message)
    })
  }
  return (
    <Card>
      <SnkBr open={snkOpen} sev={snkSev} msg={snkMsg} setOpen={setSnkOpen}/>

      <PerfectScrollbar>
        <Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  ID
                </TableCell>
                <TableCell>
                  Full Name
                </TableCell>
                <TableCell>
                  Username
                </TableCell>
                <TableCell>
                  Server ID
                </TableCell>
                <TableCell>
                  Start Date
                </TableCell>
                <TableCell>
                  Due Date
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
                <TableCell>

                </TableCell>
                <TableCell>

                </TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {customers.slice(0, limit).map((customer) => (
                <TableRow
                  hover
                  key={customer.id}
                  selected={selectedCustomerIds.indexOf(customer.id) !== -1}
                >
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {customer.id}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {customer.full_name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {customer.username}
                  </TableCell>
                  <TableCell>
                  192.168.214.{parseInt(customer.server_id)+1}
                  </TableCell>
                  <TableCell>
                    {dayjs(customer.start_date).format("MM/DD/YYYY")}
                  </TableCell>
                  <TableCell>
                    {dayjs(customer.valid_until).format("MM/DD/YYYY")}
                  </TableCell>
                  <TableCell>
                    <Button
                      color={customer.active ? "success" : "error"}
                      variant="contained"
                      onClick={customer.active ? () => disable(customer.id) : () => activate(customer.id)}
                    >
                      {customer.active ? "Active" : "Disable"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Link href={`/edituser/${customer.id}`}>
                      <Button color='warning'>Edit</Button>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => confirm(`Are you sure that you want to delete user with id ${customer.id}?`) ? delUser(customer.id) : null}
                    >
                      <DeleteForeverOutlined />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={customers.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

// CustomerListResults.propTypes = {
//   customers: PropTypes.array.isRequired
// };
