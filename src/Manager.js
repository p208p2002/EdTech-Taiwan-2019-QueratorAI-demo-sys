import React, { Component } from 'react';
import Box from './Box';
import testData from './test.json'

const randRange = (max, min = 1) => {
    return Math.random() * (max - min) + min;
}

class Manager extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.boxRefs = []
        this.questions = testData
    }

    componentDidMount() {
        // setTimeout(() => {
        //     this.boxRefs[0].setText('true')
        //     this.boxRefs[0].show(true)
        // }, 2000)
        // setTimeout(() => {
        //     this.boxRefs[0].show(false)
        // }, 4000)

        // setTimeout(() => {
        //     this.boxRefs[0].setText('true2')
        //     this.boxRefs[0].show(true)
        // }, 6000)
        // setTimeout(() => {
        //     this.boxRefs[0].show(false)
        // }, 8000)

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
        let { questions } = this
        let boxOffset = 10
        let boxHeight = 45 + boxOffset
        let numberOfBoxs = parseInt((window.innerHeight) / (boxHeight)) - 1
        let marginTop = parseInt((window.innerHeight - numberOfBoxs * boxHeight) / 2)
        let boxs = []

        for (var i = 0; i < numberOfBoxs; i++) {
            boxs.push(<Box ref={(input) => { this.boxRefs.push(input) }} key={i} y={i * boxHeight} />)
        }

        return (
            <div style={{ marginTop }}>
                {boxs}
            </div>
        );
    }
}

export default Manager;