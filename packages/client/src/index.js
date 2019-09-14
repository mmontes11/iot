import _ from "underscore";
import { Credentials } from "./models/credentials";
import { AuthService } from "./services/authService";
import { EventService, MeasurementService } from "./services/observationService";
import { ObservationsService } from "./services/observationsService";
import { TimePeriodsService } from "./services/timePeriodsService";
import { ThingService } from "./services/thingService";
import { ThingsService } from "./services/thingsService";
import { SubscriptionService } from "./services/subscriptionService";
import { SubscriptionsService } from "./services/subscriptionsService";
import { TopicsService } from "./services/topicsService";
import { TokenHandler } from "./helpers/tokenHandler";
import { Log } from "./util/log";
import defaultOptions from "./config/defaultOptions";

export class IoTClient {
  constructor(optionsByParam) {
    this.mandatoryParams = ["url", "basicAuthUsername", "basicAuthPassword"];
    if (this._areValidOptions(optionsByParam)) {
      const options = Object.assign({}, defaultOptions, optionsByParam);
      const basicAuthCredentials = new Credentials(options.basicAuthUsername, options.basicAuthPassword);
      let userCredentials;
      if (!_.isUndefined(options.username) && !_.isUndefined(options.password)) {
        userCredentials = new Credentials(options.username, options.password);
      }
      this.url = options.url;
      this.headers = options.headers;
      this.log = new Log(options.debug);
      this.authService = new AuthService(this, basicAuthCredentials, userCredentials);
      this.eventService = new EventService(this);
      this.measurementService = new MeasurementService(this);
      this.observationsService = new ObservationsService(this);
      this.timePeriodsService = new TimePeriodsService(this);
      this.thingService = new ThingService(this);
      this.thingsService = new ThingsService(this);
      this.subscriptionService = new SubscriptionService(this);
      this.subscriptionsService = new SubscriptionsService(this);
      this.topicsService = new TopicsService(this);
      TokenHandler.initStorage();
    } else {
      throw new Error(`IoT Client misconfiguration. Mandatory params: ${this.mandatoryParams.join(", ")}`);
    }
  }
  _areValidOptions(options) {
    return !_.any(this.mandatoryParams, param => _.isUndefined(options[param]));
  }
}
