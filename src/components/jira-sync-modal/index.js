import React, { useState } from 'react'

import { DatePicker, Modal, notification } from 'antd'

import moment from 'moment'

import LocalStorageService from '../../services/local-storage'
import JiraService from '../../services/jira'
import { FrownOutlined } from '@ant-design/icons'

const JiraSyncModal = ({ visible = false, setVisible = () => { } }) => {
    const [startMonth, setStartMonth] = useState(moment())
    const [endMonth, setEndMonth] = useState(moment())
    const [confirmLoading, setConfirmLoading] = useState(false);

    return (
        <Modal
            title="Jira Sync"
            visible={visible}
            confirmLoading={confirmLoading}
            onOk={async() => {
                setConfirmLoading(true)

                const user = LocalStorageService.getUserInfos()

                if (!user?.['jira-url'] || !user?.['jira-api-key'] || !user?.['jira-email']) {
                    notification.open({
                        message: 'Status',
                        description: 'You don\'t have credentials! Please edit your user on configuration menu.',
                        icon: <FrownOutlined style={{ color: '#FF0000' }} />,
                    })

                    setConfirmLoading(false)
                    setVisible(false)
                    return
                }

                const taskLog = LocalStorageService.getTaskLog()
                for (var m = moment(startMonth); m.isBefore(endMonth) || m.isSame(endMonth, 'day'); m.add(1, 'days')) {
                    const dateStr = moment(m).format('DD/MM/YYYY')
                    if (taskLog[dateStr] && taskLog[dateStr].length > 0) {
                        const taskUpdated = []

                        //taskLog[dateStr].forEach(task => taskUpdated.push(JiraService.syncTask(task, dateStr)))

                        const promises = taskLog[dateStr].map(async(task) => {
                            const taskSynced = await JiraService.syncTask(task, dateStr)
                            taskUpdated.push(taskSynced)
                        })

                        await Promise.all(promises)

                        const tasks = LocalStorageService.getTaskLog()
                        tasks[dateStr] = taskUpdated
                        LocalStorageService.saveTaskLog(tasks)
                    }
                }

                setConfirmLoading(false)
                setVisible(false)
            }}
            onCancel={() => setVisible(false)}
        >
            <p>Select a date interval for sync: </p>
            <DatePicker.RangePicker
                defaultValue={[startMonth, endMonth]}
                format="DD/MM/YYYY"
                onChange={(value, _) => {
                    setStartMonth(value[0])
                    setEndMonth(value[1])
                }}
            />
        </Modal>
    )
}

export default JiraSyncModal
