import { SET_GLOBAL_MAP_MOBILITY_BY_DATE, SET_COVID_CHART_DATA, SET_SELECTED_COUNTRY_CODE, SET_SELECTED_SUBREGION, SET_MOBILITY_CHART_DATA, SET_MOBILITY_DATES, SET_MOBILITY_SUBREGION_NAMES, SET_COVID_SUBREGIONS, SET_COVID_SUB_DATA, SET_MOBILITY_SUB_DATA } from '../actions/actions';

const initialState = {
  globalMapMobilityByDate: {},
  covidChartData: {},
  selectedCountryCode: '',
  mobilityDates: [],
  mobilityChartData: {},
  mobilitySubregionNames: [],
  covidSubData: {},
  mobilitySubData: {}
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
    case SET_SELECTED_SUBREGION:
      return { ...state, selectedSubregion: payload };
    case SET_MOBILITY_DATES: 
      return { ...state, mobilityDates: payload };
    case SET_MOBILITY_SUBREGION_NAMES:
      return { ...state, mobilitySubregionNames: payload };
    case SET_COVID_SUBREGIONS:
      return { ...state, covidSubregions: payload };
    case SET_COVID_SUB_DATA:
      return { ...state, covidSubData: payload };
    case SET_MOBILITY_SUB_DATA:
      return { ...state, mobilitySubData: payload };
    default: 
      return state;
  }
}
