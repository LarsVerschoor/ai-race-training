import Webcam from "./utils/webcam.js";
import Landmarks from "./utils/landmarks.js";
import { DrawingUtils, HandLandmarker } from "@mediapipe/tasks-vision";

const videoElement = document.getElementById('webcam');
const enableWebcamButton = document.getElementById('startwebcam');
const videoContainer = document.getElementById('videoContainer');
const canvasElement = document.getElementById('canvas');
const ctx = canvasElement.getContext('2d');
const webcam = new Webcam(videoElement);
const landmarks = new Landmarks();
const trainingData = JSON.parse(localStorage.getItem('trainingData')) || [];

const trainButtons = [
    {label: 'left', button: document.getElementById('trainleft')},
    {label: 'right', button: document.getElementById('trainright')},
    {label: 'brake', button: document.getElementById('trainbrake')},
    {label: 'accelerate', button: document.getElementById('trainaccelerate')}
];

const exportButton = document.getElementById('export');
const resetButton = document.getElementById('reset');

exportButton.addEventListener('click', exportTrainingData);
resetButton.addEventListener('click', () => {
    trainingData.length = 0;
    localStorage.removeItem('trainingData');
});

trainButtons.forEach((button) => {
    button.button.addEventListener('click', () => {
        trainingData.push({points: landmarks.result[0].map((landmark) => [landmark.x, landmark.y, landmark.z]).flat(), label: button.label});
        localStorage.setItem('trainingData', JSON.stringify(trainingData));
        console.log(trainingData)
    });
});

const drawUtils = new DrawingUtils(ctx);
enableWebcamButton.addEventListener('click', async () => {
    await landmarks.init();
    webcam.enable(async () => {
        console.log('test')
        console.log(videoElement.videoHeight, videoElement.videoWidth);
        console.log(videoElement.width, videoElement.height)
        canvasElement.style.width = videoElement.videoWidth;
        canvasElement.style.height = videoElement.videoHeight;
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        videoContainer.style.height = videoElement.videoHeight + 'px';

        trainButtons.forEach((button) => {
            button.button.removeAttribute('disabled');
        });

        landmarks.predict(videoElement, (hands) => {
            ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            hands.forEach((hand) => {
                drawUtils.drawConnectors(hand, HandLandmarker.HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 10 });
                drawUtils.drawLandmarks(hand, { radius: 4, color: '#FF0000', lineWidth: 4 });
            });
        });
    });
});

function exportTrainingData() {
    console.log(trainingData)
    if (!trainingData) {
        return console.log('No training data to export.');
    }
    const blob = new Blob([JSON.stringify(trainingData.sort(() => Math.random() - 0.5))], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url
    a.download = 'trainingData.json';
    a.click();
    URL.revokeObjectURL(url);
}