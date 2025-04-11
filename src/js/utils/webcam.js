class Webcam {
    constructor(element) {
        this.element = element;
        this.isEnabled = false;
    }

    async enable(callback) {
        try {
            this.element.srcObject = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            this.element.addEventListener('loadeddata', callback);

            this.isEnabled = true
        } catch(e) {
            console.error(e);
        }
    }

    async disable() {
        try {
            this.isEnabled = false;
        } catch(e) {
            console.error(e)
        }
    }
}

export default Webcam;