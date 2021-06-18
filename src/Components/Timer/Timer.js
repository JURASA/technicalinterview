import React, { Component } from 'react';
import './Timer.css';

class Timer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      count: 1
    }
  }

  render () {
    const {count} = this.state
    if(count%60 < 10 && count > 0){
        return(<h1 class="timer">Time Left: {Math.floor(count/60)}:0{(count%60)} </h1>);
    } else if (count > 0){
        return(<h1 class="timer">Time Left: {Math.floor(count/60)}:{(count%60)} </h1>);
    }else{
      return(<h1 class="timer">Time Left: 0:00 </h1>);
    }
  }
  // setInterval
  // clearInterval
  componentDidMount () {
    const {startCount} = this.props
    this.setState({
      count: startCount
    })
    this.doIntervalChange()
  }

  doIntervalChange = () => {
      this.myInterval = setInterval(() => {
      this.setState(prevState => ({
        count: prevState.count - 1
      }))
      if(this.state.count === 0){
        console.log("time's up!");
        fetch(`http://ec2-3-19-74-89.us-east-2.compute.amazonaws.com/student`, {
          method: 'POST',
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            email_address: this.props.email_address,
            full_name: this.props.full_name,
            student_id: this.props.student_id,
            question: this.props.question,
            question_id: this.props.question_id,
            allotted_time: this.props.allotted_time,
            on_time: this.props.success,
            language_name: this.props.language_name,
            student_code: this.props.student_code,
          }),
        })
      }
    }, 1000)
  }

  componentWillUnmount () {
    clearInterval(this.myInterval)
  }
}

export default Timer;