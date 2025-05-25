import React, { useEffect } from "react";
import { Form, Input } from "antd";
import {
  ShopOutlined,
  BankOutlined,
  MailOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import styles from "./index.module.scss";
import classNames from "classnames/bind";
import ButtonComponent from "@components/ButtonComponent";
import { useRedux, useReduxSelector } from "@hooks/useRedux";
import { registerUserApi, resetRegisterState } from "@redux/registerSlice";
import Spinner from "@components/Spinner";
import { useNavigate } from "react-router-dom";
import { LoginPath } from "@config/routerConfig";

const cx = classNames.bind(styles);

interface RegisterFormProps {
  onSubmit?: (values: any) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = () => {
  const [form] = Form.useForm();
  const dispatch = useRedux();
  const nagigate = useNavigate();
  const { loading, registerSuccess } = useReduxSelector(
    (state) => state.register
  );
  const handleSubmit = (values: any) => {
    const { email, firstName, lastName, password } = values;
    dispatch(
      registerUserApi({
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password,
      })
    );
  };

  useEffect(() => {
    if (registerSuccess) {
      form.resetFields();
      dispatch(resetRegisterState());
      nagigate(LoginPath);
    }
  }, [registerSuccess, dispatch, form]);

  return (
    <>
      <Spinner isLoading={loading} fullscreen />
      <div className={cx("register-container")}>
        <div className={cx("register-card")}>
          <h1 className={cx("register-title")}>Đăng ký</h1>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className={cx("register-form")}
          >
            <div className={cx("register-form-row")}>
              <Form.Item
                name="firstName"
                className={cx("register-form-item")}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập họ",
                    validateTrigger: "onSubmit",
                  },
                ]}
              >
                <Input
                  prefix={
                    <ShopOutlined className={cx("register-input-icon")} />
                  }
                  placeholder="Nhập họ"
                  className={cx("register-input")}
                />
              </Form.Item>

              <Form.Item
                name="lastName"
                className={cx("register-form-item")}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên",
                    validateTrigger: "onSubmit",
                  },
                ]}
              >
                <Input
                  prefix={
                    <BankOutlined className={cx("register-input-icon")} />
                  }
                  placeholder="Nhập tên"
                  className={cx("register-input")}
                />
              </Form.Item>
            </div>

            <div className={cx("register-form-row")}>
              <Form.Item
                name="email"
                className={cx("register-form-item")}
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  {
                    type: "email",
                    message: "Vui lòng nhập đúng định dạng email",
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined className={styles.inputIcon} />}
                  placeholder="Địa chỉ email"
                  className={cx("register-input")}
                />
              </Form.Item>
            </div>

            <div className={cx("register-form-row")}>
              <Form.Item
                name="password"
                className={cx("register-form-item")}
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
              >
                <Input.Password
                  prefix={
                    <LockOutlined className={cx("register-input-icon")} />
                  }
                  placeholder="Mật khẩu"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  className={cx("register-input")}
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                className={cx("register-form-item")}
                dependencies={["password"]}
                rules={[
                  {
                    required: true,
                    message: "Nhập lại mật khẩu",
                    validateTrigger: "onSubmit",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("The two passwords do not match")
                      );
                    },
                    validateTrigger: "onSubmit",
                  }),
                ]}
              >
                <Input.Password
                  prefix={
                    <LockOutlined className={cx("register-input-icon")} />
                  }
                  placeholder="Nhập lại mật khẩu"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  className={cx("register-input")}
                />
              </Form.Item>
            </div>

            <Form.Item className={cx("register-submit-item")}>
              <ButtonComponent
                isLoading={loading}
                type="primary"
                htmlType="submit"
                className={cx("register-submit-button")}
              >
                Đăng ký
              </ButtonComponent>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
