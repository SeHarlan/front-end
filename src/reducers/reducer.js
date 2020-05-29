import { SET_GLOBAL_MAP_MOBILITY_BY_DATE, SET_COVID_CHART_DATA, SET_SELECTED_COUNTRY_CODE, SET_SELECTED_SUBREGION, SET_MOBILITY_CHART_DATA, SET_MOBILITY_DATES, SET_MOBILITY_SUBREGION_NAMES, SET_COVID_SUBREGIONS, SET_COVID_SUB_DATA, SET_MOBILITY_SUB_DATA, SET_SELECTED_COUNTRY_NAME, SET_SELECTED_COUNTRY, RESET_COVID_SUB_DATA, SET_US_MAP_MOBILITY_BY_DATE, RESET_MOBILITY_SUB_DATA, SET_MOBILITY_COMPARE_COUNTRY, SET_MOBILITY_COMPARE_CHART_DATA, SET_MOBILITY_COMPARE_COUNTRY_CODE, SET_MOBILITY_COMPARE_COUNTRY_NAME, SET_MOBILITY_COMPARE_SUBREGION, SET_MOBILITY_COMPARE_SUBREGION_NAMES, SET_MOBILITY_COMPARE_SUB_DATA, DELETE_MOBILITY_SUB_DATA } from '../actions/actions';

const initialState = {
  globalMapMobilityByDate: {},
  covidChartData: {},
  mobilityDates: [],
  mobilityChartData: {},
  mobilityCompareCountryCode: '',
  mobilityCompareCountryName: 'Worldwide',
  mobilityCompareChartData: {},
  mobilityCompareSubregion: '',
  mobilityCompareSubregionNames: [],
  mobilitySubregionNames: [],
  covidSubData: {},
  mobilitySubData: {},
  selectedCountryCode: '',
  selectedCountryName: 'Worldwide',
  selectedSubregion: '',
  USMobilityMap: {}
};

export default function reducer(state = initialState, { type, payload }) {
  switch(type) {
    case SET_GLOBAL_MAP_MOBILITY_BY_DATE:
      return { ...state, globalMapMobilityByDate: payload };
    case SET_COVID_CHART_DATA:
      return { ...state, covidChartData: payload };
    case SET_MOBILITY_CHART_DATA:
      return { ...state, mobilityChartData: payload };
    case SET_MOBILITY_COMPARE_COUNTRY:
      return { ...state, mobilityCompareCountryCode: payload.countryCode, mobilityCompareCountryName: payload.countryName };
    case SET_MOBILITY_COMPARE_COUNTRY_CODE:
      return { ...state, mobilityCompareCountryCode: payload };
    case SET_MOBILITY_COMPARE_COUNTRY_NAME:
      return { ...state, mobilityCompareCountryName: payload };
    case SET_MOBILITY_COMPARE_CHART_DATA:
      return { ...state, mobilityCompareChartData: payload };
    case SET_SELECTED_COUNTRY:
      return { ...state, selectedCountryCode: payload.countryCode, selectedCountryName: payload.countryName };
    case SET_SELECTED_COUNTRY_CODE:
      return { ...state, selectedCountryCode: payload };
    case SET_SELECTED_COUNTRY_NAME:
      return { ...state, selectedCountryName: payload };
    case SET_SELECTED_SUBREGION:
      return { ...state, selectedSubregion: payload };
    case SET_MOBILITY_DATES: 
      return { ...state, mobilityDates: payload };
    case SET_MOBILITY_SUBREGION_NAMES:
      return { ...state, mobilitySubregionNames: payload };
    case SET_MOBILITY_COMPARE_SUBREGION:
      return { ...state, mobilityCompareSubregion: payload };
    case SET_MOBILITY_COMPARE_SUBREGION_NAMES:
      return { ...state, mobilityCompareSubregionNames: payload };
    case SET_MOBILITY_COMPARE_SUB_DATA:
      return { ...state, mobilityCompareChartData: payload };
    case SET_COVID_SUBREGIONS:
      return { ...state, covidSubregions: payload };
    case SET_COVID_SUB_DATA:
      return { ...state, covidSubData: payload };
    case SET_MOBILITY_SUB_DATA:
      return { ...state, mobilitySubData: payload };
    case DELETE_MOBILITY_SUB_DATA:
      return { ...state, mobilitySubData: payload };
    case RESET_COVID_SUB_DATA:
      return { ...state, covidSubData: {} };
    case RESET_MOBILITY_SUB_DATA:
      return { ...state, mobilitySubData: {} };
    case SET_US_MAP_MOBILITY_BY_DATE:
      return { ...state, USMobilityMap: payload };
    default: 
      return state;
  }
}
