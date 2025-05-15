import React from "react";
import { Box, Typography, Avatar, Stack, Paper } from "@mui/material";

const testimonial = {
  name: "Anh Dũng",
  text:
    "Tour du thuyền 2 ngày 1 đêm rất tuyệt vời, tôi được ngắm vẻ đẹp của vịnh Hạ Long, khám phá các hang động. Nhân viên tư vấn nhiệt tình, phục vụ chu đáo. Đồ ăn ngon, phòng ốc đẹp. Đây thực sự là trải nghiệm đáng nhớ, mình sẽ tiếp tục ủng hộ và giới thiệu cho bạn bè. Cảm ơn du thuyền!",
};

const customers = [
  { name: "Anh A", avatar: "https://i.pravatar.cc/40?img=1" },
  { name: "Anh B", avatar: "https://i.pravatar.cc/40?img=2" },
  { name: "Anh C", avatar: "https://i.pravatar.cc/40?img=3" },
  { name: "Bạn D", avatar: "https://i.pravatar.cc/40?img=4" },
  { name: "Cô C & E", avatar: "https://i.pravatar.cc/40?img=5" },
];

export default function Review() {
  return (
    <Box sx={{ width: '100%', bgcolor: '#f5fbf9', py: 8, px: 2, my: 6 }}>
      <Box maxWidth={900} mx="auto">
        <Typography variant="h5" fontWeight={700} mb={2}>
          Đánh giá từ những người đã trải nghiệm
        </Typography>
        <Typography mb={4} color="text.secondary">
          Khách hàng chia sẻ về những kỷ niệm tuyệt vời trên chuyến du lịch với chúng tôi.
        </Typography>
        <Paper variant="outlined" sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 }, borderRadius: 4, mb: 3, background: "url('https://ext.same-assets.com/834882384/1398955826.png') center/cover" }}>
          <Typography variant="subtitle1" fontWeight={600} mb={2}>
            Du thuyền Stellar of the Seas
          </Typography>
          <Typography variant="body1" fontStyle="italic" color="text.secondary">
            “{testimonial.text}”
          </Typography>
          <Typography mt={2} variant="subtitle2" color="primary">
            {testimonial.name}
          </Typography>
        </Paper>
        <Stack direction="row" spacing={2} justifyContent="center">
          {customers.map((c, idx) => (
            <Stack key={idx} alignItems="center" spacing={1}>
              <Avatar src={c.avatar} alt={c.name} />
              <Typography variant="caption" color="text.secondary">
                {c.name}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
