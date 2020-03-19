import React from "react";
import { connect } from "react-redux";
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";
import { compose, withProps } from "recompose";
import PropTypes from "prop-types";
import { PropTypeLatLng } from "helpers/geometry";
import { toggleMapDialog } from "actions/app";

const Map = ({ zoom, center, label, point, isDialogOpened, toggleDialog }) => (
  <GoogleMap zoom={zoom} center={center}>
    {point && (
      <Marker position={point} onClick={() => toggleDialog()}>
        {label && isDialogOpened && (
          <InfoWindow onCloseClick={() => toggleDialog()}>
            <p className="title is-6 has-text-primary">{label}</p>
          </InfoWindow>
        )}
      </Marker>
    )}
  </GoogleMap>
);

Map.propTypes = {
  zoom: PropTypes.number,
  center: PropTypeLatLng,
  label: PropTypes.string,
  point: PropTypeLatLng,
  isDialogOpened: PropTypes.bool.isRequired,
  toggleDialog: PropTypes.func.isRequired,
};

Map.defaultProps = {
  zoom: 8,
  center: { lat: 43.36, lng: -8.43 },
  label: null,
  point: null,
};

const withConnect = connect(state => ({ isDialogOpened: state.app.isMapDialogOpened }), {
  toggleDialog: toggleMapDialog,
});

const withGoogleMapProps = withProps(props => {
  const point = props.marker && props.marker.point;
  let maybeKey = "";
  if (process.env.NODE_ENV === "PRODUCTION") {
    maybeKey = `&key=${process.env.GOOGLE_MAPS_KEY}`;
  }
  return {
    googleMapURL: `https://maps.googleapis.com/maps/api/js?v=3.exp${maybeKey}&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: props.containerElement || <div className="map" />,
    mapElement: <div style={{ height: `100%` }} />,
    zoom: point ? 12 : props.zoom,
    center: point || props.center,
    label: props.marker && props.marker.label,
    point,
  };
});

export default compose(withConnect, withGoogleMapProps, withScriptjs, withGoogleMap)(Map);
