import React from "react";
import loader from "assets/loader.svg";

const Loader = () => (
  <div className="is-horizontal-center">
    <figure className="image is-128x128">
      <img src={loader} alt="Loader" />
    </figure>
  </div>
);

export default Loader;
