import React, { Component } from 'react';
import {Map, Marker} from 'react-bmap';

class MapLj extends Component {
    render() {
        return (
            <div>
                <Map center={"南京"} zoom="11" style={{height:'100vh'}}>
                    <Marker position={{lng: 116.402544, lat: 39.928216}} />
                </Map>
            </div>
        );
    }
}

export default MapLj;
