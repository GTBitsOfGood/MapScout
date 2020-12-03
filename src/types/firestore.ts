export type TeamDocProps = {
  label: string,
  latitude: number,
  longitude: number,
  logoUrl?: string,
  name: string,
  primaryColor: string,
  secondaryColor: string,
  zoom?: number,
  id: string
}

export type UserDocProps = {
  UID: string,
  email: string,
  team: string,
  id: string
}

export type CategoryOptions = {
  label: string,
  value: string,
}

export type CategoryDocProps = {
  active: boolean,
  id: string,
  name: string,
  options?: CategoryOptions[],
  priority: number,
  select_type: number,
  team: string,
}

export type ProviderHours = {
  Friday: number[],
  Monday: number[],
  Saturday: number[],
  Sunday: number[],
  Thursday: number[],  
  Tuesday: number[],
  Wednesday: number[],
}

export type ProviderProps = {
  address: string,
  buildingNum?: string,
  description?: string,
  facilityName: string,
  hours?: ProviderHours,
  id: string,
  image?: string,
  imageURL?: string,
  latitude: number,
  longitude: number,
  phoneNum: string,
  website?: string,
  team: string
} & {
  [prop: string]: CategoryDocProps;
};