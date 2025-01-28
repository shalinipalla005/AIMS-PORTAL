const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: {type: String},
    email: { type: String},
    password: { type: String},
    department:{type: String},
    fa:{type:Boolean},
    createdOn: { type: Date, default: new Date().getTime() },
    category:{type:String},
    
});

module.exports = mongoose.model("users", userSchema);