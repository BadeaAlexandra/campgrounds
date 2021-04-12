var mongoose = require('mongoose');

//schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    createdAt: { type: Date, default: Date.now }, //momentul crearii
    author: {
      id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
      },
      username: String
   },
    comments: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment" //numele modelului
        }
     ],
     reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    rating: {
        type: Number,
        default: 0
    }
});
        
//Compilarea clasei/pattern-ului campgroundSchema in modelul Campground
var Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;