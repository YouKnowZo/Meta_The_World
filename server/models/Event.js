import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['concert', 'party', 'meetup', 'competition', 'workshop', 'other'],
    required: true
  },
  location: {
    coordinates: {
      x: Number,
      y: Number,
      z: Number
    },
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' }
  },
  startTime: { type: Date, required: true },
  endTime: Date,
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  maxAttendees: Number,
  isPublic: { type: Boolean, default: true },
  requiresTicket: { type: Boolean, default: false },
  ticketPrice: { type: Number, default: 0 },
  rewards: {
    currency: { type: Number, default: 0 },
    experience: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now }
});

eventSchema.index({ startTime: 1 });
eventSchema.index({ host: 1 });

export default mongoose.model('Event', eventSchema);
