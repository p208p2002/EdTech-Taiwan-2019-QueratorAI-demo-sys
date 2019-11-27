import React, { Component } from 'react';
import Box from './Box.js';
import cool_data from '../../asset/cool_data.json'
import './index.css'

let boxOffset = 10
let boxHeight = 45 + boxOffset
let numberOfBoxs = parseInt((window.innerHeight) / (boxHeight)) - 1
let marginTop = parseInt(boxHeight / 2)

const randRange = (max, min = 1) => {
	return parseInt(Math.random() * (max - min) + min);
}

class Manager extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataStack: [],
			textRunnerStack: [],
			textRunnerText:'',
			showRunner: false
		};
		this.boxs = []
		this.boxRefs = []
		this.connectSocket = this.connectSocket.bind(this)
		this.fiilDataStack = this.fiilDataStack.bind(this)
		this.setBox = this.setBox.bind(this)
		this.getRandomCoolData = this.getRandomCoolData.bind(this)
		this.updateBoxDataFromDataStack = this.updateBoxDataFromDataStack.bind(this)
		this.execTextRunner = this.execTextRunner.bind(this)
	}

	execTextRunner() {
		let { textRunnerStack } = this.state
		let data = textRunnerStack.pop()
		if (textRunnerStack.length > 0) {
			this.setState({
				showRunner:true,
				textRunnerText:data
			})
			setTimeout(()=>{
				this.setState({
					showRunner:false
				})
			},6200)
		}
		this.setState({
			textRunnerStack
		})
	}

	getRandomCoolData() {
		return cool_data[randRange(cool_data.length - 1, 0)]
	}

	setBox(refId, option = {}) {
		let { text = '', isShow = true } = option
		setTimeout(() => {
			this.boxRefs[refId].setText(text)
				.then(() => {
					this.boxRefs[refId].show(isShow)
				})
		}, randRange(350, 0))
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
			var { dataStack, textRunnerStack } = this.state
			var newdata = this.getRandomCoolData()
			dataStack.pop()
			dataStack.unshift(newdata)
			textRunnerStack.unshift(newdata)
			this.setState({
				dataStack,
				textRunnerStack
			})
			// console.log(dataStack)
			console.log(textRunnerStack.length)
		}, 2000)
	}

	UNSAFE_componentWillMount() {
		for (var i = 0; i < numberOfBoxs; i++) {
			this.boxs.push(<Box ref={(input) => { this.boxRefs.push(input) }} key={i} y={i * boxHeight + marginTop} />)
		}
	}

	componentDidMount() {
		this.fiilDataStack()
		this.connectSocket()
		setInterval(() => {
			this.updateBoxDataFromDataStack()
		}, 7000)
		setInterval(() => {
			this.execTextRunner()
		}, 8000)
	}

	updateBoxDataFromDataStack() {
		let { dataStack } = this.state
		for (var i = 0; i < numberOfBoxs; i++) {
			this.setBox(i, { text: dataStack[i] })
		}
	}

	render() {
		let { boxs } = this
		let { showRunner,textRunnerText } = this.state
		return (
			<div id="Wall">
				<div className={`${showRunner ? 'high-light' : 'hidden'}`}></div>
		<div className={`${showRunner ? 'high-light-text' : 'hidden'}`}><h3 className="text-center">{textRunnerText}</h3></div>
				<div>
					{boxs}
				</div>
			</div>
		);
	}
}

export default Manager;