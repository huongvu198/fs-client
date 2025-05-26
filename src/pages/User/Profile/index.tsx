import { Form, Input, Button, Card, Skeleton } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { changePassword, updateProfileApi } from "@redux/userSlice";
import { ApiDispatch } from "@redux/index";
import { useReduxSelector } from "@hooks/useRedux";

const { Item } = Form;

const ProfilePage = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const dispatch = useDispatch<ApiDispatch>();

  const { data, loading, loadingAction, loadingActionChangePassword } =
    useReduxSelector((state) => state.user);

  const onProfileFinish = (values: any) => {
    const formatted = {
      ...values,
    };
    dispatch(updateProfileApi(formatted));
  };

  const onPasswordFinish = (values: any) => {
    const { currentPassword, newPassword } = values;
    dispatch(changePassword({ currentPassword, newPassword }));
  };

  return (
    <>
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <>
          <Card title="Hồ sơ của tôi" className="profile-card">
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1 0 70%", textAlign: "left" }}>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onProfileFinish}
                  style={{ flex: 1 }}
                  initialValues={{
                    fullName: data?.fullName,
                    email: data?.email,
                  }}
                >
                  <Item
                    label="Họ và tên"
                    name="fullName"
                    rules={[{ required: true, message: "Họ tên là bắt buộc" }]}
                  >
                    <Input placeholder="Nhập họ tên" />
                  </Item>

                  <Item label="Email" name="email">
                    <Input disabled />
                  </Item>

                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loadingAction}
                  >
                    Lưu
                  </Button>
                </Form>
              </div>
            </div>
          </Card>

          <Card
            title="Thay đổi mật khẩu"
            className="profile-card"
            style={{ marginTop: 12 }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: "1 0 70%", textAlign: "left" }}>
                <Form
                  form={passwordForm}
                  layout="vertical"
                  onFinish={onPasswordFinish}
                  style={{ flex: 1 }}
                  validateTrigger={["onSubmit"]}
                >
                  <Item
                    label="Mật khẩu"
                    name="currentPassword"
                    rules={[
                      {
                        required: true,
                        message: "Mật khẩu hiện tại là bắt buộc",
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="Nhập mật khẩu hiện tại"
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                    />
                  </Item>

                  <Item
                    label="Mật khẩu mới"
                    name="newPassword"
                    rules={[
                      {
                        required: true,
                        message: "Mật khẩu mới là bắt buộc",
                      },
                      {
                        min: 8,
                        message: "Mật khẩu phải có ít nhất 8 ký tự",
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="Nhập mật khẩu mới"
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                    />
                  </Item>

                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loadingActionChangePassword}
                  >
                    Thay đổi
                  </Button>
                </Form>
              </div>
            </div>
          </Card>
        </>
      )}
    </>
  );
};

export default ProfilePage;
