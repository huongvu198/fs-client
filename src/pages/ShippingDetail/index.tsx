import React from "react";
import { Form, Input, Select, Radio, Button } from "antd";
import styles from "./index.module.scss";
import OrderSummary from "@components/OrderSummaryComponent";

const { Option } = Select;

interface ShippingFormData {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  country: string;
  city: string;
  zipCode: string;
  phoneNumber: string;
  selectedAddress: string;
}

const ShippingDetails: React.FC = () => {
  const [form] = Form.useForm<ShippingFormData>();
  const [selectedAddress, setSelectedAddress] = React.useState("address-1");

  const cart = { items: [] };
  const subtotal = 100;
  const shipping = 10;
  const taxes = 5;
  const total = 115;

  const handleNext = (data: ShippingFormData) => {
    console.log("Form Data:", data);
  };

  const handleCancel = () => {
    console.log("Canceled");
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      handleNext(values);
    } catch (errorInfo) {
      console.error("Validation Failed:", errorInfo);
    }
  };

  return (
    <div>
      <div className={styles.layout}>
        <div className={styles.mainContent}>
          <h1 className={styles.pageTitle}>Shipping Details</h1>

          <Form
            form={form}
            layout="vertical"
            initialValues={{ selectedAddress: "address-1" }}
            className={styles.formSection}
          >
            <div className={styles.formRow}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[
                  { required: true, message: "Please enter your first name" },
                ]}
                className={styles.formItem}
              >
                <Input placeholder="First Name" />
              </Form.Item>

              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[
                  { required: true, message: "Please enter your last name" },
                ]}
                className={styles.formItem}
              >
                <Input placeholder="Last Name" />
              </Form.Item>
            </div>

            <Form.Item
              name="address1"
              label="Address"
              rules={[{ required: true, message: "Please enter your address" }]}
              className={styles.formItem}
            >
              <Input placeholder="Address" />
            </Form.Item>

            <Form.Item
              name="address2"
              label="Address 2"
              className={styles.formItem}
            >
              <Input placeholder="Address 2" />
            </Form.Item>

            <div className={styles.formRow}>
              <Form.Item
                name="country"
                label="Country"
                rules={[
                  { required: true, message: "Please select your country" },
                ]}
                className={styles.formItem}
              >
                <Select placeholder="Country">
                  <Option value="us">United States</Option>
                  <Option value="ca">Canada</Option>
                  <Option value="uk">United Kingdom</Option>
                  <Option value="au">Australia</Option>
                  <Option value="vn">Vietnam</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="city"
                label="City"
                rules={[{ required: true, message: "Please enter your city" }]}
                className={styles.formItem}
              >
                <Input placeholder="City" />
              </Form.Item>
            </div>

            <div className={styles.formRow}>
              <Form.Item
                name="zipCode"
                label="Zip/Postal Code"
                rules={[
                  {
                    required: true,
                    message: "Please enter your zip/postal code",
                  },
                ]}
                className={styles.formItem}
              >
                <Input placeholder="Zip/Postal Code" />
              </Form.Item>

              <Form.Item
                name="phoneNumber"
                label="Phone Number"
                rules={[
                  { required: true, message: "Please enter your phone number" },
                ]}
                className={styles.formItem}
              >
                <Input placeholder="Phone Number" />
              </Form.Item>
            </div>

            <Form.Item
              name="selectedAddress"
              label="Select an Address"
              className={styles.formItem}
            >
              <Radio.Group
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(e.target.value)}
                style={{ width: "100%" }}
              >
                <div
                  className={`${styles.addressOption} ${selectedAddress === "address-1" ? styles.selected : ""}`}
                >
                  <Radio value="address-1">
                    <div>
                      <div className={styles.addressTitle}>Address-1</div>
                      <div className={styles.addressDetails}>HN-VN</div>
                    </div>
                  </Radio>
                </div>

                <div
                  className={`${styles.addressOption} ${selectedAddress === "address-2" ? styles.selected : ""}`}
                >
                  <Radio value="address-2">
                    <div>
                      <div className={styles.addressTitle}>Address-2</div>
                      <div className={styles.addressDetails}>HN-VN</div>
                    </div>
                  </Radio>
                </div>
              </Radio.Group>
            </Form.Item>

            <div className={styles.buttonGroup}>
              <Button
                type="primary"
                onClick={handleSubmit}
              >
                Next
              </Button>
              <Button
                type="default"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </div>

        <div className={styles.sidebar}>
          <OrderSummary
            cart={cart}
            subtotal={subtotal}
            shipping={shipping}
            taxes={taxes}
            total={total}
          />
        </div>
      </div>
    </div>
  );
};

export default ShippingDetails;
