import React, {Component} from 'react';
import './App.css';
import Compiler from "./Components/Compiler/Compiler.js";

class App extends Component {
  render(){
    return (
      <div>
        <Compiler/>
      </div>
    );
  }
}

export default App;
