import React, { Component } from "react";
import { render } from "react-dom";
import AceEditor from "react-ace";
import Timer from "../Timer/Timer.js";
import Landing from "../Landing/Landing.js";

import ReactResizeDetector from 'react-resize-detector'


import "ace-builds/src-noconflict/mode-jsx";
/*eslint-disable no-alert, no-console */
import "ace-builds/src-min-noconflict/ext-searchbox";
import "ace-builds/src-min-noconflict/ext-language_tools";
import './Compiler.css';
// Removed Ruby and Golang, need to add PHP
// C, C++, and C# implemented elsewhere
const languages = [
  "javascript",
  "java",
  "python",
  "typescript",
];

const themes = [
  "monokai",
  "github",
  "tomorrow",
  "kuroir",
  "twilight",
  "xcode",
  "textmate",
  "solarized_dark",
  "solarized_light",
  "terminal"
];

const max_question_id = 2;
const min_question_id = 1;

languages.forEach(lang => {
  require(`ace-builds/src-noconflict/mode-${lang}`);
  require(`ace-builds/src-noconflict/snippets/${lang}`);
});
require(`ace-builds/src-noconflict/mode-c_cpp`);

themes.forEach(theme => require(`ace-builds/src-noconflict/theme-${theme}`));















export default class Compiler extends Component {
  onLoad() {
    console.log("i've loaded");
  }
  onCodeChange(newValue) {
    console.log("change", newValue);
    this.setState({
      value: newValue
    });
  }

  onSelectionChange(newValue, event) {
    console.log("select-change", newValue);
    console.log("select-change-event", event);
  }

  onCursorChange(newValue, event) {
    console.log("cursor-change", newValue);
    console.log("cursor-change-event", event);
  }

  onValidate(annotations) {
    console.log("onValidate", annotations);
  }
  setTheme(e) {
    this.setState({
      theme: e.target.value
    });
  }

















  setMode(e) {
    this.setState({
      mode: e.target.value,
      selectedLanguage: e.target.value
    }, ()=> {
      this.setStarterCode();
    });

    if(e.target.value === "javascript"){
      this.setState({
        mode_id: 63
      });
    } else if(e.target.value === "java"){
      this.setState({
        mode_id: 62
      });
    } else if(e.target.value === "python"){
      this.setState({
        mode_id: 71
      });
    } else if(e.target.value === "C"){
      this.setState({
        mode:"c_cpp",
        mode_id: 50
      });
    } else if(e.target.value === "C++"){
      this.setState({
        mode:"c_cpp",
        mode_id: 54
      });
    } else if(e.target.value === "C#"){
      this.setState({
        mode:"csharp",
        mode_id: 51
      });
    } else if(e.target.value === "typescript"){
      this.setState({
        mode_id: 74
      });
    } else if(e.target.value === "ruby"){
      this.setState({
        mode_id: 72
      });
    } else if(e.target.value === "golang"){
      this.setState({
        mode_id: 60
      });
    }
    console.log(this.state.selectedLanguage)
  }

  setStarterCode() {
    console.log(this.state.selectedLanguage)
    fetch(`http://ec2-3-19-74-89.us-east-2.compute.amazonaws.com/question/${this.state.question_id}/${this.state.selectedLanguage}`)
      .then((response) => response.json())
      .then((data)=> {
        console.log(this.state.value);
        this.setState({
          value: data.starter_code,
          test_cases: data.test_cases,
        });
        console.log(this.state.selectedLanguage);
        console.log(this.state.value);
        console.log(data.starter_code);
      })
      .catch(error => {
        console.log(error);
      })
  }














  setBoolean(name, value) {
    this.setState({
      [name]: value
    });
  }
  setFontSize(e) {
    this.setState({
      fontSize: parseInt(e.target.value, 10)
    });
  }
  userInput = (event) => {
    this.setState({ user_input: event.target.value });
  };




















  submit = async (e) => {
    if(this.state.value){
      e.preventDefault();

      let outputText = document.getElementById("output");
      outputText.innerHTML = "";
      outputText.innerHTML += "Creating Submission ...\n";
      const response = await fetch(
        "https://judge0-ce.p.rapidapi.com/submissions",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-rapidapi-key": "3639162d1fmshe308787c7cf7188p189929jsn24e61de456df", // Get yours for free at https://rapidapi.com/hermanzdosilovic/api/judge0
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            accept: "application/json",
          },
          body: JSON.stringify({
            language_id: this.state.mode_id,
            source_code: this.state.value,
            stdin: this.state.user_input,
          }),
        }
      );
      outputText.innerHTML += "Submission Created ...\n";
      const jsonResponse = await response.json();

      let jsonGetSolution = {
        status: { description: "Queue" },
        stderr: null,
        compile_output: null,
      };

