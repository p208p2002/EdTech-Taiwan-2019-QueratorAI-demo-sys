import React from 'react';
import posed from 'react-pose';
import './App.css';
import testData from './test.json'

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
      isVisible: true,
      x:0,
      y:props.y
    };
    
    this.testData = testData
  }


  componentDidMount() {
    setInterval(() => {
      let { isVisible } = this.state
      if (isVisible === true) {
        var x = randRange(window.innerWidth,600)-600
        // var y = Math.round(randRange(window.innerHeight-45, 0))
        this.setState({
          isVisible: !this.state.isVisible,
          x,
          // y
        });
      }
      else {
        this.setState({
          isVisible: !this.state.isVisible,
        });
      }
    }, 3500);
  }

  render() {
    let {x,y} = this.state
    return (
      <React.Fragment>
       <Box
        style={{
          position: 'absolute',
          left: `${x}px`,
          top: `${y}px`,
        }}
        className="box"
        pose={this.state.isVisible ? 'hidden' : 'visible'}>
        <div style={{
          width: '100%',
          height: '100%',
          textAlign: 'center',
          lineHeight: '45px',
          color: 'white',
          fontSize: 20
        }}>{'text'}</div>
      </Box>
      </React.Fragment>
    )
  }
}

export default Example
