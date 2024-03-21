import React from "react";
import CustomTable from "../custom-table";
import { TableCell, TableRow } from "@mui/material";
import { useGetProductsInStorage } from "../../hooks/storage";
import { langFormat } from "../../functions/langFormat";

const Head = () => {
  return (
    <TableRow sx={{ bgcolor: "primary.main", color: "white" }}>
      <TableCell sx={{ fontWeight: "bold" }}>
        {langFormat({ uzb: "Soni", en: "Count", ru: "Количество" })}
      </TableCell>
      <TableCell sx={{ fontWeight: "bold" }}>
        {langFormat({
          uzb: "Umumiy Kelish Narxi",
          en: "Total commming cost",
          ru: "Всего приход",
        })}
      </TableCell>
      <TableCell sx={{ fontWeight: "bold" }}>
        {langFormat({
          uzb: "Umumiy Sotilish Narxi",
          en: "Total selling cost",
          ru: "Всего продаж",
        })}
      </TableCell>
      <TableCell sx={{ fontWeight: "bold" }}>
        {langFormat({
          uzb: "Umumiy Foyda",
          en: "Total profit",
          ru: "Всего прибыль",
        })}
      </TableCell>
    </TableRow>
  );
};

const Body = () => {
  const { data: products } = useGetProductsInStorage();
  return (
    <TableRow>
      <TableCell>
        {products?.reduce((a, b) => a + b.count, 0) || 0}{" "}
        {langFormat({ uzb: "ta", en: "", ru: "" })}
      </TableCell>
      <TableCell>
        {products?.reduce((a, b) => a + b.count * b.cost, 0).toLocaleString() ||
          0}{" "}
        {langFormat({ uzb: "so'm", en: "so'm", ru: "сум" })}
      </TableCell>
      <TableCell>
        {products
          ?.reduce((a, b) => a + b.count * b.price, 0)
          .toLocaleString() || 0}{" "}
        {langFormat({ uzb: "so'm", en: "so'm", ru: "сум" })}
      </TableCell>
      <TableCell>
        {products
          ?.reduce((a, b) => a + b.count * (b.price - b.cost), 0)
          .toLocaleString() || 0}{" "}
        {langFormat({ uzb: "so'm", en: "so'm", ru: "сум" })}
      </TableCell>
    </TableRow>
  );
};

function StorageReport() {
  return (
    <CustomTable
      title={langFormat({ uzb: "Ombor", en: "Storage", ru: "Склад" })}
      tablebody={<Body />}
      tablehead={<Head />}
    />
  );
}

export default StorageReport;
