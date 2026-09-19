import express from "express";
import cors from "cors";


const app = express();
app.set("trust proxy", 1);

app.use(cors());  //should set some allowed origins later

app.use(express.json());

//Health check route
app.get("/", (req, res) => {
    res.send("Server is running");
});

export default app;