import browser from 'webextension-polyfill'
import { settings, updateSettings, connectAVMediaElements } from './audio'
import runOnInteractive from './util/runOnInteractive'

const connectedMediaElements: HTMLMediaElement[] = []
let shouldCheckForNewElements: boolean = false

const init = async () => {
  const pageScript = document.createElement('script')
  pageScript.src = browser.runtime.getURL('page.js')
  document.head.appendChild(pageScript)

  browser.runtime.onMessage.addListener((request) => {
    if (request.type === 'getStatus') return Promise.resolve(settings)
    if (request.type === 'settingsUpdate') {
      updateSettings(request.settings, true)
    }
  })

  function findAVMediaElements(): HTMLMediaElement[] {
    const mediaElements: HTMLMediaElement[] = []
    const elements = Array.from(document.querySelectorAll('audio, video'))

    elements.forEach((element) => {
      if (element instanceof HTMLMediaElement) mediaElements.push(element)
    })

    return mediaElements
  }

  function processDOMChanges() {
    if (shouldCheckForNewElements) {
      shouldCheckForNewElements = false

      const newAVElements = findAVMediaElements().filter(
        (mediaElement) => !connectedMediaElements.includes(mediaElement)
      )

      connectedMediaElements.push(...newAVElements)
      connectAVMediaElements(newAVElements)
    }
  }

  const onDOMChanged = function () {
    shouldCheckForNewElements = true
  }

  const observer = new MutationObserver(onDOMChanged)
  observer.observe(document.body, { childList: true, subtree: true })

  connectAVMediaElements(findAVMediaElements())
  setInterval(processDOMChanges, 100)
}

runOnInteractive(init)
