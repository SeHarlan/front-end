import React, { useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Container, CssBaseline } from '@material-ui/core';
import { useStyles } from './App.styles';
import Home from '../Home/Home';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { individualCountry } from '../individualCountry/individualCountry';
import ComparePage from '../ComparePage/ComparePage';
import { HighScore } from '../HighScore/HighScore';
import { About } from '../About/About';

import { useDispatch } from 'react-redux';
import { setMobilityDates, setGlobalMobilityDataByDate, setCovidChartData } from '../../actions/actions';


export default function App() {
  const styles = useStyles();

  const defaultDate = '2020-02-15';

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setMobilityDates());
    dispatch(setGlobalMobilityDataByDate(defaultDate));
    dispatch(setCovidChartData());
  }, []);

  return (
    <BrowserRouter>
      <Container maxWidth="xl" className={styles.root}>
        <CssBaseline />
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/country/:countryCode" component={individualCountry} />
          <Route path="/compare" component={ComparePage} />
          <Route path="/highscore" component={HighScore} />
          <Route path="/about" component={About} />
        </Switch>
        <Footer />
      </Container>
    </BrowserRouter>
  );
}
