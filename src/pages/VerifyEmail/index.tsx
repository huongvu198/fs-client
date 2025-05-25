// EmailVerification.tsx
import React, { useState, useRef, useEffect } from "react";
import { Button, Form, Typography, Space } from "antd";
import styles from "./index.module.scss";
import classNames from "classnames/bind";
import ButtonComponent from "@components/ButtonComponent";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRedux, useReduxSelector } from "@hooks/useRedux";
import { verifyEmail } from "@redux/verifySlice";
import { VerifyCodeEnum } from "shared/enum";

const cx = classNames.bind(styles);

const { Title, Text } = Typography;

const VerifyEmail: React.FC = () => {
  const dispatch = useRedux();
  const [searchParams] = useSearchParams();
  const [verificationCode, setVerificationCode] = useState<string[]>(
    Array(6).fill("")
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
  const { verifysuccess, loading } = useReduxSelector(
    (state) => state.verifyEmail
  );
  const navigate = useNavigate();
  const handleInputChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = verificationCode.join("");
    const customerId = searchParams.get("customer");
    const type = VerifyCodeEnum.CREATE_ACCOUNT;
    if (customerId && code && type) {
      dispatch(
        verifyEmail({
          id: customerId,
          code: code,
          type: type,
        })
      );
    }
  };

  const sendAnotherCode = () => {
    console.log("Sending another verification code");
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (verifysuccess) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [verifysuccess]);

  return (
    <div className={cx("verification-container")}>
      <div className={cx("verification-card")}>
        <Title level={3} className={cx("verification-title")}>
          Email verification
        </Title>
        <Text className={cx("verification-subtitle")}>
          An email has been sent to you,
        </Text>
        <Text className={cx("verification-description")}>
          Check the email that's associated with your account for the
          verification code
        </Text>

        <Form className={cx("verification-form")}>
          <Space className={cx("code-input-container")}>
            {verificationCode.map((digit, index) => (
              <div key={index} className={cx("input-wrapper")}>
                <input
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className={cx("code-input")}
                  aria-label={`Digit ${index + 1}`}
                />
              </div>
            ))}
          </Space>

          <ButtonComponent
            isLoading={loading}
            type="primary"
            onClick={handleVerify}
            className={cx("verification-button")}
          >
            Verify
          </ButtonComponent>

          <Button
            type="link"
            onClick={sendAnotherCode}
            className={cx("resend-button")}
          >
            Send me another code
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default VerifyEmail;
