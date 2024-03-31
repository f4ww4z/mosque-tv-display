export interface CarouselItem {
  id: string
  title: string
  filename: string
  order: number
  hidden: boolean
}

export interface CarouselSwapRequest {
  itemSwapFromId: string
  itemSwapToId: string
}

export interface CarouselItemDeleteRequest {
  itemId: string
}
