import './App.css';
import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function App() {
  const [vendors, setVendors] = useState([]);
  const [graphdata, setGraphData] = useState([0,0,0,0,0,0,0,0,0,0,0,0]);
  const [vendorId, setVendorId]=useState({});
  const [name, setName]=useState({x:''});
  const [products, setProducts]=useState([]);
  const [isLoading, setIsLoading]=useState({load:false});
  let vendorValue='';

  //get vendors to List into Dropdown Menu
  const getVendors = async()=>{
    try{
      const response = await fetch('/api/vendors')
      if(response.ok){
        const result = await response.json();
        setVendors(result);
      }
    }catch(error){
      console.log(error);
    }
     
  }
  //send request to get orders and products based on vendor id
  const getOrders = async()=>{
    const newGraphData = [0,0,0,0,0,0,0,0,0,0,0,0];
    setIsLoading({...isLoading, load:true})
    try{
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(vendorId),
        
    })
      if(response.ok){
        const result = await response.json();
        //Edit Graph Data
        result.orders.map((order)=>{
          if(new Date(order.payment_at).getYear() === 122){
            order.cart_item.map((item)=>{
            result.products.map((product)=>{
              if(item.product == product._id){
                switch(new Date(order.payment_at).getMonth()){
                  case 0:
                      newGraphData[0]+=item.quantity
                    break;
                    case 1:
                        newGraphData[1]+=item.quantity
                      break;
                  case 2:
                      newGraphData[2]+=item.quantity
                    break;
                  case 3:
                      newGraphData[3]+=item.quantity
                  break;
                  case 4:
                      newGraphData[4]+=item.quantity
                    break;
                  case 5:
                      newGraphData[5]+=item.quantity
                  break;
                  case 6:
                      newGraphData[6]+=item.quantity
                    break;
                  case 7:
                      newGraphData[7]+=item.quantity
                  break;
                  case 8:
                      newGraphData[8]+=item.quantity
                    break;
                  case 9:
                      newGraphData[9]+=item.quantity
                  break;
                  case 10:
                      newGraphData[10]+=item.quantity
                    break;
                  case 11:
                      newGraphData[11]+=item.quantity
                  break;
                }
            }})
          })
          }
        })
        setGraphData(newGraphData);
        //Edit Table Data
        setProducts(result.products);
         result.orders.map((order)=>{
          order.cart_item.map((item)=>{
              result.products.map((product)=>{
                if(product.quantity === undefined){
                  product.quantity = 0
                }
                if(item.product == product._id){
                  product.quantity+=item.quantity;
                }
            })
          })
        })
        
      }
    }catch(error){
      console.log(error);
    }
    setIsLoading({...isLoading, load:false})
      
  }
  
 
  //handle dropdown change
  const handleChange =  (event) => {
    vendorValue = event.target.value;
    setVendorId({vendorId:vendorValue});
    setProducts([])
    setName({...name, x:event.target.value});
  };

  useEffect(()=>{
    getVendors();
    getOrders();
  }, [vendorId, vendorValue,  ])
  return (
    <div className="App">
      <h1>Welcome to The Dashboard, Prepared For You</h1>
      <p>Please Choose a Vendor To See The Data</p>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Choose A Vendor</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={name.x}
          label='Click to Choose A Vendor'
          onChange={handleChange}
        >
          {vendors.map((vendor)=>{
            return (
              <MenuItem value={vendor._id}>{vendor.name}</MenuItem>
            )
          })}
        </Select>
      </FormControl>
      {isLoading.load?'Veri Yükleniyor lütfen bekleyiniz.':
      ((<div>
        <h2>Line Chart</h2>
        <p>Line Chart Shows 2022 Sales of Chosen Vendor Per Month(Numbers represents months and [0=January, 11=December])</p>
        <LineChart
          xAxis={[{ data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] }]}
          series={[
            { curve: "linear", data: graphdata },
          ]}
          height={300}
        />
  <h2>Table</h2>
  <p>Table Shows All Sales of Chosen Vendor For All Time By Product</p>
  <TableContainer component={Paper}>
        <Table sx={{ minWidth: 250 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name Of Product</TableCell>
              <TableCell align="right">Quantity Sold</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      </div>))}
    </div>
  );
}

export default App;
