'use strict'

const webcam = require('./node_modules/webcamjs/webcam.min.js')
let mediaRecorder = null
let capturer = null
let loop = null

const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

function recordViaMediaRecorder () {
  document.querySelector('#target').setAttribute('src', '')
  console.log('recording a 5s video via MediaRecorder.')
  let mediaChunks = []
  mediaRecorder.start()
  mediaRecorder.ondataavailable = (event) => {
    ;(event.data.size > 0) && mediaChunks.push(event.data)
  }
  mediaRecorder.onstop = (event) => {
    const path = `/tmp/video-media-${new Date().getTime()}.webm`
    const blob = new Blob(mediaChunks, { type: 'video/webm' })
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(blob)
    reader.addEventListener('load', function () {
      const mediaDatas = reader.result
      const mediaBuffer = new Buffer(mediaDatas)
      require('fs').writeFile(path, mediaBuffer, (err) => {
        if (err) {
          throw err
        } else {
          document.querySelector('#target').setAttribute('src', `file://${path}`)
        }
      })
    }, false)
    reader.addEventListener('error', function (err) {
      console.log(error)
    })
    mediaChunks = []
  }
  setTimeout(() => {
    mediaRecorder.stop()
  }, 5000)
}

function setupCanvas () {
  canvas.width = 400
  canvas.height = 300
}

function render () {
  loop = requestAnimationFrame(render)
  const stream = document.querySelector('#source > video')
  ctx.drawImage(stream, 0, 0, canvas.width, canvas.height)
  capturer.capture(canvas)
}

function recordViaCcapture () {
  capturer && capturer.stop()
  cancelAnimationFrame(loop)
  document.querySelector('#target').setAttribute('src', '')
  console.log('recording a 5s video via ccapture.')
  capturer.start()
  render()
  setTimeout(() => {
    console.log('stop')
    cancelAnimationFrame(loop)
    capturer.stop()
    capturer.save()
  }, 5000)
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM is loaded.')

  webcam.set({
    width: 400,
    height: 300
  })
  webcam.attach('#source')
  webcam.on('live', () => {
    mediaRecorder = new MediaRecorder(webcam.stream, { mimeType: 'video/webm' })
    capturer = new CCapture({
      framerate: 60,
      verbose: true,
      format: 'webm'
    })
    setupCanvas()
  })

  document.querySelector('.js-capture-media-recorder').addEventListener('click', recordViaMediaRecorder)
  document.querySelector('.js-capture-ccapture').addEventListener('click', recordViaCcapture)
})
