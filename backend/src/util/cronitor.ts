import { URL } from 'url'
import axios from 'axios'

export const getCronitor = (cronitorLink: string) : Cronitor => {
    /**
   * Utility method to build Cronitor ping url
   * @param action Type of ping action
   * @param message Optional message for Cronitor ping
   */
  const buildUrl = (action: string, message?: string): string => {
    const url = new URL(`${cronitorLink}/${action}`)
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
  return {
    run, complete, fail
  }

}

export interface Cronitor {
    run: () => Promise<void>
    complete: () => Promise<void>
    // eslint-disable-next-line no-unused-vars
    fail: (message?: string) => Promise<void>
}
