'use strict'

const webcam = require('./node_modules/webcamjs/webcam.min.js')

function recordViaMediaRecorder () {
  console.log('recording a 5s video via MediaRecorder.')
}

function recordViaCcapture () {
  console.log('recording a 5s video via ccapture.')
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM is loaded.')

  webcam.set({
    width: 800,
    height: 600
  })
  webcam.attach('#source')

  document.querySelector('.js-capture-media-recorder').addEventListener('click', recordViaMediaRecorder)
  document.querySelector('.js-capture-ccapture').addEventListener('click', recordViaCcapture)
})
