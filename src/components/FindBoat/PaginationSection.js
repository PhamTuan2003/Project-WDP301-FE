import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Pagination } from "@mui/material";
import { setCurrentPage } from "../../redux/action";

const PaginationSection = ({
  totalPages,
  filteredCruisesLength,
  indexOfFirstItem,
  indexOfLastItem,
}) => {
  const dispatch = useDispatch();
  const { currentPage } = useSelector((state) => state.filters || {});

  const startItem = filteredCruisesLength === 0 ? 0 : indexOfFirstItem + 1;
  const endItem = Math.min(indexOfLastItem, filteredCruisesLength);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mt: 3,
      }}
    >
      <Typography
        fontFamily="Archivo, sans-serif"
        variant="body2"
        color="text.secondary"
        sx={{
          mr: 1,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          backgroundColor: "#fff",
          padding: "5px 10px",
          borderRadius: "32px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        Đang xem :{" "}
        <p
          style={{
            padding: "5px 10px",
            border: "2px solid gray",
            borderRadius: "100%",
            margin: "0 5px",
          }}
        >
          {endItem}
        </p>{" "}
        trong tổng số {filteredCruisesLength}
      </Typography>
      <Pagination
        count={totalPages}
        page={Number.isInteger(currentPage) ? Math.max(1, currentPage) : 1}
        onChange={(event, value) => dispatch(setCurrentPage(value))}
        color="info"
        showFirstButton
        showLastButton
        sx={{
          fontFamily: "Archivo, sans-serif",
          fontWeight: 600,
          backgroundColor: "#eaecf0",
          padding: "5px 10px",
          borderRadius: "32px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.1)",
        }}
      />
    </Box>
  );
};
export default PaginationSection;