      while (
        jsonGetSolution.status.description !== "Accepted" &&
        jsonGetSolution.stderr == null &&
        jsonGetSolution.compile_output == null
      ) {
        outputText.innerHTML = `Creating Submission ... \nSubmission Created ...\nChecking Submission Status\nstatus : ${jsonGetSolution.status.description}`;
        if (jsonResponse.token) {
          let url = `https://judge0-extra.p.rapidapi.com/submissions/${jsonResponse.token}?base64_encoded=true`;

          const getSolution = await fetch(url, {
            method: "GET",
            headers: {
              "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
              "x-rapidapi-key": "3639162d1fmshe308787c7cf7188p189929jsn24e61de456df", // Get yours for free at https://rapidapi.com/hermanzdosilovic/api/judge0
              "content-type": "application/json",
            },
          });

          jsonGetSolution = await getSolution.json();
        }
      }
      if (jsonGetSolution.stdout) {
        const output = atob(jsonGetSolution.stdout);

        outputText.innerHTML = "";

        outputText.innerHTML += `Results\n-------------------------\n\n${output}\n\n--------------------------\nExecution Time : ${jsonGetSolution.time} Secs\nMemory used : ${jsonGetSolution.memory} bytes`;
      } else if (jsonGetSolution.stderr) {
        const error = atob(jsonGetSolution.stderr);

        outputText.innerHTML = "";

        outputText.innerHTML += `\n Error :${error}`;
      } else {
        const compilation_error = atob(jsonGetSolution.compile_output);

        outputText.innerHTML = "";

        outputText.innerHTML += `\n Error :${compilation_error}`;
      }
    }
  };













  onEditorResize (w, h) {
    this.setState({
      editorHeight: h,
      width: w
    })
  }

  onIoResize (w, h) {
    this.setState({
      ioHeight: h,
      width: w
    })
  }

  

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      theme: "monokai",
      selectedLanguage: "javascript",
      mode: "javascript",
      mode_id: 63,
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      fontSize: 20,
      showGutter: true,
      showPrintMargin: true,
      highlightActiveLine: true,
      enableSnippets: true,
      showLineNumbers: true,
      user_input: ``,
      editorHeight: 400,
      ioHeight: 300,
      width: 500,
      displayIO: true,

      isLanding: true,

      email_address: "",
      full_name: "",
      student_id: "",
      success: 'no',

      question_id: 1,
      question: '',
      details: '',
      allotted_time: 10,
      starter_code: '',
      test_cases: '',
    };
    this.setTheme = this.setTheme.bind(this);
    this.setMode = this.setMode.bind(this);
    this.onCodeChange = this.onCodeChange.bind(this);
    this.setFontSize = this.setFontSize.bind(this);
    this.onEditorResize = this.onEditorResize.bind(this);
    this.onIoResize = this.onIoResize.bind(this);
  }







  componentDidMount() {
    const temp = Math.floor(Math.random() * (max_question_id - min_question_id + 1)) + min_question_id
    this.setState({
      question_id: temp
    });
    fetch(`http://ec2-3-19-74-89.us-east-2.compute.amazonaws.com/question/${temp}/${this.state.selectedLanguage}`)
      .then((response) => response.json())
      .then((data)=> {
        this.setState({
          question: data.question,
          details: data.details,
          allotted_time: data.allotted_time,
          starter_code: data.starter_code,
          test_cases: data.test_cases,
          value: data.starter_code
        });
        console.log(this.stateallotted_time);
        console.log(this.data.allotted_time);
      })
      .catch(error => {
        console.log(error);
      })
  }

  onLandingChange = () => {
    if(this.state.email_address !== '' && this.state.full_name !== '' && this.state.student_id !==''){
      this.setState({
        isLanding: false,
      });
    } 
  }

  onFieldChange = (key, event) => { 
    this.setState({[key]: event})
  }







  render() {
    const { displayIO } = this.state;
    if(this.state.isLanding){
      return(
        <div>
          <Landing 
            onLandingChange = {this.onLandingChange}
            onFieldChange={this.onFieldChange} />
        </div>
      )
    }else{
        return (
        <div>

          <div className="questions_and_answers" style={{display: "flex"}}>
            <div className="Compiler" style={{width: `50%`}}>
              <div className="popup">
                <div className="field">
                  <label>Mode:</label>
                  <p className="control">
                    <span className="select">
                      <select
                        name="mode"
                        onChange={this.setMode}
                        value={this.state.selectedLanguage}
                      >
                        {languages.map(lang => (
                          <option key={lang} value={lang}>
                            {lang}
                          </option>
                        ))
                        }
                        <option key={"C"} value={"C"}>
                          C
                        </option>
                        <option key={"C++"} value={"C++"}>
                          C++
                        </option>
                        <option key={"C#"} value={"C#"}>
                          C#
                        </option>
                      </select>
                    </span>
                  </p>
                </div>

                <div className="field">
                  <label>Theme:</label>
                  <p className="control">
                    <span className="select">
                      <select
                        name="Theme"
                        onChange={this.setTheme}
                        value={this.state.theme}
                      >
                        {themes.map(lang => (
                          <option key={lang} value={lang}>
                            {lang}
                          </option>
                        ))}
                      </select>
                    </span>
                  </p>
                </div>

                <div className="field">
                  <label>Font Size:</label>
                  <p className="control">
                    <span className="select">
                      <select
                        name="Font Size"
                        onChange={this.setFontSize}
                        value={this.state.fontSize}
                      >
                        {[14, 16, 18, 20, 24, 28, 32, 40].map(lang => (
                          <option key={lang} value={lang}>
                            {lang}
                          </option>
                        ))}
                      </select>
                    </span>
                  </p>
                </div>

                {/* <div className="field">
                  <p className="control">
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        checked={this.state.enableBasicAutocompletion}
                        onChange={e =>
                          this.setBoolean(
                            "enableBasicAutocompletion",
                            e.target.checked
                          )
                        }
                      />
                      Enable Basic Autocomplete
                    </label>
                  </p>
                </div>
                <div className="field">
                  <p className="control">
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        checked={this.state.enableLiveAutocompletion}
                        onChange={e =>
                          this.setBoolean(
                            "enableLiveAutocompletion",
                            e.target.checked
                          )
                        }
                      />
                      Enable Live Autocomplete
                    </label>
                  </p>
                </div>
                <div className="field">
                  <p className="control">
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        checked={this.state.showPrintMargin}
                        onChange={e =>
                          this.setBoolean("showPrintMargin", e.target.checked)
                        }
                      />
                      Show Print Margin
                    </label>
                  </p>
                </div>
                <div className="field">
                  <p className="control">
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        checked={this.state.highlightActiveLine}
                        onChange={e =>
                          this.setBoolean("highlightActiveLine", e.target.checked)
                        }
                      />
                      Highlight Active Line
                    </label>
                  </p>
                </div>
                <div className="field">
                  <p className="control">
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        checked={this.state.enableSnippets}
                        onChange={e =>
                          this.setBoolean("enableSnippets", e.target.checked)
                        }
                      />
                      Enable Snippets
                    </label>
                  </p>
                </div> */}
              </div>
              
              <button 
                type="submit" 
                // className="btn btn-danger ml-2 mr-2 " 
                onClick={this.submit} > Run
                </button>







              <div className="resizable">
                {/* <h2>Editor</h2> */}

                <ReactResizeDetector handleWidth handleHeight onResize={this.onEditorResize} />
                <AceEditor
                  mode={this.state.mode}
                  theme={this.state.theme}
                  name="blah2"
                  onLoad={this.onLoad}
                  onChange={this.onCodeChange}
                  onSelectionChange={this.onSelectionChange}
                  onCursorChange={this.onCursorChange}
                  onValidate={this.onValidate}
                  value={this.state.value}
                  fontSize={this.state.fontSize}
                  showPrintMargin={this.state.showPrintMargin}
                  showGutter={this.state.showGutter}
                  highlightActiveLine={this.state.highlightActiveLine}
                  height={this.state.editorHeight}
                  width={this.state.width}
                  setOptions={{
                    useWorker: false,
                    enableBasicAutocompletion: this.state.enableBasicAutocompletion,
                    enableLiveAutocompletion: this.state.enableLiveAutocompletion,
                    enableSnippets: this.state.enableSnippets,
                    tabSize: 2
                  }}
                />
                
              </div>
              <div id = "textarea-container">
              {/* <ReactResizeDetector handleWidth handleHeight onResize={this.onIoResize} /> */}
              <div class="ioButtons" style={{marginLeft: this.state.width - 105 }}>
                  <div onClick={() => this.setState({ displayIO: false })}>Stdin</div>
                  <div onClick={() => this.setState({ displayIO: true })}>Stdio</div>
                </div>
                <div style={{ display: (displayIO ? 'block' : 'none')}}>
                  <textarea readOnly={true} class="io" id="output"
                            style={{width: this.state.width}}></textarea>
                </div>
                <div style={{ display: (displayIO ? 'none' : 'block')}}>
                  <textarea class = "io" id="input" onChange={this.userInput}
                            style={{width: this.state.width}}></textarea>
                </div>
              </div>
            </div>
















            
            <div className="Questions" style={{width: `50%`}}>

              <div>
                <Timer 
                  startCount = {this.state.allotted_time}
                  email_address= {this.state.email_address}
                  full_name = {this.state.full_name}
                  student_id = {this.state.student_id}
                  question = {this.state.question}
                  question_id = {this.state.question_id}
                  allotted_time = {this.state.allotted_time}
                  success = {this.state.success}
                  language_name = {this.state.selectedLanguage}
                  student_code = {this.state.value} />
              </div>
              <div style = {{whiteSpace: 'pre-wrap'}} class = 'prompt'>
                {this.state.question}
              </div>
              <div style = {{whiteSpace: 'pre-wrap'}} class = 'details'>
                {this.state.details}
              </div>

            </div>


          </div>
        </div>
      );
    }
    
  }
}