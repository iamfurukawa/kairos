import React, { useState } from 'react'

import {
    Button,
    Modal,
    Form,
    Input,
    TimePicker,
    Select,
    Divider,
    Row,
    Col
} from 'antd'

import { PlusOutlined } from '@ant-design/icons'

import moment from 'moment'

import LocalStorageService from '../../services/local-storage'

const NewTaskModal = ({ visible = false, setVisible = () => { }, date }) => {
    const tagsLabel = [
        'Backend',
        'Frontend',

        'Investigação',
        'Levantamento de requisito',
        'Auxilio de chamados',
        'Resposta de chamado',

        'Desenvolvimento',
        'Teste',
        'Teste unitário',
        'Teste de integração',
        'Estudo',
        'Meta técnica',

        'Reunião',
        'Fornecedores',

        'Implantação',
        'Auxiliar no regressivo',

        'Rito',
        'Daily',
        'Refinement',
        'Planning',
        'Review',
        'Retrospective',

        'Fora de escopo',
        'Não especificado',

        'Platform Loan',
        'Api Proposta',
        'Digio Grana',
        'Pós Vendas',
        'Personal Loan Core',
        'Api Consulta Service Legado',
        'Api Cobranca',
        'Api Campanha'
    ]

    const [tags, setTags] = useState(LocalStorageService.getTags() || tagsLabel)
    const [newTag, setNewTag] = useState('')

    const [workType, setWorkType] = useState(LocalStorageService.getWorkType() || ['Opus', 'Digio'])
    const [newWorkType, setNewWorkType] = useState('')

    const [formNewTask] = Form.useForm()

    const { Option } = Select


    const modalNewTaskHandleOk = () => {
        formNewTask.validateFields()
            .then(taskForm => {
                formNewTask.resetFields()
                const taskLog = LocalStorageService.getTaskLog()
                const dateStr = moment(date).format('DD/MM/YYYY')

                const task = {
                    description: taskForm.description,
                    startTime: taskForm['start-time'].format('HH:mm:ss'),
                    endTime: (taskForm['end-time'] && taskForm['end-time'].format('HH:mm:ss')) || null,
                    tags: taskForm.tags,
                    workFor: taskForm['work-for'],
                    jiraSync: false,
                }

                if (taskLog[dateStr] && taskLog[dateStr].length > 0) {
                    taskLog[dateStr] = [...taskLog[dateStr], task]
                } else {
                    taskLog[dateStr] = [task]
                }

                LocalStorageService.saveTaskLog(taskLog)

                setVisible(false)
            })
            .catch(info => {
                console.log('Validate Task Failed:', info)
            })
    }

    const cancel = () => setVisible(false)


    const onNewWorkChange = event => setNewWorkType(event.target.value)

    const addNewWorkItem = () => {
        if (newWorkType === '') return

        setWorkType([...workType, newWorkType])
        LocalStorageService.saveWorkType([...workType, newWorkType])
        setNewWorkType('')
    }

    const onNewTag = event => setNewTag(event.target.value)

    const addNewTag = () => {
        if (newTag === '') return

        setTags([...tags, newTag])
        LocalStorageService.saveTags([...tags, newTag])
        setNewTag('')
    }

    return (
        <Modal
            visible={visible}
            title="New Task"
            onOk={modalNewTaskHandleOk}
            onCancel={cancel}
            footer={[
                <Button form={formNewTask} key="submit" type="primary" onClick={modalNewTaskHandleOk}>
                    Create
                </Button>,
            ]}
        >
            <Form
                form={formNewTask}
                layout={'vertical'}
            >
                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please input a description!' }]}
                >
                    <Input placeholder='Create a new controller' />
                </Form.Item>

                <Row>
                    <Col>
                        <Form.Item
                            label="Start Time"
                            name="start-time"
                            rules={[{ type: 'object', required: true, message: 'Please select a time!' }]}
                        >
                            <TimePicker defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} format={'HH:mm:ss'} />
                        </Form.Item>
                    </Col>
                    <Col offset={1}>
                        <Form.Item
                            label="End Time"
                            name="end-time"
                        >
                            <TimePicker defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} format={'HH:mm:ss'} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Form.Item
                            label="Jira Item"
                            name="jira-item"
                        >
                            <Input placeholder='E.g. COREP-1234' />
                        </Form.Item>
                    </Col>

                    <Col offset={1}>
                        <Form.Item
                            label="Work for"
                            name="work-for"
                            rules={[{ required: true, message: 'Please select one type!' }]}
                        >
                            <Select
                                style={{ width: 240 }}
                                placeholder="Select one"
                                dropdownRender={menu => (
                                    <div>
                                        {menu}
                                        <Divider style={{ margin: '4px 0' }} />
                                        <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                            <Input style={{ flex: 'auto' }} value={newWorkType} onChange={onNewWorkChange} />
                                            <a
                                                style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                                                onClick={addNewWorkItem}
                                            >
                                                <PlusOutlined /> Add item
                                            </a>
                                        </div>
                                    </div>
                                )}
                            >
                                {workType.map(item => (
                                    <Option key={item}>{item}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="Tags"
                    name="tags"
                    label="tags"
                    rules={[{ required: true, message: 'Please select some tags!', type: 'array' }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Please select some tags"
                        dropdownRender={menu => (
                            <div>
                                {menu}
                                <Divider style={{ margin: '4px 0' }} />
                                <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                    <Input style={{ flex: 'auto' }} value={newTag} onChange={onNewTag} />
                                    <a
                                        style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                                        onClick={addNewTag}
                                    >
                                        <PlusOutlined /> Add item
                                    </a>
                                </div>
                            </div>
                        )}>
                        {tags.map(item => (
                            <Option key={item}>{item}</Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default NewTaskModal