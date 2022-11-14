const mongoose = require("mongoose");

const { Schema } = mongoose;

const profilesSchema = new Schema({
    createdDate: {
        type: Date,
        default: new Date()
    },
    name: {
        type: String
    },
    lastname: {
        type: String
    },
    image: {
        type: String
    },
}, {timestamps: true});

const Profiles = mongoose.model("Profiles", profilesSchema);
module.exports = Profiles;
