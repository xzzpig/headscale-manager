import { Machine, MachinesQueryResult, useDeleteMachineMutation, useMachinesQuery, useRoutesQuery, useSaveMachineMutation } from "@/graphql/codegen";
import { ReloadOutlined } from "@ant-design/icons";
import { EditableProTable, ProColumns } from "@ant-design/pro-components";
import { Button, message } from "antd";
import React, { useState } from "react";

const columns: ProColumns<Machine>[] = [
    {
        title: "名称",
        dataIndex: "name",
        formItemProps: () => {
            return {
                rules: [{ required: true, message: '此项为必填项' }],
            };
        },
    },
    {
        title: "操作",
        width: 16 * 8,
        valueType: "option",
        render: (text, record, _, action) => [
            <a key="editable"
                onClick={() => {
                    action?.startEditable?.(record.id!!)
                }}>编辑</a>,

        ],
        renderFormItem: (schema, config, form, action) => [
            <a key="save"
                onClick={() => {
                    action?.saveEditable?.(config.recordKey!!)
                }}>保存</a>
        ],
    }
]

const NEW_KEY = '-'

const MachineTable: React.FC = (props) => {
    type MachineType = NonNullable<NonNullable<NonNullable<NonNullable<MachinesQueryResult>["data"]>["machines"]>[0]>

    const { loading, refetch } = useMachinesQuery({
        onError: (e) => {
            messageApi.error('查询失败:' + (e.message))
        },
        onCompleted(data) {
            setMachines(data.machines as any)
        },
    });
    const [saveMachine, { loading: saving }] = useSaveMachineMutation()
    const [deleteMachine, { loading: deleting }] = useDeleteMachineMutation()
    const [machines, setMachines] = useState<readonly MachineType[]>()
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const [messageApi, contextHolder] = message.useMessage();

    const doRefresh = async () => {
        setRefreshing(true)
        try {
            return await refetch();
        } catch (e: any) {
            messageApi.error('刷新失败:' + (e?.message ?? e));
            setMachines([])
        } finally {
            setRefreshing(false);
        }
    }
    
    return (<>
    {contextHolder}
            <EditableProTable<MachineType>
                rowKey="id"
                // scroll={{ y: 'calc(100vh - 290px)' }}
                scroll={{ y: 'calc(100vh - 250px)' }}
                loading={loading || saving || deleting || refreshing}
                value={machines}
                // pagination={{
                //     // pageSize:3,
                //     responsive: true,
                // }}
                search={false}
                columns={columns}
                toolbar={{
                    title: '机器',
                    actions: [
                        <Button
                            icon={<ReloadOutlined spin={refreshing} />}
                            onClick={async () => {
                                await doRefresh()
                            }} />,
                    ],
                }}
                recordCreatorProps={{
                    record: () => ({
                        id: NEW_KEY,
                    })
                }}
                editable={{
                    deletePopconfirmMessage: '确定删除吗？',
                    onSave: async (rowKey, data, row) => {
                        console.log("onSave", rowKey, data, row)
                        await saveMachine({
                            variables: {
                                machineInput: {
                                    id: data.id == NEW_KEY ? undefined : data.id,
                                    name: data.name,
                                }
                            },
                            onError: (e) => {
                                messageApi.error('保存失败:' + (e.message))
                            }
                        })
                        await doRefresh()
                    },
                    onDelete: async (rowKey, row) => {
                        console.log("onDelete", rowKey, row)
                        await deleteMachine({
                            variables: {
                                machineID: row.id!!
                            },
                            onError: (e) => {
                                messageApi.error('删除失败:' + (e.message))
                            }
                        })
                        await doRefresh()
                    },
                    actionRender: (row, config, defaultDom) => [
                        defaultDom.save,
                        defaultDom.cancel,
                        defaultDom.delete,
                    ]
                }} />
    </>)
}

export default MachineTable