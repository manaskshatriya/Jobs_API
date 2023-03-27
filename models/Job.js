const mongoose = require('mongoose');


const JobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true,"Please add a company"],
        maxlength: [50,"Company name can not be more than 50 characters"]
    },
    position:{
        type: String,
        required: [true,"Please add a position"],
        maxlength: [15,"Position name can not be more than 15 characters"]
    },
    status:{
        type: String,
        enum:['interview','declined','pending'],
        default: 'pending',
    },
    createdBy:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true,"Please add a user"] 
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Job',JobSchema)