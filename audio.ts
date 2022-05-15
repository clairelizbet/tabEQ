import { SavedSiteSettings } from './util/storage'

let settings: Required<SavedSiteSettings> = {
  compressDynamicRange: false,
  equalization: [],
  normalizeChannels: false,
  normalizeLoudness: false,
  pan: 0,
  volume: 1,
}

interface TabAudioSourceNode {
  sourceNode: MediaElementAudioSourceNode
  lastPreCompressionNode: AudioNode
  compressorNode?: DynamicsCompressorNode // Always last if it exists
  panNode: StereoPannerNode
  gainNode: GainNode
  nodeSettings: Required<SavedSiteSettings>
}

const activeSourceNodes: TabAudioSourceNode[] = []

function connectSourceNode(
  sourceNode: MediaElementAudioSourceNode
): TabAudioSourceNode {
  const nodeSettings = { ...settings }
  let audioChainHead: AudioNode = sourceNode
  let compressorNode: DynamicsCompressorNode | undefined
  let lastPreCompressionNode: AudioNode

  const addNodeToChain = (node: AudioNode) =>
    (audioChainHead = audioChainHead.connect(node))

  try {
  sourceNode.disconnect()
  } catch (e) {}

  const gainNode = sourceNode.context.createGain()
  gainNode.gain.value = nodeSettings.volume
  addNodeToChain(gainNode)

  const panNode = sourceNode.context.createStereoPanner()
  panNode.pan.value = nodeSettings.pan
  lastPreCompressionNode = addNodeToChain(panNode)

  if (nodeSettings.compressDynamicRange) {
    compressorNode = sourceNode.context.createDynamicsCompressor()
    compressorNode.ratio.value = nodeSettings.compressDynamicRange
    addNodeToChain(compressorNode)
  }

  audioChainHead.connect(sourceNode.context.destination)

  return {
    sourceNode,
    lastPreCompressionNode,
    compressorNode,
    panNode,
    gainNode,
    nodeSettings,
  }
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
  activeSourceNodes.forEach((source) => {
    const {
      sourceNode,
      compressorNode,
      lastPreCompressionNode,
      gainNode,
      panNode,
      nodeSettings,
    } = source
    const newSettings = { ...settings }

    if (nodeSettings.volume !== newSettings.volume)
      gainNode.gain.value = newSettings.volume

    if (nodeSettings.pan !== newSettings.pan)
      panNode.pan.value = newSettings.pan

    // If the new settings call for no compression we need to remove compressor
    if (newSettings.compressDynamicRange === false && compressorNode) {
      compressorNode.disconnect(sourceNode.context.destination)
      lastPreCompressionNode.disconnect(compressorNode)
      source.compressorNode = undefined

      lastPreCompressionNode.connect(sourceNode.context.destination)
    }

    // If the new settings call for a compressor and we lack one, add it
    if (newSettings.compressDynamicRange && !compressorNode) {
      lastPreCompressionNode.disconnect(sourceNode.context.destination)

      const compressor = sourceNode.context.createDynamicsCompressor()
      compressor.ratio.value = newSettings.compressDynamicRange

      lastPreCompressionNode.connect(compressor)
      compressor.connect(sourceNode.context.destination)

      source.compressorNode = compressor
    }

    // Update the node's settings
    for (const settingKey in settings) {
      const key = settingKey as keyof SavedSiteSettings
      source.nodeSettings[key] = settings[key] as never
    }
  })
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
