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
  const sampleidx = 10
  await Campground.deleteMany({});
  for(let i = 0; i < sampleidx; i++){
    const price = Math.floor(Math.random() * 80) * 1000 + 10000;
    const seedcamp = new Campground({
      author: '60eea1b23ed66a18a0173098',
      location: `${sample(citiesinfo).city}, ${sample(citiesinfo).state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: 'https://source.unsplash.com/collection/483251',
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo nisi, optio laudantium quam aut facilis consequuntur quo officiis! Odit aperiam expedita maiores atque, repellendus sed ut unde ipsa impedit mollitia.",
      price: price
    })
    await seedcamp.save()
  }
}

seedDb().then(() => {
  mongoose.connection.close()
});