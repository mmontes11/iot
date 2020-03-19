import React from "react";
import PropTypes from "prop-types";
import ReactDatePicker from "react-datepicker";
import { connect } from "react-redux";

const DatePicker = ({ locale, placeholder, selected, onChange }) => (
  <ReactDatePicker
    locale={locale}
    selected={selected}
    onChange={date => onChange(date)}
    showTimeSelect
    timeIntervals={15}
    dateFormat="Pp"
    placeholderText={placeholder}
    className="input"
  />
);

DatePicker.propTypes = {
  locale: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  selected: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
};

DatePicker.defaultProps = {
  selected: null,
};

const withConnect = connect(state => ({
  locale: state.localization.selectedLanguage,
}));

export default withConnect(DatePicker);
