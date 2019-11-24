import React, { Component } from 'react';
import App from './App';
class Manager extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let boxOffset = 10
        let boxHeight = 45+boxOffset
        let numberOfBoxs = parseInt((window.innerHeight)/(boxHeight)) - 1
        let marginTop = parseInt((window.innerHeight-numberOfBoxs*boxHeight)/2)
        let boxs = []
        for (var i=0;i<numberOfBoxs;i++){
            boxs.push(<App key={i} y={i*boxHeight}/>)
        }
        return (
            <div style={{marginTop}}>
                {boxs}
            </div>
        );
    }
}

export default Manager;