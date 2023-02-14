import express, {Express, Request, Response} from "express";
import dotenv from 'dotenv'

dotenv.config();


const app:Express = express();

const PORT = process.env.PORT;


app.get('/', (req:Request,res:Response)=>{
    res.status(200).json({GET: 'Hello, Server is running...'})
})

// app.listen(PORT)
app.listen(PORT, ()=>{
    console.log('Server is running on PORT: ', PORT)
})