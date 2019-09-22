import mongoose from "../lib/mongoose";

const UnitSchema = new mongoose.Schema({
  name: String,
  symbol: String,
});
const UnitModel = mongoose.model("Unit", UnitSchema);

export { UnitSchema, UnitModel };
