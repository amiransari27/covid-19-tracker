import React from 'react'
import './Map.css'
import { Map as LeafletMap, TileLayer } from 'react-leaflet'
import { showDataOnMap } from 'utils'

function Map({countries, casesType, center, zoom}) {
    return (
        <div className="map">
            <LeafletMap center={center} zoom={zoom}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution={`&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors`}
                />

                {
                    showDataOnMap(countries, casesType)
                }

            </LeafletMap>
        </div>
    )
}

export default Map
