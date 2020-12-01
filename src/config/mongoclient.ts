import MongoDB from "mongodb";

const MongoClient = MongoDB.MongoClient;

const uri = process.env.DB_URI;

export default new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).connect();
