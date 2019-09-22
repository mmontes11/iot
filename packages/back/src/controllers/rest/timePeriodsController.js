import { orderedTimePeriods } from "../../models/timePeriod";
import responseKeys from "../../utils/responseKeys";

const getTimePeriods = (req, res) =>
  res.send({
    [responseKeys.timePeriodsArrayKey]: orderedTimePeriods,
  });

export default { getTimePeriods };
