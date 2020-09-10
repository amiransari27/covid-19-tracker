import React, { useEffect } from 'react'
import './LineGraph.css'
import { Line } from 'react-chartjs-2'
import { useState } from 'react'
import numeral from 'numeral'

const options = {
    legend: {
        display: false
    },
    elements: {
        point: {
            radius: 0
        }
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0.0")
            }
        }
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll"
                }
            }
        ],
        yAxes: [
            {
                gridLine: {
                    display: false
                },
                ticks: {
                    //include dollar sign in the ticks
                    callbakc: function(value, index, values){
                        return numeral(value).format("0a")
                    }
                }
            }
        ]
    }
}

function LineGraph({casesType, className}) {

    const [data, setData] = useState(null)

    const buildChartData = (data, casesType) => {
        const chartData = []
        let lastDataPoint

        for (let date in data[casesType]) {
            if (lastDataPoint) {
                const newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint
                }
                chartData.push(newDataPoint)
            }
            lastDataPoint = data[casesType][date]
        }

        return chartData
    }

    useEffect(() => {
        fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
            .then(response => response.json())
            .then(data => {
                const chartData = buildChartData(data, casesType)
                setData(chartData)
            })
    }, [casesType])




    return (
        <div className={className}>
            {
                data &&
                <Line
                    options={options}
                    data={{
                        datasets: [{
                            backgroundColor: "rgb(204,16,52,0.5)",
                            borderColor: "#CC1034",
                            data: data
                        }]
                    }}
                />
            }

        </div>
    )
}

export default LineGraph
