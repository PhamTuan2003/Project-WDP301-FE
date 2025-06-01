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
} from "lucide-react";
import { formatPrice } from "../../../redux/validation";
import { closeInvoiceModal } from "../../../redux/action";
import { downloadInvoicePDF } from "../../../redux/asyncActions";

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center">
            <FileText className="mr-2" size={24} />
            <h3 className="text-xl font-bold text-gray-800">
              Hóa đơn thanh toán
            </h3>
          </div>
          <button
            onClick={handleCloseModal}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6" id="invoice-content">
          {/* Invoice Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              HÓA ĐƠN THANH TOÁN
            </h2>
            <div className="text-sm text-gray-600">
              <div>
                Số hóa đơn:{" "}
                <span className="font-medium">{invoiceData.invoiceNumber}</span>
              </div>
              <div>
                Ngày phát hành:{" "}
                {new Date(invoiceData.issueDate).toLocaleDateString("vi-VN")}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <h4 className="font-bold text-gray-800 mb-3">
                CÔNG TY DU THUYỀN
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Địa chỉ: 123 Đường ABC, Quận XYZ</div>
                <div>Điện thoại: 0123-456-789</div>
                <div>Email: info@yacht.com</div>
                <div>Website: www.yacht.com</div>
              </div>
            </div>

            {/* Customer Info */}
            <div>
              <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                <User className="mr-2" size={16} />
                THÔNG TIN KHÁCH HÀNG
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>
                  Tên:{" "}
                  <span className="font-medium">
                    {invoiceData.customerInfo.fullName}
                  </span>
                </div>
                <div>Email: {invoiceData.customerInfo.email}</div>
                <div>SĐT: {invoiceData.customerInfo.phoneNumber}</div>
                {invoiceData.customerInfo.address && (
                  <div>Địa chỉ: {invoiceData.customerInfo.address}</div>
                )}
              </div>
            </div>
          </div>

          {/* Yacht & Booking Info */}
          {invoiceData.yachtInfo && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-blue-800 mb-2 flex items-center">
                <Ship className="mr-2" size={16} />
                THÔNG TIN DU THUYỀN
              </h4>
              <div className="text-sm text-blue-700 space-y-1">
                {invoiceData.yachtInfo.name && (
                  <div>
                    Du thuyền:{" "}
                    <span className="font-medium">
                      {invoiceData.yachtInfo.name}
                    </span>
                  </div>
                )}
                {invoiceData.yachtInfo.location && (
                  <div>Địa điểm: {invoiceData.yachtInfo.location}</div>
                )}
                {invoiceData.yachtInfo.scheduleInfo && (
                  <div className="flex items-center">
                    <Calendar className="mr-1" size={14} />
                    Lịch trình: {invoiceData.yachtInfo.scheduleInfo}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Items Table */}
          <div className="mb-8">
            <h4 className="font-bold text-gray-800 mb-4">CHI TIẾT DỊCH VỤ</h4>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
                      STT
                    </th>
                    <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Tên phòng
                    </th>
                    <th className="border border-gray-200 px-4 py-2 text-center text-sm font-medium text-gray-700">
                      Số lượng
                    </th>
                    <th className="border border-gray-200 px-4 py-2 text-right text-sm font-medium text-gray-700">
                      Đơn giá
                    </th>
                    <th className="border border-gray-200 px-4 py-2 text-right text-sm font-medium text-gray-700">
                      Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items?.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-200 px-4 py-2 text-sm">
                        {index + 1}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-sm">
                        <div className="font-medium">{item.roomName}</div>
                        {item.description && (
                          <div className="text-xs text-gray-500">
                            {item.description}
                          </div>
                        )}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-sm text-center">
                        {item.quantity}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-sm text-right">
                        {formatPrice(item.unitPrice)}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-sm text-right font-medium">
                        {formatPrice(item.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-full max-w-sm">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tạm tính:</span>
                  <span>{formatPrice(invoiceData.subtotal)}</span>
                </div>
                {invoiceData.discount > 0 && (
                  <div className="flex justify-between text-sm text-red-600">
                    <span>Giảm giá:</span>
                    <span>-{formatPrice(invoiceData.discount)}</span>
                  </div>
                )}
                {invoiceData.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Thuế:</span>
                    <span>{formatPrice(invoiceData.tax)}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-blue-600">
                    {formatPrice(invoiceData.total)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Đã thanh toán:</span>
                  <span className="font-medium">
                    {formatPrice(invoiceData.paidAmount)}
                  </span>
                </div>
                {invoiceData.remainingAmount > 0 && (
                  <div className="flex justify-between text-sm text-orange-600">
                    <span>Còn lại:</span>
                    <span className="font-medium">
                      {formatPrice(invoiceData.remainingAmount)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Transaction Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-bold text-gray-800 mb-3">
              THÔNG TIN GIAO DỊCH
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Loại giao dịch:</span>{" "}
                {invoiceData.transactionId?.transaction_type === "deposit"
                  ? "Thanh toán cọc"
                  : "Thanh toán đầy đủ"}
              </div>
              <div>
                <span className="font-medium">Mã giao dịch:</span>{" "}
                {invoiceData.transactionId?.transaction_reference}
              </div>
              <div>
                <span className="font-medium">Trạng thái:</span>{" "}
                <span className="text-green-600 font-medium">Thành công</span>
              </div>
              <div>
                <span className="font-medium">Ngày thanh toán:</span>{" "}
                {invoiceData.transactionId?.completedAt
                  ? new Date(
                      invoiceData.transactionId.completedAt
                    ).toLocaleString("vi-VN")
                  : "N/A"}
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoiceData.notes && (
            <div className="mb-6">
              <h4 className="font-bold text-gray-800 mb-2">GHI CHÚ</h4>
              <p className="text-sm text-gray-600">{invoiceData.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center pt-6 border-t">
            <p className="text-lg font-medium text-gray-800 mb-2">
              Cảm ơn quý khách đã sử dụng dịch vụ!
            </p>
            <p className="text-sm text-gray-600">
              Chúng tôi hy vọng được phục vụ quý khách trong những chuyến đi
              tiếp theo.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={handlePrint}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center"
          >
            <Printer className="mr-2" size={16} />
            In hóa đơn
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Download className="mr-2" size={16} />
            Tải xuống PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
