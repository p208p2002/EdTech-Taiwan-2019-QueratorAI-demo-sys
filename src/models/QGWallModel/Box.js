import React from 'react';
import posed from 'react-pose';
import './Box.css';


const randRange = (max, min = 1) => {
  return Math.random() * (max - min) + min;
}

const Box = posed.div({
  hidden: {
    opacity: 0,
    scale: 0.01,
    transition: () => ({ delay: randRange(1000), duration: 800 })
  },
  visible: {
    opacity: 1,
    scale: 1.0,
    transition: () => ({ delay: randRange(1000), duration: 800 })
  },
});

class Example extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isVisible: false,
      x: 0,
      y: props.y,
      text: ''
    };

    // this.testData = testData
    // this.show = this.show.bind(this)
  }

  setText(text) {
    let { isVisible } = this.state
    return new Promise((reslove,reject) => {
      if(isVisible){
        this.setState({
          isVisible:false
        })
        setTimeout(()=>{
          reslove()
        },2000)
      }
      else{
        reslove()
      }
    })
    .then(() => {
      var x = parseInt(randRange(window.innerWidth, 600) - 600)
      this.setState({
        text,
        x
      })
    })
  }

  show(tf) {
    this.setState({
      isVisible: tf,
    });
  }

  render() {
    let { x, y, text, isVisible } = this.state
    return (
      <React.Fragment>
        <Box
          style={{
            position: 'absolute',
            left: `${x}px`,
            top: `${y}px`,
          }}
          className="box"
          pose={isVisible ? 'visible' : 'hidden'}>
          <div style={{
            width: '100%',
            height: '100%',
            textAlign: 'center',
            lineHeight: '45px',
            color: 'white',
            fontSize: 20
          }}>{text}</div>
        </Box>
      </React.Fragment>
    )
  }
}

export default Example
