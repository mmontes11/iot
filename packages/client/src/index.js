import _ from "underscore";
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
import { Log } from "./helpers/log";

export class IoTClient {
  constructor(options = {}) {
    if (!_.isUndefined(options.basicAuthUsername) && !_.isUndefined(options.basicAuthPassword)) {
      this.basicAuthCredentials = { username: options.basicAuthUsername, password: options.basicAuthPassword };
    }
    if (!_.isUndefined(options.username) && !_.isUndefined(options.password)) {
      this.userCredentials = { username: options.username, password: options.password };
    }
    this.url = options.url || "";
    const debug = !_.isUndefined(options.debug) ? options.debug : true;
    this.log = new Log(debug);
    this.authService = new AuthService(this);
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
  }
}
