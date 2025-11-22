const mongoose = require('mongoose');

const CoworkingSpaceSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength:[50, 'name cannot be more than 50 character']
    },
    address:{
        type: String,
        required: [true, 'Please add a address']
    },
    district:{
        type: String,
        required: [true, 'Please add a district']
    },
    province:{
        type: String,
        required: [true, 'Please add a province']
    },
    postalcode:{
        type: String,
        required: [true, 'Please add a postalcode'],
        maxlength:[5, 'Postalcode cannot be more than 5 digit']
    },
    tel:{
        type:String
    },
    region:{
        type: String,
        required: [true, 'Please add a region']
    },
    openTime:{
        type: String
    },
    closeTime: {
        type: String
    }

},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

CoworkingSpaceSchema.virtual('reservations', {
    ref: 'Reservation',
    localField: '_id',
    foreignField: 'spaceId',
    justOne: false
});

CoworkingSpaceSchema.virtual('waitlist', {
    ref: 'Waitlist',
    localField: '_id',
    foreignField: 'spaceId',
    justOne: false
});

module.exports = mongoose.model('CoworkingSpace', CoworkingSpaceSchema);