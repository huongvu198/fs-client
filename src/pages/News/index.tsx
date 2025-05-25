import { useRedux, useReduxSelector } from "@hooks/useRedux";
import { getNew } from "@redux/appSlice";
import { Content } from "antd/es/layout/layout";
import { useEffect } from "react";
import { formatDateToVietnamese } from "shared/common";

const New = () => {
  const dispatch = useRedux();
  const { newData } = useReduxSelector((state) => state.app);

  useEffect(() => {
    dispatch(getNew());
  }, []);

  return (
    <Content>
      <div
        style={{
          width: "60%",
          margin: "0 auto",
          padding: 16,
          backgroundColor: "#fff",
        }}
      >
        <h2>{newData?.title}</h2>
        <p
          style={{
            color: "#666",
            fontSize: "0.9rem",
            marginTop: "-8px",
            marginBottom: "16px",
          }}
        >
          {newData?.createdAt && formatDateToVietnamese(newData.createdAt)}
        </p>
        <div
          style={{
            maxWidth: "100%",
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: newData?.content }} />
        </div>
        <style>
          {`
            div img {
              display: block;
              margin-left: auto;
              margin-right: auto;
              max-width: 100%;
              height: auto;
            }
          `}
        </style>
      </div>
    </Content>
  );
};

export default New;
