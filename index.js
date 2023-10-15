const express = require('express');
const { ObjectId } = require('mongodb');
const mongoose=require('mongoose');
var MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const client = new MongoClient(process.env.DB_URL);
var cors = require('cors')


const app = express()
const port = 5500
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hello World!')
});

//return vendor list
app.get('/api/vendors', async (req, res) => {
  const database = await client.db("store");
  const products = await database.collection("vendors").find().toArray(function(err, results){
    console.log(results);
});;
  console.log(products.length);

  if (products) {
      res.send(products);
  } else {

  }

});

//receive vendor id and return related orders.
app.post('/api/products', async (request, response) => {
  const {vendorId} = request.body;
  console.log(typeof vendorId)
  if(vendorId === ''){
    return;
  }
  const query = {"vendor": new ObjectId(vendorId)};
  const database = await client.db("store");
  const products = await database.collection("products").find(query).toArray(function(err, results){
    console.log('test-1');
    console.log(results);
});;
  const searchProductArray=[];
  products.map((product)=>{
    searchProductArray.push(product._id)
  })
  
  // console.log(searchProductArray);
  const productQuery = {"cart_item.product":{$in:searchProductArray}};
  const orderCount = await database.collection("orders").find(productQuery).toArray(function(err, results){
    console.log(results);
});;

  if (orderCount && products) {

      // console.log(result);
      response.send({orders:orderCount, products:products});
  } else {

  }

});
// app.get('api/orders', async (req, res) => {
//   // const query = {_id: new ObjectId("61cc167a57a0b1781e9a0ff9")};
//   const query = {"cart_item.product": new ObjectId("6212e886be0097373dcaa3f1")};
//   const database = await client.db("store");
//   const products = await database.collection("orders").find(query).toArray(function(err, results){
//     console.log(results);
// });;
//   console.log(products.length);

//   if (products) {

//       // console.log(result);
//       res.send(products);
//   } else {

//   }

// });
// app.get('/orders', async (req, res) => {
//     // const query = {_id: new ObjectId("61cc167a57a0b1781e9a0ff9")};
//     const query = {"cart_item.product": new ObjectId("6212e886be0097373dcaa3f1")};
//     const database = await client.db("store");
//     const products = await database.collection("orders").find(query).toArray(function(err, results){
//       console.log(results);
//   });;
//     console.log(products.length);

//     if (products) {

//         // console.log(result);
//         res.send(products);
//     } else {

//     }

// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


mongoose.connect(process.env.DB_URL)
.then(() => {

    console.log('test');
    
})
  .catch((error)=>{
    console.log(error)
  })