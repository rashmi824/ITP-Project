import React, {useState, useEffect } from 'react';
import {NavLink}from 'react-router-dom'
import jspdf from 'jspdf'
import "jspdf-autotable"




const ViewStockO=()=>{
  const[searchTerm,setsearchTerm]=useState("");//search
  



    //view data

   const [getuserdata,setUserdata]=useState([]);
   const [ldt,setDLTdata]=useState([]);
  console.log(getuserdata);


  


  const getdata=async(e)=>{
 

    
    const res =await fetch("http://localhost:8090/stockorder",{

      method:"GET",
      headers:{"Content-Type":"application/json"},

      
    });

 const data= await res.json();
 console.log(data);

   if (res.status===404 ||!data)
{
  console.log("error");

}else{
 setUserdata(data);
  console.log("data fetched");
}
}

  useEffect(()=>{
    getdata();
  },[]) 




  //delete user

const deleteuser = async (id) => {

    const res2 = await fetch(`http://localhost:8090/stockorder/delete/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
  
    const deletedata = await res2.json();
    console.log(deletedata);
  
    if (res2.status === 422 || !deletedata) {
        console.log("error");
    } else {
        console.log("user deleted");
        setDLTdata(deletedata)
        getdata();
    }
  
  
  }
  
  
  function generatePDF() {
    const doc = new jspdf();
    const tableColumn = ["Supplier ID", "Order Number", "Date", "Description", "Status", "Amount"];
    const tableRows = [];

    getuserdata.slice(0).reverse().map(pdf => {
        const pdfData = [
            pdf.supplierId,
            pdf.orderNumber,
            pdf.date,
            pdf.description,
            pdf.status,
            pdf.amount,
            
        ];
        tableRows.push(pdfData);
    });

    doc.autoTable(tableColumn, tableRows, { styles: { fontSize: 8 }, startY: 35 });
    const date = Date().split(" ");
    const dateStr = date[1] + "-" + date[2] + "-" + date[3];
    doc.text("SUPPLIER-StockOrder-Report", 14, 15).setFontSize(12);
    doc.text(`Report Generated Date - ${dateStr} `, 14, 23);
    doc.save(`SUPPLIER-StockOrder-Report_${dateStr}.pdf`);

}
  





    return(

//<div>{/* className="container" */}
<section className="ftco-section">
<div className="container">
  <div className="row justify-content-center">
    <div className="col-md-12 text-center mb-5">
{/* //search */}
 <nav class="navbar navbar-dark bg-light">
  <form class="form-inline">
    <input class="form-control mr-sm-2" type="search"   placeholder="Search" onChange={(e)=>{setsearchTerm(e.target.value);}} aria-label="Search"  />

  </form>
</nav> 

<div className="row">
  <div className="col-md-12">
 <div className="table-wrap">
        <table className="table">
  <thead class="thead-dark">
    <tr>
      <th scope="col">Index</th>
      <th scope="col">Supplier ID</th>
      <th scope="col">Order Number</th>
      <th scope="col">Date</th>
      <th scope="col">Description</th>
      <th scope="col">Status</th>
      <th scope="col">Amount</th>
      <th scope="col"></th>
      <th scope="col"></th>
      <th scope="col"></th>

    </tr>
  </thead>
  <tbody>


 

    {getuserdata.filter((val)=>{ //search feature
     if(searchTerm===''){
      return val;
     }else if(
      val.supplierId.toLowerCase().includes(searchTerm.toLowerCase())||
      val.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())||
      val.description.toLowerCase().includes(searchTerm.toLowerCase())||
      val.status.toLowerCase().includes(searchTerm.toLowerCase())
     ){
      return val;
     }
      
     }).map((element,id)=>{

        return(

            <>
            <tr>
            <th scope="row">{id+1}</th>
      <td>{element.supplierId}</td>
      <td>{element.orderNumber}</td>
      <td>{element.date}</td>
      <td>{element.description}</td>
      <td>{element.status}</td>
      <td>{element.amount}</td>
      <td></td>
      <td></td>
      <td className="d-flex justify-content-between">
      <NavLink to={`/updateStock/${element._id}`}><button className="btn btn-dark" ><i className="fa-regular fa-pen-to-square"></i></button></NavLink>
      <button className="btn btn-dark" onClick={() => deleteuser(element._id)}><i className="fa-regular fa-trash-can"></i></button>
      </td>


            </tr>
            </>
        )
    })}

    

  
 
  </tbody>
</table>
</div>
</div>
</div>
<button className="btn btn-dark"  onClick={generatePDF}>Generate Report</button>
</div>
</div>
</div>
</section>
//</div>

    )
}



export default ViewStockO;
