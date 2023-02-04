import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SnkBr = (props) => {
    const [open, setOpen] = React.useState(props.open)
    const handleClose = () => {
        setOpen(false);
    };
    return <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={props.sev} sx={{ width: '100%' }}>
            {props.msg}
        </Alert>
    </Snackbar
    >
}

export default SnkBr