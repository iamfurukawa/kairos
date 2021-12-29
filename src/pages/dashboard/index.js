import React, { useState, useEffect } from 'react'

import { Pie, measureTextWidth } from '@ant-design/charts'
import { DatePicker, Select } from 'antd'

import moment from 'moment'

import TaskManagerService from '../../services/task-manager'

import styles from './dashboard.module.scss'

const DashboardPage = () => {

    const { Option } = Select

    const [startData, setStartDate] = useState(moment())
    const [endData, setEndDate] = useState(moment())
    const [data, setData] = useState([])
    const [filterSelected, setFilterSelected] = useState('jira')

    useEffect(() => {
        generateDashboard()
    }, [])

    useEffect(() => {
        generateDashboard()
    }, [filterSelected, startData, endData])

    const generateDashboard = () => {
        let result = []

        if (filterSelected === 'jira')
            result = TaskManagerService.getDashboardByJiraIssue(startData, endData)
        else
            result = TaskManagerService.getDashboardByTag(startData, endData)

        setData(result)
        console.log(result)
    }

    const handleChange = (value) => setFilterSelected(value)

    const renderStatistic = (containerWidth, text, style) => {
        const { width: textWidth, height: textHeight } = measureTextWidth(text, style);
        const R = containerWidth / 2; // r^2 = (w / 2)^2 + (h - offsetY)^2

        let scale = 1;

        if (containerWidth < textWidth) {
            scale = Math.min(Math.sqrt(Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2)))), 1);
        }

        const textStyleStr = `width:${containerWidth}px;`;
        return `<div style="${textStyleStr};font-size:${scale}em;line-height:${scale < 1 ? 1 : 'inherit'};">${text}</div>`;
    }

    const config = {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        innerRadius: 0.80,
        meta: {
            value: {
                formatter: (v) => `${v}`,
            },
        },
        label: {

            type: 'outer',
            animate: true,
            offset: '-50px',
            content: function content(_ref) {
                return `${moment.duration(_ref.value, 'seconds').format('D [day] H [hour and] m [min]')}`
            },
        },
        statistic: {
            title: {
                offsetY: -4,
                customHtml: (container, view, datum) => {
                    const { width, height } = container.getBoundingClientRect();
                    const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
                    const text = datum ? datum.type : 'Total';
                    return renderStatistic(d, text, {
                        fontSize: 28,
                    });
                },
            },
            content: {
                offsetY: 4,
                style: {
                    fontSize: '32px',
                },
                customHtml: (container, view, datum, data) => {
                    const { width } = container.getBoundingClientRect();
                    const text = datum ?
                        `${moment.duration(datum.value, 'seconds').format('D [day] H [hour and] m [min]')}`
                        :
                        `${moment.duration(data.reduce((r, d) => r + d.value, 0), 'seconds').format('D [day] H [hour and] m [min]')}`;
                    return renderStatistic(width, text, {
                        fontSize: 32,
                    });
                },
            },
        },
        interactions: [
            {
                type: 'element-selected',
            },
            {
                type: 'element-active',
            },
            {
                type: 'pie-statistic-active',
            },
        ],
    };

    return (
        <>
            <div className={styles.filter}>
                <Select defaultValue="jira" style={{ width: 120, marginRight: 20 }} onChange={handleChange}>
                    <Option value="jira">Jira Issue</Option>
                    <Option value="tag">Tag</Option>
                </Select>

                <DatePicker.RangePicker
                    defaultValue={[startData, endData]}
                    format="DD/MM/YYYY"
                    onChange={(value) => {
                        setStartDate(value[0])
                        setEndDate(value[1])
                    }}
                />
            </div>
            <Pie {...config} />
        </>
    )
}

export default DashboardPage
