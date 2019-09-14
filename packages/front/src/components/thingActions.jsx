import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { EVENT_TYPE, MEASUREMENT_TYPE } from "constants/observationTypes";

const ThingActions = ({ thing, onStatsClick }) => (
  <p className="buttons is-horizontal-center">
    {thing.googleMapsUrl && (
      <a id="google-maps-link" className="button" href={thing.googleMapsUrl} target="_blank" rel="noopener noreferrer">
        <span className="icon">
          <i className="fas fa-map-marked" />
        </span>
        <FormattedMessage id="Google maps" />
      </a>
    )}
    {thing.supportedObservationTypes.event.length > 0 && (
      <button id="event-stats-button" className="button" onClick={() => onStatsClick(EVENT_TYPE)}>
        <span className="icon">
          <i className="fas fa-chart-bar" />
        </span>
        <FormattedMessage id="Event stats" />
      </button>
    )}
    {thing.supportedObservationTypes.measurement.length > 0 && (
      <button id="measurement-stats-button" className="button" onClick={() => onStatsClick(MEASUREMENT_TYPE)}>
        <span className="icon">
          <i className="fas fa-chart-bar" />
        </span>
        <FormattedMessage id="Measurement stats" />
      </button>
    )}
  </p>
);

ThingActions.propTypes = {
  thing: PropTypes.shape({}).isRequired,
  onStatsClick: PropTypes.func.isRequired,
};

export default ThingActions;
