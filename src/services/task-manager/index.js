import moment from 'moment'
import 'moment-duration-format'

import _ from 'lodash'

import { v4 as uuidv4 } from 'uuid'

import LocalStorageService from '../local-storage'

const TaskManagerService = () => {

    const createOrUpdate = (taskForm, date, uuid = null) => {
        uuid ? update(taskForm, date, uuid) : create(taskForm, date)
    }

    const create = (taskForm, date) => {
        const taskLog = LocalStorageService.getTaskLog()
        const dateStr = moment(date).format('DD/MM/YYYY')
        const task = {
            uuid: uuidv4(),
            description: taskForm.description,
            startTime: taskForm['start-time'].format('HH:mm:ss'),
            endTime: taskForm['end-time']?.format('HH:mm:ss') || null,
            tags: taskForm.tags,
            workFor: taskForm['work-for'],
            jiraSync: false,
            jiraItem: taskForm['jira-item'] || null
        }

        if (taskLog[dateStr] && taskLog[dateStr].length > 0) {
            taskLog[dateStr] = [...taskLog[dateStr], task]
        } else {
            taskLog[dateStr] = [task]
        }

        LocalStorageService.saveTaskLog(taskLog)
    }

    const update = (taskForm, date, uuid) => {
        const dateStr = moment(date).format('DD/MM/YYYY')
        const tasks = LocalStorageService.getTaskLog();

        (tasks[dateStr] || []).forEach(task => {
            if (task.uuid === uuid) {
                task.description = taskForm.description
                task.startTime = taskForm['start-time'].format('HH:mm:ss')
                task.endTime = taskForm['end-time']?.format('HH:mm:ss') || null
                task.tags = taskForm.tags
                task.workFor = taskForm['work-for']
                task.jiraItem = taskForm['jira-item'] || null
            }
        })

        LocalStorageService.saveTaskLog(tasks)
    }

    const taskMapperToDataSource = (selectedDate) => {
        const taskLog = LocalStorageService.getTaskLog()
        const dateStr = moment(selectedDate).format('DD/MM/YYYY')
        return (taskLog[dateStr] || [])
            .map(task => ({
                key: task.uuid,
                task: task.jiraItem ? `${task.jiraItem} - ${task.description}` : `${task.workFor} - ${task.description}`,
                sync: task.jiraSync,
                time: task.endTime ? `${task.startTime} - ${task.endTime}` : `${task.startTime}`,
                tags: task.tags,
                jiraItem: task.jiraItem,
                workFor: task.workFor,
                startStop: !!task.endTime
            }))
    }

    const pauseTask = (taskToPause, selectedDate) => {
        const dateStr = moment(selectedDate).format('DD/MM/YYYY')
        const tasks = LocalStorageService.getTaskLog();
        (tasks[dateStr] || []).forEach(task => {
            if (task.uuid === taskToPause.key)
                task.endTime = moment().format('HH:mm:ss')
        })

        LocalStorageService.saveTaskLog(tasks)
    }

    const continueTask = (taskToContinue, selectedDate) => {
        const dateStr = moment(selectedDate).format('DD/MM/YYYY')
        const today = moment().format('DD/MM/YYYY')
        const tasks = LocalStorageService.getTaskLog()
        let clonedTask = null;

        (tasks[dateStr] || []).forEach(task => {
            if (task.uuid === taskToContinue.key)
                clonedTask = _.cloneDeep(task)
        })

        clonedTask.uuid = uuidv4()
        clonedTask.jiraSync = false
        clonedTask.endTime = null
        clonedTask.startTime = moment().format('HH:mm:ss')

        if (tasks[today] && tasks[today].length > 0) {
            tasks[today] = [...tasks[today], clonedTask]
        } else {
            tasks[today] = [clonedTask]
        }

        LocalStorageService.saveTaskLog(tasks)
    }

    const getDescriptions = (selectedDate) => {
        let days = 30
        const tasks = LocalStorageService.getTaskLog()

        let descriptions = []
        while (days--) {
            const dateStr = moment(selectedDate).subtract(days, 'days').format('DD/MM/YYYY')
            descriptions = [...descriptions, ...(tasks[dateStr] || []).map(task => ({ value: task.description }))]
        }

        descriptions = _.uniqBy(descriptions, 'value')

        return descriptions
    }

    const getJiraItems = (selectedDate) => {
        let days = 30
        const tasks = LocalStorageService.getTaskLog()

        let jiraItems = []
        while (days--) {
            const dateStr = moment(selectedDate).subtract(days, 'days').format('DD/MM/YYYY')
            jiraItems = [...jiraItems, ...(tasks[dateStr] || []).map(task => ({ value: task.jiraItem || null }))]
        }

        jiraItems = _.uniqBy(jiraItems, 'value')
        jiraItems = jiraItems.filter(e => e.value != null)

        return jiraItems
    }

    const removeTask = (uuid, selectedDate) => {
        const dateStr = moment(selectedDate).format('DD/MM/YYYY')
        const tasks = LocalStorageService.getTaskLog()
        tasks[dateStr] = (tasks[dateStr] || []).filter(task => task.uuid !== uuid)

        LocalStorageService.saveTaskLog(tasks)
    }

    const unSync = (uuid, selectedDate) => {
        const dateStr = moment(selectedDate).format('DD/MM/YYYY')
        const tasks = LocalStorageService.getTaskLog()

            (tasks[dateStr] || []).forEach(task => {
                if (task.uuid === uuid)
                    task.jiraSync = false
            })

        LocalStorageService.saveTaskLog(tasks)
    }

    const getTaskBy = (uuid = null, selectedDate = moment()) => {
        if (!uuid) return null
        const tasks = LocalStorageService.getTaskLog()
        const dateStr = moment(selectedDate).format('DD/MM/YYYY')
        let taskSelected = null;
        (tasks[dateStr] || []).forEach(task => {
            if (task.uuid === uuid)
                taskSelected = task
        })

        return taskSelected
    }

    const getDashboardByJiraIssue = (startData, endData) => {
        console.log(`Jira ${startData} ${endData}`)
        const tasks = LocalStorageService.getTaskLog()
        let data = []
        for (var m = moment(startData); m.isBefore(endData) || m.isSame(endData, 'day'); m.add(1, 'days')) {
            const currentDate = moment(m).format('DD/MM/YYYY');
            const dataOfCurrentDate = (tasks[currentDate] || []).map(task => {
                if (!task.endTime) return null

                return {
                    type: task.jiraItem || task.workFor,
                    value: moment.duration(moment(task.endTime, 'HH:mm:ss').diff(moment(task.startTime, 'HH:mm:ss'))).asSeconds()
                }
            })

            data.push(...dataOfCurrentDate)
        }

        data = _.omitBy(data, _.isNil)
        data = _(data)
            .groupBy((item) => {
                console.log(item)
                return item.type.toUpperCase()
            })
            .map((group) => {
                return {
                    type: group[0].type,
                    value: group.map(item => item.value).reduce((prev, curr) => prev + curr, 0)
                }
            }).value()

        return _.sortBy(data, 'value')

    }

    const getDashboardByTag = (startData, endData) => {
        console.log(`Tag ${startData} ${endData}`)
        const tasks = LocalStorageService.getTaskLog()
        let data = []
        for (var m = moment(startData); m.isBefore(endData) || m.isSame(endData, 'day'); m.add(1, 'days')) {
            const currentDate = moment(m).format('DD/MM/YYYY');
            const dataOfCurrentDate = (tasks[currentDate] || []).flatMap(task => {
                if (!task.endTime) return null

                return task.tags.map(tag => ({
                    type: tag,
                    value: moment.duration(moment(task.endTime, 'HH:mm:ss').diff(moment(task.startTime, 'HH:mm:ss'))).asSeconds()
                }))
            })

            data.push(...dataOfCurrentDate)
        }

        data = _.omitBy(data, _.isNil)
        data = _(data)
            .groupBy((item) => {
                return item.type.toUpperCase()
            })
            .map((group) => {
                return {
                    type: group[0].type,
                    value: group.map(item => item.value).reduce((prev, curr) => prev + curr, 0)
                }
            }).value()

        return _.sortBy(data, 'value')
    }

    return {
        createOrUpdate,
        taskMapperToDataSource,
        pauseTask,
        continueTask,
        getDescriptions,
        getJiraItems,
        removeTask,
        unSync,
        getTaskBy,
        getDashboardByJiraIssue,
        getDashboardByTag
    }
}

export default TaskManagerService()