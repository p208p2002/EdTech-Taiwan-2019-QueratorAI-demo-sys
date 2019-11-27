import React, { Component } from 'react';
import Box from './Box.js';
import cool_data from '../../asset/cool_data.json'
import './index.css'
import openSocket from 'socket.io-client';
// const io = require('socket.io');

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
		this.setState({
			textRunnerStack
		})
		// console.log('execTextRunner',textRunnerStack,data)
		if (data) {
			this.setState({
				showRunner:true,
				textRunnerText:data
			})
			setTimeout(()=>{
				this.setState({
					showRunner:false
				})
			},6500)
		}
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
		// console.log(dataStack)
		this.setState({
			dataStack
		})
	}

	connectSocket() {
		// setInterval(() => {
		// 	var { dataStack, textRunnerStack } = this.state
		// 	var newdata = this.getRandomCoolData()
		// 	dataStack.pop()
		// 	dataStack.unshift(newdata)
		// 	if(textRunnerStack.length <= 100){
		// 		textRunnerStack.unshift(newdata)
		// 	}
		// 	this.setState({
		// 		dataStack,
		// 		textRunnerStack
		// 	})
		// 	// console.log(dataStack)
		// 	console.log('textRunnerStack length',textRunnerStack.length)
		// }, 2000)
	
		let socket = openSocket.connect('http://140.120.13.250:5002')
		socket.on('connect', function() {
            socket.emit('connect_event', {data: 'connected!'});
        })

        socket.on('server_response', function(msg) {
			// $('#log').append('<p>question: ' + msg.data + '</p>');
			console.log(msg)
			console.log(msg.data)
        });
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
			console.log('exec')
			this.execTextRunner()
		}, 7000)
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