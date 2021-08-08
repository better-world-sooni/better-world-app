import { Div } from 'src/components/common/Div';
import { IMAGES } from 'src/modules/images';
import React, { useEffect, useState } from 'react';
import { Img } from 'src/components/common/Img';

const SunganCollection = () => {
    return (
        <>
        {[0, 80, 160, 240].map((item, index) => {
        return (
            <Div 
            key={index}
            absolute 
            auto 
            rounded100 
            border 
            border3 
            borderWhite
            shadowColor="rgba(22, 28, 45, 0.06)"
            shadowOffset={{ width: 0, height: 2 }}
            style={{left: item}}>
            {/* <Div auto rounded100 my3 mx3> */}
                <Img w100 h100 rounded100 source={IMAGES.example} />
            {/* </Div> */}
            </Div>
        );
        })}
        </>
    )
}

export default SunganCollection;