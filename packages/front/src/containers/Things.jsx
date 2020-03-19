import React, { useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import PropTypes from "prop-types";
import ThingItem from "components/ThingItem";
import ThingDetail from "components/ThingDetail";
import Loader from "components/Loader";
import Modal from "components/Modal";
import * as thingActions from "actions/things";
import * as fromState from "reducers";
import { withReset } from "hocs/reset";
import { injectIntl, intlShape } from "react-intl";
import { EVENT_TYPE, MEASUREMENT_TYPE } from "constants/observationTypes";
import { defaultTimePeriodFilter, defaultGroupBy } from "config/params";

const Things = ({
  intl: { formatMessage },
  match: {
    params: { thing: thingName },
  },
  history,
  isLoading,
  things,
  selectedThing,
  shouldShowNotFoundError,
  getThings,
  selectThing,
  showNotFoundError,
}) => {
  const _isSelected = thing => selectedThing !== null && selectedThing.name === thing.name;
  const _resetPathToRoot = () => history.push("/things");
  const _selectThing = thing => {
    selectThing(thing);
    if (_isSelected(thing)) {
      _resetPathToRoot();
    } else {
      history.push(`/things/${thing.name}`);
    }
  };
  const _onStatsClick = (type, thing) => {
    const supportedEvents = thing.supportedObservationTypes.event;
    const supportedMeasurements = thing.supportedObservationTypes.measurement;
    let url;
    if (type === EVENT_TYPE && supportedEvents && supportedEvents.length > 0) {
      url = `/stats/${type}/${supportedEvents[0]}?thing=${thing.name}&timePeriod=${defaultTimePeriodFilter}`;
    } else if (type === MEASUREMENT_TYPE && supportedMeasurements && supportedMeasurements.length > 0) {
      url = `/stats/${type}/${supportedMeasurements[0]}?thing=${thing.name}&timePeriod=${defaultTimePeriodFilter}`;
    }
    if (url) {
      history.push(url);
    }
  };
  const _onDataClick = (type, observation, thing) =>
    history.push(
      `/data/${type}/${observation}/${defaultGroupBy}?thing=${thing.name}&timePeriod=${defaultTimePeriodFilter}`,
    );
  useEffect(() => {
    if (things.length === 0) {
      getThings();
    }
    if (selectedThing === null && things.length > 0 && thingName) {
      const thing = things.find(t => t.name === thingName);
      if (thing) {
        _selectThing(thing);
      } else {
        _resetPathToRoot();
        showNotFoundError(true);
      }
    }
  }, [things]);
  if (isLoading && things.length === 0) {
    return <Loader />;
  }
  return (
    <div>
      <div className="container is-fluid section">
        <div className="columns">
          <div className="column is-one-quarter">
            {things.map(thing => (
              <ThingItem
                key={thing.name}
                name={thing.name}
                isSelected={_isSelected(thing)}
                onClick={() => _selectThing(thing)}
              />
            ))}
          </div>
          {selectedThing && (
            <div className="column is-three-quarters">
              <ThingDetail
                thing={selectedThing}
                onStatsClick={type => _onStatsClick(type, selectedThing)}
                onDataClick={(type, observation) => _onDataClick(type, observation, selectedThing)}
              />
            </div>
          )}
        </div>
      </div>
      <Modal
        isActive={shouldShowNotFoundError}
        onCloseClick={() => showNotFoundError(false)}
        messageStyle="is-danger"
        title={formatMessage({ id: "Error" })}
        subTitle={formatMessage({ id: "Thing not found" })}
      />
    </div>
  );
};

Things.propTypes = {
  intl: intlShape.isRequired,
  getThings: PropTypes.func.isRequired,
  selectThing: PropTypes.func.isRequired,
  selectedThing: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  isLoading: PropTypes.bool.isRequired,
  things: PropTypes.arrayOf(PropTypes.shape({})),
  shouldShowNotFoundError: PropTypes.bool,
  showNotFoundError: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      thing: PropTypes.string,
    }),
  }).isRequired,
};

Things.defaultProps = {
  selectedThing: null,
  things: [],
  shouldShowNotFoundError: false,
};

const withConnect = connect(
  state => ({
    isLoading: fromState.isLoading(state),
    things: state.things.items,
    selectedThing: state.things.selectedItem,
    shouldShowNotFoundError: state.things.showNotFoundError,
  }),
  {
    getThings: thingActions.getThings,
    selectThing: thingActions.selectThing,
    showNotFoundError: thingActions.showThingNotFoundError,
  },
);

export default compose(withConnect, withRouter, withReset, injectIntl)(Things);
