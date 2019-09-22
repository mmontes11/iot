import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const Modal = ({ isActive, onCloseClick, messageStyle, title, subTitle }) => {
  const modalClass = classNames("modal", {
    "is-active": isActive,
  });
  const messageClass = classNames("message", "is-medium", messageStyle);
  return (
    <div className={modalClass}>
      <div className="modal-background" onClick={onCloseClick} onKeyPress={onCloseClick} role="button" tabIndex={0} />
      <div className="modal-content">
        <article className={messageClass}>
          <div className="message-header">
            <p>{title}</p>
          </div>
          <div className="message-body has-text-centered">{subTitle}</div>
        </article>
      </div>
      <button className="modal-close is-large" aria-label="close" onClick={onCloseClick} />
    </div>
  );
};

Modal.propTypes = {
  isActive: PropTypes.bool.isRequired,
  onCloseClick: PropTypes.func.isRequired,
  messageStyle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
};

export default Modal;
