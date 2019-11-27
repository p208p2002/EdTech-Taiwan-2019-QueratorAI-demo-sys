import React, { Component } from 'react';
import './index.css'
var $ = require("jquery");
class InputView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: '',
            submitDisable:false
        };
        this.submit = React.createRef
    }

    componentDidMount() {
        function hover() {
            $(".button").on("mouseenter", function () {
                return $(this).addClass("hover");
            });
        }

        function hoverOff() {
            $(".button").on("mouseleave", function () {
                return $(this).removeClass("hover");
            });
        }

        function active() {
            $(".button").on("click", function () {
                setTimeout(() => {
                    $(this).removeClass("active");
                }, 1500)
                return $(this).addClass("active");
            });
        }

        hover();
        hoverOff();
        active();
    }

    render() {
        let { keyword,submitDisable } = this.state
        return (
            <div id="InputView">
                <div className="container">
                    <h1>Querator AI</h1>
                    <h3>隨意輸入關鍵字吧!</h3>
                    {/* <input type="text" /> */}
                    <div className="wrapper">
                        <input
                            className="search"
                            type="text"
                            id="search"
                            value={keyword}
                            onChange={(e) => {
                                this.setState({
                                    keyword: e.target.value
                                })
                            }}
                            onKeyDown={(e) => {
                                if(!submitDisable){
                                    if (e.key === 'Enter') {
                                        this.submit.click()
                                    }
                                }
                            }}
                        />
                    </div>

                    <br />
                    {/*  */}
                    <div className="button"
                        style={{pointerEvents:submitDisable?'none':'auto'}}
                        ref = {(input)=>{ this.submit = input }}
                        onClick={()=>{
                            this.setState({
                                submitDisable:true
                            })
                            setTimeout(()=>{
                                this.setState({
                                    submitDisable:false
                                })
                            },3000)
                        }}
                        >
                        <div className="submit"><span>Submit</span></div>
                        <div className="arrow">
                            <div className="top line"></div>
                            <div className="bottom line"></div>
                        </div>
                    </div>

                    <h5>present by UDIC</h5>

                </div>



            </div>
        );
    }
}

export default InputView;