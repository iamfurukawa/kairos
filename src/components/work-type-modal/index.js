import React, { useState, useEffect } from 'react'

import { Checkbox, Row, Col, Modal, Button } from 'antd'

import LocalStorageService from '../../services/local-storage'

const WorkTypeModal = ({ visible = false, setVisible = () => { } }) => {

    const [checkedValues, setCheckedValues] = useState([])
    const [workTypes, setWorkTypes] = useState([])

    useEffect(() => {
        setCheckedValues([])
        setWorkTypes(LocalStorageService.getWorkType() || workTypeLabel)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible])

    const onChange = (values) => setCheckedValues(values)

    const cancel = () => {
        setCheckedValues([])
        setVisible(false)
    }

    const workTypeLabel = ['Opus', 'Digio']

    const onOkHandle = () => {
        LocalStorageService.saveWorkType(workTypes.filter(wt => !checkedValues.includes(wt)))
        setWorkTypes(LocalStorageService.getWorkType())
        setCheckedValues([])
        setVisible(false)
    }

    const reset = () => {
        LocalStorageService.saveWorkType(workTypeLabel)
        setCheckedValues([])
        setVisible(false)
    }

    return (
        <Modal
            visible={visible}
            title="Remove Work Types"
            onOk={onOkHandle}
            onCancel={cancel}
            footer={[
                <Button key="reset" type="link" onClick={reset}>
                    Reset All
                </Button>,
                <Button key="cancel" onClick={cancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={onOkHandle}>
                    OK
                </Button>,
            ]}
        >
            <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
                <Row>
                    {workTypes.map(wt =>
                        <Col span={15}>
                            <Checkbox key={wt} value={wt}>{wt}</Checkbox>
                        </Col>
                    )}
                </Row>
            </Checkbox.Group>
        </Modal >
    )
}

export default WorkTypeModal