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
app.use(express.static("client/build"));
if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, "client/build")));
}
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
      res.send('No product is found check /api/vendors end point');
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
    res.send('No product or order is found check /api/prodocts end point');
  }

});

app.get('*', (req, res, next)=>{
  res.sendFile(path.join(__dirname, "client/build/index.html"));
})


//listen port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//Be sure db is connected
mongoose.connect(process.env.DB_URL)
.then(() => {

    console.log('Db successfully connected.');
    
})
  .catch((error)=>{
    console.log(error)
  })