import React from 'react'

import {
    Button,
    Modal,
    Form,
    Input,
} from 'antd'

import LocalStorageService from '../../services/local-storage'

const InitModal = ({ visible = false, setVisible = () => { } }) => {

    const [formInit] = Form.useForm()

    const modalInitHandleOk = () => {
        formInit.validateFields()
            .then(user => {
                formInit.resetFields()
                LocalStorageService.saveUserInfos(user)
                setVisible(false)
            })
            .catch(info => {
                console.log('Validate User Failed:', info)
            })
    }

    return (
        <Modal
            visible={visible}
            title="Welcome to Kairos!"
            onOk={modalInitHandleOk}
            closable={false}
            footer={[
                <Button form={formInit} key="submit" type="primary" onClick={modalInitHandleOk}>
                    Sign in
                </Button>,
            ]}
        >
            <Form
                form={formInit}
                layout={'vertical'}
            >
                <Form.Item
                    label="Your name"
                    name="name"
                    rules={[{ required: true, message: 'Please input your name!' }]}
                >
                    <Input placeholder='Arnold Schwarzenegger' />
                </Form.Item>

                <Form.Item
                    label="Jira URL"
                    name="jira-url"
                >
                    <Input placeholder='E.g. https://somename.atlassian.net/' />
                </Form.Item>

                <Form.Item
                    label="Jira API Key"
                    name="jira-api-key"
                    tooltip="Get token here: https://id.atlassian.com/manage-profile/security/api-tokens"
                >
                    <Input placeholder='E.g. 7oFV91HU9HFYI1ossryhA5A8' />
                </Form.Item>
            </Form>

        </Modal>
    )
}

export default InitModal