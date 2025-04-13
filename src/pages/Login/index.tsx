import React from "react";
import { Row, Col, Form, Input, Checkbox } from "antd";
import styles from "./index.module.scss";
import classNames from "classnames/bind";
import Footer from "@components/FooterComponent";
import ButtonComponent from "@components/ButtonComponent";

const cx = classNames.bind(styles);

const LoginRegistrationForm: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Form submitted:", values);
  };

  return (
    <>
      <div className={cx("login-container")}>
        <Row gutter={[32, 32]} className={cx("login-form-row")}>
          <Col xs={24} md={12} className={cx("login-form-col")}>
            <div className={cx("login-form-container")}>
              <h2 className={cx("login-title")}>Bạn đã có tài khoản</h2>
              <p className={cx("login-description")}>
                Nếu bạn đã có tài khoản, hãy đăng nhập để tích lũy điểm thành
                viên và nhận được những ưu đãi tốt hơn!
              </p>

              <Form
                form={form}
                name="login_form"
                onFinish={onFinish}
                layout="vertical"
                className={cx("login-form")}
              >
                <Form.Item
                  name="email"
                  className={cx("login-form-item")}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập email hoặc số điện thoại!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Email/SĐT"
                    className={cx("login-form-input")}
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  className={cx("login-form-item")}
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                  ]}
                >
                  <Input.Password
                    placeholder="Mật khẩu"
                    className={cx("login-form-input")}
                  />
                </Form.Item>

                <div className={cx("login-form-remember")}>
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                  </Form.Item>
                  <a href="#" className={cx("forgot-link")}>
                    Quên mật khẩu?
                  </a>
                </div>

                <Form.Item className={cx("login-submit-item")}>
                  <ButtonComponent type="primary" htmlType="submit" block>
                    ĐĂNG NHẬP
                  </ButtonComponent>
                </Form.Item>
              </Form>
            </div>
          </Col>

          <Col xs={24} md={12} className={cx("login-form-col")}>
            <div className={cx("login-form-container")}>
              <h2 className={cx("login-title")}>Khách hàng mới</h2>
              <p className={cx("login-description")}>
                Nếu bạn chưa có tài khoản, hãy sử dụng tùy chọn này để truy cập
                biểu mẫu đăng ký.
              </p>
              <p className={cx("login-description")}>
                Bằng cách cung cấp các thông tin chi tiết của bạn, quá trình mua
                hàng sẽ là một trải nghiệm thú vị và nhanh chóng hơn!
              </p>

              <ButtonComponent
                type="primary"
                className={cx("register-button")}
                block
              >
                ĐĂNG KÝ
              </ButtonComponent>
            </div>
          </Col>
        </Row>
      </div>
      <Footer />
    </>
  );
};

export default LoginRegistrationForm;
