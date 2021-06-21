import pg from 'pg'
import { Client } from 'ssh2'
import net from 'net'
import fs from 'fs'

export type JumphostInput = {
    uri: string
    keyFilePath: string
    port: number
    proxyPort: number
}

export type DatabaseInput = {
    uri: string
}
export type PgClientInput = {
    database: DatabaseInput
    jumphost?: JumphostInput

}

const createPgClient = async (options: PgClientInput) : Promise<pg.Client> =>{
    const pgClient = await new Promise<pg.Client>((resolve, reject)=> {
        if(options.jumphost) {
            if(!options.jumphost.uri || !options.jumphost.keyFilePath || !options.jumphost.port || !options.jumphost.proxyPort) {
                throw new Error('Missing params needed for instantiaing a tunnel to the database')
            }
            const uri = new URL(options.database.uri)
            const [jumphostUser, jumphost] = options.jumphost.uri.split('@')
            const jumphostPort = options.jumphost.port
            const jumphostKeyFilePath = options.jumphost.keyFilePath
            const proxyHost = '127.0.0.1'
            const proxyPort = options.jumphost.proxyPort
            const { hostname: pgHost, port: pgPort, username: dbUsername, password: dbPassword, pathname: dbName } = uri
            
            // Create a tunnel through the jumphost to connect to the database
            let ready = false
            const connection = new Client()
            const proxy = net.createServer((socket)=>{
                if(!ready) return socket.destroy()
                if(socket.remoteAddress && socket.remotePort) {
                    connection.forwardOut(socket.remoteAddress, socket.remotePort, pgHost, +pgPort, function(err, stream) {
                        if (err)
                            return socket.destroy();
                        socket.pipe(stream);
                        stream.pipe(socket);
                    });
                } else {
                    reject(new Error('Socket could not be created'))
                }
            })
            proxy.listen(proxyPort, proxyHost)

            connection.connect({
                host: jumphost,
                port: options.jumphost.port,
                username: jumphostUser,
                privateKey: fs.readFileSync(jumphostKeyFilePath)
            })
            connection.on('connect', ()=> {
                console.log(`Connecting to jumphost :: ${jumphostUser}@${jumphost}:${jumphostPort} using $${jumphostKeyFilePath}`)
            })
            connection.on('ready', ()=> {
                ready = true
                const connectionString = `postgresql://${dbUsername}:${dbPassword}@${proxyHost}:${proxyPort}${dbName}`
                console.log(`Connecting to db :: @${proxyHost}:${proxyPort}${dbName} `)
                const client = new pg.Client(connectionString);
                resolve(client)
            })
            connection.on('error', (err)=> {
                reject(err)
            })

        } else{
            resolve(new pg.Client(options.database.uri))
        }
    })
    return pgClient
}   

export {
    createPgClient
}
