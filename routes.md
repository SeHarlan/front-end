### MobilityData
  * 1: GET mobility data
        -all countries
        -excludes subregions
        -all dates
    https://pandemic-legacy.herokuapp.com/api/v1/mobility

  * 2: GET mobility data
        -all countries
        -excludes subregions
        -by date
    https://pandemic-legacy.herokuapp.com/api/v1/mobility/${date}

  * 3: GET mobility data
        -single country by countryCode
        -excludes subregions
        -all dates
    https://pandemic-legacy.herokuapp.com/api/v1/mobility/country/${countryCode}

  * 4: GET mobility data
        -single country by countryCode
        -includes subregions
        -excludes subregion2
        -all dates
    https://pandemic-legacy.herokuapp.com/api/v1/mobility/countryWithSub/${countryCode}

  * 5: GET mobility data
        -by subRegion1
        -excludes subRegion2
        -all dates
    https://pandemic-legacy.herokuapp.com/api/v1/mobility/countryBySub/${countryCode}/${subRegion1}

  * 6: GET mobility data
        -by subRegion1
        -includes subRegion2
        -all dates
    https://pandemic-legacy.herokuapp.com/api/v1/mobility/subRegionWithSub2/${countryCode}/${subRegion1}

    * 7: GET mobility data
          -by countryCode
          -one hard-coded date
          -gets one document per subRegion1 name
      https://pandemic-legacy.herokuapp.com/api/v1/mobility/names/${countryCode}


### CovidData
  * 1: GET covid data
        -worldwide numbers
        -excludes country-level data
        -all dates
    https://pandemic-legacy.herokuapp.com/api/v1/covid/

  * 2: GET covid data
        -single country by countryCode
        -excludes subregions
        -all dates
    https://pandemic-legacy.herokuapp.com/api/v1/covid/${countryCode}

  * 3: GET covid data
        -single country by countryCode
        -includes subregions
        -all dates
    https://pandemic-legacy.herokuapp.com/api/v1/covid/subRegion/${countryCode}

  * 4: GET covid data
        -single country by countryCode
        -single subRegion by subRegion1
        -excludes subRegion2
        -all dates
    https://pandemic-legacy.herokuapp.com/api/v1/covid/bySub/${countryCode}/${subRegion1}
