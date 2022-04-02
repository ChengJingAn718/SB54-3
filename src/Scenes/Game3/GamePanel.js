import React, { useEffect, useContext, useRef, useState } from 'react';
import "../../stylesheets/styles.css";
import BaseImage from '../../components/BaseImage';
import { Player } from '@lottiefiles/react-lottie-player';
import { UserContext } from '../../components/BaseShot';
import { prePathUrl, generateStandardNum, setRepeatAudio, startRepeatAudio, stopRepeatAudio } from "../../components/CommonFunctions"

let timerList = []
//3.5,-3.5,
// 5,-5

let isGameStarted = false;
let currentNum = 0;
let stepNumRange = 10;
let currentStep = 0

export default function Scene2({ finishGame, _baseGeo, stopSound }) {
    const audioList = useContext(UserContext)

    const baseRef = useRef()
    const backRef = useRef()

    const greenStar = useRef();
    const redStar = useRef();
    const lastBoy = useRef();

    const targetRange = 0.0685
    const stepRange = -0.03

    const layoutStartPos = { x: -1.4, y: 0.5 }
    const translateStartPos = { x: 1.4, y: 0.5 }

    const characterList = Array.from({ length: 5 }, ref => useRef())
    const starList = Array.from({ length: 100 }, ref => useRef())
    const starBaseList = Array.from({ length: 100 }, ref => useRef())
    const numberList = Array.from({ length: 100 }, ref => useRef())


    const sparkBaseRef = useRef()
    const sparkRefList = [useRef(), useRef(), useRef()]

    // width : + -> -
    // height : - ->+


    const heightList = [
        1, 0, -1, -2, -1, 0, -1, -2, -1, 0,
        1, 0, -1, -2, -1, 0, -1, -2, -1, 0,
        1, 0, -1, -2, -1, 0, -1, -2, -1, 0,
        1, 0, -1, -2, -1, 0, -1, -2, -1, 0,
        1, 0, -1, -2, -1, 0, -1, -2, -1, 0,
        1, 0, -1, -2, -1, 0, -1, -2, -1, 0,
        1, 0, -1, -2, -1, 0, -1, -2, -1, 0,
        1, 0, -1, -2, -1, 0, -1, -2, -1, 0,
        1, 0, -1, -2, -1, 0, -1, -2, -1, 0,
        1, 0, -1, -2, -1, 0, -1, -2, -1, 0,
        1, 0, -1, -2, -1, 0, -1, -2, -1, 0,
        1, 0, -1, -2, -1, 0, -1, -2, -1, 0,
    ]

    const widthStep = 0.684

    useEffect(
        () => {

            setRepeatAudio(audioList.subBodyAudio)
            isGameStarted = true;

            greenStar.current.style.opacity = 0
            redStar.current.style.opacity = 0


            backRef.current.style.transition = '0s'
            backRef.current.style.transform = 'translate(' + (_baseGeo.width * (translateStartPos.x - currentStep * widthStep)) + 'px, '
                + _baseGeo.height * (translateStartPos.y) + 'px)'


            return () => {

                isGameStarted = false;
                currentNum = 0;
                currentStep = 0

                audioList.clapAudio.pause();
            }
        }, []
    )

    if (isGameStarted)
        reRenderingFunc()

    function reRenderingFunc() {
        backRef.current.style.transition = '0s'

        backRef.current.style.transform = 'translate(' + (_baseGeo.width * (translateStartPos.x - currentStep * widthStep)) + 'px, '
            + _baseGeo.height * (translateStartPos.y) + 'px)'

        characterList[0].current.setPosInfo({
            l: layoutStartPos.x + 0.02 + targetRange * currentNum,
            b: layoutStartPos.y + 0.00 + stepRange * heightList[currentNum - 1]
        })
    }

    function clickFunc(num) {

        stopRepeatAudio();
        if (currentNum == 0)
            stopSound(num + 1 == currentNum + stepNumRange);

        if (num >= currentNum) {
            let currentStar = starBaseList[num]
            currentStar.current.style.transition = '0.1s'
            currentStar.current.style.transform = 'scale(0.95)'
            setTimeout(() => {
                currentStar.current.style.transform = 'scale(1)'
            }, 100);

            redStar.current.style.opacity = 0
            greenStar.current.style.opacity = 0

            if (num + 1 == currentNum + stepNumRange) {

                audioList.buzzAudio.pause();
                audioList.tingAudio.currentTime = 0;
                audioList.tingAudio.play();


                baseRef.current.style.pointerEvents = 'none'

                starBaseList[currentNum].current.style.cursor = 'default'
                starBaseList[currentNum + 1].current.style.cursor = 'default'



                currentNum += stepNumRange;
                showButtonAni(greenStar, num)

                setTimeout(() => {

                    for (let i = 1; i < 5; i++) {
                        characterList[i].current.setPosInfo({
                            l: layoutStartPos.x + 0.05 + targetRange * (currentNum - stepNumRange) + i * 0.02,
                            b: layoutStartPos.y + 0.02 + stepRange * heightList[currentNum - stepNumRange - 1]
                        })
                    }

                    let num = 0;
                    let interval = setInterval(() => {
                        characterList[num].current.setClass('hideObject')

                        characterList[0].current.setPosInfo({
                            l: layoutStartPos.x + 0.063 + targetRange * currentNum,
                            b: layoutStartPos.y + 0.02 + stepRange * heightList[currentNum - 1]
                        })

                        if (num == 4) {
                            clearInterval(interval)
                            characterList[0].current.setClass('showObject')

                        }
                        else {
                            num++
                            characterList[num].current.setClass('showObject')
                        }
                    }, 150);


                    sparkBaseRef.current.style.left = (layoutStartPos.x + 0.123 + targetRange * currentNum) * 100 + "%"
                    sparkBaseRef.current.style.bottom = (layoutStartPos.y + 0.13 + stepRange * heightList[currentNum - 1]) * 100 + "%"

                    setTimeout(() => {
                        let num = 0;
                        sparkRefList[0].current.setClass('showObject')
                        let interval = setInterval(() => {
                            sparkRefList[num].current.setClass('hideObject')
                            if (num < 2) {
                                num++
                                sparkRefList[num].current.setClass('showObject')
                            }
                            else {
                                clearInterval(interval)
                            }
                        }, 100);
                    }, 800);


                    setTimeout(() => {

                        for (let i = currentNum - 10; i < currentNum; i++) {
                            if ((i + 1) % 10 != 0) {
                                starList[i].current.setUrl('SB54_Prop-Interactive/PI_woodden_box_inactivate_01.svg')
                                numberList[i].current.setStyle({ opacity: 0.4 })
                            }
                            starBaseList[i].current.style.cursor = 'default'
                        }
                        setTimeout(() => {
                            currentStep++;

                            backRef.current.style.transition = '2s'
                            backRef.current.style.transform = 'translate(' + (_baseGeo.width * (translateStartPos.x - currentStep * widthStep)) + 'px, '
                                + _baseGeo.height * (translateStartPos.y) + 'px)'



                            setTimeout(() => {
                                greenStar.current.style.opacity = 0


                                baseRef.current.style.pointerEvents = ''
                                if (currentStep == 10) {
                                    characterList[0].current.setClass('hideObject')
                                    lastBoy.current.setClass('showOjbect')

                                    audioList.bodyAudio.play();
                                    audioList.clapAudio.play();

                                    setTimeout(() => {
                                        baseRef.current.style.transition = '0.7s'
                                        baseRef.current.style.opacity = 0

                                        setTimeout(() => {
                                            finishGame();
                                        }, 700);
                                    }, 5000);
                                }
                                else {
                                    startRepeatAudio()
                                }
                            }, 2000);
                        }, 1000);







                    }, 1000);
                }, 200);
            }
            else {

                startRepeatAudio()
                audioList.tingAudio.pause();

                audioList.buzzAudio.currentTime = 0;
                audioList.buzzAudio.play();

                showButtonAni(redStar, num)
            }
        }
    }

    function showButtonAni(obj, num) {

        obj.current.style.transition = '0.0s'
        obj.current.style.opacity = '0'
        obj.current.style.bottom = (layoutStartPos.y + 0.1 + heightList[num] * stepRange) * 100 + '%'
        obj.current.style.left = (layoutStartPos.x + 0.183 + num * targetRange) * 100 + '%'

        setTimeout(() => {
            obj.current.style.transition = '0.5s'
            obj.current.style.opacity = 1
        }, 100);
    }

    return (
        <div ref={baseRef}
            className="aniObject"  >
            <div
                ref={backRef}
                style={{
                    position: "fixed", width: _baseGeo.width + "px",
                    height: _baseGeo.height + "px"
                    , left: _baseGeo.left + _baseGeo.width * 0.0 + "px",
                    bottom: _baseGeo.height * 0.0 + "px",
                }}>
                <img
                    style={{
                        width: '100%',
                        left: '0%', bottom: '0%',
                        transform: 'scale(12)'
                    }}
                    src={prePathUrl() + "images/SB54_BG/SB_54_forest_bg-01.svg"}
                />
                < BaseImage
                    scale={1.15}
                    posInfo={{
                        l: layoutStartPos.x - 0.05,
                        b: layoutStartPos.y - 0.12
                    }}
                    url={'animations/SB54_pond_1_10.svg'}
                />
                {
                    Array.from(Array(7).keys()).map(value => <div
                        style={{
                            position: 'absolute',
                            left: (layoutStartPos.x - 0.05 + 1 + value * 0.8) * 100 + "%",
                            bottom: (layoutStartPos.y - 0.12) * 100 + '%',
                            width: '115%',
                            height: '115%',
                            overflow: 'hidden'

                        }}
                    >
                        < BaseImage
                            posInfo={{ l: -0.2 }}
                            url={'animations/SB54_pond_1_10.svg'}
                        />
                    </div>)

                }
                <div
                    style={{
                        position: 'absolute',
                        left: (layoutStartPos.x - 0.05 + 6.5) * 100 + "%",
                        bottom: (layoutStartPos.y - 0.15) * 100 + '%',
                        width: '115%',
                        height: '115%',
                        overflow: 'hidden'

                    }}
                >
                    < BaseImage
                        posInfo={{ l: -0.2 }}
                        url={'animations/SB54_pond_91_100.svg'}
                    />
                </div>





                {
                    Array.from(Array(100).keys()).map(value =>

                        <div
                            ref={starBaseList[value]}
                            onClick={() => { clickFunc(value) }}
                            style={{
                                position: 'absolute',
                                width: '8%',
                                height: '11%',
                                cursor: 'pointer',
                                bottom: (layoutStartPos.y + 0.10 + heightList[value] * stepRange) * 100 + '%',
                                left: (layoutStartPos.x + 0.18 + value * targetRange) * 100 + '%'
                            }}>

                            < BaseImage
                                ref={starList[value]}
                                url={'SB54_Prop-Interactive/PI_woodden_box_01.svg'}
                            />
                            < BaseImage
                                ref={numberList[value]}
                                scale={0.5}
                                posInfo={{ l: 0.22, t: 0.35 }}
                                url={'SB54_Text-Interactive/TI_G3_' + generateStandardNum(value + 1) + '.svg'}
                            />
                        </div>
                    )
                }

                < BaseImage
                    scale={0.4}
                    posInfo={{
                        l: layoutStartPos.x + 7.07,
                        b: layoutStartPos.y + 0.105
                    }}
                    url={'SB54_Prop-Interactive/SB54_Apple_tree_01.svg'}
                />
                < BaseImage
                    scale={0.05}
                    posInfo={{
                        l: layoutStartPos.x + 7.27,
                        b: layoutStartPos.y + 0.505
                    }}
                    url={'animations/SB54_apple_4.svg'}
                />
                < BaseImage
                    scale={0.05}
                    posInfo={{
                        l: layoutStartPos.x + 7.17,
                        b: layoutStartPos.y + 0.505
                    }}
                    url={'animations/SB54_apple_3.svg'}
                />
                < BaseImage
                    scale={0.05}
                    posInfo={{
                        l: layoutStartPos.x + 7.37,
                        b: layoutStartPos.y + 0.605
                    }}
                    url={'animations/SB54_apple_1.svg'}
                />

                < BaseImage
                    scale={0.05}
                    posInfo={{
                        l: layoutStartPos.x + 7.27,
                        b: layoutStartPos.y + 0.705
                    }}
                    url={'animations/SB54_apple_2.svg'}
                />
                < BaseImage
                    scale={0.05}
                    posInfo={{
                        l: layoutStartPos.x + 7.21,
                        b: layoutStartPos.y + 0.605
                    }}
                    url={'animations/SB54_apple_2.svg'}
                />

                < BaseImage
                    scale={0.05}
                    posInfo={{
                        l: layoutStartPos.x + 7.15,
                        b: layoutStartPos.y + 0.705
                    }}
                    url={'animations/SB54_apple_2.svg'}
                />

                < BaseImage
                    scale={0.05}
                    posInfo={{
                        l: layoutStartPos.x + 7.15,
                        b: layoutStartPos.y + 0.155
                    }}
                    url={'animations/SB54_apple_6.svg'}
                />

                < BaseImage
                    scale={0.05}
                    posInfo={{
                        l: layoutStartPos.x + 7.25,
                        b: layoutStartPos.y + 0.155
                    }}
                    url={'animations/SB54_apple_6.svg'}
                />

                < BaseImage
                    scale={0.05}
                    posInfo={{
                        l: layoutStartPos.x + 7.35,
                        b: layoutStartPos.y + 0.25
                    }}
                    url={'animations/SB54_apple_5.svg'}
                />






                < BaseImage
                    scale={0.18}
                    ref={lastBoy}
                    className='hideObject'
                    posInfo={{
                        l: layoutStartPos.x + 7.1,
                        b: layoutStartPos.y + 0.105
                    }}
                    url={'SB54_Prop-Interactive/SB54_Boy_01.svg'}
                />





                <div
                    ref={greenStar}
                    style={{
                        position: 'absolute',
                        width: '7.5%',
                        height: '11%',
                        pointerEvents: 'none',
                        bottom: (layoutStartPos.y + 0.118 + heightList[0] * stepRange) * 100 + '%',
                        left: (layoutStartPos.x + 0.183 + targetRange * 0) * 100 + '%'
                    }}>
                    < BaseImage
                        url={'SB54_Prop-Interactive/PI_Woodden_box_Green_HL_01.svg'}
                    />
                </div>

                <div
                    ref={redStar}
                    style={{
                        position: 'absolute',
                        width: '7.5%',
                        height: '11%',
                        pointerEvents: 'none',
                        bottom: (layoutStartPos.y + 0.12 + heightList[0] * stepRange) * 100 + '%',
                        left: (layoutStartPos.x + 0.183) * 100 + '%'
                    }}>
                    < BaseImage
                        url={'SB54_Prop-Interactive/PI_Woodden_box_Red_HL_01.svg'}
                    />
                </div>


                {Array.from(Array(5).keys()).map(value =>
                    <BaseImage
                        scale={0.8}
                        ref={characterList[value]}
                        posInfo={{
                            l: layoutStartPos.x + 0.02,
                            b: layoutStartPos.y + 0.00
                        }}
                        className='hideObject'
                        url={'SB54_Animation/boy/SB54_CI_boy_0' + [value + 1] + '.svg'}
                    />
                )}

                <div
                    ref={sparkBaseRef}
                    style={{
                        position: 'fixed',
                        pointerEvents: 'none',
                        width: '5%',
                        height: '5%',
                        left: (layoutStartPos.x + 0.132) * 100 + '%',
                        bottom: (layoutStartPos.y + 0.489) * 100 + '%'
                    }}
                >
                    {
                        Array.from(Array(3).keys()).map(value =>
                            <BaseImage
                                ref={sparkRefList[value]}
                                className='hideObject'
                                key={value + 308}
                                style={{ transform: 'scale(' + [2, 3, 4][value] + ')' }}
                                url={'Magic/sb_52_magic_wand_sparkels_' + (1 + value) + '.svg'}
                            />
                        )
                    }
                </div>
                {/* {Array.from(Array(4).keys()).map(value =>
                    <BaseImage
                        // ref={eyeRefList[value]}
                        scale={0.03}
                        key={value + 304}
                        posInfo={{
                            l: layoutStartPos.x + 0.102,
                            b: layoutStartPos.y + 0.489
                        }}
                        // className='hideObject'
                        url={'animations/SB54_Boy_eyeblink_0' + (4 - value) + '.svg'}
                    />
                )} */}
            </div>



        </div>
    );

}
