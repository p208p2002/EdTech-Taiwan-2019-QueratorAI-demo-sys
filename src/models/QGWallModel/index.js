import React, { Component } from 'react';
import Box from './Box.js';
import cool_data from '../../asset/cool_data.json'
import './index.css'
import openSocket from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
			showKeyWordRunner: false,
			keywordText: '',
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

		//Interval or timeout
		this.setUpdateBoxDataFromDataStackInterval = this.setUpdateBoxDataFromDataStackInterval.bind(this)
		this.autouUpdateBoxDataFromDataStack = undefined
		this.setTextRunnerInterval = this.setTextRunnerInterval.bind(this)
		this.textRunnerInterval = undefined
		this.keywordTextTimeout = undefined
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

		// toast(<span>😱你考倒我啦<br/>您給的關鍵字我不太清楚<br/>請再輸入更完整一點的訊息～</span>, {
		// 	position: "bottom-center",
		// 	hideProgressBar: false,
		// 	closeOnClick: true,
		// 	pauseOnHover: true,
		// 	draggable: true,
		// 	autoClose:50000
		// });
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
		let socket = openSocket.connect('http://140.120.13.250:6002')
		let self = this
		socket.on('server_response', function (msg) {
			console.log(msg)
			let { event = 'QUESTION', data = "NO_DATA" } = msg
			var { dataStack, textRunnerStack } = self.state
			var availableBoxs = [], i
			if (event === 'QUESTION') {
				if (textRunnerStack.length === 0) {
					self.setUpdateBoxDataFromDataStackInterval(false)
					for (i = 0; i < numberOfBoxs; i++) {
						self.setBox(i, { isShow: false })
						availableBoxs.push(i)
					}
					availableBoxs = shuffle(availableBoxs)
					self.setState({
						availableBoxs
					})
					self.setTextRunnerInterval(true)
				}

				dataStack.pop()
				dataStack.unshift(data)

				if (textRunnerStack.length <= textRunnerStackLimit) {
					textRunnerStack.unshift(data)
				}
				self.setState({
					dataStack,
					textRunnerStack
				})
			}
			else if (event === 'KEYWORD') {
				console.log('event:KEYWORD')			
				clearTimeout(self.keywordTextTimeout)
				self.setState({
					showKeyWordRunner:false,
					keywordText:''
				})
				self.setState({
					showKeyWordRunner:true,
					keywordText:data+'請稍後，Querator正在生成問句🤨'
				})
				self.keywordTextTimeout = setTimeout(()=>{
					self.setState({
						showKeyWordRunner:false,
						keywordText:''
					})
				},20000)
			}
			else if (event === 'NO_RESULT') {
				toast(<span><span role="img" aria-label="emoji">😱</span>你考倒我啦<br/>您給的關鍵字我不太清楚<br/>請再輸入更完整一點的訊息～</span>, {
					position: "bottom-center",
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true
				});
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
		let { showRunner, textRunnerText, isInit, keywordText, showKeyWordRunner } = this.state
		return (
			<div id="Wall">
				{isInit ? <h5 style={{ position: 'absolute', marginLeft: 15 }}>初始化...</h5> : ''}
				<ToastContainer
					position="bottom-center"
					autoClose={4000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnVisibilityChange
					draggable
					pauseOnHover
				/>				
				<span className={`${showKeyWordRunner ? 'keyword-runner-bg' : 'hidden'}`}></span>
				<span className={`${showKeyWordRunner ? 'keyword-runner' : 'hidden'}`}>{keywordText}</span>
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