import express from 'express'
import { MongoClient } from 'mongodb'
import cors from 'cors'
import fs from 'fs'
import { Binary } from 'mongodb'

const app = express()
app.use(express.json())
app.use(cors())
const client = new MongoClient('mongodb+srv://nandhagopy:24122000@cluster0.wfk7s1i.mongodb.net/')

app.get('/submit',async(req,res)=>{
    const {cmd,where} = req.query
    const paths = cmd.split(',')
    await client.connect()
    const db = client.db('Ecommerce')
    const coll = db.collection('allproducts')

    const tempArr = paths.map((data)=>{
        return new Binary(Buffer.from(fs.readFileSync(data)))
    })

    const result = await coll.updateOne({product:where},{$set:{data:tempArr}})
    console.log(result);
    console.log(cmd,where);
    res.send(true)
})

app.listen(8000,async()=>{
    console.log('server started');
    await client.connect()
    console.log("db connected");
})