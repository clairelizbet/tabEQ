import { connectAVSourceNode, updateSettings } from './audio'

AudioContext.prototype._createMediaElementSource =
  AudioContext.prototype.createMediaElementSource

// TODO: Instead of automatically connecting all nodes, wait for action invoke
// Except if they already have the settings for this site stored, then auto connect

AudioContext.prototype.createMediaElementSource = function (
  mediaElement: HTMLMediaElement
) {
  const source = this._createMediaElementSource(mediaElement)
  connectAVSourceNode(source)
  return source
}

window.addEventListener('message', (event) => {
  if (event.source != window) return
  if (event.data?.type === 'audioNodesUpdate' && event.data?.settings) {
    updateSettings(event.data?.settings)
  }
})
