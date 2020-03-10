import React, { Component } from 'react'
import axios from 'axios';
import {Table } from 'react-bootstrap';
import {ImageAssets} from './loader/loader'
export default class App extends Component {
  isClickable = false;
  constructor(props){
    super(props);
   
  }
  state={
    data:'',
    error:Error,
    responseData:undefined,
    tableData:undefined,
    displayTable:false,
    displayCompayDetails:false,
    domainName:'',
    companyDetails:[],
    loading:false
  }
  handleFields = (event)=> {
    this.isClickable = true;
    this.setState({ 
      ...this.state,
      data:event.target.value
    },() =>{
      this.sendData(this.state.data);
    })

    }
  getColumnNames = (dataObj) => {
    return dataObj ? Object.keys(dataObj) : []
  }
  getColumnValues = (valueObj) => {
    return valueObj ? Object.values(valueObj) : []
  }

  handleCompanySearch = async(domainName) => {
    this.isClickable = false;
    try{
      const companyName=domainName.split(' ')
      this.setState({
        ...this.state,
        loading:true
      })
      const response=await axios.get(`https://axis-poc.herokuapp.com/fetchDomain/${companyName[0]}`)
      this.setState({
        ...this.state,
        loading:false
      })
        this.getCompanyDetails(response.data.Domain)
    }catch(error){
      this.setState({
        ...this.state,
        error,loading:false
      })
    }
    
  }
componentDidMount(){
  this.getData();
}

async getCompanyDetails(domainName){
try{
  this.setState({
    ...this.state,
    loading:true
  })
  const response =await axios.get(`https://axis-poc.herokuapp.com/companyDomain/${domainName}`)
  if(response)
  {
    this.setState({
      ...this.state,
      tableData:[response.data],
      loading:false
    },()=>{console.log('in get company ',response.data)
    })
  }
}catch(error){
  this.setState({
    ...this.state,
    error,
    loading:false
  })
}
}

 getData=async()=>{
   
    try{
    this.setState({
      ...this.state,
      loading:true
    })
      const response = await axios.get('https://guarded-stream-73338.herokuapp.com/api/rss_cat/')
      
      if(response){
        this.setState({
          ...this.state,
          displayTable:true,
          responseData:response.data.categories,
          loading:false
        })    
      }
    }catch(error){
      this.setState({
        ...this.state,
        displayTable:false,
        error,
        loading:false
      })
    }
  }

  
 sendData=async(cat_id)=>{
  try{
    this.setState({
      ...this.state,
      loading:true
    })
  
    const response = await axios.get(`https://guarded-stream-73338.herokuapp.com/api/rss_data/?cat_id=${this.state.data}`)
    
   
    if(response){
      this.setState({
        ...this.state,
        tableData:response.data.response,
        loading:false
      })
    }
  }catch(error){
    this.setState({
      ...this.state,
      error,
      loading:false
    })
  }
}
  render() {

    const { tableData, responseData,companyDetails } = this.state;
    return (
      <div >
       
            <div className="container " style={{marginLeft :"38%",marginTop:"80px"}}>
                <div className="dropdown show ">
                    <a className="btn btn-success dropdown-toggle justify-content-center" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{width:"300px"}}>
                    Categories                     
                    </a>
                     {this.state.loading && <img style={{width:30}} src={ImageAssets.ic_cLoader}/>} 
                    <div  className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                      {
                        responseData && responseData.map((data)=>{
                        return <li   key={`${data.cat_name}-${data.cat_id}`} className="dropdown-item"   value={data.cat_id} onClick={this.handleFields}>{data.cat_name}</li>
                        })
                      }

                      
                    </div>
                </div>

            </div>

        <div style={{marginTop:"50px"}}>

           

<div className="row mb-4 ">
          <div className="col-sm-12 grid-margin">
            <div className="card h-100">
              <h4 className="card-header">Data From Api</h4>
              <div className="card-body">
                
                <Table striped bordered hover>
                  <thead>

                    <tr>
                    {tableData  !== undefined ? this.getColumnNames(tableData[0]).map((item,index) =>
                      <th key={index}>{item}</th>) : ""}
                      </tr>
                   
                  </thead>
                  <tbody>
                  
            
                   { tableData  !== undefined ? tableData.map((obj,index) =>
                       (<tr key={index}>{this.getColumnValues(obj).map((item,index)=>
                       index === 1 && this.isClickable ? (<td key={index} onClick={()=>this.handleCompanySearch(item)}>{item}</td>) : (<td key={index}>{item}</td>)
                    )}</tr>)
                  ) :''}
         
                     </tbody>
                </Table>
                    
              </div>
            </div>
          </div>
        </div>

      </div>


      </div>
     
    )
  }
}





    



