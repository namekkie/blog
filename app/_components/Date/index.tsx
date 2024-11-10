import React from "react";
import { IoMdTime } from "react-icons/io";
import styles from "./index.module.css";
import { formatDate } from "@/app/_libs/utils";

type Props = {
  date: string;
};

export default function Date({ date }: Props) {
  return (
    <span className={styles.date}>
      <IoMdTime size={20} />
      {formatDate(date)}
    </span>
  );
}
