import React, { useEffect, useState } from "react";
import { Form, Input, Radio, Button } from "antd";
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
import { PaymentMethodPath } from "@config/routerConfig";
import { showToast, ToastType } from "shared/toast";
import { formatPhoneInternal } from "shared/common";
import useSocket from "@hooks/useSocket";
import { SocketEvent } from "shared/enum";
import { getCartByUserApi } from "@redux/cartSlice";
import { calculateCart } from "@utils/handleCart";

interface ShippingFormData {
  fullName: string;
  address: string;
  country: string;
  district: string;
  city: string;
  phoneNumber: string;
  selectedAddress: string;
  street: string;
  ward: string;
  pointUsed: string;
}

const ShippingDetails: React.FC = () => {
  const [form] = Form.useForm<ShippingFormData>();
  const [selectedAddress, setSelectedAddress] = React.useState(null);
  const [isAddNewAddress, setIsAddNewAddress] = React.useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    discountAmount: initialDiscountAmount,
    discount: initialDiscountPercent,
    voucherType: initialVoucherType,
    selectedPoint: initialSelectedPoint = false,
    voucherId: initialVoucherId,
    totalPayment: initialTotalPayment = 0,
    pointUsed: initialPointUsed = 0,
    cartItems,
  } = location.state || {};

  const [discountPercent] = useState(initialDiscountPercent);
  const [discountAmount, setDiscountAmount] = useState(initialDiscountAmount);
  const [voucherType] = useState(initialVoucherType || "");
  const [selectedPoint] = useState(initialSelectedPoint);
  const [voucherId] = useState(initialVoucherId);
  const [totalPayment, setTotalPayment] = useState(initialTotalPayment);
  const [pointUsed, setPointUsed] = useState(initialPointUsed);
  const [cart, setCart] = useState(cartItems);

  const { userAddress, createAddressSuccess, error } = useReduxSelector(
    (state) => state.user
  );
  const [prevAddresses, setPrevAddresses] = useState<Address[]>([]);

  useSocket({
    [SocketEvent.PRODUCT_PRICE_CHANGED]: (data) => {
      const productIdFromEvent = data.productId;

      const productExistsInCart = cart?.items?.some(
        (item: any) => item.product?.id === productIdFromEvent
      );

      if (productExistsInCart) {
        showToast(
          ToastType.INFO,
          "Sản phẩm được cập nhật lại giá, vui lòng kiểm tra lại"
        );
        dispatch(getCartByUserApi())
          .unwrap()
          .then((cartData: any) => {
            setCart(cartData);

            const calculationResult = calculateCart({
              items: cartData.items,
              discount: discountPercent || 0,
              dataVoucher: {
                type: voucherType,
              },
              selectedPoint,
              pointRedux: pointUsed,
            });

            // Cập nhật lại state tương ứng
            setDiscountAmount(calculationResult.discountAmount);
            setTotalPayment(calculationResult.totalPayment);
            setPointUsed(calculationResult.pointUsed);
          })
          .catch((err: any) => {
            console.error("Failed to fetch cart:", err);
          });
      }
    },
  });

  const handleNext = async () => {
    if (!selectedAddress || selectedAddress === "add") {
      return showToast(ToastType.ERROR, "Vui lòng chọn địa chỉ nhận hàng");
    }
    const values = await form.validateFields();
    const selectedAddressValue = values.selectedAddress;
    navigate(PaymentMethodPath, {
      state: {
        cart,
        discountAmount,
        voucherType,
        selectedPoint,
        discountPercent,
        selectedAddress: selectedAddressValue,
        voucherId,
        totalPayment,
        pointUsed,
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
        fullName: values.fullName,
        phone: values.phoneNumber,
        street: values.street,
        city: values.city,
        district: values.district,
        ward: values.ward,
        country: values.country,
      };
      setPrevAddresses(userAddress.addresses || []);

      try {
        const res = await dispatch(
          createAddress(formDataCreateAddress)
        ).unwrap();

        const newAddress = res?.addresses?.find(
          (addr: Address) => !prevAddresses.some((old) => old.id === addr.id)
        );

        if (newAddress) {
          setSelectedAddress(newAddress.id);
          form.setFieldsValue({ selectedAddress: newAddress.id });
          setIsAddNewAddress(false);
        }
      } catch (error) {
        showToast(
          ToastType.ERROR,
          "Thêm địa chỉ thất bại, vui lòng thử lại sau."
        );
      }
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
      showToast(ToastType.ERROR, error);
    }

    if (createAddressSuccess || error) {
      dispatch(resetUserState());
    }
  }, [createAddressSuccess]);

  return (
    <div>
      <div className={styles.layout}>
        <h1 className={styles.pageTitle}>Địa chỉ nhận hàng</h1>
        <div className={styles.layoutContent}>
          <div className={styles.mainContent}>
            <Form form={form} layout="vertical" className={styles.formSection}>
              <Form.Item
                name="selectedAddress"
                // label="Select an Address"
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
                          <div className={styles.addressDetails}>
                            {address.fullName} |{" "}
                            {formatPhoneInternal(address.phone)}
                          </div>
                          <div className={styles.addressTitle}>
                            {address.street}
                          </div>
                          <div className={styles.addressDetails}>
                            {`${address.ward}, ${address.district}, ${address.city}, ${address.country}`}
                          </div>
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
                      <div className={styles.addressTitle}>
                        Thêm địa chỉ mới
                      </div>
                    </Radio>
                  </div>
                </Radio.Group>
              </Form.Item>

              {selectedAddress === "add" ? (
                <>
                  <div className={styles.formRow}>
                    <Form.Item
                      name="fullName"
                      label="Họ và tên"
                      rules={[
                        {
                          required: isAddNewAddress,
                          message: "Vui lòng nhập tên của bạn",
                        },
                      ]}
                      className={styles.formItem}
                    >
                      <Input
                        placeholder="Vu Thi Huong"
                        disabled={isInputDisabled}
                      />
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
                    <Input
                      placeholder="Tên đường..."
                      disabled={isInputDisabled}
                    />
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
                      <Input
                        placeholder="Thành phố..."
                        disabled={isInputDisabled}
                      />
                    </Form.Item>

                    <Form.Item name="country" initialValue="Việt Nam" hidden>
                      <Input />
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
                </>
              ) : null}

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
              totalPayment={totalPayment}
              pointUsed={pointUsed}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingDetails;
