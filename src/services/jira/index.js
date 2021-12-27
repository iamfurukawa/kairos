import AxiosService from '../axios'

import { notification } from 'antd'

import { FrownOutlined, SmileOutlined } from '@ant-design/icons'

import moment from 'moment'

const JiraService = () => {
    const syncTask = async (task, date) => {

        if (task.jiraSync) return task

        if (!task.jiraItem) {
            notification.open({
                message: 'Status',
                description: <> <span>Task </span> <span> <b> {task.description} </b> </span> <span> without <b>Jira Item!</b></span></>,
                icon: <FrownOutlined style={{ color: '#FF0000' }} />,
            })

            return task
        }

        if (!task.endTime) {
            notification.open({
                message: 'Status',
                description: <> <span>Task </span> <span> <b> {task.jiraItem} </b> </span> <span> without <b>end time!</b></span></>,
                icon: <FrownOutlined style={{ color: '#FF0000' }} />,
            })

            return task
        }

        const timeSpentSeconds = moment.duration(moment(task.endTime, 'HH:mm:ss').diff(moment(task.startTime, 'HH:mm:ss')))

        if (timeSpentSeconds.asSeconds() < 61) {
            notification.open({
                message: 'Status',
                description: <> <span>Task </span> <span> <b> {task.jiraItem} </b> </span> <span> minimum time not reached!</span></>,
                icon: <FrownOutlined style={{ color: '#FF0000' }} />,
            })

            return task
        }

        try {
            await AxiosService.addWorklog({
                "timeSpentSeconds": timeSpentSeconds.asSeconds(),
                "comment": task.description,
                "issue": task.jiraItem,
                "started": moment(date + ' ' + task.startTime, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DDTHH:mm:ss.SSSZZ')
            })

            notification.open({
                message: 'Status',
                description: `Task ${task.description} synced!`,
                icon: <SmileOutlined style={{ color: '#00FF00' }} />,
            })

            return { ...task, jiraSync: true }
        } catch (e) {
            console.log(e)
            notification.open({
                message: 'Status',
                description: <> <span>Task </span> <span> <b> {task.jiraItem} </b> </span> <span> not synced!</span></>,
                icon: <FrownOutlined style={{ color: '#FF0000' }} />,
            })
            return task
        }
    }


    return {
        syncTask
    }
}

export default JiraService()