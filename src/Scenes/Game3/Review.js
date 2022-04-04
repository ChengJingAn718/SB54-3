import React, { useEffect, useContext, useRef, useState } from 'react';
import "../../stylesheets/styles.css";
import BaseImage from '../../components/BaseImage';

import { UserContext } from '../../components/BaseShot';
import { prePathUrl, generateStandardNum } from "../../components/CommonFunctions"
import WellDone from "../Welldone"

let timerList = []
//-0.5,1.25,5,-5

export default function Review1({ _baseGeo, nextFunc }) {
    const audioList = useContext(UserContext)
    const starBaseList = Array.from({ length: 10 }, ref => useRef())
    const baseRef = useRef()

    useEffect(
        () => {
            audioList.bodyAudio.src = "./sounds/nowsay.mp3"

            setTimeout(() => {
                audioList.bodyAudio.play();
                setTimeout(() => {
                    starBaseList.map((star, index) => {
                        setTimeout(() => {
                            star.current.style.transition = '0.5s'
                            star.current.style.transform = 'scale(1.2)'
                            if (index == 9)
                                setTimeout(() => {
                                    nextFunc()
                                }, 2000);
                        }, 1500 * index);
                    })
                }, audioList.bodyAudio.duration * 1000);
            }, 2000);

            return () => {
            }
        }, []
    )

    return (
        <div ref={baseRef}
            className="aniObject"  >
            <div
                style={{
                    position: "fixed", width: _baseGeo.width + "px",
                    height: _baseGeo.height + "px"
                    , left: _baseGeo.left + _baseGeo.width * 0.0 + "px",
                    bottom: _baseGeo.bottom + _baseGeo.height * 0.0 + "px",
                }}>

                <BaseImage url="SB54_BG/SB54_summery_screen_01.svg" />
                {
                    Array.from(Array(10).keys()).map(value =>
                        <div
                            ref={starBaseList[value]}
                            style={{
                                position: 'absolute',
                                width: '12%',
                                height: '12%',
                                top: (0.25 + 0.3 * parseInt((value / 5))) * 100 + '%',
                                left: (0.12 + (value % 5) * 0.16) * 100 + '%',
                            }}>

                            < BaseImage
                                url={'SB54_Prop-Interactive/PI_woodden_box_01.svg'}
                            />
                            < BaseImage
                                scale={0.5}
                                posInfo={{ l: 0.22, t: 0.38 }}
                                url={'SB54_Text-Interactive/TI_G2_' + generateStandardNum((value + 1) * 10) + '.svg'}
                            />
                        </div>
                    )
                }
            </div>


        </div>
    );

}
