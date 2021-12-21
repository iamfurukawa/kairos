import React, { useState, useEffect } from 'react'

import { Checkbox, Row, Col, Modal, Button } from 'antd'

import LocalStorageService from '../../services/local-storage'

const TagsModal = ({ visible = false, setVisible = () => { } }) => {

    const [checkedValues, setCheckedValues] = useState([])
    const [tags, setTags] = useState([])

    useEffect(() => {
        setCheckedValues([])
        setTags(LocalStorageService.getTags() || tagsLabel)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible])

    const onChange = (values) => setCheckedValues(values)

    const cancel = () => {
        setCheckedValues([])
        setVisible(false)
    }

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

    const onOkHandle = () => {
        LocalStorageService.saveTags(tags.filter(tag => !checkedValues.includes(tag)))
        setTags(LocalStorageService.getTags())
        setCheckedValues([])
        setVisible(false)
    }

    const reset = () => {
        LocalStorageService.saveTags(tagsLabel)
        setCheckedValues([])
        setVisible(false)
    }

    return (
        <Modal
            visible={visible}
            title="Remove Tags"
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
                    {tags.map(tag =>
                        <Col span={15}>
                            <Checkbox key={tag} value={tag}>{tag}</Checkbox>
                        </Col>
                    )}
                </Row>
            </Checkbox.Group>
        </Modal >
    )
}

export default TagsModal