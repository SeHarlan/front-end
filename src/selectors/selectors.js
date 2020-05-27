// returns all mobility data integrated with geoJSON data
export const getGlobalMapMobilityByDate = state => state.reducer.globalMapMobilityByDate;

// returns covid data
export const getCovidChartData = state => state.reducer.covidChartData;

// returns mobility data
export const getMobilityChartData = state => state.reducer.mobilityChartData;

// returns currently selected countryCode
export const getSelectedCountryCode = state => state.reducer.selectedCountryCode;

// returns currently selected subregion
export const getSelectedSubregion = state => state.reducer.selectedSubregion;

// returns array of dates only
export const getMobilityDates = state => state.reducer.mobilityDates;

// returns mobility data for a single country including subregions
export const getMobilitySubregionNames = state => state.reducer.mobilitySubregionNames;

// returns covid data for a single country including subregions
export const getCovidSubregions = state => state.reducer.covidSubregions;
