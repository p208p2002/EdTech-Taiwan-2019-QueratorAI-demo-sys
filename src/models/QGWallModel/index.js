import React, { Component } from 'react';
import Box from './Box.js';
import cool_data from '../../asset/cool_data.json'

const randRange = (max, min = 1) => {
    return parseInt(Math.random() * (max - min) + min);
}

let boxOffset = 10
let boxHeight = 45 + boxOffset
let numberOfBoxs = parseInt((window.innerHeight) / (boxHeight)) - 1
let marginTop = parseInt((window.innerHeight - numberOfBoxs * boxHeight) / 2)

class Manager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataStack: []
        };
        this.boxs = []
        this.boxRefs = []
        this.questions = cool_data
        this.connectSocket = this.connectSocket.bind(this)
        this.fiilDataStack = this.fiilDataStack.bind(this)
    }

    fiilDataStack() {
      // 使用靜態資源填充
      let { dataStack } = this.state
      for(var i=0;i<numberOfBoxs;i++){
        dataStack.unshift(cool_data[randRange(cool_data.length-1,0)])
      }
      console.log(dataStack)
      this.setState({
        dataStack
      })
    }

    connectSocket() {
      setInterval(()=>{
        var { dataStack } = this.state
        var newdata = cool_data[randRange(cool_data.length-1,0)]
        dataStack.pop()
        dataStack.unshift(newdata)
        this.setState({
          dataStack
        })
        console.log(dataStack)
      },1000)
    }

    UNSAFE_componentWillMount() {
        for (var i = 0; i < numberOfBoxs; i++) {
            this.boxs.push(<Box ref={(input) => { this.boxRefs.push(input) }} key={i} y={i * boxHeight} />)
        }
    }

    componentDidMount() {
        this.fiilDataStack()
        this.connectSocket()
        setTimeout(() => {
            this.boxRefs[0].setText('true')
                .then(() => {
                    this.boxRefs[0].show(true)
                })
        }, 2000)

        setTimeout(() => {
            this.boxRefs[0].setText('true2')
                .then(() => {
                    this.boxRefs[0].show(true)
                })
        }, 6000)



    }

    render() {
        let { boxs } = this
        return (
            <div style={{ marginTop }}>
                {boxs}
            </div>
        );
    }
}

export default Manager;