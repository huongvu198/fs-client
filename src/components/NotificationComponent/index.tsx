import { BellOutlined } from "@ant-design/icons";
import { Badge, Dropdown, MenuProps } from "antd";
import classNames from "classnames/bind";
import { useState } from "react";
import styles from "./index.module.scss";

const cx = classNames.bind(styles);

interface Props {
  notifications: { id: number; message: string }[];
}

const Notification = ({ notifications }: Props) => {
  const [hasUnread, setHasUnread] = useState(true);

  const handleNotificationClick = () => setHasUnread(false);

  const notificationMenu: MenuProps["items"] = notifications.map((noti) => ({
    key: noti.id,
    label: <div>{noti.message}</div>,
  }));

  return (
    <Dropdown menu={{ items: notificationMenu }} trigger={["click"]}>
      <Badge count={hasUnread ? notifications.length : 0} offset={[2, 0]}>
        <BellOutlined
          className={cx("notification-icon")}
          onClick={handleNotificationClick}
        />
      </Badge>
    </Dropdown>
  );
};

export default Notification;
