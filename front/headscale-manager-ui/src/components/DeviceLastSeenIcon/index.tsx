import { CheckCircleFilled, ExclamationCircleFilled, QuestionCircleFilled } from "@ant-design/icons";
import { Badge, Tooltip, theme } from "antd";
import moment from "moment";
import React from "react";

interface DeviceLastSeenIconProps {
    lastSeen: Date
}

enum IconType {
    SUCCESS,
    WARNING,
    FAIL,
}

function getIconType(date: Date) {
    let currentTime = new Date();
    let timeDifference = Math.round((currentTime.getTime() - date.getTime()) / 1000);
    if (timeDifference < 3600) {
        return IconType.SUCCESS;
    } else if (timeDifference < 86400) {
        return IconType.WARNING;
    } else {
        return IconType.FAIL;
    }
}

function timeSince(date: Date) {
    return moment(date).locale("zh_CN").fromNow()
}

function getIconTypeNode(iconType: IconType) {
    const style: React.CSSProperties = { paddingLeft: "4px", paddingRight: "8px" }
    switch (iconType) {
        case IconType.SUCCESS:
            return <Badge style={style} status="success" />
        case IconType.WARNING:
            return <Badge style={style} status="warning" />
        case IconType.FAIL:
            return <Badge style={style} status="default" />
    }
}

const DeviceLastSeenIcon: React.FC<DeviceLastSeenIconProps> = ({ lastSeen }) => {

    const iconType = getIconType(lastSeen);
    return <Tooltip title={() => timeSince(lastSeen)}>
        {getIconTypeNode(iconType)}
    </Tooltip>

}

export default DeviceLastSeenIcon;