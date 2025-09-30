const mongoose = require('mongoose');
const { Schema } = mongoose;

const RobotSchema = new Schema({
    name: { type: String, required: true, unique: true },
    type: { type: String, default: 'AMR' },
    status: { type: String, enum: ['idle','active','charging','error'], default: 'idle' },
    location: {
        lat: { type: Number, default: 0 },
        lng: { type: Number, default: 0 },
        updatedAt: { type: Date, default: Date.now }
    },
    battery: { type: Number, min: 0, max: 100, default: 100 },
    config: { type: Schema.Types.Mixed, default: {} },
    lastSeen: { type: Date, default: Date.now }
}, { timestamps: true });

RobotSchema.index({ status: 1 });
module.exports = mongoose.model('Robot', RobotSchema);
