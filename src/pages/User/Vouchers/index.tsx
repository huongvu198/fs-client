import React, { useEffect } from "react";
import { Card, Skeleton } from "antd";
import { GiftOutlined } from "@ant-design/icons";
import DateTag from "@components/Common/DateTagProps";
import dayjs from "dayjs";
import { DiscountType } from "shared/enum";
import { FormattedNumber } from "react-intl";
import { useDispatch } from "react-redux";
import { ApiDispatch } from "@redux/index";
import { useReduxSelector } from "@hooks/useRedux";
import { getVoucherAvailable, resetVoucherState } from "@redux/voucherSlice";
import { Voucher } from "../../../interfaces/voucher.interface";

const gridStyle: React.CSSProperties = {
  width: "23%",
  textAlign: "center",
  margin: "1%",
  padding: 10,
};

const UserVouchersPage = () => {
  const dispatch = useDispatch<ApiDispatch>();
  const { vouchers, error, loading } = useReduxSelector(
    (state) => state.voucher
  );

  useEffect(() => {
    if (!vouchers) {
      dispatch(getVoucherAvailable());
    }
  }, [dispatch, vouchers]);

  useEffect(() => {
    dispatch(resetVoucherState());
  }, [error, dispatch]);

  return (
    <>
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <Card title="Khuyến mãi của tôi">
          {vouchers?.map((vc: Voucher) => (
            <Card.Grid key={vc.id} style={gridStyle}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    flex: "0 0 25%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <GiftOutlined style={{ fontSize: 24 }} />
                </div>

                <div style={{ flex: "1 0 70%", textAlign: "left" }}>
                  <p>
                    <strong>Mã:</strong> {vc.code}
                  </p>
                  <p>
                    <strong>Giảm giá:</strong>{" "}
                    {vc.type === DiscountType.FIXED ? (
                      <FormattedNumber
                        value={vc.discount}
                        style="currency"
                        currency="VND"
                      />
                    ) : (
                      `${vc.discount}%`
                    )}
                  </p>
                  <p>
                    {dayjs(vc.startDate).isAfter(dayjs()) ? (
                      <>
                        <strong>Ngày bắt đầu:</strong>{" "}
                        <DateTag date={vc.startDate} />
                      </>
                    ) : dayjs(vc.endDate).isBefore(dayjs()) ? (
                      <>
                        <strong>HSD:</strong>{" "}
                        <DateTag date={vc.endDate} color="red" />
                      </>
                    ) : (
                      <>
                        <strong>HSD:</strong> <DateTag date={vc.endDate} />
                      </>
                    )}
                  </p>
                </div>
              </div>
            </Card.Grid>
          ))}
        </Card>
      )}
    </>
  );
};

export default UserVouchersPage;
