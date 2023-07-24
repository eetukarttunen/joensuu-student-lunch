import React from 'react';
import './PanLoader.css';

const PanLoader = () => {


    return (
        <div class="pan-loader">
            <div class="loader"></div>
            <div class="pan-container">
                <div class="pan"></div>
                <div class="handle"></div>
            </div>
            <div class="shadow"></div>
        </div>

    );
};

export default PanLoader;
