import axios, { AxiosResponse } from 'axios'
import { Transporter } from 'nodemailer'
import { Attachment } from 'nodemailer/lib/mailer'

export type EmailInput = {
    from: string
    to: string[]
    subject: string
    html: string
    attachments? : Attachment[]
}

export type SlackHookInput = {
    uri: string
    text: string
}

const sendEmail = async (transporter: Transporter, email: EmailInput) : Promise<string> => {
    return new Promise((resolve, reject)=>{
        transporter.sendMail(email, (err, info)=>{
            if (err!==null) {
                reject(err)
            } else{
                resolve(info.messageId)
            }
        })
    })
}

const sendToSlackHook = (slack: SlackHookInput) : Promise<AxiosResponse> => {
    return axios.post(slack.uri, { text: slack.text })
}

export {
    sendEmail,
    sendToSlackHook
}