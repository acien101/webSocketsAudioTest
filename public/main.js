/**
 * Created by amil101 on 28/07/17.
 */


const ws = new WebSocket('ws://192.168.1.101:8080');		//Poner la dirección de donde se envia el audio

var audioContext;
var rawAudio = new Float32Array();

window.addEventListener('load', init, false);
function init() {
    try {
        console.log("Creating audio Context");

        // Fix up for prefixing
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        audioContext = new AudioContext();
        var source = audioContext.createBufferSource(1, 44100, 44100);

        var scriptNode = audioContext.createScriptProcessor(4096, 1, 1);

        scriptNode.onaudioprocess = function(event) {
                var out = event.outputBuffer.getChannelData(0);
                for (sample = 0 ; sample < rawAudio.length ; sample++) {
                    out[sample] = rawAudio[sample];
                }
        };

        source.connect(scriptNode);
        scriptNode.connect(audioContext.destination);
        source.start();
    }
    catch(e) {
        alert('Web Audio API is not supported in this browser');
    }
}

ws.binaryType = 'arraybuffer'
ws.onmessage = function(e){
    var rawAudioTemp = new Float32Array(e.data);
    rawAudio= rawAudioTemp
};



