import React, { useContext, useState, useEffect, useRef } from 'react';
import "../../stylesheets/styles.css";

import { UserContext } from '../../components/BaseShot';
import { prePathUrl, initialAudio, startRepeatAudio } from '../../components/CommonFunctions';
import GamePanel from "./GamePanel"
import Review from "./Review"
import loadSound from '../../utils/loadSound';
import { Player } from '@lottiefiles/react-lottie-player';
var isGameStarted = false;
var timerList = []

const BaseScene = React.forwardRef(({ nextFunc, _geo, _baseGeo, showMusicBtn }, ref) => {

    const audioList = useContext(UserContext)
    const [isIntroHide, setIntroHide] = useState(false)

    const [isGameFinished, setGameFinish] = useState(false)
    const [isGameRenderStart, setGameRenderStart] = useState(false)

    const [isShow, setShow] = useState(false)
    const gamePanelRef = useRef();
    const playBtnRef = useRef();
    const aniChracterObj = useRef()
    const playerPanel = useRef();

    useEffect(() => {
        audioList.titleAudio = loadSound('SB_54_Audio_01_B')
        audioList.bodyAudio = loadSound('SB_54_Audio_06');
        audioList.subBodyAudio = loadSound('SB_54_Audio_07');

        setTimeout(() => {
            playBtnRef.current.className = 'introText'
            setGameRenderStart(true)
        }, 1500);

        setTimeout(() => {
            setShow(true)
        }, 1000);

        setTimeout(() => {
            playBtnRef.current.className = 'commonButton'
            playBtnRef.current.style.pointerEvents = ''
        }, 3000);

        playBtnRef.current.className = 'hide'

        return () => {
            audioList.titleAudio.pause();
            audioList.titleAudio.currentTime = 0;

        }

    }, [])


    function finishGame() {

        setGameFinish(true)

        setTimeout(() => {
            gamePanelRef.current.style.display = 'none'
        }, 1000);
    }

    function clickFunc() {
        showMusicBtn();
        audioList.titleAudio.pause();
        audioList.titleAudio.currentTime = 0;

        if (!isGameStarted)
            new initialAudio(audioList)

        if (!isGameStarted) {
            setTimeout(() => {
                isGameStarted = true;
            }, 500);
        }

        setTimeout(() => {
            audioList.backAudio.play().catch(error => {
            });

            gamePanelRef.current.style.display = 'inline-block'
            gamePanelRef.current.style.transition = '1s'
            gamePanelRef.current.style.opacity = 1
            setTimeout(() => {
                setIntroHide(true)

                timerList[0] = setTimeout(() => {
                    audioList.bodyAudio.play();
                    aniChracterObj.current.play();

                    timerList[1] = setTimeout(() => {
                        aniChracterObj.current.stop();

                        timerList[2] = setTimeout(() => {
                            audioList.subBodyAudio.play();
                            startRepeatAudio()
                        }, 1000);
                    }, audioList.bodyAudio.duration * 1000);
                }, 1000);

            }, 1000);
        }, 200)
    }


    function stopSound(isTrue = false) {

        if (isTrue)
            setTimeout(() => {
                playerPanel.current.className = 'hideObject'
            }, 200);

        aniChracterObj.current.stop();

        timerList.map(timer => {
            clearTimeout(timer)
        })

        audioList.bodyAudio.pause();
        audioList.subBodyAudio.pause();

        audioList.bodyAudio.src = loadSound('SB_54_Audio_11')
    }

    return (
        <div>
            {!isIntroHide &&
                <div >
                    <div
                        style={{
                            position: "fixed", width: _baseGeo.width * 0.22 + "px",
                            left: _baseGeo.width * 0.15 + _baseGeo.left + "px"
                            , bottom: _baseGeo.height * 0.2 + _baseGeo.bottom + "px",
                        }}>
                        <img draggable={false} width={"100%"}
                            src={prePathUrl() + 'images/SB54_Intro BG/SB_54_Intro_Game_3_CH_01.svg'}
                        />
                    </div>
                    {isShow &&
                        <div
                            className='introText'
                            style={{
                                position: "fixed", width: _baseGeo.width * 0.45 + "px",
                                left: _baseGeo.width * 0.35 + _baseGeo.left + "px"
                                , bottom: _baseGeo.height * 0.4 + _baseGeo.bottom + "px",
                            }}>
                            <img draggable={false} width={"100%"}
                                src={prePathUrl() + 'images/SB54_Intro BG/SB_54_Intro_Game_3_TI_01.svg'}
                            />
                        </div>
                    }

                    <div
                        className="hide"
                        ref={playBtnRef}
                        onClick={clickFunc}
                        style={{
                            position: "fixed", width: _geo.width * 0.12 + "px",
                            left: _geo.width * 0.5 + _geo.left + "px"
                            , bottom: _geo.height * 0.15 + _geo.top + "px",
                            cursor: "pointer",
                            pointerEvents: 'none'
                        }}>
                        <img draggable={false}
                            width={"100%"}
                            src={prePathUrl() + 'images/Buttons/Play_blue.svg'}
                        />
                    </div>



                </div>
            }
            {
                isGameRenderStart &&
                < div
                    ref={gamePanelRef}
                    style={{ display: 'none', opacity: 0 }}
                >
                    <GamePanel stopSound={stopSound} finishGame={finishGame} _baseGeo={_baseGeo} _geo={_geo} />
                    <div
                        ref={playerPanel}
                        
                    >
                        <Player
                            ref={aniChracterObj}
                            keepLastFrame={true}
                            loop={true}
                            src={prePathUrl() + 'lottieFiles/SB_54_boywithbasket_body.json'}
                            style={{
                                position: 'fixed',
                                width: _baseGeo.width * 0.14 + 'px',
                                left: _baseGeo.width * 0.055 + 'px',
                                top: _baseGeo.height * 0.26 + 'px',
                                pointerEvents: 'none',
                                overflow: 'visible'
                            }}
                        >
                        </Player>
                    </div>
                </div>
            }
            {
                isGameFinished &&
                <Review nextFunc={nextFunc} _baseGeo={_baseGeo} _geo={_geo} />
            }
        </div >
    );
});

export default BaseScene;
