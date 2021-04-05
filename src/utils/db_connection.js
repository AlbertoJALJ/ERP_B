import mongoose from 'mongoose'
const db_uri = process.env.db_uri;

mongoose.connect(db_uri,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
.then(console.log('Succesfuly connected to MongoDb'))
.catch(db => console.error(db))

module.exports = mongoose
