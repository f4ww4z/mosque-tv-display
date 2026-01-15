export interface EventResponse {
  id: string
  title: string
  description: string
  location: string
  firstPicture: string
  startDateTime: Date
  endDateTime: Date
}

export interface MasjidAndBriefEventsResponse {
  id: string
  masjidType: string
  masjidName: string
  masjidAddress: string
  theme: string
  logoFilename?: string
  events: EventResponse[]
}

export interface EventDetailResponse {
  id: string
  title: string
  description: string
  location: string
  startDateTime: Date
  endDateTime: Date
  pictures: string[]
}

export interface CreateEventRequest {
  title: string
  description: string
  location: string
  startDateTime: Date
  endDateTime: Date
}

export interface UpdateEventRequest {
  title: string
  description: string
  location: string
  startDateTime: Date
  endDateTime: Date
}

export interface CreateEventResponse {
  id: string
}

export interface DeleteEventRequest {
  id: string
}

export interface DeleteEventPictureRequest {
  filename: string
}
