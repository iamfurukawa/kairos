import React from 'react'

import moment from 'moment'

import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { DatePicker } from 'antd'

import styles from './datePagination.module.scss'

const DatePagination = ({ selectedDate, setSelectedDate }) => {
    return (
        <div className={styles.container} >
            <LeftOutlined className={styles.icon} onClick={() => setSelectedDate(moment(selectedDate).subtract(1, 'days'))} />
            <DatePicker size={'large'} defaultValue={selectedDate} value={selectedDate} format={'DD/MM/yyyy'} onChange={(date, _) => setSelectedDate(date)} allowClear={false} />
            <RightOutlined className={styles.icon} onClick={() => setSelectedDate(moment(selectedDate).add(1, 'days'))} />
        </div>
    )
}

export default DatePagination