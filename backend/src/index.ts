
import { getCronitor } from './util/cronitor'
import { createPgClient, JumphostInput } from './util/create-pg-client'
import config from './config';

const useJumphost = (): JumphostInput | undefined=> {
    if(config.get('jumphost.uri')) {
        return config.get('jumphost')
    }
    return
}

const main = async () => {
    const cronitor = getCronitor()
    await cronitor?.run()
    try {
        console.log(`Running at ${new Date()}`)
        
        const pgClient = await createPgClient({
            database: { uri: config.get('database.uri') },
            jumphost: useJumphost()
        })
        await pgClient.connect().then(()=>{ 
              console.log('Connected')
        })
        const result = await pgClient.query('SELECT 1+1;')
        console.log(result.rows)

        await pgClient.end()
        .then(() => console.log('Disconnected'))
        
        await cronitor?.complete()
    } catch (err) {
        console.error(err)
        await cronitor?.fail(err.message) 
    }
}

;(async()=> {
    main()
})()
