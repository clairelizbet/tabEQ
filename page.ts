import { connectAVSourceNode, updateSettings } from './audio'

AudioContext.prototype._createMediaElementSource =
  AudioContext.prototype.createMediaElementSource

AudioContext.prototype.createMediaElementSource = function (
  mediaElement: HTMLMediaElement
) {
  const audioCtx = this
  const source = audioCtx._createMediaElementSource(mediaElement)

  window.addEventListener('message', (event) => {
    if (event.source != window) return
    if (event.data?.type === 'audioNodesUpdate' && event.data?.settings) {
      updateSettings(event.data?.settings)
    }
  })

  connectAVSourceNode(source)
  return source
}
