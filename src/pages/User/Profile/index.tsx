import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Card,
  Skeleton,
  Image,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile } from "antd/es/upload/interface";
import { useDispatch } from "react-redux";
import { getUserApi, resetUserState, updateProfileApi } from "@redux/userSlice";
import { ApiDispatch } from "@redux/index";
import { useReduxSelector } from "@hooks/useRedux";
import useNotification from "@hooks/useNotification";

const { Item } = Form;

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const ProfilePage = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<ApiDispatch>();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const {
    data: user,
    updateUserSuccess,
    error,
    loading,
    loadingAction,
  } = useReduxSelector((state) => state.user);

  const { successMessage, errorMessage } = useNotification();

  useEffect(() => {
    if (!user) {
      dispatch(getUserApi());
    }
  }, []);

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

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange = async ({
    fileList: newFileList,
  }: {
    fileList: UploadFile[];
  }) => {
    setFileList(newFileList);

    const latestFile = newFileList[newFileList.length - 1];
    if (latestFile?.originFileObj) {
      const base64 = await getBase64(latestFile.originFileObj as RcFile);
      setImageUrl(base64);
    }
  };

  const onFinish = (values: any) => {
    const formatted = {
      ...values,
      avatar: imageUrl,
    };
    dispatch(updateProfileApi(formatted));
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <>
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <Card title="Hồ sơ của tôi" className="profile-card">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ flex: "1 0 70%", textAlign: "left" }}>
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                style={{ flex: 1 }}
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

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loadingAction}
                >
                  Lưu
                </Button>
              </Form>
            </div>
            <div
              style={{
                flex: "0 0 30%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Upload
                action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                listType="picture-circle"
                fileList={fileList}
                beforeUpload={beforeUpload}
                onPreview={handlePreview}
                onChange={handleChange}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>

              {previewImage && (
                <Image
                  wrapperStyle={{ display: "none" }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage(""),
                  }}
                  src={previewImage}
                />
              )}
              <p style={{ fontSize: 12 }}>Dung lượng file tối đa 1 MB</p>
              <p style={{ fontSize: 12 }}>Định dạng: .JPEG, .PNG</p>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default ProfilePage;
