import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Container, CssBaseline } from '@material-ui/core';
import { useStyles } from './App.styles';
import Home from '../Home/Home';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { individualCountry } from '../individualCountry/individualCountry';
import ComparePage from '../ComparePage/ComparePage';
import { HighScore } from '../HighScore/HighScore';
import MiniCharts from '../MiniChart/MiniCharts';

export default function App() {
  const styles = useStyles();
  return (
    <BrowserRouter>
      <Container maxWidth="xl" className={styles.root}>
        <CssBaseline />
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/country" component={individualCountry} />
          <Route path="/compare" component={ComparePage} />
          {/* <Route path="/search" component={search} /> */}
          <Route path="/highscore" component={HighScore} />
          <Route path="/minicharts" component={MiniCharts} />
        </Switch>
        <Footer />
      </Container>
    </BrowserRouter>
  );
}
