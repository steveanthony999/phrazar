import React from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  AppBar,
  Typography,
  Toolbar,
  makeStyles,
  Button,
  Modal,
  Backdrop
} from '@material-ui/core';
import BlurOnIcon from '@material-ui/icons/BlurOn';
import { useSpring, animated } from 'react-spring/web.cjs';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  title: {
    flexGrow: 1
  },
  typography: {
    padding: theme.spacing(2)
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

const Fade = React.forwardRef(function Fade(props, ref) {
  const { in: open, children, onEnter, onExited, ...other } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter();
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited();
      }
    }
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element,
  in: PropTypes.bool.isRequired,
  onEnter: PropTypes.func,
  onExited: PropTypes.func
};

const Navbar = () => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Container maxWidth='md'>
        <AppBar position='static' color='transparent'>
          <Toolbar>
            <BlurOnIcon />
            <Typography variant='h6' className={classes.title}>
              Phrazar
            </Typography>
            <Button variant='outlined' color='inherit' onClick={handleOpen}>
              About
            </Button>
            <Modal
              aria-labelledby='spring-modal-title'
              aria-describedby='spring-modal-description'
              className={classes.modal}
              open={open}
              onClose={handleClose}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500
              }}
            >
              <Fade in={open}>
                <div className={classes.paper}>
                  <h2 id='spring-modal-title'>Phrazar</h2>
                  <p>By Steven Woodward</p>
                  <p id='spring-modal-description'>
                    Phrazar is meant to be a sidekick
                    <br /> to any of your language learning <br />
                    applications by giving you one phrase
                    <br /> along with it's translation, transliteration,
                    <br /> and speech to concentrate on in a 24-hour period.
                  </p>
                </div>
              </Fade>
            </Modal>
          </Toolbar>
        </AppBar>
      </Container>
    </React.Fragment>
  );
};

export default Navbar;
