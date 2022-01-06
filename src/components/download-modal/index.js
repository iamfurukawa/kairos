import { React, useState } from 'react'

import { Modal, DatePicker, notification } from 'antd'
import { SmileOutlined } from '@ant-design/icons'

import moment from 'moment'

import { ExportToCsv } from 'export-to-csv';

import LocalStorageService from '../../services/local-storage'

const DownloadModal = ({ visible = false, setVisible = () => { } }) => {
    const [startMonth, setStartMonth] = useState(moment().startOf('month'))
    const [endMonth, setEndMonth] = useState(moment().endOf('month'))

    const options = {
        showLabels: true,
        filename: `detailed_report_${startMonth.format('YYYYMMDD')}_${endMonth.format('YYYYMMDD')}`,
        useKeysAsHeaders: false,
        headers: ['Day', 'User', 'Time Entry', 'Project', 'Project Code', 'Client', 'Tags', 'Work Type', 'Start Time', 'End Time', 'Duration']
    };

    return (
        <Modal
            title="Report CSV"
            visible={visible}
            onOk={() => {
                notification.open({
                    message: 'Status',
                    description: 'Generating report!',
                    icon: <SmileOutlined style={{ color: '#108ee9' }} />,
                })

                const data = []
                const taskLog = LocalStorageService.getTaskLog()
                const user = LocalStorageService.getUserInfos()
                for (var m = moment(startMonth); m.isBefore(endMonth); m.add(1, 'days')) {
                    const dateStr = moment(m).format('DD/MM/YYYY')
                    const dayFormatted = moment(m).format('YYYY-MM-DD')

                    if (taskLog[dateStr] && taskLog[dateStr].length > 0)

                        data.push(...(taskLog[dateStr] || []).map(task => {
                            const diff = task.endTime ? moment.duration(moment(task.endTime, 'HH:mm:ss').diff(moment(task.startTime, 'HH:mm:ss'))) : null
                            return {
                                day: dayFormatted,
                                user: user.name,
                                timeEntry: `${task.jiraItem ? (task.jiraItem + ' - ') : ''}${task.description}`,
                                project: task.workFor,
                                projectCode: '',
                                client: task.workFor,
                                tags: task.tags.join(','),
                                workType: '',
                                startTime: task.startTime,
                                endTime: task.endTime || '',
                                duration: diff ? `${diff.hours()}:${String(diff.minutes()).padStart(2,'0')}:${String(diff.seconds()).padStart(2,'0')}` : '',
                            }
                        }))
                }

                const csvExporter = new ExportToCsv(options);
                csvExporter.generateCsv(data);

                setVisible(false)
            }}
            onCancel={() => setVisible(false)}
        >
            <p>Select a date interval for generate report: </p>
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

export default DownloadModal