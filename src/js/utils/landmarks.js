import { HandLandmarker, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision";

class Landmarks {
    constructor() {
        this.handLandmarker = null;
        this.result = null;
    }

    async init() {
        const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm');
        this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
                delegate: 'GPU'
            },
            runningMode: 'VIDEO',
            numHands: 2
        });
    }

    async predict(video, callback) {
        window.requestAnimationFrame(() => {
            this.predict(video, callback);
        });

        this.result = (await this.handLandmarker.detectForVideo(video, performance.now())).landmarks;

        callback(this.result);
    }
}

export default Landmarks;