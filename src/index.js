import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import QGWall from './models/QGWallModel';
import InputView from './models/InputModel/index.js'
import * as serviceWorker from './serviceWorker';
var Url = require('url-parse');

function parseQuery(queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}

var url = new Url(window.location.href);
var { mode = 'out' } = parseQuery(url.query)
// console.log(mode)

ReactDOM.render(
    <div style={{
        position: 'relative',
        height: '100%',
        width: '100%',
        // padding:500,
        // paddingBottom:100
    }}>
        {mode === 'unset' ?
            <div className="container">
                <h3>模式設定</h3>
                <a href="/?mode=out">資訊跑馬燈</a>
                <br />
                <br />
                <a href="/?mode=in">輸入介面</a>
            </div>
            : mode === 'out' ? <QGWall /> : <InputView />}
    </div >, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
