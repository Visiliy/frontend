import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import twoImage from "./img/two.jpg";

const App = () => {
    const [response, setResponse] = useState("");
    const [favorite, setFavorite] = useState([]);

    let audioChunks = [];
    let mediaRecorder;
    let audioStream;

    function getCookie(name) {
        var matches = document.cookie.match(
            new RegExp(
                "(?:^|; )" +
                    name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
                    "=([^;]*)"
            )
        );
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    let d1 = "";
    let d2 = "display_none";

    if (getCookie("nickname") != undefined) {
        d1 = "display_none";
        d2 = "";
        axios
            .get(
                `http://127.0.0.1:8090/favorite2?nickname=${getCookie(
                    "nickname"
                )}`
            )
            .then((response) => {
                console.log(response.data[0]);
                setFavorite(response.data[0]);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const uploadAudio = async (blob) => {
        const div = document.querySelector(".load");
        const text = document.querySelector(".load-time");
        const music = document.querySelector(".music");
        const span2 = document.querySelector(".span2");

        text.textContent = "Обработка...";

        const formData = new FormData();
        formData.append("audio", blob, "recording.wav");

        try {
            const ans = await axios.post(
                "http://127.0.0.1:8090/get_music",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (ans.status === 200) {
                setResponse(ans.data[0]);
                console.log(ans.data[0][1]);
                div.classList.add("display_none");
                music.classList.remove("display_none");
                span2.classList.remove("display_none");
                text.textContent = "Запись пошла";
                text.classList.add("display_none");
                console.log("Ответ сервера:", ans.data[0]);
            } else {
                throw new Error("Ошибка при отправке файла");
            }
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    const new_window = () => {
        const btn = document.querySelector(".close");
        const music = document.querySelector(".music");
        const span2 = document.querySelector(".span2");
        btn.classList.remove("display_none");
        music.classList.add("display_none");
        span2.classList.add("display_none");
    };

    const sendData1 = () => {
        const input1 = document.querySelector(".one_1");
        const input2 = document.querySelector(".two_2");

        axios
            .post("http://127.0.0.1:8090/login", {
                name: input1.value,
                password: input2.value,
            })
            .then((response) => {
                console.log("Response:", response.data);
                let data = response.data;
                if (!data[0][0]) {
                    alert("Такого никнейма нет");
                } else if (!data[0][1]) {
                    alert("Неправильный пароль");
                } else {
                    console.log("Ok");
                    document.cookie = `nickname=${input1.value};max-age=2629743`;
                    const left_2 = document.querySelector(".left_2");
                    const left_3 = document.querySelector(".left_3");
                    left_2.classList.add("display_none");
                    left_3.classList.remove("display_none");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const sendData2 = () => {
        const input1 = document.querySelector(".one_1");
        const input2 = document.querySelector(".two_2");

        axios
            .post("http://127.0.0.1:8090/registration", {
                name: input1.value,
                password: input2.value,
            })
            .then((response) => {
                console.log("Response:", response.data);
                if (!response.data[0]) {
                    alert("Такой никнейм есть");
                } else {
                    document.cookie = `nickname=${input1.value};max-age=2629743`;
                    const left_2 = document.querySelector(".left_2");
                    const left_3 = document.querySelector(".left_3");
                    left_2.classList.add("display_none");
                    left_3.classList.remove("display_none");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const sendAudioContentToServer = async () => {
        const div = document.querySelector(".load");
        const text = document.querySelector(".load-time");
        const btn = document.querySelector(".close");
        console.log("Ok");
        div.classList.remove("display_none");
        text.classList.remove("display_none");
        btn.classList.add("display_none");

        audioStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });

        const audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(audioStream);
        const recorder = new Recorder(source, { numChannels: 1 });

        recorder.record();

        const stop = () => {
            recorder.stop();

            audioStream.getTracks().forEach((track) => track.stop());

            recorder.exportWAV((blob) => {
                uploadAudio(blob);
            });
        };
        setTimeout(stop, 7000);
    };

    const openLoginForm = () => {
        const div1 = document.querySelector(".left_1");
        const div2 = document.querySelector(".left_2");
        const p1 = document.querySelector("#a1");
        const p2 = document.querySelector("#a2");
        const p3 = document.querySelector("#a3");
        const p4 = document.querySelector("#a4");
        const btn1 = document.querySelector(".btn1");
        const btn2 = document.querySelector(".btn2");

        p1.classList.remove("display_none");
        p4.classList.remove("display_none");

        p2.classList.add("display_none");
        p3.classList.add("display_none");

        btn1.classList.remove("display_none");
        btn2.classList.add("display_none");
        div1.classList.add("display_none");
        div2.classList.remove("display_none");
    };

    const openRegForm = () => {
        console.log("Click");
        const p1 = document.querySelector("#a1");
        const p2 = document.querySelector("#a2");
        const p3 = document.querySelector("#a3");
        const p4 = document.querySelector("#a4");
        const btn1 = document.querySelector(".btn1");
        const btn2 = document.querySelector(".btn2");

        p1.classList.add("display_none");
        p4.classList.add("display_none");

        p2.classList.remove("display_none");
        p3.classList.remove("display_none");

        btn1.classList.add("display_none");
        btn2.classList.remove("display_none");
    };

    const exit = () => {
        document.cookie = `nickname=${getCookie("nickname")};max-age=-1`;
        window.location.href = "/";
    };

    const click = () => {
        if (getCookie("nickname") != undefined) {
            axios
                .post("http://127.0.0.1:8090/favorite", {
                    name: getCookie("nickname"),
                    res: response,
                })
                .then((response) => {
                    console.log("Response:", response.data);
                    alert("Песня добавлена");
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        } else {
            alert("Вы не вошли в аккаунт");
        }
    };

    return (
        <div className="main">
            <div className={`left left_1 ${d1}`}>
                <div className="text-div">
                    <center>
                        <h2 className="text1">Заряжайся</h2>
                    </center>
                    <center>
                        <h2 className="text1">музыкой!</h2>
                    </center>
                </div>

                <button className="btn1" onClick={openLoginForm}>
                    Войти
                </button>
            </div>
            <div className="left left_2 display_none">
                <p className="text2 one" id="a1">
                    Вход
                </p>
                <p
                    className="text3 display_none one"
                    id="a2"
                    onClick={openLoginForm}
                >
                    Вход
                </p>

                <p className="text2 display_none two" id="a3">
                    Регистрация
                </p>
                <p className="text3 two" id="a4" onClick={openRegForm}>
                    Регистрация
                </p>

                <input className="input one_1" placeholder="Логин" />
                <input
                    className="input two_2"
                    type="password"
                    placeholder="Пароль"
                />

                <button className="btn1" onClick={sendData1}>
                    Войти
                </button>
                <button className="btn2 display_none" onClick={sendData2}>
                    Зарегистрироваться
                </button>
            </div>
            <div className={`left left_3 ${d2}`}>
                <div className="text-div">
                    <center>
                        <h2 className="text1">Любимые</h2>
                    </center>
                </div>
                <div className="content">
                    {favorite.map((music) => (
                        <center>
                            <h2>{music}</h2>
                        </center>
                    ))}
                </div>

                <button className="btn1" onClick={exit}>
                    Выйти
                </button>
            </div>
            <div className="right">
                <div className="logo">
                    <div className="wrapper">
                        <img src={twoImage} alt="Two" className="logo-img" />
                        <span className="logo-text">Floating Sound</span>
                    </div>
                    <div className="close">
                        <div
                            className="wave-equalizer"
                            onClick={sendAudioContentToServer}
                        >
                            <div className="wave-bar"></div>
                            <div className="wave-bar"></div>
                            <div className="wave-bar"></div>
                            <div className="wave-bar"></div>
                            <div className="wave-bar"></div>
                            <div className="wave-bar"></div>
                            <div className="wave-bar"></div>
                            <div className="wave-bar"></div>
                        </div>
                    </div>

                    <div className="load display_none"></div>
                    <h2 className="load-time display_none">Запись пошла</h2>
                    <div style={{ display: "inline" }}>
                        <h2 className="music display_none" onClick={new_window}>
                            {response}
                        </h2>
                        <span className="span2 display_none" onClick={click}>
                            <h1>💜</h1>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
