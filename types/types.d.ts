
export interface Color {
  [key: string]: number
}

export interface ColorDescription {
  high: string
  medium: string
  low: string
  varied: string
  uniform: string
}

export interface ColorDescriptionDict {
  [key: string]: ColorDescription
}

export interface Song {
  url: string
  name: string
  image: string
  artist: string
}
