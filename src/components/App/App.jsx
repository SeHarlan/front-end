import React, { useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Container, CssBaseline, ThemeProvider } from '@material-ui/core';
import { Home } from '../Home/Home';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { MiniChartsContainer } from '../MiniChart/MiniChartsContainer';
import { individualCountry } from '../individualCountry/individualCountry';
import { ComparePage } from '../ComparePage/ComparePage';
import { HighScore } from '../HighScore/HighScore';
import { About } from '../About/About';
import { useDispatch } from 'react-redux';
import { setMobilityDates, setGlobalMobilityDataByDate, setCovidChartData } from '../../actions/actions';
import { theme } from './theme';

export default function App() {
  const dispatch = useDispatch();

  const defaultDate = '2020-05-09';

  useEffect(() => {
    dispatch(setMobilityDates());
    dispatch(setGlobalMobilityDataByDate(defaultDate));
    dispatch(setCovidChartData());
  }, []);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="xl">
          <Header />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/country/:countryCode" component={individualCountry} />
            <Route path="/about" component={About} />
            {/* Stretch routes! */}
            <Route path="/compare" component={ComparePage} />
            <Route path="/highscore" component={HighScore} />
            {/* MiniCharts route is just for testing! */}
            <Route path="/minicharts" component={MiniChartsContainer} />
          </Switch>
          <Footer />
        </Container>
      </ThemeProvider>
    </BrowserRouter>
  );
}
