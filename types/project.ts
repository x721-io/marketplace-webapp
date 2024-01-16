import {Collection, Round} from "@/types/launchpad";

export interface Project {
  id: string,
  idOnchain: number,
  name: string,
  banner: string,
  logo: string
  description: string,
  organization: string,
  website: string,
  telegram: string,
  twitter: string,
  facebook: string,
  instagram: string,
  discord: string,
  shortLink: string,
  isActivated: boolean,
  collection: Collection,
  rounds: Round[]
  details: { key: string, content: string }[]
}