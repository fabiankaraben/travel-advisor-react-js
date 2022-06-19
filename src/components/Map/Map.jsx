import React from 'react'
import PropTypes from 'prop-types'

import { Paper, Typography, useMediaQuery, Rating } from '@mui/material'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import { GoogleMap } from '@react-google-maps/api'

// import useStyles from './styles'
import mapStyles from './mapStyles'

let map
let justOnceFlag = false

const Map = ({ setCoordinates, setBounds, coordinates, places, setChildClicked }) => {
  // Map.propTypes = {
  //   setCoordinates: PropTypes.func.isRequired,
  //   setBounds: PropTypes.func.isRequired,
  //   coordinates: PropTypes.func.isRequired,
  //   places: PropTypes.func.isRequired,
  //   setChildClicked: PropTypes.func.isRequired,
  // }

  Map.propTypes = {
    setCoordinates: PropTypes.any,
    setBounds: PropTypes.any,
    coordinates: PropTypes.any,
    places: PropTypes.any,
    setChildClicked: PropTypes.any
  }

  // const classes = useStyles()
  const classes = {}
  const isDesktop = useMediaQuery('(min-width:600px)')

  function updateData () {
    if (map) {
      setCoordinates(map.center.toJSON())
      setBounds({ ne: map.getBounds().getNorthEast().toJSON(), sw: map.getBounds().getSouthWest().toJSON() })
    }
  }

  return (
    <div className={classes.mapContainer}>
      {coordinates.lat && coordinates.lng
        ? (
        <GoogleMap
          id="circle-example"
          mapContainerStyle={{
            height: '600px',
            width: '100%'
          }}
          zoom={14}
          center={coordinates}
          options={{ disableDefaultUI: true, zoomControl: true, styles: mapStyles }}
          onLoad={(m) => {
            map = m
          }}
          onDragEnd={() => {
            updateData()
          }}
          onZoomChanged={() => {
            updateData()
          }}
          onChildClick={(child) => {
            setChildClicked(child)
          }}
          onTilesLoaded={() => {
            if (!justOnceFlag) {
              justOnceFlag = true
              updateData()
            }
          }}
        >
          {places?.map((place, i) => (
            <div
              className={classes.markerContainer}
              lat={Number(place.latitude)}
              lng={Number(place.longitude)}
              key={i}
            >
          {
            !isDesktop
              ? (
              <LocationOnOutlinedIcon color="primary" fontSize="large" />
                )
              : (
              <Paper elevation={3} className={classes.paper}>
                <Typography className={classes.Typography} variant="subtitle2" gutterBottom>
                  {place.name}
                </Typography>
                <img
                  className={classes.pointer}
                  src={place.photo ? place.photo.images.large.url : 'https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg'}
                  alt={place.name}
                />
                <Rating size="small" value={Number(place.rating)} readOnly />
              </Paper>
                )
            }
          </div>
          ))}
        </GoogleMap>
          )
        : (
        <p>Loading</p>
          )}
    </div>
  )
}

export default Map
