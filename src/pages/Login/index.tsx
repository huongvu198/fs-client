import React, { useEffect } from "react";
import { Row, Col, Form, Input, Checkbox } from "antd";
import styles from "./index.module.scss";
import classNames from "classnames/bind";
import ButtonComponent from "@components/ButtonComponent";
import { useReduxSelector } from "@hooks/useRedux";
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
import { useDispatch } from "react-redux";
import { ApiDispatch } from "@reduxjs/toolkit";
import { loginUserApi, resetLoginState } from "@redux/loginSlice";
import { addToCartImportApi, getCartByUserApi } from "@redux/cartSlice";
import { CartRequest } from "interfaces/cart.interface";

const cx = classNames.bind(styles);

const LoginRegistrationForm: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<ApiDispatch>();
  const { data, loading, error, loginSuccess } = useReduxSelector(
    (state) => state.login
  );
  const { errorMessage } = useNotification();
  const navigate = useNavigate();

  // Hàm format lại request giỏ hàng từ localStorage
  const formatCartRequest = (): CartRequest[] => {
    const tempCart = localStorage.getItem("tempCart");
    if (!tempCart) return [];
    const cart = JSON.parse(tempCart);

    return cart.items.map((item: any) => ({
      productId: item.product?.id || "",
      variantId: item.variant?.id || "",
      sizeId: item.size?.id || "",
      quantity: item.quantity || 0,
    }));
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
    const handleLoginSuccess = async () => {
      form.resetFields();
      dispatch(resetLoginState());
      const timestampAccessToken = data.tokenExpires;
      const timestampRefreshToken = data.refreshExpires;
      const dateAccessToken = new Date(timestampAccessToken * 1000);
      const dateRefreshToken = new Date(timestampRefreshToken * 1000);

      setAccessToken(data.token, dateAccessToken);
      setLocalToken(data.token);
      setRefreshToken(data.refreshToken, dateRefreshToken);
      setLocalRefreshToken(data.refreshToken);

      const cartRequest = formatCartRequest();
      if (cartRequest.length > 0) {
        // Đợi addToCartImportApi hoàn thành
        await dispatch(addToCartImportApi(cartRequest));
      }

      // Sau khi thêm cart xong thì mới gọi getCartByUserApi
      await dispatch(getCartByUserApi());

      navigate("/");
      localStorage.removeItem("tempCart");
    };

    if (loginSuccess) {
      handleLoginSuccess();
    }
  }, [loginSuccess, dispatch, form, data]);

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

  // // Khi lấy giỏ hàng thành công, update context
  // useEffect(() => {
  //   if (dataCart) {
  //     setCart(dataCart); // Cập nhật cart vào context
  //   }
  // }, [dataCart, setCart]);

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
                  rules={[{ required: true, message: "Vui lòng nhập email!" }]}
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
              <ButtonComponent
                type="primary"
                className={cx("register-button")}
                block
                onClick={() => navigate(RegisterPath)}
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
