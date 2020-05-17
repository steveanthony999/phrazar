import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Container } from '@material-ui/core';

import Navbar from './components/Navbar';
import TranslateGoogleApi from './components/TranslateGoogleApi';

import './App.css';

function App() {
  const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1
    }
  }));

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Navbar />
        </Grid>
        <Grid item xs={12}>
          <Container maxWidth='md'>
            <TranslateGoogleApi />
          </Container>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
