import express from "express"
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config'
import cors from "cors"



const app = express();
const port = 8000;

app.use(cors())
app.use(express.json())


const client = new MongoClient(process.env.MONGODB_URI);
export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const Mongo = await connectToMongoDB()
const db = Mongo.db("aid-circle")
const eventcollection = db.collection("events")
const joinedcollection = db.collection("joined")

app.post('/create-event', async(req , res) =>{
  const data = req.body
  const result =  await eventcollection.insertOne(data)
  
  
  res.send(result)
})

app.get('/events', async (req, res) =>{
  const result = await eventcollection.find().toArray()
  res.send(result)
})
app.get('/events/:id', async (req, res) =>{
  const {id} = req.params
  const result = await eventcollection.findOne({_id: new ObjectId(id)})

  res.send(result)
  
})

app.post('/joined' , async(req, res) =>{
 const data = req.body
  const result =  await joinedcollection.insertOne(data)
  
  
  res.send(result)
})

app.get('/manage-event/:email' , async(req , res) =>{
const {email} = req.params
const result =  await joinedcollection.find({email:email}).toArray()

res.send(result)
})


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});