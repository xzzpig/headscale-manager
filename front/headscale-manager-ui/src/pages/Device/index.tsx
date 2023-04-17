import DeviceCard from "@/components/DeviceCard";
import { HmachinesQueryResult, useHmachinesQuery } from "@/graphql/codegen";
import { ReloadOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import { Button, message } from "antd";
import { EventEmitter } from "events";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";

const ButtonGroup = Button.Group;

const reactNode: React.FC = () => {
    type MachineType = NonNullable<NonNullable<NonNullable<NonNullable<NonNullable<HmachinesQueryResult>["data"]>["headscale"]>["machines"]>[0]>
    const [machines, setMachines] = useState<readonly MachineType[]>()
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const { loading, refetch } = useHmachinesQuery({
        onError: (e) => {
            messageApi.error('查询失败:' + (e.message))
        },
        onCompleted(data) {
            setMachines(data.headscale?.machines)
            eventEmitter.emit("NEW_MACHINES")
        },
        pollInterval: 60000, //refresh every minute
    });
    const [messageApi, contextHolder] = message.useMessage();
    const [eventEmitter] = useState(new EventEmitter())

    const doRefresh = async () => {
        setRefreshing(true)
        try {
            return await refetch({
            });
        } catch (e: any) {
            messageApi.error('刷新失败:' + (e?.message ?? e));
            setMachines([])
        } finally {
            setRefreshing(false);
        }
    }

    const doRefreshDebounce = useCallback(debounce(doRefresh, 500), [refetch])

    useEffect(() => {
        eventEmitter.on("DO_REFRESH_MACHINES", () => {
            doRefreshDebounce()
        })
    }, [eventEmitter, refetch])

    return (
        <PageContainer
            header={{
                title: "设备",
                extra: [<ButtonGroup key="buttons">
                    <Button
                        key="refresh"
                        onClick={async () => {
                            await doRefresh()
                        }} >
                        <ReloadOutlined spin={refreshing || loading} />
                    </Button>
                </ButtonGroup>]
            }}>
            {contextHolder}
            {machines?.map((machine) => <DeviceCard key={machine.id} machine={machine} eventEmitter={eventEmitter} />)}

        </PageContainer>
    );
}

export default reactNode