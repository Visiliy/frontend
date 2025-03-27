import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import twoImage from "./img/two.jpg";

const App = () => {
    const [response, setResponse] = useState("");

    let audioChunks = [];
    let mediaRecorder;
    let audioStream;

    const uploadAudio = async (blob) => {
        const div = document.querySelector(".load");
        const text = document.querySelector(".load-time");
        const music = document.querySelector(".music");

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
                setResponse(ans.data[0][0]);
                console.log(ans.data[0][1]);
                div.classList.add("display_none");
                music.classList.remove("display_none");
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
        const btn = document.querySelector(".main-btn");
        const music = document.querySelector(".music");
        btn.classList.remove("display_none");
        music.classList.add("display_none");
    };

    const sendAudioContentToServer = async () => {
        const div = document.querySelector(".load");
        const text = document.querySelector(".load-time");
        const btn = document.querySelector(".main-btn");
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

    return (
        <div className="main">
            <div className="right">
                <div className="logo">
                    <div className="wrapper">
                        <img src={twoImage} alt="Two" className="logo-img" />
                        <span className="logo-text">Floating Sound</span>
                    </div>
                    <button
                        className="main-btn"
                        onClick={sendAudioContentToServer}
                    >
                        Определить
                    </button>
                    <div className="load display_none"></div>
                    <h2 className="load-time display_none">Запись пошла</h2>
                    <div style={{ display: "inline" }}>
                        <h2 className="music display_none" onClick={new_window}>
                            {response}
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
