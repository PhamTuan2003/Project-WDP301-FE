import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  X,
  Download,
  Printer,
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
import { closeInvoiceModal } from "../../../redux/action";
import { downloadInvoicePDF } from "../../../redux/asyncActions";
import { Typography } from "@mui/material";

const InvoiceModal = () => {
  const dispatch = useDispatch();
  const { showInvoiceModal, invoiceData } = useSelector(
    (state) => state.ui.modals
  );

  if (!showInvoiceModal || !invoiceData) return null;

  const handleCloseModal = () => {
    dispatch(closeInvoiceModal());
  };

  const handleDownloadPDF = () => {
    dispatch(downloadInvoicePDF(invoiceData._id));
  };

  const handlePrint = () => {
    window.print();
  };

  console.log("invoiceData", invoiceData);

  const subtotal =
    invoiceData.subtotal ??
    invoiceData.items?.reduce((sum, item) => sum + (item.totalPrice || 0), 0) ??
    0;
  const discount = invoiceData.discount ?? 0;
  const tax = invoiceData.tax ?? 0;
  const total = invoiceData.total ?? subtotal - discount + tax;
  const paidAmount = invoiceData.paidAmount ?? 0;
  const remainingAmount = invoiceData.remainingAmount ?? total - paidAmount;

  return (
    <div className="fixed inset-0  bg-black mt-20 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[85vh] overflow-y-scroll [::-webkit-scrollbar]:display-none shadow-2xl">
        {/* Header với gradient background */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 px-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center  space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  fontFamily={"Archivo, sans-serif"}
                  className="font-bold font-archivo"
                >
                  HÓA ĐƠN GIÁ TRỊ GIA TĂNG
                </Typography>
                <Typography
                  variant="subtitle2"
                  fontFamily={"Archivo, sans-serif"}
                  className="font-bold"
                >
                  Electronic Invoice
                </Typography>
              </div>
            </div>
            <button
              onClick={handleCloseModal}
              className="text-white hover:text-red-200 transition-colors p-2 hover:bg-white hover:bg-opacity-20 rounded-lg"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6" id="invoice-content">
          {/* Thông tin định danh hóa đơn */}
          <div className="bg-yellow-50 shadow-lg rounded-xl p-3 mb-5 border-l-8 border-yellow-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center space-x-2">
                <Hash className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Ký hiệu hóa đơn</p>
                  <p className="font-semibold text-gray-800">AB/20E</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Số hóa đơn</p>
                  <p className="font-semibold text-blue-600">
                    {invoiceData.invoiceNumber}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Ngày phát hành</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(invoiceData.issueDate).toLocaleDateString(
                      "vi-VN"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-5">
            {/* Thông tin người bán */}
            <div className="bg-gray-50 border border-cyan-300 rounded-xl px-6 py-3 shadow-lg">
              <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-gray-100">
                <Building2 className="w-6 h-5 text-blue-600" />
                <h4 className="font-bold text-gray-800 uppercase text-base">
                  Thông tin người bán
                </h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Building2 className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Tên công ty:</p>
                    <p className="font-semibold text-gray-800">
                      CÔNG TY DU THUYỀN ABC
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Địa chỉ:</p>
                    <p className="text-gray-700">
                      Khu công nghệ cao, Hòa lạc, Thạch Thất, Hà Nội
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Hash className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Mã số thuế:</p>
                    <p className="font-semibold text-red-600">0123456789</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Điện thoại:</p>
                      <p className="text-gray-700">0123-456-789</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email:</p>
                      <p className="text-gray-700">info@yacht.com</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Website:</p>
                    <p className="text-blue-600">www.yacht.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin người mua */}
            <div className="bg-gray-100 border border-cyan-300 rounded-xl px-6 py-3 shadow-lg">
              <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-gray-100">
                <User className="w-5 h-5 text-green-600" />
                <h4 className="font-bold text-gray-800 text-base">
                  THÔNG TIN NGƯỜI MUA
                </h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <User className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Họ và tên:</p>
                    <p className="font-semibold text-gray-800">
                      {invoiceData.customerInfo.fullName}
                    </p>
                  </div>
                </div>
                {invoiceData.customerInfo.address && (
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Địa chỉ:</p>
                      <p className="text-gray-700">
                        {invoiceData.customerInfo.address}
                      </p>
                    </div>
                  </div>
                )}
                {invoiceData.customerInfo.taxCode && (
                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Mã số thuế:</p>
                      <p className="font-semibold text-red-600">
                        {invoiceData.customerInfo.taxCode}
                      </p>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Số điện thoại:</p>
                      <p className="text-gray-700">
                        {invoiceData.customerInfo.phoneNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email:</p>
                      <p className="text-gray-700">
                        {invoiceData.customerInfo.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin dịch vụ */}
          {invoiceData.yachtInfo && (
            <div className="bg-gradient-to-r shadow-lg from-teal-50 to-cyan-50 border border-teal-300 rounded-xl px-6 py-3 mb-6">
              <div className="flex items-center border-b border-gray-200 pb-3 space-x-2 mb-1">
                <Ship className="w-6 h-5 text-teal-600" />
                <h4 className="font-bold text-teal-700 text-base">
                  THÔNG TIN DỊCH VỤ
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {invoiceData.yachtInfo.name && (
                  <div className="flex items-center space-x-2">
                    <Ship className="w-4 h-4 text-teal-500" />
                    <div>
                      <p className="text-sm text-teal-700">Du thuyền</p>
                      <p className="font-semibold text-teal-800">
                        {invoiceData.yachtInfo.name}
                      </p>
                    </div>
                  </div>
                )}
                {invoiceData.yachtInfo.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-teal-500" />
                    <div>
                      <p className="text-sm text-teal-600">Địa điểm</p>
                      <p className="text-teal-700">
                        {invoiceData.yachtInfo.location}
                      </p>
                    </div>
                  </div>
                )}
                {invoiceData.yachtInfo.scheduleInfo && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-teal-500" />
                    <div>
                      <p className="text-sm text-teal-700">Lịch trình</p>
                      <p className="text-teal-700">
                        {invoiceData.yachtInfo.scheduleInfo}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bảng chi tiết dịch vụ */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <Receipt className="w-5 h-5 text-gray-600" />
              <h4 className="font-bold text-gray-800 text-lg">
                CHI TIẾT HÀNG HÓA, DỊCH VỤ
              </h4>
            </div>
            <div className="overflow-x-auto rounded-xl border border-blue-300 shadow-lg">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-blue-100">
                    <th className="border-b border-blue-200 px-4 py-3 text-left text-sm font-semibold text-blue-700">
                      STT
                    </th>
                    <th className="border-b border-blue-200 px-4 py-3 text-left text-sm font-semibold text-blue-700">
                      Tên hàng hóa, dịch vụ
                    </th>
                    <th className="border-b border-blue-200 px-4 py-3 text-center text-sm font-semibold text-blue-700">
                      Đơn vị tính
                    </th>
                    <th className="border-b border-blue-200 px-4 py-3 text-center text-sm font-semibold text-blue-700">
                      Số lượng
                    </th>
                    <th className="border-b border-blue-200 px-4 py-3 text-right text-sm font-semibold text-blue-700">
                      Đơn giá
                    </th>
                    <th className="border-b border-blue-200 px-4 py-3 text-right text-sm font-semibold text-blue-700">
                      Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {invoiceData.items?.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-blue-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-center font-medium text-gray-600">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="font-medium text-gray-800">
                          {item.roomName}
                        </div>
                        {item.description && (
                          <div className="text-xs text-gray-500 mt-1">
                            {item.description}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-gray-600">
                        Phòng
                      </td>
                      <td className="px-4 py-3 text-sm text-center font-medium text-gray-800">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-gray-800">
                        {formatPrice(item.unitPrice)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-blue-600">
                        {formatPrice(item.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tổng tiền với thiết kế đẹp */}
          <div className=" rounded-xl p-2 mb-6">
            <div className="flex justify-end ">
              <div className="w-full max-w-md shadow-xl border border-red-300 bg-gradient-to-r from-red-50 to-blue-50 p-3 rounded-xl space-y-3">
                <div className="flex justify-between items-center py-2">
                  <div className="flex items-center space-x-2">
                    <Calculator className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">
                      Tổng tiền hàng hóa, dịch vụ
                    </span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center space-x-2">
                      <Percent className="w-4 h-4 text-red-500" />
                      <span className="text-red-600">
                        Chiết khấu thương mại
                      </span>
                    </div>
                    <span className="text-red-600 font-semibold">
                      -{formatPrice(discount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center py-2">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">Tiền chưa có thuế VAT</span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    {formatPrice(subtotal - discount)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <div className="flex items-center space-x-2">
                    <Percent className="w-4 h-4 text-orange-500" />
                    <span className="text-gray-700">Thuế VAT (5%)</span>
                  </div>
                  <span className="font-semibold text-orange-600">
                    {formatPrice(tax)}
                  </span>
                </div>

                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Receipt className="w-5 h-5 text-blue-600" />
                      <span className="text-lg font-bold text-gray-800">
                        TỔNG TIỀN THANH TOÁN
                      </span>
                    </div>
                    <span className="text-xl font-bold text-blue-600">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-700 font-medium">
                        Đã thanh toán
                      </span>
                    </div>
                    <span className="font-bold text-green-600">
                      {formatPrice(paidAmount)}
                    </span>
                  </div>
                </div>

                {remainingAmount > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-orange-600" />
                        <span className="text-orange-700 font-medium">
                          Còn lại
                        </span>
                      </div>
                      <span className="font-bold text-orange-600">
                        {formatPrice(remainingAmount)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Thông tin giao dịch */}
          <div className="bg-green-50 border border-green-300 rounded-xl px-6 py-3 mb-6 shadow-lg">
            <div className="flex items-center space-x-2 mb-2 pb-1 border-b border-gray-200">
              <CreditCard className="w-5 h-5 text-purple-600" />
              <h4 className="font-bold text-gray-800 text-lg">
                THÔNG TIN THANH TOÁN
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Receipt className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Loại giao dịch</p>
                  <p className="font-semibold text-gray-800">
                    {invoiceData.transactionId?.transaction_type === "deposit"
                      ? "Thanh toán cọc"
                      : "Thanh toán đầy đủ"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Hash className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Mã giao dịch</p>
                  <p className="font-mono text-gray-800 text-sm">
                    {invoiceData.transactionId?.transaction_reference}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Trạng thái</p>
                  <p className="font-semibold text-green-600">Thành công</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Thời gian thanh toán</p>
                  <p className="text-gray-800 text-sm">
                    {invoiceData.transactionId?.completedAt
                      ? new Date(
                          invoiceData.transactionId.completedAt
                        ).toLocaleString("vi-VN")
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ghi chú */}
          {invoiceData.notes && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6 shadow-lg">
              <div className="flex items-center space-x-2 mb-3">
                <FileText className="w-5 h-5 text-yellow-600" />
                <h4 className="font-bold text-yellow-800">GHI CHÚ</h4>
              </div>
              <p className="text-yellow-700">{invoiceData.notes}</p>
            </div>
          )}

          {/* Chữ ký điện tử */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-3 border-t border-gray-200">
            <div className="text-center">
              <p className="font-semibold text-gray-800 mb-1">NGƯỜI MUA</p>
              <p className="text-sm text-gray-600 mb-10">(Ký, ghi rõ họ tên)</p>
              <div className="h-16 border-b w-1/4 mx-auto border-gray-300 mb-1"></div>
              <p className="text-sm font-medium text-gray-700">
                {invoiceData.customerInfo.fullName}
              </p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-800 mb-1">NGƯỜI BÁN</p>
              <p className="text-sm text-gray-600 mb-10">
                (Ký, đóng dấu, ghi rõ họ tên)
              </p>
              <div className="h-16 border-b w-1/4 mx-auto border-gray-300 mb-1"></div>
              <p className="text-sm font-medium text-gray-700">Giám đốc</p>
            </div>
          </div>

          {/* Footer cảm ơn */}
          <div className="text-center pt-4 mt-4  border-t border-gray-200">
            <div className="bg-gradient-to-r from-fuchsia-600 to-pink-600 shadow-lg text-white rounded-xl p-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <CheckCircle className="w-6 h-6" color="white" />
                <p className="text-xl font-bold">Cảm ơn quý khách!</p>
              </div>
              <p className="text-blue-100">
                Chúng tôi hy vọng được phục vụ quý khách trong những chuyến đi
                tiếp theo.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons với thiết kế đẹp */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-200">
          <div className="flex justify-end gap-3">
            <button
              onClick={handlePrint}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-white hover:shadow-md transition-all duration-200 flex items-center space-x-2 font-medium"
            >
              <Printer size={16} />
              <span>In hóa đơn</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg hover:shadow-xl"
            >
              <Download size={16} />
              <span>Tải xuống PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
