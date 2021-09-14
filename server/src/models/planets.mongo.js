const mongoose = require("mongoose");

const planetSchema = new mongoose.schema({
    keplerName: {
        type: String,
        required: true,
    },
});
