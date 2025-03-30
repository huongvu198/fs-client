import { Breadcrumb } from "antd";
import type { BreadcrumbProps } from "antd/es/breadcrumb";
import classNames from "classnames/bind";
import styles from "./index.module.scss";

const cx = classNames.bind(styles);

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface CustomBreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: string;
}

const BreadcrumbComponent = ({ items }: CustomBreadcrumbProps) => {
  const breadcrumbItems: BreadcrumbProps["items"] = [
    { title: <a href="/">Home</a> },
    ...items.map((item) => ({
      title: item.href ? <a href={item.href}>{item.label}</a> : item.label,
    })),
  ];

  return <Breadcrumb items={breadcrumbItems} separator="-" className={cx("bread-crumb-container")}/>;
};

export default BreadcrumbComponent;
