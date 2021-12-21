import axios from 'axios'

import LocalStorageService from "../local-storage"

const AxiosService = () => {

    const CORS_PROXY = 'https://cors-proxy-umber.vercel.app'
    const WORKLOG_URL = '/api/worklog'

    const api = axios.create({
        baseURL: CORS_PROXY,
    })

    const user = LocalStorageService.getUserInfos()

    const addWorklog = async (worklog) => {
        await api.post(WORKLOG_URL, { ...worklog, url: user['jira-url'] }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(user['jira-email'] + ':' + user['jira-api-key'], 'utf8').toString('base64')}`,
            }
        })
    }

    return {
        addWorklog
    }
}

export default AxiosService()