### MobilityData
  * 1: GET mobility data for all countries, all dates (excludes records that have a subregion):
    https://pandemic-legacy.herokuapp.com/api/v1/mobility

  * 2: GET worldwide mobility data for all countries by date (excludes records that have a subregion):
    https://pandemic-legacy.herokuapp.com/api/v1/mobility/${date}

  * 3: GET documents by countryCode for all dates, excluding subregions:
    https://pandemic-legacy.herokuapp.com/api/v1/mobility/country/${countryCode}

  * 4: GET documents by countryCode for all dates, including subregions:
    https://pandemic-legacy.herokuapp.com/api/v1/mobility/countryWithSub/${countryCode}

  * 5: GET documents by subRegion1 for all dates, excluding subRegion2:
    https://pandemic-legacy.herokuapp.com/api/v1/mobility/countryBySub/${countryCode}/${subRegion1}

  * 6: GET documents by subRegion1 for all dates, including subRegion2 if relevant:
    https://pandemic-legacy.herokuapp.com/api/v1/mobility/subRegionWithSub2/${countryCode}/${subRegion1}


### CovidData
  * 1: GET documents for Worldwide only, for all dates:
    https://pandemic-legacy.herokuapp.com/api/v1/covid/

  * 2: GET documents by countryCode for all dates, excluding subregions (NB: country is case sensitive!):
    https://pandemic-legacy.herokuapp.com/api/v1/covid/${countryCode}

  * 3: GET documents by countryCode for all dates, with subregions if relevant:
    https://pandemic-legacy.herokuapp.com/api/v1/covid/subRegion/${countryCode}
