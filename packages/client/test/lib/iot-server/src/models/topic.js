import mongoose from "../lib/mongoose";

const TopicSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
  },
});

TopicSchema.statics.findTopicById = function findTopicById(topicId) {
  const objectId = mongoose.Types.ObjectId(topicId);
  return this.findOne(objectId);
};

const TopicModel = mongoose.model("Topic", TopicSchema);

export { TopicSchema, TopicModel };
