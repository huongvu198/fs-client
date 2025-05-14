import React, { useEffect } from "react";
import { Form, Input, Select, Radio, Button } from "antd";
import styles from "./index.module.scss";
import OrderSummary from "@components/OrderSummaryComponent";
import { useLocation, useNavigate } from "react-router-dom";
import { useReduxSelector } from "@hooks/useRedux";
import { useDispatch } from "react-redux";
import {
  createAddress,
  getUserAddress,
  resetUserState,
} from "@redux/userSlice";
import { Address } from "interfaces/user.interface";
import useNotification from "@hooks/useNotification";

const { Option } = Select;

interface ShippingFormData {
  firstName: string;
  lastName: string;
  address: string;
  country: string;
  district: string;
  city: string;
  phoneNumber: string;
  selectedAddress: string;
  street: string;
  ward: string;
}

const ShippingDetails: React.FC = () => {
  const [form] = Form.useForm<ShippingFormData>();
  const [selectedAddress, setSelectedAddress] = React.useState("address-1");
  const [isAddNewAddress, setIsAddNewAddress] = React.useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = location.state?.cartItems;
  const discountAmount = location.state?.discountAmount;
  const discountPercent = location.state?.discount;
  const voucherType = location.state?.voucherType;
  const selectedPoint = location.state?.selectedPoint;
  const voucherId = location.state?.voucherId;
  const cart = cartItems;
  const { userAddress, createAddressSuccess, error } = useReduxSelector(
    (state) => state.user
  );
  const { errorMessage, successMessage } = useNotification();
  const handleNext = async () => {
    const values = await form.validateFields();
    const selectedAddress = values.selectedAddress;
    navigate("/paymentMethod", {
      state: {
        cart,
        discountAmount,
        voucherType,
        selectedPoint,
        discountPercent,
        selectedAddress,
        voucherId,
      },
    });
  };

  const handleCancel = () => {
    history.back();
  };

  const handleAddNewAddress = async () => {
    const values = await form.validateFields();
    if (values.selectedAddress === "add") {
      const formDataCreateAddress = {
        fullName: values.firstName + " " + values.lastName,
        phone: values.phoneNumber,
        street: values.street,
        city: values.city,
        district: values.district,
        ward: values.ward,
        country: values.country,
      };
      dispatch(createAddress(formDataCreateAddress));
    }
  };

  const isInputDisabled = !isAddNewAddress;

  useEffect(() => {
    if (!userAddress) {
      dispatch(getUserAddress());
    }
  }, [userAddress, dispatch]);

  useEffect(() => {
    if (
      userAddress?.addresses?.length &&
      !form.getFieldValue("selectedAddress")
    ) {
      const defaultAddressId = userAddress.addresses[0].id;
      setSelectedAddress(defaultAddressId);
      form.setFieldsValue({ selectedAddress: defaultAddressId });
      setIsAddNewAddress(false);
    }
  }, [userAddress, form]);

  useEffect(() => {
    if (createAddressSuccess) {
      form.resetFields();
    }

    if (error) {
      errorMessage({ description: error });
    }

    if (createAddressSuccess || error) {
      dispatch(resetUserState());
    }
  }, [createAddressSuccess]);

  return (
    <div>
      <div className={styles.layout}>
        <div className={styles.mainContent}>
          <h1 className={styles.pageTitle}>Shipping Details</h1>

          <Form form={form} layout="vertical" className={styles.formSection}>
            <Form.Item
              name="selectedAddress"
              label="Select an Address"
              className={styles.formItem}
            >
              <Radio.Group
                value={selectedAddress}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedAddress(value);
                  form.setFieldsValue({ selectedAddress: value });
                  setIsAddNewAddress(value === "add");
                }}
                style={{ width: "100%" }}
              >
                {userAddress?.addresses.map((address: Address) => (
                  <div
                    key={address.id}
                    className={`${styles.addressOption} ${
                      selectedAddress === address.id ? styles.selected : ""
                    }`}
                  >
                    <Radio value={address.id}>
                      <div>
                        <div className={styles.addressTitle}>
                          {address.street}
                        </div>
                        <div className={styles.addressDetails}>
                          {`${address.ward}, ${address.district}, ${address.city}, ${address.country}`}
                        </div>
                        {address.phone && (
                          <div className={styles.addressDetails}>
                            Phone: {address.phone}
                          </div>
                        )}
                      </div>
                    </Radio>
                  </div>
                ))}
                <div
                  className={`${styles.addressOption} ${
                    selectedAddress === "add" ? styles.selected : ""
                  }`}
                >
                  <Radio value="add">
                    <div className={styles.addressTitle}>Thêm địa chỉ mới</div>
                  </Radio>
                </div>
              </Radio.Group>
            </Form.Item>

            <div className={styles.formRow}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[
                  {
                    required: isAddNewAddress,
                    message: "Please enter your first name",
                  },
                ]}
                className={styles.formItem}
              >
                <Input placeholder="First Name" disabled={isInputDisabled} />
              </Form.Item>

              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[
                  {
                    required: isAddNewAddress,
                    message: "Please enter your last name",
                  },
                ]}
                className={styles.formItem}
              >
                <Input placeholder="Last Name" disabled={isInputDisabled} />
              </Form.Item>
            </div>

            <Form.Item
              name="street"
              label="Đường"
              rules={[
                {
                  required: isAddNewAddress,
                  message: "Hãy nhập tên đường",
                },
              ]}
              className={styles.formItem}
            >
              <Input placeholder="Tên đường..." disabled={isInputDisabled} />
            </Form.Item>

            <Form.Item
              name="ward"
              label="Phường/Xã"
              rules={[
                {
                  required: isAddNewAddress,
                  message: "Hãy nhập tên phường/xã",
                },
              ]}
              className={styles.formItem}
            >
              <Input
                placeholder="Tên phường/xã..."
                disabled={isInputDisabled}
              />
            </Form.Item>

            <Form.Item
              name="district"
              label="Quận/Huyện"
              rules={[
                {
                  required: isAddNewAddress,
                  message: "Hãy nhập tên quận/huyện",
                },
              ]}
              className={styles.formItem}
            >
              <Input
                placeholder="Tên quận/huyện..."
                disabled={isInputDisabled}
              />
            </Form.Item>

            <div className={styles.formRow}>
              <Form.Item
                name="city"
                label="Thành phố"
                rules={[
                  {
                    required: isAddNewAddress,
                    message: "Hãy nhập thành phố",
                  },
                ]}
                className={styles.formItem}
              >
                <Input placeholder="Thành phố..." disabled={isInputDisabled} />
              </Form.Item>

              <Form.Item
                name="country"
                label="Quốc gia"
                rules={[
                  {
                    required: isAddNewAddress,
                    message: "Hãy chọn quốc gia",
                  },
                ]}
                className={styles.formItem}
              >
                <Select
                  style={{ height: "44.5px" }}
                  placeholder="Quốc gia"
                  disabled={isInputDisabled}
                >
                  <Option value="us">United States</Option>
                  <Option value="ca">Canada</Option>
                  <Option value="uk">United Kingdom</Option>
                  <Option value="au">Australia</Option>
                  <Option value="vn">Vietnam</Option>
                </Select>
              </Form.Item>
            </div>

            <div className={styles.formRow}>
              <Form.Item
                name="phoneNumber"
                label="Số điện thoại"
                rules={[
                  {
                    required: isAddNewAddress,
                    message: "Hãy nhập số điện thoại",
                  },
                ]}
                className={styles.formItem}
              >
                <Input
                  placeholder="Số điện thoại..."
                  disabled={isInputDisabled}
                />
              </Form.Item>
            </div>

            {isAddNewAddress && (
              <div style={{ marginBottom: 16 }}>
                <Button type="dashed" onClick={handleAddNewAddress}>
                  Thêm địa chỉ mới
                </Button>
              </div>
            )}

            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={handleNext}
              >
                Tiếp theo
              </button>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={handleCancel}
              >
                Trở về
              </button>
            </div>
          </Form>
        </div>

        <div className={styles.sidebar}>
          <OrderSummary
            discountType={voucherType}
            cart={cart}
            discount={discountPercent}
            discountAmount={discountAmount}
            selectedPoint={selectedPoint}
          />
        </div>
      </div>
    </div>
  );
};

export default ShippingDetails;
