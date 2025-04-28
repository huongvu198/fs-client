import React, { useEffect, useState } from "react";
import { Form, Input, Button, Upload, message, Card, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile } from "antd/es/upload/interface";
import styles from "./index.module.scss";
import { useDispatch } from "react-redux";
import { getUserApi, resetUserState, updateProfileApi } from "@redux/userSlice";
import { ApiDispatch } from "@redux/index";
import { useReduxSelector } from "@hooks/useRedux";
import useNotification from "@hooks/useNotification";

const { Item } = Form;

const ProfilePage: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<ApiDispatch>();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const {
    data: user,
    updateUserSuccess,
    error,
    loading,
  } = useReduxSelector((state) => state.user);
  const { successMessage, errorMessage } = useNotification();

  useEffect(() => {
    if (!user) {
      dispatch(getUserApi());
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (!updateUserSuccess && !error) return;

    if (updateUserSuccess) {
      successMessage({
        title: "Cập nhật hồ sơ",
        description: "Thông tin của bạn đã được lưu.",
      });
    } else {
      errorMessage({
        title: "Cập nhật thất bại",
        description: error!,
      });
    }
    // reset flag để không lặp lại
    dispatch(resetUserState());
  }, [updateUserSuccess, error, successMessage, errorMessage, dispatch]);

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    const isLt1M = file.size / 1024 / 1024 < 1;

    if (!isJpgOrPng) {
      message.error("Chỉ chấp nhận ảnh JPG/PNG!");
    }
    if (!isLt1M) {
      message.error("Dung lượng ảnh phải nhỏ hơn 1MB!");
    }

    return isJpgOrPng && isLt1M;
  };

  const handleUploadChange = (info: UploadChangeParam) => {
    if (info.file.status === "done" || info.file.status === "uploading") {
      const reader = new FileReader();
      reader.onload = () => setImageUrl(reader.result as string);
      reader.readAsDataURL(info.file.originFileObj as RcFile);
    }
  };

  const onFinish = (values: any) => {
    const formatted = {
      ...values,
    };
    dispatch(updateProfileApi(formatted));
  };

  return (
    <Card title="Hồ sơ của tôi">
      <Spin spinning={loading} tip="Đang tải..." className={styles.spinWrapper}>
        <div className={styles.formContainer}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className={styles.form}
            initialValues={{
              fullName: user?.fullName,
              email: user?.email,
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

            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Form>

          <div className={styles.avatarSection}>
            <img
              src={
                imageUrl ||
                "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/08/anh-con-meo-cute-7.jpg"
              }
              alt="avatar"
              className={styles.avatar}
            />
            <Upload
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleUploadChange}
            >
              <Button icon={<UploadOutlined />}>Chọn Ảnh</Button>
            </Upload>
            <p>Dung lượng file tối đa 1 MB</p>
            <p>Định dạng: .JPEG, .PNG</p>
          </div>
        </div>
      </Spin>
    </Card>
  );
};

export default ProfilePage;

{
  /* <div className={styles.profileWrapper}>
      <h2>Hồ sơ của tôi</h2>

      <div className={styles.formContainer}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className={styles.form}
          initialValues={{
            fullName: user?.fullName,
            email: user?.email,
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

          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
        </Form>

        <div className={styles.avatarSection}>
          <img
            src={
              imageUrl ||
              "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/08/anh-con-meo-cute-7.jpg"
            }
            alt="avatar"
            className={styles.avatar}
          />
          <Upload
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleUploadChange}
          >
            <Button icon={<UploadOutlined />}>Chọn Ảnh</Button>
          </Upload>
          <p>Dung lượng file tối đa 1 MB</p>
          <p>Định dạng: .JPEG, .PNG</p>
        </div>
      </div>
    </div> */
}
