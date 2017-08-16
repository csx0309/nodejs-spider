import React,{Component} from 'react';
import config from '../public/config.json';
import styles from './Greeter.css';

/*var config = require("./config.json");

module.exports = function(){
	var greet = document.getElementById("root");
	greet.textContent = config.greetText;
	return greet;
}*/

class Greeter extends Component {
	render(){
		return (
			<div className={styles.root}>
				{config.greetText};
			</div>
		);
	}
}

export default Greeter
