// Server component - no need for 'use client'
// import { useEffect, useState } from "react";

import axios from "axios";

// export default function User() {
//   const [data, setdata] = useState<any[]>([])

//   useEffect(() => {
//    axios.get('https://fakestoreapi.com/products')
//   .then(response => setdata(response.data))
//   }, [])

export default async function User(){
  const response = await axios.get('https://fakestoreapi.com/products')
  await new Promise(r => setTimeout(r,1000))
  const data = response.data;

  return (
    <div>
      <p className="m-4 p-2 bg-yellow-300 max-w-fit" >ALL PRODUCTS DETAILS</p>
      {data.map((item:any) => (
        <div key={item.id} className="bg-amber-200 p-4 m-4 max-w-fit">
          <div className="flex bg-amber-300 p-2" >Title: {item.title}</div>
          <div className="flex bg-amber-400 p-2">Price: {item.price}</div>
          <div className="flex bg-amber-600 p-2">Description : {item.description}</div>
          <div className="flex bg-amber-700 p-2">Category : {item.category}</div>
        </div>
      ))}
    </div>
  )
}