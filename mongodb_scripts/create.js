db.locations.save({
    name: "Starcups",
    address: "125 High Street, Reading, RG6 1PS",
    rating: 3,
    facilities: ["Hot drinks", "Food", "Premium wifi"],
    coords: [-0.9690884, 51.455041],
    openingTimes: [
        {
            days: "Monday - Friday",
            opening: "07:00 am",
            closing: "07:00 pm",
            closed: false
        },
        {
            days: "Saturday",
            opening: "08:00 am",
            closing: "05:00 pm",
            closed: false
        },
        {
            days: "Sunday",
            closed: true
        }
    ]
})


db.locations.update({
    name: "Starcups"
    },{
    $push: {
        reviews: {
            author: "Simon Holmes",
            _id: ObjectId(),
            rating: 5,
            timestamp: new Date("Jul 16, 2013"),
            reviewText: "What a great place. I can't say enough good things about it."
        }
    }
})
