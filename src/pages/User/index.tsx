import classNames from "classnames/bind";
import styles from "./index.module.scss";
import { Layout } from "antd";
import UserMenu from "@components/MenuComponent/profile";
import { Outlet } from "react-router-dom";

const { Sider, Content } = Layout;

const cx = classNames.bind(styles);
const contentStyle: React.CSSProperties = {
  textAlign: "center",
  minHeight: 120,
  lineHeight: "120px",
  color: "#333", // Dark text color for better readability
  backgroundColor: "#f4f5f7", // Lighter background to differentiate from sidebar
  padding: "20px", // Add some padding around the content
};

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
              <Content style={contentStyle}>
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
