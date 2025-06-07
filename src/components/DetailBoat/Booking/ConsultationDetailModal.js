import React from "react";
import {
  Modal,
  Backdrop,
  Box,
  Typography,
  IconButton,
  Divider,
  Stack,
  Chip,
  Card,
  CardContent,
  Button,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  XCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  FileText,
  Building,
  Edit,
} from "lucide-react";
import { formatPrice } from "../../../redux/validation";

// Framer-Motion wrappers
const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionButton = motion(Button);

// Animation variants
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8, y: -20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, type: "spring", stiffness: 120 },
  }),
};

const ConsultationDetailsModal = ({
  open,
  onClose,
  consultation,
  onEdit,
  onCancel,
}) => {
  const theme = useTheme();
  if (!consultation) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
          },
        },
      }}
    >
      <MotionBox
        component="div"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        sx={{
          position: "absolute",
          top: "7%",
          left: "33%",
          transform: "translate(-50%,-50%)",
          width: { xs: "90%", sm: 550 },
          maxHeight: "87vh",
          overflowY: "auto",
          bgcolor: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(8px)",
          borderRadius: 2,
          boxShadow: theme.shadows[24],
          p: 3,
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography
            fontFamily="Archivo, sans-serif"
            variant="h5"
            sx={{ flexGrow: 1, textAlign: "center" }}
            fontWeight={700}
            color="primary"
          >
            Chi tiết yêu cầu tư vấn
          </Typography>
          <IconButton onClick={onClose} size="small">
            <XCircle size={20} />
          </IconButton>
        </Box>
        <Divider />

        {/* Thông tin user */}
        <Stack spacing={1.5} mt={2}>
          {[
            {
              icon: <User size={18} />,
              label: "Họ và tên",
              value: consultation.fullName,
            },
            {
              icon: <Mail size={18} />,
              label: "Email",
              value: consultation.email,
            },
            {
              icon: <Phone size={18} />,
              label: "Điện thoại",
              value: consultation.phoneNumber,
            },
            {
              icon: <MapPin size={18} />,
              label: "Địa chỉ",
              value: consultation.address || "N/A",
            },
            {
              icon: <Calendar size={18} />,
              label: "Ngày nhận phòng",
              value: new Date(consultation.checkInDate).toLocaleDateString(
                "vi-VN"
              ),
            },
            {
              icon: <Users size={18} />,
              label: "Số khách",
              value: consultation.guestCount,
            },
            {
              icon: <FileText size={18} />,
              label: "Yêu cầu",
              value: consultation.requirements || "N/A",
            },
          ].map((row, i) => (
            <Stack
              key={i}
              component={motion.div}
              custom={i}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              direction="row"
              spacing={1}
              alignItems="center"
            >
              {row.icon}
              <Typography
                fontFamily="Archivo, sans-serif"
                color="#0e4f4f"
                fontWeight={600}
                flex={1}
              >
                {row.label}:
              </Typography>
              <Typography
                fontFamily="Archivo, sans-serif"
                flex={2}
                bgcolor={"white"}
                borderRadius={1}
                p={0.5}
              >
                {row.value}
              </Typography>
            </Stack>
          ))}
        </Stack>

        {/* Selected rooms */}
        <Typography
          fontFamily="Archivo, sans-serif"
          variant="subtitle1"
          color="#0e4f4f"
          fontWeight={600}
          mt={3}
          mb={1}
        >
          Phòng đã chọn
        </Typography>
        <Stack spacing={1}>
          {consultation.selectedRooms.map((room, i) => (
            <MotionCard
              key={i}
              component="div"
              variants={itemVariants}
              custom={i + 7}
              initial="hidden"
              animate="visible"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                boxShadow: theme.shadows[4],
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Building size={18} />
                <Typography fontFamily="Archivo, sans-serif">
                  {room.name}
                </Typography>
                <Chip label={`x${room.quantity}`} size="small" color="info" />
              </Stack>
              <Typography fontFamily="Archivo, sans-serif" fontWeight={500}>
                {formatPrice(room.price)}
              </Typography>
            </MotionCard>
          ))}
        </Stack>

        {/* Tổng tiền */}
        <Stack direction="row" justifyContent="space-between" mt={2} mb={3}>
          <Typography
            fontFamily="Archivo, sans-serif"
            color="#0e4f4f"
            fontWeight={700}
            variant="subtitle1"
          >
            Tổng tiền:
          </Typography>
          <Typography
            fontFamily="Archivo, sans-serif"
            variant="h6"
            color="primary"
            fontWeight={700}
          >
            {formatPrice(consultation.totalPrice)}
          </Typography>
        </Stack>

        <Divider />

        {/* Actions */}
        <Stack direction="row" justifyContent="flex-end" spacing={1} mt={2}>
          <MotionButton
            variant="contained"
            color="primary"
            startIcon={<Edit size={16} />}
            onClick={onEdit}
            whileHover={{ scale: 1.05 }}
            sx={{ textTransform: "none", fontFamily: "Archivo, sans-serif" }}
          >
            Chỉnh sửa
          </MotionButton>
          <MotionButton
            variant="outlined"
            color="error"
            onClick={onCancel}
            whileHover={{ scale: 1.05 }}
            sx={{ textTransform: "none", fontFamily: "Archivo, sans-serif" }}
          >
            Hủy yêu cầu
          </MotionButton>
          <MotionButton
            variant="text"
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            sx={{ textTransform: "none", fontFamily: "Archivo, sans-serif" }}
          >
            Đóng
          </MotionButton>
        </Stack>
      </MotionBox>
    </Modal>
  );
};

export default ConsultationDetailsModal;
