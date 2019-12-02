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
let dataStackLimit = 80
let textRunnerStackLimit = 50

const randRange = (max, min = 1) => {
	return parseInt(Math.random() * (max - min) + min);
}

function shuffle(array) {
	let counter = array.length;
	while (counter > 0) {
		let index = Math.floor(Math.random() * counter);
		counter--;
		let temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}
	return array;
}

class Manager extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataStack: [],
			textRunnerStack: [],
			textRunnerText: '',
			showRunner: false,
			autoUpdateDataStack: false,
			availableBoxs: [],
			isInit: true
		};
		this.boxs = []
		this.boxRefs = []
		this.connectSocket = this.connectSocket.bind(this)
		this.fiilDataStack = this.fiilDataStack.bind(this)
		this.setBox = this.setBox.bind(this)
		this.getRandomCoolData = this.getRandomCoolData.bind(this)
		this.updateBoxDataFromDataStack = this.updateBoxDataFromDataStack.bind(this)
		this.execTextRunner = this.execTextRunner.bind(this)

		//Interval
		this.setUpdateBoxDataFromDataStackInterval = this.setUpdateBoxDataFromDataStackInterval.bind(this)
		this.autouUpdateBoxDataFromDataStack = undefined
		this.setTextRunnerInterval = this.setTextRunnerInterval.bind(this)
		this.textRunnerInterval = undefined
	}

	UNSAFE_componentWillMount() {
		for (var i = 0; i < numberOfBoxs; i++) {
			this.boxs.push(<Box ref={(input) => { this.boxRefs.push(input) }} key={i} y={i * boxHeight + marginTop} />)
		}
	}

	componentDidMount() {
		this.fiilDataStack()
		this.connectSocket()
		this.setUpdateBoxDataFromDataStackInterval(true)
		this.setTextRunnerInterval(false)

		window.addEventListener('resize', function (event) {
			console.warn('detect window resize, app will restart in 3s')
			setTimeout(() => {
				window.location.reload()
			}, 3000)
		});

		setTimeout(() => {
			this.setState({
				isInit: false
			})
		}, 7000)
	}

	setTextRunnerInterval(bool) {
		if (bool) {
			clearInterval(this.textRunnerInterval)
			this.textRunnerInterval = setInterval(() => {
				let { showRunner } = this.state
				if (!showRunner) {
					this.execTextRunner()
				}
			}, 1000)
		}
		else {
			clearInterval(this.textRunnerInterval)
		}
	}

	setUpdateBoxDataFromDataStackInterval(bool) {
		if (bool) {
			// setup interval
			clearInterval(this.autouUpdateBoxDataFromDataStack)
			this.autouUpdateBoxDataFromDataStack = setInterval(() => {
				this.updateBoxDataFromDataStack()
			}, 7000)
		}
		else {
			// remove interval
			clearInterval(this.autouUpdateBoxDataFromDataStack)
		}
		this.setState({
			autoUpdateDataStack: bool
		})
	}

	execTextRunner() {
		let { textRunnerStack } = this.state
		// console.log(availableBoxs)
		let data = textRunnerStack.pop()
		this.setState({
			textRunnerStack
		})

		if (data) {
			this.setState({
				showRunner: true,
				textRunnerText: data
			})

			new Promise((reslove, reject) => {
				setTimeout(() => {
					this.setState({
						showRunner: false
					})
					return reslove()
				}, 4500)
			})
				.then(() => {
					var { availableBoxs } = this.state
					// console.log(availableBoxs)
					var boxId = availableBoxs.pop()
					if (availableBoxs.length === 0) {
						for (var i = 0; i < numberOfBoxs; i++) {
							availableBoxs.push(i)
						}
						availableBoxs = shuffle(availableBoxs)
					}
					this.setBox(boxId, { text: data })
					this.setState({
						availableBoxs
					})
				})

		}
		else {
			// 重新啟動自動刷新
			if (textRunnerStack.length === 0) {
				this.setTextRunnerInterval(false)
				this.setUpdateBoxDataFromDataStackInterval(true)
			}
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
		for (var i = 0; i < dataStackLimit; i++) {
			dataStack.unshift(this.getRandomCoolData())
		}
		// console.log(dataStack)
		this.setState({
			dataStack
		})
	}

	connectSocket() {
		let socket = openSocket.connect('http://140.120.13.250:5002')
		let self = this
		socket.on('server_response', function (msg) {
			console.log(msg.data)
			let { event='QUESTION' } = msg.data
			if (event === 'QUESTION') {
				var { dataStack, textRunnerStack } = self.state
				var availableBoxs = []
				if (textRunnerStack.length === 0) {
					self.setUpdateBoxDataFromDataStackInterval(false)
					for (var i = 0; i < numberOfBoxs; i++) {
						self.setBox(i, { isShow: false })
						availableBoxs.push(i)
					}
					availableBoxs = shuffle(availableBoxs)
					self.setState({
						availableBoxs
					})
					self.setTextRunnerInterval(true)
				}
				let newdata = msg.data
				dataStack.pop()
				dataStack.unshift(newdata)
				if (textRunnerStack.length <= textRunnerStackLimit) {
					textRunnerStack.unshift(newdata)
				}
				self.setState({
					dataStack,
					textRunnerStack
				})
			}
		});

	}

	updateBoxDataFromDataStack() {
		let { dataStack } = this.state
		for (var i = 0; i < numberOfBoxs; i++) {
			this.setBox(i, { text: dataStack[parseInt(randRange(dataStack.length - 1, 0))] })
		}
	}

	render() {
		let { boxs } = this
		let { showRunner, textRunnerText, isInit } = this.state
		return (
			<div id="Wall">
				{isInit ? <h5 style={{ position: 'absolute', marginLeft: 15 }}>初始化...</h5> : ''}
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