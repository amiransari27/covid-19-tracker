import React, { useState, useEffect } from 'react';
import './App.css';
import { FormControl, Select, MenuItem, Card, CardContent } from '@material-ui/core'
import InfoBox from 'components/InfoBox/InfoBox';
import Map from 'components/Map/Map';
import Table from 'components/Table/Table';
import { sortData } from 'utils';
import LineGraph from 'components/LineGraph/LineGraph';
import 'leaflet/dist/leaflet.css';


function App() {

  const [contries, setContries] = useState([])
  const [country, setCountry] = useState('')
  const [countryInfo, setCountryInfo] = useState(null)
  const [tableData, setTableData] = useState([])

  const [mapCenter, setMapCenter] = useState({
    lat: 34.80746, lng: -40.4796
  })
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setCountries] = useState([])


  const [casesType, setCasesType] = useState('cases')

  useEffect(() => {
    fetchCountryInfo('worldwide')
  }, [])

  useEffect(() => {
    const getCountries = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then(response => response.json())
        .then(data => {
          const contries = data.map(country => ({
            id: country.countryInfo._id,
            name: country.country,
            value: country.countryInfo.iso2
          }))
          setContries(contries)

          setTableData(sortData(data))

          setCountries(data)
        })
    }

    getCountries()

    setCountry('worldwide')

  }, [])


  const handleCountryChange = async (event) => {
    const countryCode = event.target.value
    setCountry(countryCode)

    fetchCountryInfo(countryCode)

  }


  const fetchCountryInfo = async (countryCode) => {
    const url = countryCode === 'worldwide' ?
      'https://disease.sh/v3/covid-19/all' :
      `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data)

        if (data?.countryInfo) {
          setMapCenter([data?.countryInfo?.lat, data?.countryInfo?.long])
          setMapZoom(4)
        }

      })
  }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">

          <h1>Covid 19 tracker</h1>
          <FormControl className="app_dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={handleCountryChange}

            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                contries.map((contry, index) => (

                  <MenuItem key={index} value={contry.value}>{contry.name}</MenuItem>
                ))
              }

            </Select>
          </FormControl>
        </div>

        <div className="app__stats">

          <InfoBox
            isRed
            active={casesType === 'cases'}
            onClick={e => setCasesType('cases')}
            title="Coronavirus Cases"
            cases={countryInfo?.todayCases}
            total={countryInfo?.cases} />
          <InfoBox
            active={casesType === 'recovered'}
            onClick={e => setCasesType('recovered')}
            title="Recovered"
            cases={countryInfo?.todayRecovered}
            total={countryInfo?.recovered} />
          <InfoBox
            isRed
            active={casesType === 'deaths'}
            onClick={e => setCasesType('deaths')}
            title="Death"
            cases={countryInfo?.todayDeaths}
            total={countryInfo?.deaths} />

        </div>




        <Map
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
          casesType={casesType}
        />
      </div>


      <Card className="app__right">
        <CardContent>
          <h3>Live cases by country</h3>
          <Table countries={tableData} />
          <h3 className="app__graphTitle">World wide new {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType} />

        </CardContent>
      </Card>



    </div>
  );
}

export default App;
