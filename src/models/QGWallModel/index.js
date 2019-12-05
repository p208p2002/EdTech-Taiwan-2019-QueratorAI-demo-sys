import React, { Component } from 'react';
import Box from './Box.js';
import cool_data from '../../asset/cool_data.json'
import './index.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Axios from 'axios';
// const io = require('socket.io');

let boxOffset = 10
let boxHeight = 45 + boxOffset
let numberOfBoxs = parseInt((window.innerHeight) / (boxHeight)) - 1
let marginTop = parseInt(boxHeight / 2)
let dataStackLimit = 72

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
			showKeyWordRunner: false,
			keywordText: '',
			autoUpdateDataStack: false,
			availableBoxs: [],
			isInit: true
		};
		this.boxs = []
		this.boxRefs = []
		this.fiilDataStack = this.fiilDataStack.bind(this)
		this.setBox = this.setBox.bind(this)
		this.getRandomCoolData = this.getRandomCoolData.bind(this)
		this.updateBoxDataFromDataStack = this.updateBoxDataFromDataStack.bind(this)
		this.execTextRunner = this.execTextRunner.bind(this)
		this.fetchPolling = this.fetchPolling.bind(this)

		//Interval or timeout
		this.setUpdateBoxDataFromDataStackInterval = this.setUpdateBoxDataFromDataStackInterval.bind(this)
		this.autouUpdateBoxDataFromDataStack = undefined
		this.setTextRunnerInterval = this.setTextRunnerInterval.bind(this)
		this.textRunnerInterval = undefined
		this.keywordTextTimeout = undefined
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

	fetchPolling(update = false) {
		return Axios.get('http://140.120.13.250:5000/getQuestions')
			.then((res) => {
				console.log(res.data)
				let { data = [] } = res
				let questions = []
				data.forEach((d) => {
					let { questions: dQuestions = [] } = d
					dQuestions.forEach((dq) => {
						console.log(dq)
						questions.push(dq)
					})
				})
				return Promise.resolve(questions)
			})
			.then((questions)=>{
				let { dataStack,textRunnerStack } = this.state
				questions.forEach((q)=>{
					if(update){
						dataStack.pop()
					}
					textRunnerStack.unshift(q)					
					dataStack.unshift(q)
				})
				this.setState({
					dataStack,
					textRunnerStack
				})
			})
	}

	UNSAFE_componentWillMount() {
		for (var i = 0; i < numberOfBoxs; i++) {
			this.boxs.push(<Box ref={(input) => { this.boxRefs.push(input) }} key={i} y={i * boxHeight + marginTop} />)
		}
	}

	componentDidMount() {
		// this.fiilDataStack()

		// 確保用足夠的數量填充		
		this.fetchPolling()
		this.fetchPolling()

		// this.connectSocket()
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

		setInterval(()=>{
			this.execTextRunner()
			.then(()=>{
				console.log('then')
			})
			.catch((msg)=>{
				console.log(msg)
				if(msg === 'NULL'){
					this.fetchPolling(true)
				}
			})
		},1000)
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
		let { textRunnerStack,showRunner } = this.state
		let data = textRunnerStack.pop()	
		if (data && !showRunner && textRunnerStack.length>=1) {
			this.setState({
				showRunner: true,
				textRunnerText: data,
				textRunnerStack
			})
			return new Promise((reslove, reject) => {
				setTimeout(() => {
					this.setState({
						showRunner: false
					})
					return reslove()
				}, 4500)
			})
		}
		else if(data && textRunnerStack.length === 0){
			return Promise.reject('NULL')
		}
		else{
			return Promise.reject('WAIT')
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