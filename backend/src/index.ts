
import { getCronitor } from './util/cronitor'
const main = async () => {
    const cronitor = getCronitor()
    await cronitor?.run()
    try {
        console.log(`Running at ${new Date()}`)
        await cronitor?.complete()
    } catch (err) {
        await cronitor?.fail(err.message)
    }
}

;(async()=> {
    main()
})()
