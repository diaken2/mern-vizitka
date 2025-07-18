import express from "express";
import path from "path"
import { fileURLToPath } from "url"
import cors from "cors";
import mongoose from "mongoose";
import router from "./router.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", router);
app.use(express.static(path.join(__dirname, 'dist')))
const PORT = process.env.PORT || 8888;





const start = async () => {
  try {
    await mongoose.connect(
      "mongodb://visitsite:learninfo88@ac-dm6hbja-shard-00-00.fuynubj.mongodb.net:27017,ac-dm6hbja-shard-00-01.fuynubj.mongodb.net:27017,ac-dm6hbja-shard-00-02.fuynubj.mongodb.net:27017/?ssl=true&replicaSet=atlas-cgrymg-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0",
      {}
    );
    app.listen(PORT, () => {
      console.log("Server has been launched on PORT:", PORT);
    });
  } catch (e) {
    console.log(e.message);
    return;
  }
};
app.get('/{*any}', (req,res)=>{
res.sendFile(path.join(__dirname, 'dist', 'index.html'));
})

start();