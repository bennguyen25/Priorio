import snapshot from '../data/canvas-snapshot.json'

export function fetchCanvasData() {
  return Promise.resolve(snapshot)
}
