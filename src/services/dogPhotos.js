// Maps common Spanish breed names → Dog CEO API paths
// Full list: https://dog.ceo/dog-api/documentation
const BREED_MAP = {
  'chihuahua':             'chihuahua',
  'golden retriever':      'retriever/golden',
  'labrador retriever':    'retriever/labrador',
  'labrador':              'retriever/labrador',
  'beagle':                'beagle',
  'poodle':                'poodle',
  'caniche':               'poodle',
  'bulldog francés':       'bulldog/french',
  'bulldog frances':       'bulldog/french',
  'bulldog inglés':        'bulldog/english',
  'bulldog ingles':        'bulldog/english',
  'bulldog':               'bulldog/french',
  'pastor alemán':         'germanshepherd',
  'pastor aleman':         'germanshepherd',
  'yorkshire terrier':     'terrier/yorkshire',
  'yorkshire':             'terrier/yorkshire',
  'boxer':                 'boxer',
  'dálmata':               'dalmatian',
  'dalmata':               'dalmatian',
  'dachshund':             'dachshund',
  'salchicha':             'dachshund',
  'husky':                 'husky',
  'husky siberiano':       'husky',
  'doberman':              'doberman',
  'rottweiler':            'rottweiler',
  'bichón frisé':          'bichon/frise',
  'bichon frise':          'bichon/frise',
  'bichon':                'bichon/frise',
  'cocker spaniel':        'spaniel/cocker',
  'spaniel':               'spaniel/cocker',
  'shih tzu':              'shihtzu',
  'shih-tzu':              'shihtzu',
  'schnauzer':             'schnauzer',
  'border collie':         'collie/border',
  'collie':                'collie/border',
  'maltés':                'maltese',
  'maltes':                'maltese',
  'maltese':               'maltese',
  'pomerania':             'pomeranian',
  'pomeranian':            'pomeranian',
  'pomeriano':             'pomeranian',
  'pitbull':               'pitbull',
  'pit bull':              'pitbull',
  'akita':                 'akita',
  'chow chow':             'chow',
  'san bernardo':          'stbernard',
  'saint bernard':         'stbernard',
  'gran danés':            'dane/great',
  'gran danes':            'dane/great',
  'great dane':            'dane/great',
  'mastín':                'mastiff',
  'mastin':                'mastiff',
  'mastiff':               'mastiff',
  'australian shepherd':   'australian/shepherd',
  'pastor australiano':    'australian/shepherd',
  'basenji':               'basenji',
  'basset hound':          'basset',
  'basset':                'basset',
  'bloodhound':            'bloodhound',
  'borzoi':                'borzoi',
  'clumber spaniel':       'spaniel/clumber',
  'corgi':                 'corgi/cardigan',
  'pembroke':              'corgi/pembroke',
  'dogo argentino':        'dogo/argentino',
  'greyhound':             'greyhound/italian',
  'galgo':                 'greyhound/italian',
  'irish setter':          'setter/irish',
  'jack russell':          'terrier/russell',
  'russell':               'terrier/russell',
  'malinois':              'malinois',
  'pastor belga':          'malinois',
  'pug':                   'pug',
  'carlino':               'pug',
  'saluki':                'saluki',
  'samoyed':               'samoyed',
  'samoyedo':              'samoyed',
  'shar pei':              'chinesesharpei',
  'sharpei':               'chinesesharpei',
  'vizsla':                'vizsla',
  'weimaraner':            'weimaraner',
  'whippet':               'whippet',
}

// In-memory cache: breed slug → image URL
const cache = new Map()
const pending = new Map()

export async function getDogPhoto(breedName = '') {
  const key = breedName.trim().toLowerCase()
  const slug = BREED_MAP[key]

  if (!slug) return null          // unknown breed → caller shows fallback
  if (cache.has(slug)) return cache.get(slug)

  // Deduplicate concurrent requests for the same breed
  if (pending.has(slug)) return pending.get(slug)

  const promise = fetch(`https://dog.ceo/api/breed/${slug}/images/random`)
    .then((r) => r.json())
    .then((data) => {
      const url = data.status === 'success' ? data.message : null
      cache.set(slug, url)
      pending.delete(slug)
      return url
    })
    .catch(() => {
      pending.delete(slug)
      return null
    })

  pending.set(slug, promise)
  return promise
}
