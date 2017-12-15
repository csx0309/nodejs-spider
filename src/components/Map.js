import React, { Component } from 'react';
const url = 'https://nj.fang.lianjia.com/loupan/';

class MapLj extends Component {
    componentDidMount(){
        const BMap = window.BMap;
        const map = new BMap.Map("allmap");
        map.centerAndZoom("南京", 11);
        map.enableScrollWheelZoom(true);
        const myGeo = new BMap.Geocoder();
        fetch('http://localhost/api/map')
            .then((response) => {
                // console.log(response);
                response.json().then(function(data){
                    // console.log(data);
                    data.map(function (item, i) {
                        const add = item.where.split("-")[1];
                        // const add = item.name;
                        // console.log(add);

                        /* VM10127:1 Uncaught TypeError: Failed to execute 'appendChild' on 'Node': parameter 1 is not of type 'Node'.
                           错误的意思是 百度地图api中 this.openInfoWindow(infoWindow) 要求的信息窗口对象为
                           appendChild可识别的真实DOM的Node类型，而不是React这种虚拟DOM组件。*/

                        // const infoWindowContent =
                        //     <div>
                        //         <h4>{item.name}</h4>
                        //     </div>;

                        const infoWindowContent =
                            `<div class="infowindow">
                                <h4>${item.name}</h4>
                                <a href="${url}${item.href}" target="_blank"><img src='${item.src}' alt='${item.name}'/></a>
                                <p>${item.where}</p>
                                <p>${item.area}</p>
                                <p class="price">${item.price}${item.discount===''?'':' - ' + item.discount}</p>
                                <p class="tag">
                                    ${item.tags.map(function (tag) {
                                        return `<span>${tag}</span>`
                                    })}
                                </p>
                                <p class="type">
                                    ${item.types === undefined ? '' : item.types.map(function (type) {
                                        return `<span>${type}</span>`
                                    })}
                                </p>
                            </div>
                            <style>
                                .infowindow h4{font-weight: bold;}
                                .infowindow p{margin-bottom:0;font-size: 12px;}
                                .infowindow img{width:100%;height: 100px;}
                                .infowindow .price{color: #e29c97;font-size: 14px;}
                                .infowindow .tag,.infowindow .type{margin-bottom:7px;margin-top: 5px;}
                                .tag span{
                                    background-color: #f5f5f5;
                                    color: #bdbfc4;
                                    padding: 3px 5px;
                                    margin-right: 5px;
                                }
                                .type span{
                                    padding: 0 5px;
                                    margin-right: 5px;
                                    border: 1px solid #85c6dc;
                                    color: #85c6dc;
                                    display: inline-block;
                                }
                            </style>
                            `;

                        // 地址名转换为坐标点
                        myGeo.getPoint(add, function(point){
                            if (point) {
                                const address = new BMap.Point(point.lng, point.lat);
                                const marker = new BMap.Marker(address);  //创建标注
                                const infoWindow = new BMap.InfoWindow(infoWindowContent);  //创建信息窗口对象
                                map.addOverlay(marker);
                                marker.addEventListener("click", function () {
                                    this.openInfoWindow(infoWindow);
                                });
                                // marker.setLabel(new BMap.Label(i+":"+add,{offset:new BMap.Size(20,-10)}));
                            }else{
                                console.log('The address is not found.');
                            }
                        }, "南京市");
                    });
                });
            })
            .then()
            .catch((err) => {
                console.log(err);
            })
    }
    render() {
        return (
            <div id="allmap" style={{height:'100vh'}}>

            </div>
        );
    }
}

export default MapLj;
