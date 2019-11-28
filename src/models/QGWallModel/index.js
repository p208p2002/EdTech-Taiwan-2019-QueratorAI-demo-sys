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

class Manager extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataStack: [],
			textRunnerStack: [],
			textRunnerText: '',
			showRunner: false,
			autoUpdateDataStack: false,
			lastUpdateBoxId: 0
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
		let { textRunnerStack, autoUpdateDataStack, lastUpdateBoxId } = this.state
		let data = textRunnerStack.pop()
		this.setState({
			textRunnerStack
		})
		// console.log('execTextRunner',textRunnerStack,data)
		if (data) {
			this.setState({
				showRunner: true,
				textRunnerText: data
			})

			if(lastUpdateBoxId === 0){
				for(var i=0;i<numberOfBoxs;i++){
					this.setBox(i,{isShow:false})
				}
			}

			new Promise((reslove,reject)=>{
				setTimeout(() => {
					this.setState({
						showRunner: false
					})
					return reslove()
				}, 4500)
			})
			.then(()=>{
				this.setBox(lastUpdateBoxId, { text: data })
				this.setState({
					lastUpdateBoxId: lastUpdateBoxId < numberOfBoxs - 1 ? lastUpdateBoxId + 1 : 0
				})
			})
			
		}
		else {
			// 重新啟動資料柱列更新
			if (autoUpdateDataStack === false && textRunnerStack.length === 0) {
				this.setState({
					lastUpdateBoxId: 0
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
			self.setUpdateBoxDataFromDataStackInterval(false) // 關閉刷新
			// console.log(lastUpdateBoxId)
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
		this.setUpdateBoxDataFromDataStackInterval(true)
		setInterval(() => {
			let { showRunner } = this.state
			if (!showRunner) {
				this.execTextRunner()
			}
		}, 1000)
	}

	updateBoxDataFromDataStack() {
		let { dataStack } = this.state
		for (var i = 0; i < numberOfBoxs; i++) {
			this.setBox(i, { text: dataStack[parseInt(randRange(dataStack.length - 1, 0))] })
		}
	}

	render() {
		let { boxs } = this
		let { showRunner, textRunnerText } = this.state
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