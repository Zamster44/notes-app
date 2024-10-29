const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const noteSchema = new Schema ({
    title: {type: String ,required: true} ,
    content: {type: String ,required: true} ,
    tag: {type: [String] ,default: []},
    isPinned: {type: Boolean ,default: false} ,
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    createdOn: { type: Date , default: new Date().getTime()}
})

module.exports = mongoose.model("Note" , noteSchema);