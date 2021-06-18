import React, { Component } from 'react';
import './Landing.css';
import logo from './grapvineLogo.jpg';


class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    onValueChange = (event) => {
        // for a regular input field, read field name and value from the event
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        this.props.onFieldChange(fieldName, fieldValue);
    }

    render() {
        return (
            <div>
            <img src={logo} alt="imagename" class="styledimg"/>
            <div class="container">
                <div class="row">
                    <div class="col-25">
                        <label for="fname">Email Address</label>
                    </div>
                    <div class="col-75">
                        <input type="text" id="fname" name="email_address" placeholder="Enter Univeristy Email Address" 
                        onChange={this.onValueChange} />
                    </div>
                </div>
                <div class="row">
                    <div class="col-25">
                        <label for="lname">Full Name</label>
                    </div>
                    <div class="col-75">
                        <input type="text" id="lname" name="full_name" placeholder="Enter Legal Full Name" 
                        onChange={this.onValueChange}/>
                    </div>
                </div>
                <div class="row">
                    <div class="col-25">
                        <label for="fname">Student ID</label>
                    </div>
                    <div class="col-75">
                        <input type="text" id="fname" name="student_id" placeholder="Enter your Student ID Number" 
                        onChange={this.onValueChange}/>
                    </div>
                </div>
                <div class="row">

                </div>
                <div class="row">
                    <input type="submit" value="Submit" onClick={this.props.onLandingChange}/>
                </div>
            </div>
            </div>
        );
    }
}

export default Landing;

