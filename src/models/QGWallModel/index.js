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
let dataStackLimit = 70
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
			isInit:true
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
		setInterval(() => {
			let { showRunner } = this.state
			if (!showRunner) {
				this.execTextRunner()
			}
		}, 1000)

		window.addEventListener('resize', function(event){
			console.warn('detect window resize, app will restart in 3s')
			setTimeout(()=>{
				window.location.reload()
			},3000)
		});

		setTimeout(()=>{
			this.setState({
				isInit:false
			})
		},7000)
	}


	setUpdateBoxDataFromDataStackInterval(bool) {
		if (bool) {
			// setup interval
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
		let { textRunnerStack, autoUpdateDataStack, availableBoxs } = this.state
		let data = textRunnerStack.pop()
		this.setState({
			textRunnerStack
		})

		if (data) {
			this.setState({
				showRunner: true,
				textRunnerText: data
			})

			//第一次進來，先關閉全部
			if (availableBoxs.length === 0) {
				this.setUpdateBoxDataFromDataStackInterval(false) // 關閉自動刷新
				let availableBoxs = []
				for (var i = 0; i < numberOfBoxs; i++) {
					this.setBox(i, { isShow: false })
					availableBoxs.push(i)
				}
				availableBoxs = shuffle(availableBoxs)
				this.setState({
					availableBoxs
				})
			}

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
					var boxId = availableBoxs.pop()
					if(!boxId){
						for (var i = 0; i < numberOfBoxs; i++) {							
							availableBoxs.push(i)
						}
						availableBoxs = shuffle(availableBoxs)
						boxId = availableBoxs.pop()
					}
					this.setBox(boxId, { text: data })
					this.setState({
						availableBoxs
					})
				})

		}
		else {
			// 重新啟動自動刷新
			if (autoUpdateDataStack === false && textRunnerStack.length === 0) {
				this.setState({
					availableBoxs: []
				})
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
			var { dataStack, textRunnerStack } = self.state
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
				{isInit?<h5 style={{position:'absolute',marginLeft:15}}>初始化...</h5>:''}
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