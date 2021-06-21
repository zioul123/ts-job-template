import { URL } from 'url'
import axios from 'axios'
import config from '../config'

const CRONITOR_LINK = config.get('cronitor.link')

/**
 * Utility method to build Cronitor ping url
 * @param action Type of ping action
 * @param message Optional message for Cronitor ping
 */
const buildUrl = (action: string, message?: string): string => {
  const url = new URL(`${CRONITOR_LINK}/${action}`)
  if (message) {
    url.searchParams.append('message', message)
  }
  return url.toString()
}

/**
 * Inform Cronitor that job has started
 */
const run = async (): Promise<void> => {
  const url = buildUrl('run')
  return axios.get(url)
}

/**
 * Inform Cronitor that job has completed
 */
const complete = (): Promise<void> => {
  const url = buildUrl('complete')
  return axios.get(url)
}

/**
 * Inform Cronitor that job has failed
 * @param message
 */
const fail = (message?: string): Promise<void> => {
  const url = buildUrl('fail', message)
  return axios.get(url)
}

export interface Cronitor {
    run: () => Promise<void>
    complete: () => Promise<void>
    // eslint-disable-next-line no-unused-vars
    fail: (message?: string) => Promise<void>
}

/**
 * Returns Cronitor only if code is provided
 */
export const getCronitor = (): Cronitor | null => {
  if (!CRONITOR_LINK) return null
  return {
    run,
    complete,
    fail,
  }
}