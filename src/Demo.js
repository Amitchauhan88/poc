import React, { Component } from 'react'

 class Demo extends Component {
     constructor(){
         super();
         this.state={
             message:'hello'
         }
     }
    render() {
        return (
            <div className="container text-center">
                
                <h1 >{this.state.message}</h1>
                <button type="submit">submit</button>
            </div>
        )
    }
}

export default Demo
