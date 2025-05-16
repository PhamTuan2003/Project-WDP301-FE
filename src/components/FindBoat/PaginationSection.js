import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Pagination } from "@mui/material";
import { setCurrentPage } from "../../redux/action";

const PaginationSection = ({ totalPages, filteredCruisesLength, indexOfFirstItem, indexOfLastItem }) => {
  const dispatch = useDispatch();
  const { currentPage } = useSelector((state) => state.filters || {});

  const startItem = filteredCruisesLength === 0 ? 0 : indexOfFirstItem + 1;
  const endItem = Math.min(indexOfLastItem, filteredCruisesLength);

  const theme = {
  palette: {
    divider: (theme) => (theme.palette.mode === 'light' ? '#eaecf0' : '#2f3b44'),
  },
};

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
          backgroundColor: (theme) => theme.palette.background.paper,
          padding: "5px 10px",
          borderRadius: "32px",
          boxShadow: (theme) => theme.shadows[1],
          borderColor: (theme) => theme.palette.divider,
        }}
      >
        Đang xem :{" "}
        <p
          style={{
            padding: "5px 10px",
            border: `2px solid ${theme.palette.divider(theme)}`,
            borderRadius: "100%",
            margin: "0 5px",
            color: 'text.primary',
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
          backgroundColor: (theme) => theme.palette.background.paper,
          padding: "5px 10px",
          borderRadius: "32px",
          boxShadow: (theme) => theme.shadows[1],
          borderColor: (theme) => theme.palette.divider,
          "& .MuiPaginationItem-root": {
            color: 'text.primary',
          },
        }}
      />
    </Box>
  );
};
export default PaginationSection;