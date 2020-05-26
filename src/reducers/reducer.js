import { SET_GLOBAL_MAP_MOBILITY_BY_DATE, SET_COVID_CHART_DATA, SET_SELECTED_COUNTRY_CODE, SET_MOBILITY_CHART_DATA } from '../actions/actions';

const initialState = {
  globalMapMobilityByDate: {},
  covidChartData: {},
  mobilityChartData: {},
  selectedCountryCode: ''
};

export default function reducer(state = initialState, { type, payload }) {
  switch(type) {
    case SET_GLOBAL_MAP_MOBILITY_BY_DATE:
      return { ...state, globalMapMobilityByDate: payload };
    case SET_COVID_CHART_DATA:
      return { ...state, covidChartData: payload };
    case SET_MOBILITY_CHART_DATA:
      return { ...state, mobilityChartData: payload };
    case SET_SELECTED_COUNTRY_CODE:
      return { ...state, selectedCountryCode: payload };
    default: 
      return state;
  }
}
