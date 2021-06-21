/**
 * @file Configuration
 * All defaults can be changed
 */
import convict from 'convict'

/**
 * To require an env var without setting a default,
 * use
 *    default: '',
 *    format: 'required-string',
 *    sensitive: true,
 */
convict.addFormats({
  'required-string': {
    validate: (val: unknown): void => {
      if (val === '') {
        throw new Error('Required value cannot be empty')
      }
    },
    coerce: <T extends unknown>(val: T): T | undefined => {
      if (val === null) {
        return undefined
      }
      return val
    },
  },
})

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'staging'],
    default: 'production',
    env: 'NODE_ENV'
  },
  cronitor: {
    link: {
      doc: 'The telemetry link. Eg. https://cronitor.link/p/123/ABC',
      env: 'CRONITOR_LINK',
      default: '',
    }
  },
  database: {
    uri: {
      doc: 'URI to database',
      env: 'DB_URI',
      default: '',
      format: 'required-string',
      sensitive: true
    }
  },
  jumphost: {
    uri: {
      doc: 'URI to jumphost Eg. ec2-user@12.12.12.12',
      env: 'JUMPHOST_URI',
      default: '',
    },
    keyFilePath: {
      doc: 'File path to the identity keypair for connecting to jumphost',
      env: 'JUMPHOST_KEY_FILE_PATH',
      default: ''
    },
    port: {
      doc: 'Port to connect to jumphost',
      env: 'JUMPHOST_PORT',
      default: 22
    },
    proxyPort: {
      doc: 'Port to use on localhost for tunneling to the database',
      env: 'JUMPHOST_PROXY_PORT',
      default: 9090,
    }
  }
})

config.validate({ strict: true })
export default config
