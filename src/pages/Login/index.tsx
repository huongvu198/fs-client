import React, { useEffect } from "react";
import { Row, Col, Form, Input, Checkbox } from "antd";
import styles from "./index.module.scss";
import classNames from "classnames/bind";
import ButtonComponent from "@components/ButtonComponent";
import { useReduxSelector } from "@hooks/useRedux";
import { loginUserApi, resetLoginState } from "@redux/loginSlice";
import useNotification from "@hooks/useNotification";
import { useNavigate } from "react-router-dom";
import {
  hasAccessToken,
  hasLocalAccessToken,
  setAccessToken,
  setLocalRefreshToken,
  setLocalToken,
  setRefreshToken,
} from "@config/accessToken";
import { addToCartImportApi } from "@redux/cartSlice";
import { useDispatch } from "react-redux";
import { ApiDispatch } from "@reduxjs/toolkit";
const cx = classNames.bind(styles);

const LoginRegistrationForm: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<ApiDispatch>();
  const { data, loading, error, loginSuccess } = useReduxSelector(
    (state) => state.login
  );
  const { dataCart, addToCartSuccess } = useReduxSelector(
    (state) => state.cart
  );
  const { errorMessage } = useNotification();
  const navigate = useNavigate();

  const getCartListFromLocal = () => {
    const cartList = JSON.parse(localStorage.getItem("cartList") || "{}");
    const getItems = cartList.items?.map((item: any) => ({
      productId: item.product?.id,
      variantId: item.variant?.id,
      sizeId: item.size?.id,
      quantity: item.quantity,
    }));
    return getItems;
  };

  const onLogin = (values: any) => {
    const { email, password } = values;
    dispatch(
      loginUserApi({
        email: email,
        password: password,
      })
    );
  };

  useEffect(() => {
    if (loginSuccess) {
      form.resetFields();
      dispatch(resetLoginState());
      setAccessToken(data.token);
      setLocalToken(data.token);
      setRefreshToken(data.refreshToken);
      setLocalRefreshToken(data.refreshToken);
      const cartRequest = getCartListFromLocal();
      dispatch(addToCartImportApi(cartRequest));
      navigate("/");
    }
  }, [loginSuccess, dispatch, form]);

  useEffect(() => {
    if (hasAccessToken() || hasLocalAccessToken()) {
      navigate("/");
    }
  }, [hasAccessToken(), hasLocalAccessToken()]);

  useEffect(() => {
    if (error) {
      errorMessage({ description: error });
    }
  }, [error]);

  useEffect(() => {
    if (addToCartSuccess) {
      localStorage.setItem("cartList", dataCart);
    }
  }, [addToCartSuccess]);

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
                onFinish={onLogin}
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
                  <ButtonComponent
                    type="primary"
                    htmlType="submit"
                    block
                    isLoading={loading}
                  >
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
    </>
  );
};

export default LoginRegistrationForm;
