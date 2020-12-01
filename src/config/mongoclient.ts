import MongoDB from "mongodb";

const MongoClient = MongoDB.MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jhhqz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

export default new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).connect();
