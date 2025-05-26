import React, { useEffect, useState } from "react";
import { Button, Card, Empty, Space } from "antd";
import { EPopupMode } from "shared/enum";
import { formatPhoneInternal } from "shared/common";
import { useDispatch } from "react-redux";
import { ApiDispatch } from "@redux/index";
import { useReduxSelector } from "@hooks/useRedux";
import {
  getUserAddress,
  resetUserState,
  setDefaultAddress,
} from "@redux/userSlice";
import { Address } from "interfaces/user.interface";
import UserAddressModal from "@components/UserProfile/Popup";

const UserAddressPage: React.FC = () => {
  const dispatch = useDispatch<ApiDispatch>();
  const { userAddress, setAddressDefaultSuccess, error } = useReduxSelector(
    (state) => state.user
  );

  const [open, setOpen] = useState<{
    isOpen: boolean;
    mode: EPopupMode;
    address: Address | null;
  }>({
    isOpen: false,
    mode: EPopupMode.ADD,
    address: null,
  });

  useEffect(() => {
    if (!userAddress) {
      dispatch(getUserAddress());
    }
  }, [userAddress, dispatch]);

  const setDefault = (addressId: string) => {
    dispatch(setDefaultAddress(addressId));
  };

  useEffect(() => {
    dispatch(resetUserState());
  }, [error, setAddressDefaultSuccess]);

  return (
    <>
      <Card
        title="Địa chỉ của tôi"
        extra={
          <Button
            style={{ backgroundColor: "black", color: "white" }}
            onClick={() =>
              setOpen({
                isOpen: true,
                mode: EPopupMode.ADD,
                address: null,
              })
            }
          >
            Thêm địa chỉ
          </Button>
        }
      >
        {!userAddress ||
        !userAddress.addresses ||
        userAddress.addresses.length === 0 ? (
          <Empty description="Không có địa chỉ" />
        ) : (
          userAddress.addresses.map((address: Address) => (
            <Card
              key={address.id}
              type="inner"
              title={`${address.fullName} | ${formatPhoneInternal(address.phone)}`}
              extra={
                <Space>
                  <a
                    onClick={() =>
                      setOpen({
                        isOpen: true,
                        mode: EPopupMode.UPDATE,
                        address: address,
                      })
                    }
                  >
                    Cập nhật
                  </a>
                  {!address.isDefault && (
                    <a
                      style={{ color: "red" }}
                      onClick={() =>
                        setOpen({
                          isOpen: true,
                          mode: EPopupMode.DELETE,
                          address: address,
                        })
                      }
                    >
                      Xoá
                    </a>
                  )}
                </Space>
              }
              style={{ marginBottom: "16px" }}
            >
              <p>{address.street}</p>
              <p>{`${address.ward}, ${address.district}, ${address.city}`}</p>
              <p>{address.country}</p>
              <a
                onClick={() => {
                  if (!address.isDefault) {
                    setDefault(address.id);
                  }
                }}
                style={{
                  cursor: address.isDefault ? "not-allowed" : "pointer",
                  color: address.isDefault ? "gray" : "blue",
                }}
              >
                Thiết lập mặc định
              </a>
            </Card>
          ))
        )}
      </Card>

      {open.isOpen && (
        <UserAddressModal
          open={open.isOpen}
          setOpen={setOpen}
          mode={open.mode}
          address={open.address}
        />
      )}
    </>
  );
};

export default UserAddressPage;
