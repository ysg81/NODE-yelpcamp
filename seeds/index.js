const {citiesinfo} = require('./cities')
const {places, descriptors} = require('./seedHelpers')
const mongoose = require('mongoose')
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connections error:"))
db.once("open", () => {
  console.log("Database connected");
})

const sample = arr => arr[Math.floor(Math.random() * arr.length)]

const seedDb = async() => {
  const sampleidx = 100
  await Campground.deleteMany({});
  for(let i = 0; i < sampleidx; i++){
    // const randomidx = Math.floor(Math.random()*1000)
    const seedcamp = new Campground({
      location: `${sample(citiesinfo).city}, ${sample(citiesinfo).state}`,
      title: `${sample(descriptors)} ${sample(places)}`
    })
    await seedcamp.save()
  }
}

seedDb().then(() => {
  mongoose.connection.close()
});