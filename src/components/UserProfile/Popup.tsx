import React, { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import { EPopupMode } from "shared/enum";
import { Address } from "interfaces/user.interface";
import { useDispatch } from "react-redux";
import { ApiDispatch } from "@redux/index";
import {
  createAddress,
  deleteAddress,
  resetUserState,
  updateAddress,
} from "@redux/userSlice";
import useNotification from "@hooks/useNotification";
import { useReduxSelector } from "@hooks/useRedux";

interface UserAddressModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<any>>;
  mode: EPopupMode;
  address: Address | null;
}

const UserAddressModal: React.FC<UserAddressModalProps> = ({
  open,
  setOpen,
  mode,
  address,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<ApiDispatch>();
  const { errorMessage, successMessage } = useNotification();
  const {
    updateAddressSuccess,
    createAddressSuccess,
    deleteAddressSuccess,
    error,
  } = useReduxSelector((state) => state.user);

  useEffect(() => {
    if (mode === EPopupMode.UPDATE && address) {
      form.setFieldsValue({
        ...address,
      });
    }
  }, [mode, address, form]);

  const handleCancel = () => {
    setOpen({ isOpen: false, mode: EPopupMode.ADD, address: null });
  };

  const handleSubmit = (values: any) => {
    if (mode === EPopupMode.ADD) {
      dispatch(createAddress(values));
    } else if (mode === EPopupMode.UPDATE && address) {
      dispatch(updateAddress({ data: { ...values }, id: address.id }));
    }
  };

  useEffect(() => {
    if (mode === EPopupMode.DELETE && address) {
      Modal.confirm({
        centered: true,
        title: "Xác nhận xoá địa chỉ",
        content: `Bạn có chắc muốn xoá địa chỉ của ${address.fullName}?`,
        okText: "Xoá",
        okType: "danger",
        cancelText: "Huỷ",
        onOk() {
          dispatch(deleteAddress(address.id));
        },
        onCancel() {
          setOpen({ isOpen: false, mode: EPopupMode.ADD, address: null });
        },
      });
    }
  }, [mode, address]);

  useEffect(() => {
    if (createAddressSuccess || updateAddressSuccess || deleteAddressSuccess) {
      successMessage({
        title: createAddressSuccess
          ? "Tạo mới địa chỉ"
          : updateAddressSuccess
            ? "Cập nhật địa chỉ"
            : "Xóa địa chỉ",
        description: createAddressSuccess
          ? "Địa chỉ đã được tạo mới thành công."
          : updateAddressSuccess
            ? "Địa chỉ đã được cập nhật thành công."
            : "Địa chỉ đã được xóa thành công.",
      });

      setOpen({ isOpen: false, mode: EPopupMode.ADD, address: null }); // <-- di chuyển vào đây
    }

    if (error) {
      errorMessage({ description: error });
    }

    if (
      error ||
      createAddressSuccess ||
      updateAddressSuccess ||
      deleteAddressSuccess
    ) {
      dispatch(resetUserState());
    }
  }, [error, createAddressSuccess, updateAddressSuccess, deleteAddressSuccess]);

  if (mode === EPopupMode.DELETE) return null;

  return (
    <Modal
      title={mode === EPopupMode.ADD ? "Thêm địa chỉ" : "Cập nhật địa chỉ"}
      visible={open}
      centered
      onCancel={handleCancel}
      footer={null}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="fullName"
          label="Họ và tên"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="street"
          label="Đường"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="city"
          label="Thành phố"
          rules={[{ required: true, message: "Vui lòng nhập thành phố!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="district"
          label="Quận/Huyện"
          rules={[{ required: true, message: "Vui lòng nhập quận/huyện!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="ward"
          label="Phường/Xã"
          rules={[{ required: true, message: "Vui lòng nhập phường/xã!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="country"
          label="Quốc gia"
          rules={[{ required: true, message: "Vui lòng nhập quốc gia!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            {mode === EPopupMode.ADD ? "Thêm" : "Cập nhật"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserAddressModal;
