import React, { Component } from 'react';
import routers from '../routers/router';
import { Link } from 'react-router-dom'
import { Button } from 'antd';

class Menu extends Component {
    render() {
        return (
            <div>
                <h1>Nodejs爬虫项目之链家</h1>
                <Button type="primary">1</Button>
                {routers.map(function (route, i) {
                    return <Link to={route.path} key={i}>
                        <li>{route.name}</li>
                    </Link>
                })}
            </div>
        );
    }
}

export default Menu;