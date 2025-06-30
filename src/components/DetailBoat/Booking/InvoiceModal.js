import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  X,
  Download,
  FileText,
  Calendar,
  User,
  Ship,
  MapPin,
  Phone,
  Mail,
  Globe,
  Building2,
  CreditCard,
  Receipt,
  Clock,
  CheckCircle,
  AlertCircle,
  Hash,
  DollarSign,
  Percent,
  Calculator,
} from "lucide-react";
import { formatPrice } from "../../../redux/validation";
import { closeInvoiceModal } from "../../../redux/actions/uiActions";
import { downloadInvoicePDF } from "../../../redux/asyncActions/invoiceAsyncActions";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Typography,
  Box,
  Stack,
  Grid,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const InvoiceModal = () => {
  const dispatch = useDispatch();
  const { showInvoiceModal, invoiceData } = useSelector(
    (state) => state.ui.modals
  );
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  if (!showInvoiceModal || !invoiceData) return null;

  const handleCloseModal = () => {
    dispatch(closeInvoiceModal());
  };

  const handleDownloadPDF = () => {
    dispatch(downloadInvoicePDF(invoiceData._id));
  };

  // Lấy số liệu tài chính từ invoiceData.financials (backend trả về)
  const subtotal = invoiceData.financials?.subtotal ?? 0;
  const discount = invoiceData.financials?.totalDiscount ?? 0;
  const tax = invoiceData.financials?.totalTax ?? 0;
  const total = invoiceData.financials?.total ?? 0;
  const paidAmount = invoiceData.financials?.paidAmount ?? 0;
  const remainingAmount =
    invoiceData.financials?.remainingAmount ?? total - paidAmount;

  return (
    <Dialog
      open={showInvoiceModal}
      onClose={handleCloseModal}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: 24,
          background: "#fff",
          position: "relative",
        },
      }}
      BackdropProps={{
        sx: {
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(2px)",
        },
      }}
      aria-labelledby="invoice-dialog-title"
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(90deg, #2563eb 0%, #1e40af 100%)",
          color: "#fff",
          py: 2,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        id="invoice-dialog-title"
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              background: "rgba(255,255,255,0.15)",
              p: 1,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Receipt className="w-6 h-6" color="#fff" />
          </Box>
          <Box>
            <Typography
              variant="h6"
              fontWeight={600}
              fontFamily="Archivo, sans-serif"
            >
              Hóa đơn thanh toán
            </Typography>
            <Typography variant="subtitle2" fontFamily="Archivo, sans-serif">
              Hóa đơn điện tử
            </Typography>
          </Box>
        </Stack>
        <IconButton
          onClick={handleCloseModal}
          sx={{
            color: "#fff",
            ml: 2,
            "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
          }}
          aria-label="Đóng"
        >
          <X size={24} />
        </IconButton>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          background: "#f9fafb",
          px: { xs: 1, sm: 3 },
          py: { xs: 2, sm: 3 },
          maxHeight: fullScreen ? "unset" : "70vh",
        }}
      >
        {/* Thông tin định danh hóa đơn */}
        <Box
          mb={3}
          p={2}
          sx={{
            bgcolor: "#fffbe6",
            borderLeft: "8px solid #f59e42",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Hash className="w-4 h-4" color="#6b7280" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Ký hiệu hóa đơn
                  </Typography>
                  <Typography fontWeight={600}>AB/20E</Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <FileText className="w-4 h-4" color="#6b7280" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Số hóa đơn
                  </Typography>
                  <Typography fontWeight={600} color="primary.main">
                    {invoiceData.invoiceNumber}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Calendar className="w-4 h-4" color="#6b7280" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Ngày phát hành
                  </Typography>
                  <Typography fontWeight={600}>
                    {new Date(invoiceData.issueDate).toLocaleDateString(
                      "vi-VN"
                    )}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>
        {/* Thông tin người bán & người mua */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} lg={6}>
            <Box
              bgcolor="#f0f9ff"
              border={1}
              borderColor="#67e8f9"
              borderRadius={2}
              px={3}
              py={2}
              boxShadow={1}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                mb={2}
                pb={1}
                borderBottom={1}
                borderColor="#f3f4f6"
              >
                <Building2 className="w-6 h-5" color="#2563eb" />
                <Typography
                  fontWeight={700}
                  color="text.primary"
                  textTransform="uppercase"
                  fontSize={16}
                >
                  Thông tin người bán
                </Typography>
              </Stack>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Building2 className="w-4 h-4" color="#94a3b8" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Tên công ty:
                    </Typography>
                    <Typography fontWeight={600}>
                      CÔNG TY DU THUYỀN LONGWARE
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <MapPin className="w-4 h-4" color="#94a3b8" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Địa chỉ:
                    </Typography>
                    <Typography>
                      {" "}
                      Khu công nghệ cao, Hòa lạc, Thạch Thất, Hà Nội
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Hash className="w-4 h-4" color="#94a3b8" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Mã số thuế:
                    </Typography>
                    <Typography fontWeight={600} color="error.main">
                      0123456789
                    </Typography>
                  </Box>
                </Stack>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Phone className="w-4 h-4" color="#94a3b8" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Điện thoại:
                        </Typography>
                        <Typography>0123-456-789</Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Mail className="w-4 h-4" color="#94a3b8" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Email:
                        </Typography>
                        <Typography sx={{ wordBreak: "break-all" }}>
                          longwareBooking@yacht.com
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Globe className="w-4 h-4" color="#94a3b8" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Website:
                    </Typography>
                    <Typography color="primary.main">
                      www.longware.com
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Box
              bgcolor="#f3f4f6"
              border={1}
              borderColor="#67e8f9"
              borderRadius={2}
              px={3}
              py={2}
              boxShadow={1}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                mb={2}
                pb={1}
                borderBottom={1}
                borderColor="#f3f4f6"
              >
                <User className="w-5 h-5" color="#22c55e" />
                <Typography fontWeight={700} color="text.primary" fontSize={16}>
                  Thông tin người mua
                </Typography>
              </Stack>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <User className="w-4 h-4" color="#94a3b8" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Họ và tên:
                    </Typography>
                    <Typography fontWeight={600}>
                      {invoiceData.customerInfo.fullName}
                    </Typography>
                  </Box>
                </Stack>
                {invoiceData.customerInfo.address && (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <MapPin className="w-4 h-4" color="#94a3b8" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Địa chỉ:
                      </Typography>
                      <Typography>
                        {invoiceData.customerInfo.address}
                      </Typography>
                    </Box>
                  </Stack>
                )}
                {invoiceData.customerInfo.taxCode && (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Hash className="w-4 h-4" color="#94a3b8" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Mã số thuế:
                      </Typography>
                      <Typography fontWeight={600} color="error.main">
                        {invoiceData.customerInfo.taxCode}
                      </Typography>
                    </Box>
                  </Stack>
                )}
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Phone className="w-4 h-4" color="#94a3b8" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Số điện thoại:
                        </Typography>
                        <Typography>
                          {invoiceData.customerInfo.phoneNumber}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Mail className="w-4 h-4" color="#94a3b8" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Email:
                        </Typography>
                        <Typography sx={{ wordBreak: "break-all" }}>
                          {invoiceData.customerInfo.email}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
            </Box>
          </Grid>
        </Grid>
        {/* Thông tin dịch vụ */}
        {invoiceData.yachtInfo && (
          <Box
            mb={3}
            p={2}
            sx={{
              bgcolor: "linear-gradient(90deg, #f0fdfa 0%, #ecfeff 100%)",
              border: "1px solid #5eead4",
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              mb={1}
              pb={1}
              borderBottom={1}
              borderColor="#e5e7eb"
            >
              <Ship className="w-6 h-5" color="#14b8a6" />
              <Typography fontWeight={700} color="#0e7490" fontSize={16}>
                Thông tin dịch vụ
              </Typography>
            </Stack>
            <Grid container spacing={2}>
              {invoiceData.yachtInfo.name && (
                <Grid item xs={12} md={4}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Ship className="w-4 h-4" color="#2dd4bf" />
                    <Box>
                      <Typography variant="caption" color="#0e7490">
                        Du thuyền
                      </Typography>
                      <Typography fontWeight={600}>
                        {invoiceData.yachtInfo.name}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              )}
              {invoiceData.yachtInfo.location && (
                <Grid item xs={12} md={4}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <MapPin className="w-4 h-4" color="#2dd4bf" />
                    <Box>
                      <Typography variant="caption" color="#0e7490">
                        Địa điểm
                      </Typography>
                      <Typography>{invoiceData.yachtInfo.location}</Typography>
                    </Box>
                  </Stack>
                </Grid>
              )}
              {invoiceData.yachtInfo.scheduleInfo && (
                <Grid item xs={12} md={4}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Calendar className="w-4 h-4" color="#2dd4bf" />
                    <Box>
                      <Typography variant="caption" color="#0e7490">
                        Lịch trình
                      </Typography>
                      <Typography>
                        {invoiceData.yachtInfo.scheduleInfo}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              )}
              {invoiceData.yachtInfo.checkInDate && (
                <Grid item xs={12} md={4}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Calendar className="w-4 h-4" color="#2dd4bf" />
                    <Box>
                      <Typography variant="caption" color="#0e7490">
                        Ngày nhận phòng
                      </Typography>
                      <Typography>
                        {new Date(
                          invoiceData.yachtInfo.checkInDate
                        ).toLocaleDateString("vi-VN")}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              )}
              {invoiceData.yachtInfo.checkOutDate && (
                <Grid item xs={12} md={4}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Calendar className="w-4 h-4" color="#2dd4bf" />
                    <Box>
                      <Typography variant="caption" color="#0e7490">
                        Ngày trả phòng
                      </Typography>
                      <Typography>
                        {new Date(
                          invoiceData.yachtInfo.checkOutDate
                        ).toLocaleDateString("vi-VN")}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              )}
            </Grid>
            {/* Số khách */}
            {invoiceData.guestInfo && (
              <Box mt={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <User className="w-4 h-4" color="#2dd4bf" />
                  <Typography
                    variant="caption"
                    color="#0e7490"
                    fontWeight={600}
                  >
                    Số khách:
                  </Typography>
                  <Typography fontWeight={700} color="#134e4a">
                    {invoiceData.guestInfo.adults || 0} người lớn
                    {typeof invoiceData.guestInfo.childrenUnder10 === "number"
                      ? `, ${invoiceData.guestInfo.childrenUnder10} trẻ em dưới 10 tuổi`
                      : ""}
                    {typeof invoiceData.guestInfo.childrenAbove10 === "number"
                      ? `, ${invoiceData.guestInfo.childrenAbove10} trẻ em từ 10 tuổi`
                      : ""}
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary" ml={4}>
                  Tổng khách quy đổi:{" "}
                  {invoiceData.guestInfo.adults +
                    Math.ceil(
                      (invoiceData.guestInfo.childrenAbove10 || 0) / 2
                    )}{" "}
                  (2 trẻ em từ 10 tuổi tính là 1 người lớn, trẻ em dưới 10 tuổi
                  không tính)
                </Typography>
              </Box>
            )}
          </Box>
        )}
        {/* Bảng chi tiết dịch vụ */}
        <Box mb={3}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <Receipt className="w-5 h-5" color="#64748b" />
            <Typography fontWeight={700} color="text.primary" fontSize={18}>
              Chi tiết phòng và dịch vụ{" "}
            </Typography>
          </Stack>
          <Box
            sx={{
              overflowX: "auto",
              borderRadius: 2,
              border: "1px solid #60a5fa",
              boxShadow: 1,
            }}
          >
            <table
              style={{
                width: "100%",
                background: "#fff",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    background:
                      "linear-gradient(90deg, #eff6ff 0%, #dbeafe 100%)",
                  }}
                >
                  <th
                    style={{
                      borderBottom: "1px solid #93c5fd",
                      padding: 12,
                      textAlign: "left",
                      fontWeight: 600,
                      color: "#2563eb",
                      fontSize: 14,
                    }}
                  >
                    STT
                  </th>
                  <th
                    style={{
                      borderBottom: "1px solid #93c5fd",
                      padding: 12,
                      textAlign: "left",
                      fontWeight: 600,
                      color: "#2563eb",
                      fontSize: 14,
                    }}
                  >
                    Tên phòng, dịch vụ
                  </th>
                  <th
                    style={{
                      borderBottom: "1px solid #93c5fd",
                      padding: 12,
                      textAlign: "center",
                      fontWeight: 600,
                      color: "#2563eb",
                      fontSize: 14,
                    }}
                  >
                    Đơn vị tính
                  </th>
                  <th
                    style={{
                      borderBottom: "1px solid #93c5fd",
                      padding: 12,
                      textAlign: "center",
                      fontWeight: 600,
                      color: "#2563eb",
                      fontSize: 14,
                    }}
                  >
                    Số lượng
                  </th>
                  <th
                    style={{
                      borderBottom: "1px solid #93c5fd",
                      padding: 12,
                      textAlign: "right",
                      fontWeight: 600,
                      color: "#2563eb",
                      fontSize: 14,
                    }}
                  >
                    Đơn giá
                  </th>
                  <th
                    style={{
                      borderBottom: "1px solid #93c5fd",
                      padding: 12,
                      textAlign: "right",
                      fontWeight: 600,
                      color: "#2563eb",
                      fontSize: 14,
                    }}
                  >
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items?.map((item, index) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom: "1px solid #e0e7ef",
                      background: index % 2 === 0 ? "#fff" : "#f8fafc",
                    }}
                  >
                    <td
                      style={{
                        padding: 12,
                        textAlign: "center",
                        color: "#64748b",
                        fontWeight: 500,
                      }}
                    >
                      {index + 1}
                    </td>
                    <td style={{ padding: 12 }}>
                      <Typography fontWeight={600} color="text.primary">
                        {item.name}
                      </Typography>
                      {item.description && (
                        <Typography variant="caption" color="text.secondary">
                          {item.description}
                        </Typography>
                      )}
                    </td>
                    <td
                      style={{
                        padding: 12,
                        textAlign: "center",
                        color: "#64748b",
                      }}
                    >
                      {item.name && item.name.toLowerCase().includes("phòng")
                        ? "Phòng"
                        : "Người"}
                    </td>
                    <td
                      style={{
                        padding: 12,
                        textAlign: "center",
                        fontWeight: 600,
                      }}
                    >
                      {item.quantity}
                    </td>
                    <td
                      style={{
                        padding: 12,
                        textAlign: "right",
                        fontWeight: 600,
                      }}
                    >
                      {formatPrice(item.unitPrice)}
                    </td>
                    <td
                      style={{
                        padding: 12,
                        textAlign: "right",
                        fontWeight: 700,
                        color: "#2563eb",
                      }}
                    >
                      {formatPrice(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Box>
        {/* Tổng tiền */}
        <Box mb={3} display="flex" justifyContent="end">
          <Box
            width="100%"
            maxWidth={400}
            boxShadow={3}
            border={1}
            borderColor="#fca5a5"
            borderRadius={2}
            p={2}
            bgcolor="linear-gradient(90deg, #fef2f2 0%, #eff6ff 100%)"
          >
            <Stack spacing={1}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Calculator className="w-4 h-4" color="#64748b" />
                  <Typography color="text.secondary">
                    Tổng tiền phòng và dịch vụ
                  </Typography>
                </Stack>
                <Typography fontWeight={600}>
                  {formatPrice(subtotal)}
                </Typography>
              </Stack>
              {discount > 0 && (
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Percent className="w-4 h-4" color="#ef4444" />
                    <Typography color="error.main">
                      Chiết khấu thương mại
                    </Typography>
                  </Stack>
                  <Typography fontWeight={600} color="error.main">
                    -{formatPrice(discount)}
                  </Typography>
                </Stack>
              )}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <DollarSign className="w-4 h-4" color="#64748b" />
                  <Typography color="text.secondary">
                    Tiền chưa có thuế VAT
                  </Typography>
                </Stack>
                <Typography fontWeight={600}>
                  {formatPrice(subtotal - discount)}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Percent className="w-4 h-4" color="#f59e42" />
                  <Typography color="text.secondary">Thuế VAT (5%)</Typography>
                </Stack>
                <Typography fontWeight={600} color="#f59e42">
                  {formatPrice(tax)}
                </Typography>
              </Stack>
              <Divider sx={{ my: 1 }} />
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Receipt className="w-5 h-5" color="#2563eb" />
                  <Typography
                    fontWeight={700}
                    color="text.primary"
                    fontSize={16}
                  >
                    TỔNG TIỀN THANH TOÁN
                  </Typography>
                </Stack>
                <Typography fontWeight={700} color="#2563eb" fontSize={20}>
                  {formatPrice(total)}
                </Typography>
              </Stack>
              <Box
                bgcolor="#f0fdf4"
                border={1}
                borderColor="#bbf7d0"
                borderRadius={1}
                p={1.5}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CheckCircle className="w-4 h-4" color="#22c55e" />
                    <Typography color="#22c55e" fontWeight={600}>
                      Đã thanh toán
                    </Typography>
                  </Stack>
                  <Typography fontWeight={700} color="#22c55e">
                    {formatPrice(paidAmount)}
                  </Typography>
                </Stack>
              </Box>
              {remainingAmount > 0 && (
                <Box
                  bgcolor="#fff7ed"
                  border={1}
                  borderColor="#fdba74"
                  borderRadius={1}
                  p={1.5}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <AlertCircle className="w-4 h-4" color="#f59e42" />
                      <Typography color="#f59e42" fontWeight={600}>
                        Còn lại
                      </Typography>
                    </Stack>
                    <Typography fontWeight={700} color="#f59e42">
                      {formatPrice(remainingAmount)}
                    </Typography>
                  </Stack>
                </Box>
              )}
            </Stack>
          </Box>
        </Box>
        {/* Thông tin giao dịch */}
        <Box
          mb={3}
          bgcolor="#f0fdf4"
          border={1}
          borderColor="#bbf7d0"
          borderRadius={2}
          px={3}
          py={2}
          boxShadow={1}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            mb={1}
            pb={1}
            borderBottom={1}
            borderColor="#e5e7eb"
          >
            <CreditCard className="w-5 h-5" color="#a21caf" />
            <Typography fontWeight={700} color="text.primary" fontSize={18}>
              Thông tin thanh toán
            </Typography>
          </Stack>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Receipt className="w-4 h-4" color="#94a3b8" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Loại giao dịch
                  </Typography>
                  <Typography fontWeight={600}>
                    {invoiceData.transactionId?.transaction_type === "deposit"
                      ? "Thanh toán cọc"
                      : "Thanh toán đầy đủ"}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Hash className="w-4 h-4" color="#94a3b8" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Mã giao dịch
                  </Typography>
                  <Typography fontFamily="monospace" fontSize={14}>
                    {invoiceData.transactionId?.transaction_reference}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <CheckCircle className="w-4 h-4" color="#22c55e" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Trạng thái
                  </Typography>
                  <Typography fontWeight={600} color="#22c55e">
                    Thành công
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Clock className="w-4 h-4" color="#94a3b8" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Thời gian thanh toán
                  </Typography>
                  <Typography fontSize={14}>
                    {invoiceData.transactionId?.completedAt
                      ? new Date(
                          invoiceData.transactionId.completedAt
                        ).toLocaleString("vi-VN")
                      : "N/A"}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>
        {/* Ghi chú */}
        {invoiceData.notes && (
          <Box
            mb={3}
            bgcolor="#fffbe6"
            border={1}
            borderColor="#fde68a"
            borderRadius={2}
            p={3}
            boxShadow={1}
          >
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <FileText className="w-5 h-5" color="#f59e42" />
              <Typography fontWeight={700} color="#f59e42">
                Ghi chú
              </Typography>
            </Stack>
            <Typography color="#f59e42">{invoiceData.notes}</Typography>
          </Box>
        )}
        {/* Chữ ký điện tử */}
        <Grid container spacing={4} pt={2} borderColor="#e5e7eb">
          <Grid item xs={12} md={6} textAlign="center">
            <Typography fontWeight={700} color="text.primary" mb={0.5}>
              NGƯỜI MUA
            </Typography>
            <Typography variant="caption" color="text.secondary" mb={2}>
              (Ký, ghi rõ họ tên)
            </Typography>
            <Box
              height={48}
              borderBottom={1}
              borderColor="#e5e7eb"
              width="30%"
              mx="auto"
              mb={1}
            ></Box>
            <Typography fontWeight={600}>
              {invoiceData.customerInfo.fullName}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} textAlign="center">
            <Typography fontWeight={700} color="text.primary" mb={0.5}>
              NGƯỜI BÁN
            </Typography>
            <Typography variant="caption" color="text.secondary" mb={2}>
              (Ký, đóng dấu, ghi rõ họ tên)
            </Typography>
            <Box
              height={48}
              borderBottom={1}
              borderColor="#e5e7eb"
              width="30%"
              mx="auto"
              mb={1}
            ></Box>
            <Typography fontWeight={600}>
              Công ty TNHH Du thuyền Longware
            </Typography>
          </Grid>
        </Grid>
        {/* Footer cảm ơn */}
        <Box
          textAlign="center"
          pt={3}
          mt={3}
          borderTop={1}
          borderColor="#e5e7eb"
        >
          <Box
            bgcolor="linear-gradient(90deg, #c026d3 0%, #db2777 100%)"
            color="pink"
            boxShadow={2}
            borderRadius={2}
            p={2}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={1}
              mb={1}
            >
              <CheckCircle className="w-6 h-6" color="pink" />
              <Typography fontWeight={700} color="pink" fontSize={20}>
                Cảm ơn quý khách!
              </Typography>
            </Stack>
            <Typography color="pink">
              Chúng tôi hy vọng được phục vụ quý khách trong những chuyến đi
              tiếp theo.
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          bgcolor: "#f3f4f6",
          px: 3,
          py: 2,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          borderTop: "1px solid #e5e7eb",
          position: "sticky",
          bottom: 0,
          zIndex: 1,
        }}
      >
        <Button
          onClick={handleDownloadPDF}
          variant="contained"
          color="primary"
          startIcon={<Download size={18} />}
          sx={{
            fontWeight: 600,
            px: 3,
            py: 1.5,
            borderRadius: 2,
            boxShadow: 2,
            textTransform: "none",
          }}
        >
          Tải xuống PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvoiceModal;
