import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import routers from './routers/router';
import history from './routers/history';
import { Router, Switch, Route } from 'react-router-dom';

import { Layout, Menu, Button } from 'antd';
const { Header, Content, Footer } = Layout;

const io = require('socket.io-client');
const socket = io.connect('http://localhost/',{'forceNew':true});

class App extends Component {
    state = {
        loading: false,
        progress: '',
    };
    spideOnce = () => {
        socket.emit('request', '收到抓取请求...');
        socket.on('progress', function (data) {
            // console.log(data);
            this.setState({
                progress: data.progress,
                loading: true,
            });
            if(data.progress==='抓取完成！'){
                this.setState({
                    loading: false,
                });
            }
        }.bind(this));
    };
    render() {
        const { progress, loading } = this.state;
        return (
            <Router history={history}>
                    <Layout className="layout">
                        <Header>
                            <h1 style={{float:'left',color:'#fff'}}>
                                Nodejs爬虫项目-链家
                            </h1>
                            <Button type="primary" style={{marginLeft:'15px'}} onClick={() => this.spideOnce()} loading={loading}>
                                {progress===''?'抓一下':progress}
                            </Button>
                            <Menu
                                theme="dark"
                                mode="horizontal"
                                defaultSelectedKeys={['0']}
                                style={{ lineHeight: '64px', float:'right'}}
                            >
                                {routers.map(function (route, i) {
                                    return (
                                        <Menu.Item key={i}>
                                            <Link to={route.path}>
                                                {route.name}
                                            </Link>
                                        </Menu.Item>
                                    )
                                })}
                            </Menu>
                        </Header>
                        <Content style={{ padding: '0 50px' }}>
                            <Switch>
                                {routers.map((route, i) => {
                                    return <Route key={i} exact path={route.path} component={route.component}/>
                                })}
                            </Switch>
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>
                            Spider-lj ©2017 Created by zhaoyu69
                        </Footer>
                    </Layout>

            </Router>
        );
    }
}

export default App;
