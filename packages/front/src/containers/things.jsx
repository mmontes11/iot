import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import PropTypes from "prop-types";
import ThingItem from "components/thingItem";
import ThingDetail from "components/thingDetail";
import Loader from "components/loader";
import Modal from "components/modal";
import * as thingActions from "actions/things";
import * as fromState from "reducers";
import { withResetOnUnmount } from "hocs/resetOnUnmount";
import { injectIntl, intlShape } from "react-intl";
import { EVENT_TYPE, MEASUREMENT_TYPE } from "constants/observationTypes";
import { defaultTimePeriodFilter, defaultGroupBy } from "config/params";

class Things extends React.Component {
  componentDidMount() {
    if (this.props.things.length === 0) {
      this.props.getThings();
    }
  }
  componentDidUpdate() {
    const {
      selectedThing,
      things,
      match: {
        params: { thing: thingName },
      },
    } = this.props;
    if (selectedThing === null && things.length > 0 && thingName) {
      const thing = things.find(t => t.name === thingName);
      if (thing) {
        this._selectThing(thing);
      } else {
        this._resetPathToRoot();
        this.props.showNotFoundError(true);
      }
    }
  }
  _isSelected = thing => this.props.selectedThing !== null && this.props.selectedThing.name === thing.name;
  _selectThing = thing => {
    this.props.selectThing(thing);
    if (this._isSelected(thing)) {
      this._resetPathToRoot();
    } else {
      this.props.history.push(`/things/${thing.name}`);
    }
  };
  _resetPathToRoot = () => {
    this.props.history.push("/things");
  };
  _onStatsClick = (type, thing) => {
    const supportedEvents = thing.supportedObservationTypes.event;
    const supportedMeasurements = thing.supportedObservationTypes.measurement;
    let url;
    if (type === EVENT_TYPE && supportedEvents && supportedEvents.length > 0) {
      url = `/stats/${type}/${supportedEvents[0]}?thing=${thing.name}&timePeriod=${defaultTimePeriodFilter}`;
    } else if (type === MEASUREMENT_TYPE && supportedMeasurements && supportedMeasurements.length > 0) {
      url = `/stats/${type}/${supportedMeasurements[0]}?thing=${thing.name}&timePeriod=${defaultTimePeriodFilter}`;
    }
    if (url) {
      this.props.history.push(url);
    }
  };
  _onDataClick = (type, observation, thing) => {
    this.props.history.push(
      `/data/${type}/${observation}/${defaultGroupBy}?thing=${thing.name}&timePeriod=${defaultTimePeriodFilter}`,
    );
  };
  render() {
    const {
      intl: { formatMessage },
      isLoading,
      things,
      selectedThing,
      shouldShowNotFoundError,
      showNotFoundError,
    } = this.props;
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
                  isSelected={this._isSelected(thing)}
                  onClick={() => this._selectThing(thing)}
                />
              ))}
            </div>
            {selectedThing && (
              <div className="column is-three-quarters">
                <ThingDetail
                  thing={selectedThing}
                  onStatsClick={type => this._onStatsClick(type, selectedThing)}
                  onDataClick={(type, observation) => this._onDataClick(type, observation, selectedThing)}
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
  }
}

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
  match: PropTypes.shape({}).isRequired,
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

export default compose(
  withConnect,
  withRouter,
  withResetOnUnmount,
  injectIntl,
)(Things);
