import { CheckCircleFilled, CheckCircleOutlined, CheckSquareOutlined, DeleteFilled, EditFilled, IssuesCloseOutlined, LoadingOutlined, MinusCircleFilled, MinusCircleOutlined, MinusSquareOutlined, MoreOutlined, PlusOutlined, QuestionCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import { ProDescriptions } from "@ant-design/pro-components";
import { Col, Collapse, Dropdown, Input, InputRef, List, Row, Space, Spin, Tag, Tooltip } from "antd";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { HmachinesQueryResult, useEnableHRouteMutation, useHmachineLazyQuery, useMachinesLazyQuery, useRenameHMachineMutation, useSetHMachineTagsMutation } from "../../graphql/codegen";
import DeviceLastSeenIcon from "../DeviceLastSeenIcon";
import _, { debounce } from "lodash"
import { EventEmitter } from "events"
const { Panel } = Collapse;

type MachineType = NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<HmachinesQueryResult>["data"]>["headscale"]>["machines"]>[0]>

interface DeviceCardProps {
    machine: MachineType
    eventEmitter: EventEmitter
}

const DeviceCard: React.FC<DeviceCardProps> = ({ machine, eventEmitter }) => {
    const lastSeen = new Date(parseInt((machine?.lastSeen?.seconds + "" + machine?.lastSeen?.nanos).substring(0, 13)))
    const [renameMachine] = useRenameHMachineMutation()
    const [changeTags, { loading }] = useSetHMachineTagsMutation()
    const doChangeTags = async (tags: string[]) => {
        await changeTags({
            variables: {
                machineId: machine.id,
                tags: tags,
            }
        })
        eventEmitter.emit("DO_REFRESH_MACHINES")
    }
    const doChangeTagsDebounce = useCallback(debounce(doChangeTags, 500), [changeTags])

    const [tags, setTags] = useState(() => machine.forcedTags)
    const [tagChanging, setTagChanging] = useState(false)
    useEffect(() => {
        setTags(machine.forcedTags)
    }, [machine.forcedTags])
    useEffect(() => {
        if (!tagChanging) return;
        eventEmitter.once("NEW_MACHINES", () => setTagChanging(false))
        doChangeTagsDebounce(tags)
        // setTagChanging(false)//TODO
    }, [tags])
    const doSetTags = (tags: string[]) => {
        setTagChanging(true)
        setTags(tags)
    }
    const addTag = (tag: string) => {
        if (!tag.startsWith("tag:")) tag = "tag:" + tag
        doSetTags([...tags, tag])
    }
    const removeTag = (tag: string) => {
        if (!tag.startsWith("tag:")) tag = "tag:" + tag
        doSetTags(tags.filter(t => t !== tag))
    }

    const [nameInput, setNameInput] = useState(false)

    return <Collapse key={machine.id} expandIconPosition="end" >
        <Panel
            key={machine.id}
            header={
                <Row>
                    <Col span={6}><DeviceName machine={machine} inputVisible={nameInput} onInputConfirm={async (newName) => {
                        await renameMachine({
                            variables: {
                                machineId: machine.id,
                                newName: newName
                            }
                        })
                        return new Promise<void>((resolve, reject) => {
                            eventEmitter.emit("DO_REFRESH_MACHINES")
                            eventEmitter.once("NEW_MACHINES", () => {
                                setNameInput(false)
                                resolve()
                            })
                        })
                    }} /></Col>
                    <Col span={18}><Space wrap size={0}>{[<NewDeviceTag key="NEW" onInputConfirm={async (value) => {
                        await new Promise<void>((resolve, reject) => {
                            addTag(value)
                            eventEmitter.once("NEW_MACHINES", () => resolve())
                        })
                    }}>NEW</NewDeviceTag>, ...machine.forcedTags.map(tag => <DeviceTag key={tag} title={tag.replace("tag:", "")} onClose={() => {
                        return new Promise<void>((resolve, reject) => {
                            removeTag(tag)
                            eventEmitter.once("NEW_MACHINES", () => resolve())
                        })
                    }} />)]}</Space></Col>
                </Row>}
            extra={
                <Space onClick={e => e.stopPropagation()}>
                    <Dropdown
                        menu={{
                            items: [
                                {
                                    label: '修改名称',
                                    key: 'edit',
                                    icon: <EditFilled />,
                                    onClick: () => setNameInput(true)
                                },
                                {
                                    label: '删除',
                                    key: 'delete',
                                    icon: <DeleteFilled />,
                                    danger: true,
                                },
                            ]
                        }} >
                        <MoreOutlined />
                    </Dropdown>
                </Space>
            }
        >
            <ProDescriptions style={{ margin: "-16px" }} bordered size="small" dataSource={machine} column={1} columns={[
                {
                    label: "名称",
                    dataIndex: "name"
                },
                {
                    label: "IP地址",
                    dataIndex: "ip_addresses",
                    render(dom, entity, index, action, schema) {
                        return <Space wrap size={0}>{entity.ipAddresses.map((ip, index) => <Tag key={index} bordered={false}>{ip}</Tag>)}</Space>
                    },
                },
                {
                    label: "最后在线",
                    dataIndex: "last_seen",
                    render(dom, entity, index, action, schema) {
                        return moment(lastSeen).locale("zh_CN").format()
                    },
                },
                {
                    label: "所属用户",
                    dataIndex: ["user", "name"],
                },
                {
                    label: "路由",
                    dataIndex: "routes",
                    render(dom, entity, index, action, schema) {
                        return <List>{entity.routes.map((route) => <RouteButton key={route.prefix} route={route} eventEmitter={eventEmitter} />)}</List>
                    }
                },
            ]}>
            </ProDescriptions>
        </Panel>
    </Collapse>
}

const RouteButton: React.FC<{
    route: MachineType["routes"][0],
    eventEmitter: EventEmitter,
}> = ({ route, eventEmitter }) => {
    const [enableRoute, { loading }] = useEnableHRouteMutation()
    const [refreshing, setRefreshing] = useState(false)

    const action = route.enabled ? "禁用" : "启用"

    return <Dropdown.Button
        type={route.enabled ? "default" : "dashed"}
        menu={{
            items: [
                {
                    label: '删除',
                    key: 'delete',
                    icon: <DeleteFilled />,
                    danger: true,
                },
            ]
        }}
        onClick={() => {
            if (refreshing) return
            setRefreshing(true)
            eventEmitter.once("NEW_MACHINES", () => {
                setRefreshing(false)
            })
            enableRoute({
                variables: {
                    routeId: route.id,
                    enable: !route.enabled
                }
            }).then(({ errors }) => {
                eventEmitter.emit("DO_REFRESH_MACHINES", errors)
            }).catch(err => {
                eventEmitter.emit("DO_REFRESH_MACHINES", err)
            })
        }}
    ><Tooltip title={loading ? action + "路由中" :
        refreshing ? "刷新信息中" :
            action + "路由"}>{
                loading ? <LoadingOutlined spin /> :
                    refreshing ? <QuestionCircleOutlined /> :
                        route.enabled ? <CheckCircleOutlined /> : <MinusCircleOutlined />}</Tooltip>
        {route.prefix}
    </Dropdown.Button>
}

interface DeviceTagProps {
    title: string
    maxLength?: number
    onClose?: (e: React.MouseEvent<HTMLElement>) => Promise<void>;
}

const DeviceTag: React.FC<DeviceTagProps> = ({ title, maxLength, onClose }) => {
    maxLength = maxLength ?? 10
    // title = title.length > maxLength ? title.slice(0, maxLength) + "..." : title
    const isLong = title.length > maxLength
    const [closing, setClosing] = useState(false)

    const tagEle = <Tag
        closable
        closeIcon={closing ? <LoadingOutlined spin /> : undefined}
        onClose={(e) => {
            e.preventDefault()
            setClosing(true)
            if (onClose) {
                onClose(e).finally(() => setClosing(false))
            }
        }}>{isLong ? `${title.slice(0, maxLength)}...` : title}</Tag>;

    return isLong ? <Tooltip title={title} key={title}>{tagEle}</Tooltip> : tagEle
}


interface NewDeviceTagProps {
    placeholder?: string
    onInputConfirm?: (value: string) => Promise<void>
}

const NewDeviceTag: React.FC<NewDeviceTagProps & React.PropsWithChildren> = ({
    children,
    placeholder,
    onInputConfirm,
}) => {
    const [inputVisible, setInputVisible] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<InputRef>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputConfirm = async () => {
        setConfirming(true)
        if (inputValue) {
            await onInputConfirm?.(inputValue)
        }
        setConfirming(false)
        setInputVisible(false);
        setInputValue("");
    };

    useEffect(() => {
        if (inputVisible) {
            inputRef.current?.focus();
        } else {
            inputRef.current?.blur()
        }
    }, [inputVisible]);

    return inputVisible ? <Input
        ref={inputRef}
        prefix={confirming ? <LoadingOutlined spin /> : undefined}
        placeholder={placeholder}
        type="text"
        size="small"
        style={{ width: 78, verticalAlign: "top", marginRight: "8px" }}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputConfirm}
        onPressEnter={handleInputConfirm}
    /> : <Tag onClick={(e) => {
        e.stopPropagation();
        setInputVisible(true);
    }} style={{ borderStyle: "dashed" }}>{children}<PlusOutlined className="ant-tag-close-icon" /></Tag>
}


const DeviceName: React.FC<{
    machine: MachineType
    inputVisible: boolean
    onInputConfirm: (value: string) => Promise<void>
}> = ({ machine, inputVisible, onInputConfirm }) => {
    const lastSeen = new Date(parseInt((machine?.lastSeen?.seconds + "" + machine?.lastSeen?.nanos).substring(0, 13)))

    const [confirming, setConfirming] = useState(false);
    const [inputValue, setInputValue] = useState(machine.givenName);
    const inputRef = useRef<InputRef>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputConfirm = async () => {
        setConfirming(true)
        await onInputConfirm(inputValue)
        setConfirming(false)
        setInputValue("");
    };

    useEffect(() => {
        if (inputVisible) {
            inputRef.current?.focus();
        }
    }, [inputVisible]);

    return inputVisible ? <Input
        ref={inputRef}
        prefix={confirming ? <LoadingOutlined spin /> : undefined}
        placeholder={machine.givenName}
        type="text"
        size="small"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputConfirm}
        onPressEnter={handleInputConfirm}
    /> : <><DeviceLastSeenIcon lastSeen={lastSeen} />{machine.id?.toString()?.padStart(2, " ") + ": " + machine.givenName ?? machine.name}</>
}

export default DeviceCard