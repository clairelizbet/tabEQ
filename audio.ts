import { SavedSiteSettings } from './util/storage'

let settings: Required<SavedSiteSettings> = {
  compressDynamicRange: false,
  equalization: [],
  normalizeChannels: false,
  normalizeLoudness: false,
  pan: 0,
  volume: 1,
}

const activeSourceNodes: MediaElementAudioSourceNode[] = []

function connectSourceNode(source: MediaElementAudioSourceNode) {
  let audioChainHead: AudioNode = source
  source.disconnect()

  const addNodeToChain = (node: AudioNode) => {
    audioChainHead = audioChainHead.connect(node)
  }

  const gainNode = source.context.createGain()
  gainNode.gain.value = settings.volume
  addNodeToChain(gainNode)

  const panNode = source.context.createStereoPanner()
  panNode.pan.value = settings.pan
  addNodeToChain(panNode)

  if (settings.compressDynamicRange) {
    const compressorNode = source.context.createDynamicsCompressor()
    compressorNode.threshold.value = -30
    compressorNode.ratio.value = settings.compressDynamicRange
    addNodeToChain(compressorNode)
  }

  audioChainHead.connect(source.context.destination)

  return source
}

function connectAVSourceNode(source: MediaElementAudioSourceNode) {
  activeSourceNodes.push(connectSourceNode(source))
}

function connectAVMediaElements(mediaElements: HTMLMediaElement[]) {
  mediaElements.forEach((mediaElement) => {
    try {
      const audioCtx = new AudioContext()
      /* Element here might already be connected to another node */
      const source = audioCtx.createMediaElementSource(mediaElement)
      activeSourceNodes.push(connectSourceNode(source))
    } catch (e) {
      // TODO: maybe send a notice to extension so we can change icon?
    }
  })
}

function updateAudioNodes() {
  const newSources: MediaElementAudioSourceNode[] = []

  while (activeSourceNodes.length > 0) {
    const source = activeSourceNodes.pop()
    if (source) newSources.push(connectSourceNode(source))
  }

  activeSourceNodes.push(...newSources)
}

function updateSettings(
  newSettings: SavedSiteSettings,
  broadcastUpdate: boolean = false
) {
  settings = { ...settings, ...newSettings }
  updateAudioNodes()
  if (broadcastUpdate)
    window.postMessage({ type: 'audioNodesUpdate', settings })
}

export { settings, updateSettings }
export { connectAVMediaElements, connectAVSourceNode }
