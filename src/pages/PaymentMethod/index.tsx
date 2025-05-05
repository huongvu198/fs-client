import React, { useState, useEffect } from 'react';
import { Form, Radio } from 'antd';
import styles from './index.module.scss';
import OrderSummary from '@components/OrderSummaryComponent';
import { ICartResponse } from 'interfaces/cart.interface';
import classNames from 'classnames'; // cần thêm

const PaymentMethod: React.FC = () => {
  const [form] = Form.useForm();
  const [selectedPayment, setSelectedPayment] = useState<string>('cod');

  const [cart, setCart] = useState<ICartResponse>({
    id: 'cart_fake_001',
    items: [
      {
        id: 'item_001',
        quantity: 2,
        status: 'AVAILABLE',
        product: {
          id: 'product_001',
          name: 'T-shirt Basic',
          price: 25.0,
          discount: 10,
          discountPrice: 22.5,
        },
        variant: {
          id: 'variant_001',
          color: 'Red',
          image: 'https://via.placeholder.com/150x150.png?text=T-shirt+Red',
        },
        size: {
          id: 'size_001',
          size: 'M',
          inventory: 50,
        },
      },
      {
        id: 'item_002',
        quantity: 1,
        status: 'AVAILABLE',
        product: {
          id: 'product_002',
          name: 'Hoodie Oversized',
          price: 50.0,
          discount: 20,
          discountPrice: 40.0,
        },
        variant: {
          id: 'variant_002',
          color: 'Black',
          image: 'https://via.placeholder.com/150x150.png?text=Hoodie+Black',
        },
        size: {
          id: 'size_002',
          size: 'L',
          inventory: 20,
        },
      },
    ],
    statusCode: 200,
    message: 'Success',
  });

  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(10);
  const [taxes, setTaxes] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (cart.items.length > 0) {
      const subtotalCalc = cart.items.reduce((sum: number, item: { product: { discountPrice: number; }; quantity: number; }) => {
        return sum + (item.product.discountPrice * item.quantity);
      }, 0);
      const taxCalc = subtotalCalc * 0.08;
      const totalCalc = subtotalCalc + shipping + taxCalc;

      setSubtotal(subtotalCalc);
      setTaxes(taxCalc);
      setTotal(totalCalc);
    }
  }, [cart, shipping]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      console.log('Payment data:', values);
    });
  };

  const handleCancel = () => {
    console.log('Cancel payment');
  };

  const handlePaymentChange = (e: any) => {
    setSelectedPayment(e.target.value);
  };

  return (
    <div>
      <div className={styles.layout}>
        <div className={styles.mainContent}>
          <h1 className={styles.pageTitle}>Payment method</h1>

          <Form
            form={form}
            layout="vertical"
            initialValues={{ paymentMethod: 'cod' }}
            className={styles.formSection}
          >
            <Form.Item name="paymentMethod">
              <Radio.Group
                onChange={handlePaymentChange}
                value={selectedPayment}
                style={{ width: '100%' }}
              >
                <div
                  className={classNames(styles.paymentOption, {
                    [styles.selected]: selectedPayment === 'cod',
                  })}
                >
                  <Radio value="cod">
                    <div>
                      <div className={styles.paymentTitle}>COD</div>
                      <div className={styles.paymentDescription}>
                        Thanh toán khi nhận hàng
                      </div>
                    </div>
                  </Radio>
                </div>

                <div
                  className={classNames(styles.paymentOption, {
                    [styles.selected]: selectedPayment === 'banking',
                  })}
                >
                  <Radio value="banking">
                    <div>
                      <div className={styles.paymentTitle}>Banking</div>
                      <div className={styles.paymentDescription}>
                        Chuyển khoản ngân hàng
                      </div>
                    </div>
                  </Radio>
                </div>
              </Radio.Group>
            </Form.Item>

            <div className={styles.buttonGroup}>
              <button type="button" className={styles.primaryButton} onClick={handleSubmit}>
                Pay now
              </button>
              <button type="button" className={styles.secondaryButton} onClick={handleCancel}>
                Cancel
              </button>
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

export default PaymentMethod;
