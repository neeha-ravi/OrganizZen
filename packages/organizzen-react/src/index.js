//ndex.js
import React from 'react'
import ReactDOM from 'react-dom/client'
//import styles from "./Styles/index.module.css";
import reportWebVitals from './reportWebVitals'
//import MyApp from './MyApp'
import LoginApp from './LoginApp'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<LoginApp />)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
