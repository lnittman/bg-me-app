const adjectives = [
  'happy', 'lucky', 'sunny', 'clever', 'gentle', 'brave', 'bright', 'swift',
  'calm', 'kind', 'wise', 'bold', 'proud', 'neat', 'warm', 'cool',
  'eager', 'fair', 'nice', 'pure', 'sweet', 'wild', 'young', 'zesty'
];

const nouns = [
  'panda', 'tiger', 'eagle', 'dolphin', 'koala', 'lion', 'wolf', 'bear',
  'fox', 'owl', 'hawk', 'deer', 'seal', 'cat', 'dog', 'bird',
  'fish', 'duck', 'frog', 'goat', 'horse', 'mouse', 'rabbit', 'sheep'
];

export function generateFriendlyName(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adjective} ${noun}`;
} 