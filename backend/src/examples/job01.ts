
import { getCronitor } from '../util/cronitor'
import { createPgClient, JumphostInput } from '../util/create-pg-client'
import config from '../config';
import nodemailer from 'nodemailer'
import { sendEmail } from '../util/notify';

const useJumphost = (): JumphostInput | undefined=> {
    if(config.get('jumphost.uri')) {
        return config.get('jumphost')
    }
    return
}

const main = async () => {
    const cronitor = getCronitor(config.get('cronitor.job01'))
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

        const mailer = nodemailer.createTransport(config.get('mailOpts'))
        const messageId = await sendEmail(mailer, {
            from: config.get('mailBody.from'),
            to: [config.get('mailBody.to')],
            subject: 'Cron job',
            html: JSON.stringify(result.rows)
        })
        console.log(`Sent mail ${messageId}`)


        await cronitor?.complete()
    } catch (err) {
        console.error(err)
        await cronitor?.fail(err.message) 
    }
}

;(async()=> {
    main()
})()
