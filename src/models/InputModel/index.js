import React, { Component } from 'react';
import './index.css'
var $ = require("jquery");
const axios = require('axios');
class InputView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: '',
            recentSearch: ['韓國瑜', '蔡英文', '柯文哲', '周杰倫', '蔡英文'],
            submitDisable: false
        };
        this.submitBtn = React.createRef
        this.submit = this.submit.bind(this)
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

    submit(e) {
        let { recentSearch, keyword } = this.state
        if (recentSearch.indexOf(keyword) === -1) {
            recentSearch.pop()
            recentSearch.unshift(keyword)
        }
        this.setState({
            submitDisable: true,
            keyword: '',
            recentSearch
        })
        setTimeout(() => {
            this.setState({
                submitDisable: false
            })
        }, 3000)
        axios.post('http://140.120.13.250:5002/generate-question', {
            key: keyword
        }, { headers: { 'Content-Type': 'application/json; charset=utf-8' } })
            .then((res) => {
                console.log(res)
            })
            .catch((res) => {
                console.log(res)
            })
    }

    render() {
        let { keyword, submitDisable, recentSearch } = this.state
        return (
            <div id="InputView">
                <div className="container">
                    <h1>Querator AI</h1>
                    <h3>隨意輸入關鍵字吧!</h3>
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
                                if (!submitDisable) {
                                    if (e.key === 'Enter') {
                                        this.submitBtn.click()
                                    }
                                }
                            }}
                        />
                    </div>

                    <div style={{ marginTop: '32px' }}>
                        <span className="s-first">最近搜尋</span>
                        {recentSearch.map((k, i) => {
                            return (
                                <span
                                    className="s-key"
                                    key={i}
                                    onClick={() => {
                                        this.setState({
                                            keyword: k
                                        })
                                    }}
                                >{k}</span>
                            )
                        })}
                    </div>

                    <br />
                    {/*  */}
                    <div className="button"
                        style={{ marginTop:12,marginBottom:12,pointerEvents: submitDisable ? 'none' : 'auto' }}
                        ref={(input) => { this.submitBtn = input }}
                        onClick={(e) => {
                            this.submit(e)
                        }}
                    >
                        <div className="submit"><span>Submit</span></div>
                        <div className="arrow">
                            <div className="top line"></div>
                            <div className="bottom line"></div>
                        </div>
                    </div>
                    <br />
                    <div className="developers">
                        <div className="first">
                            <span><b>Querator AI</b></span><br />
                            <span>詹英鴻</span><br />
                        </div>
                        <div className="second">
                            <span><b>web develop</b><br /></span>
                            <span>詹英鴻、黃柏鈞</span>
                        </div>
                    </div>
                    <div className="developers">
                        <div className="third">
                            <span><b>present by</b><br /></span>
                            <span>中興大學 UDIC LAB</span>
                        </div>
                    </div>
                    {/* <h5><small>present by</small><br />中興大學 UDIC LAB</h5> */}
                </div>

            </div>
        );
    }
}

export default InputView;