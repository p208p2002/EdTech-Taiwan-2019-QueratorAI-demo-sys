import React, { Component } from 'react';
import './index.css'
var $ = require("jquery");
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
        let { recentSearch,keyword } = this.state
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

                    <div style={{ marginTop: 15 }}>
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
                        style={{ pointerEvents: submitDisable ? 'none' : 'auto' }}
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

                    <h5>present by UDIC</h5>

                </div>



            </div>
        );
    }
}

export default InputView;