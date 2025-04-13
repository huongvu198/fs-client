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
import { registerUserApi, resetRegisterState } from "@redux/register";
import useNotification from "@hooks/useNotification";
import Spinner from "@components/Spinner";

const cx = classNames.bind(styles);

interface RegisterFormProps {
  onSubmit?: (values: any) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = () => {
  const [form] = Form.useForm();
  const dispatch = useRedux();
  const { loading, error, registerSuccess } = useReduxSelector(
    (state) => state.register
  );
  const { errorMessage, successMessage } = useNotification();
  const handleSubmit = (values: any) => {
    console.log("Form values:", values);
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
      successMessage({
        description: "Register success, please check email to navigate verify!",
      });
    }
  }, [registerSuccess, dispatch, form]);

  useEffect(() => {
    if (error) {
      errorMessage({ description: error });
    }
  }, [error]);

  return (
    <>
      <Spinner isLoading={loading} fullscreen />
      <div className={cx("register-container")}>
        <div className={cx("register-card")}>
          <h1 className={cx("register-title")}>Đăng kí</h1>

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
                    message: "Please enter your first name",
                    validateTrigger: "onSubmit",
                  },
                ]}
              >
                <Input
                  prefix={
                    <ShopOutlined className={cx("register-input-icon")} />
                  }
                  placeholder="Enter your first"
                  className={cx("register-input")}
                />
              </Form.Item>

              <Form.Item
                name="lastName"
                className={cx("register-form-item")}
                rules={[
                  {
                    required: true,
                    message: "Please enter your last name",
                    validateTrigger: "onSubmit",
                  },
                ]}
              >
                <Input
                  prefix={
                    <BankOutlined className={cx("register-input-icon")} />
                  }
                  placeholder="Enter your last name"
                  className={cx("register-input")}
                />
              </Form.Item>
            </div>

            <div className={cx("register-form-row")}>
              <Form.Item
                name="email"
                className={cx("register-form-item")}
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  prefix={<MailOutlined className={styles.inputIcon} />}
                  placeholder="Email Address"
                  className={cx("register-input")}
                />
              </Form.Item>
            </div>

            <div className={cx("register-form-row")}>
              <Form.Item
                name="password"
                className={cx("register-form-item")}
                rules={[
                  { required: true, message: "Please enter your password" },
                ]}
              >
                <Input.Password
                  prefix={
                    <LockOutlined className={cx("register-input-icon")} />
                  }
                  placeholder="Password"
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
                    message: "Please confirm your password",
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
                  placeholder="Confirm Password"
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
                Đăng kí
              </ButtonComponent>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
