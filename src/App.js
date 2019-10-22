import React from 'react';
import posed from 'react-pose';
import './App.css';

const randRange = (max,min=1)=>{
  return Math.random() * (max - min) + min;
}

const Box = posed.div({
  hidden: { 
    opacity: 0, 
    scale: 0.01, 
    transition: () => ({ delay: randRange(1000),duration: 500 })
    },
  visible: { 
    opacity: 1, 
    scale: 1.0, 
    transition: () => ({ delay: randRange(1000),duration: 500 })
   },
});

class Example extends React.Component {
  state = {
    isVisible: true,
    boxsNumbes: 15,
    xs:[],
    ys:[],
  };

  componentDidMount() {
    setInterval(() => {
      let { R } = this.props
      let {isVisible,boxsNumbes} = this.state
      let xs = []
      let ys = []
      
      for(var i=0;i<boxsNumbes;i++){
        xs.push(randRange(window.innerWidth,220)-220)
        ys.push(randRange(window.innerHeight,40)-40)        
      }

      if(!R){
        if(isVisible===true){
          this.setState({
            isVisible: !this.state.isVisible,
          });
        }
        else{
          this.setState({
            isVisible: !this.state.isVisible,          
            xs,
            ys,
          });
        }
      }
      else{
        if(isVisible!==true){
          this.setState({
            isVisible: !this.state.isVisible,
          });
        }
        else{
          this.setState({
            isVisible: !this.state.isVisible,          
            xs,
            ys,
          });
        }
      }
      
    }, 2500);
  }

  boxs(){
    let { R } = this.props
    const { isVisible,boxsNumbes,xs,ys } = this.state;
    let boxs = []
    for(var i =0;i<boxsNumbes;i++){
      boxs.push(<Box
        key={i}
        style={{
          position:'absolute',
          left:`${xs[i]}px`,
          top:`${ys[i]}px`
        }}
        className="box" 
        pose={R?isVisible ? 'hidden' : 'visible':isVisible ? 'visible' : 'hidden'} />)
    }
    return boxs
  }
  
  render() {
    return (
      <React.Fragment>
        {this.boxs()}
      </React.Fragment>
    )
  }
}

export default Example
