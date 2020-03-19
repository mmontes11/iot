import React from "react";
import PropTypes from "prop-types";
import TagList from "components/TagList";
import ThingActions from "components/ThingActions";
import Map from "containers/Map";
import { pointToLatLng } from "helpers/geometry";
import { formatDateTime } from "helpers/date";
import { injectIntl, intlShape, FormattedMessage } from "react-intl";
import { EVENT_TYPE, MEASUREMENT_TYPE } from "constants/observationTypes";
import { thingShape } from "types";

const ThingDetail = ({ intl: { formatDate, formatTime }, thing, onStatsClick, onDataClick }) => (
  <div className="card">
    <div className="card-content">
      <div className="columns">
        <div className="column is-three-fifths has-text-centered">
          <p className="title is-3 has-text-primary is-spaced">{thing.name}</p>
          <p className="title is-6">
            <FormattedMessage id="IP address:">{txt => <strong>{txt}</strong>}</FormattedMessage>{" "}
            <a href={`http://${thing.ip}`} target="_blank" rel="noopener noreferrer">
              {thing.ip}
            </a>
          </p>
          <p className="title is-6">
            <FormattedMessage id="MQTT topic:">{txt => <strong>{txt}</strong>}</FormattedMessage>{" "}
            <span className="has-text-info">{thing.topic}</span>
          </p>
          <p className="title is-6">
            <FormattedMessage id="Last observation:">{txt => <strong>{txt}</strong>}</FormattedMessage>{" "}
            <span className="has-text-info">{formatDateTime(thing.lastObservation, formatDate, formatTime)}</span>
          </p>
          <TagList
            label="Events:"
            tags={thing.supportedObservationTypes.event}
            tagStyle="is-warning"
            onTagClick={observation => onDataClick(EVENT_TYPE, observation)}
          />
          <TagList
            label="Measurements:"
            tags={thing.supportedObservationTypes.measurement}
            tagStyle="is-warning"
            onTagClick={observation => onDataClick(MEASUREMENT_TYPE, observation)}
          />
          <ThingActions thing={thing} onStatsClick={onStatsClick} />
        </div>
        <div className="column is-two-fifths">
          <Map marker={{ label: thing.name, point: pointToLatLng(thing.geometry) }} />
        </div>
      </div>
    </div>
  </div>
);

ThingDetail.propTypes = {
  intl: intlShape.isRequired,
  thing: thingShape.isRequired,
  onStatsClick: PropTypes.func.isRequired,
  onDataClick: PropTypes.func.isRequired,
};

export default injectIntl(ThingDetail);
