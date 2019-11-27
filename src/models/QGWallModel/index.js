import React, { Component } from 'react';
import Box from './Box.js';
import cool_data from '../../asset/cool_data.json'

let boxOffset = 10
let boxHeight = 45 + boxOffset
let numberOfBoxs = parseInt((window.innerHeight) / (boxHeight)) - 1
let marginTop = parseInt((window.innerHeight - numberOfBoxs * boxHeight) / 2)

const randRange = (max, min = 1) => {
	return parseInt(Math.random() * (max - min) + min);
}

class Manager extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataStack: []
		};
		this.boxs = []
		this.boxRefs = []
		this.connectSocket = this.connectSocket.bind(this)
		this.fiilDataStack = this.fiilDataStack.bind(this)
		this.setBox = this.setBox.bind(this)
		this.getRandomCoolData = this.getRandomCoolData.bind(this)
		this.updateBoxDataFromDataStack = this.updateBoxDataFromDataStack.bind(this)
	}

	getRandomCoolData() {
		return cool_data[randRange(cool_data.length - 1, 0)]
	}

	setBox(refId, option = {}) {
		let { text = '', isShow = true } = option
		setTimeout(()=>{
			this.boxRefs[refId].setText(text)
			.then(() => {
				this.boxRefs[refId].show(isShow)
			})
		},randRange(350,0))
	}

	fiilDataStack() {
		// 使用靜態資源填充
		let { dataStack } = this.state
		for (var i = 0; i < numberOfBoxs; i++) {
			dataStack.unshift(this.getRandomCoolData())
		}
		console.log(dataStack)
		this.setState({
			dataStack
		})
	}

	connectSocket() {
		setInterval(() => {
			var { dataStack } = this.state
			var newdata = this.getRandomCoolData()
			dataStack.pop()
			dataStack.unshift(newdata)
			this.setState({
				dataStack
			})
			console.log(dataStack)
		}, 1000)
	}

	UNSAFE_componentWillMount() {
		for (var i = 0; i < numberOfBoxs; i++) {
			this.boxs.push(<Box ref={(input) => { this.boxRefs.push(input) }} key={i} y={i * boxHeight} />)
		}
	}

	componentDidMount() {
		this.fiilDataStack()
		this.connectSocket()
		this.updateBoxDataFromDataStack()
		setInterval(()=>{
			this.updateBoxDataFromDataStack()
		},7000)
	}

	updateBoxDataFromDataStack(){
		let { dataStack } = this.state
		for (var i = 0; i < numberOfBoxs; i++) {
			this.setBox(i, { text: dataStack[i] })
		}
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