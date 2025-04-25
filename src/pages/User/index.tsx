import classNames from "classnames/bind";
import styles from "./index.module.scss";
import { Layout } from "antd";
import UserMenu from "@components/MenuComponent/profile";
import { Outlet } from "react-router-dom";

const { Sider, Content } = Layout;

const cx = classNames.bind(styles);

const siderStyle: React.CSSProperties = {
  textAlign: "center",
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "white",
};

const layoutStyle = {
  borderRadius: 8,
  overflow: "hidden",
  width: "100%",
  maxWidth: "100%",
};

const UserPage = () => {
  return (
    <>
      <div className={cx("user-page")}>
        <div className={cx("user-page-container")}>
          <Layout style={layoutStyle}>
            <Sider width="full" style={siderStyle}>
              <UserMenu />
            </Sider>
            <Layout>
              <Content style={{ padding: "20px" }}>
                <Outlet />
              </Content>
            </Layout>
          </Layout>
        </div>
      </div>
    </>
  );
};

export default UserPage;
