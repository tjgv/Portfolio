import { publicAsset } from '../../../lib/app-paths'

const PORTRAIT_POOL = [
  publicAsset('/images/home/hero-mendoza.png'),
  publicAsset('/images/home/value-picks/player-1.png'),
  publicAsset('/images/home/value-picks/makai-lemon.png'),
  publicAsset('/images/home/value-picks/player-arvell.png'),
  publicAsset('/images/home/value-picks/dillon-thieneman.png'),
  publicAsset('/images/home/value-picks/sonny-styles.png'),
]

function hashKey(key: string): number {
  let h = 0
  for (let i = 0; i < key.length; i += 1) {
    h = (h * 31 + key.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

export function prospectPortraitUrl(prospectKey: string, name: string): string {
  if (/mendoza/i.test(name)) {
    return publicAsset('/images/home/hero-mendoza.png')
  }
  return PORTRAIT_POOL[hashKey(prospectKey) % PORTRAIT_POOL.length]
}
