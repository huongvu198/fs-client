const htmlContent = "";

const New = () => {
  return (
    <div
      style={{ padding: 16, backgroundColor: "#fff" }}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default New;
