import { Service } from "./service";

class ObservationService extends Service {
  async create(observation) {
    return this.post(undefined, undefined, observation);
  }
  async getData(query) {
    const options = {
      query,
    };
    return this.get(undefined, options);
  }
  async getStats(query) {
    const options = {
      query,
    };
    return this.get("stats", options);
  }
  async getStatsByType(type) {
    return this.getStats({ type });
  }
  async getStatsByThing(thing) {
    return this.getStats({ thing });
  }
  async getStatsByDateRange(startDate, endDate) {
    return this.getStats({ startDate, endDate });
  }
  async getStatsByTimePeriod(timePeriod) {
    return this.getStats({ timePeriod });
  }
  async getStatsByCoordinates(longitude, latitude, maxDistance) {
    return this.getStats({ longitude, latitude, maxDistance });
  }
  async getStatsByAddress(address, maxDistance) {
    return this.getStats({ address, maxDistance });
  }
  async getLast(thing, type) {
    const options = {
      query: {
        thing,
        type,
      },
    };
    return this.get("last", options);
  }
  async getTypes() {
    return this.get("types");
  }
}

class EventService extends ObservationService {
  constructor(client) {
    super(client, "event");
  }
}

class MeasurementService extends ObservationService {
  constructor(client) {
    super(client, "measurement");
  }
}

export { ObservationService, EventService, MeasurementService };
