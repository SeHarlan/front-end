import React, { useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Container, CssBaseline, ThemeProvider } from '@material-ui/core';
import { Home } from '../Home/Home';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { MiniChartsContainer } from '../MiniChart/MiniChartsContainer';
import { IndividualCountry } from '../IndividualCountry/IndividualCountry';
import { Compare } from '../Compare/Compare';
import { HighScore } from '../HighScore/HighScore';
import { About } from '../About/About';
import { useDispatch, useSelector } from 'react-redux';
import { setMobilityDates, setGlobalMobilityDataByDate, setCovidChartData, setUSMobilityDataByDate } from '../../actions/actions';
import { theme } from './theme';
import { useStyles } from './App.styles';
import { getSelectedCountryCode } from '../../selectors/selectors';

export default function App() {
  const dispatch = useDispatch();
  const styles = useStyles();

  const defaultDate = '2020-04-03';
  const countryCode = useSelector(getSelectedCountryCode);

  useEffect(() => {
    dispatch(setMobilityDates());
    dispatch(setGlobalMobilityDataByDate(defaultDate));
    dispatch(setUSMobilityDataByDate(defaultDate));
    dispatch(setCovidChartData());
  }, []);

  useEffect(() => {
    if(!countryCode) return;
    dispatch(setCovidChartData(countryCode));
  }, [countryCode]);


  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="xl" className={styles.root} style={{ background: 'linear-gradient(rgba(44, 94, 236, 0.3) 0%, rgb(255, 255, 255) 300px)' }}>
          <Header />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/country/:countryCode" component={IndividualCountry} />
            <Route path="/about" component={About} />
            <Route path="/compare/:countryCode" component={Compare} />
          </Switch>
          <Footer />
        </Container>
      </ThemeProvider>
    </BrowserRouter>
  );
}
