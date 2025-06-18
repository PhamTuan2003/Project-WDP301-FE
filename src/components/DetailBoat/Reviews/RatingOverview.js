import StarRating from "./StarRating";
import RatingBar from "./RatingBar";

const RatingOverview = ({ ratingData }) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-4 mb-6">
      <div className="flex">
        <div className="w-1/4 border-r border-gray-200 pr-6 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-orange-500">
            {ratingData.average}
          </div>
          <div className="mt-1 mb-2">
            <StarRating rating={Math.round(ratingData.average)} />
          </div>
        </div>
        <div className="w-3/4 pl-6">
          {ratingData.distribution
            .slice()
            .reverse()
            .map((item) => (
              <RatingBar
                key={item.stars}
                value={item.stars}
                total={ratingData.total}
                count={item.count}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default RatingOverview;
import StarRating from "./StarRating";
import { Box, Paper, Grid, Typography, useTheme } from "@mui/material";

//biểu đồ thể hiện số lượng đánh giá theo từng mức sao (1 sao → 5 sao)
const RatingBar = ({ value, total, count }) => {
  const percent = total > 0 ? (count / total) * 100 : 0;
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", alignItems: "center", my: 1 }}>
      <Box sx={{ width: 48, color: "primary.main", opacity: 0.8, fontSize: "1rem", fontWeight: "medium" }}>
        {value} sao
      </Box>
      <Box sx={{ flex: 1, bgcolor: "action.disabledBackground", height: 8, borderRadius: "9999px", mx: 1 }}>
        <Box
          sx={{
            bgcolor: "warning.main",
            height: 8,
            borderRadius: "9999px",
            width: `${percent}%`,
            color: theme.palette.warning.main
          }}
        />
      </Box>
      <Box sx={{ color: "primary.main", opacity: 0.8, fontSize: "1rem", fontWeight: "medium", textAlign: "right", marginRight:"20px" }}>
        <Typography variant="body2" sx={{ lineClamp: 1 }}>
          {count} đánh giá
        </Typography>
      </Box>
    </Box>
  );
};

// Component RatingOverview
const RatingOverview = ({ ratingData }) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mb: 4,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: theme.shadows[4],
        border: 1,
        transition: "box-shadow 0.3s",
        "&:hover": {
          boxShadow: theme.shadows[6],
        },
      }}
    >
      <Grid container spacing={3}>
        {/* Cột điểm trung bình */}
        <Grid
          item
          xs={12}
          sm={3}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRight: { sm: 1 },
            borderColor: "divider",
            pr: { sm: 2 },
            pb: { xs: 3, sm: 0 },
            mt: 2.5,
          }}
        >
          <Typography variant="h3" fontWeight="bold" color="warning.main" sx={{ mt: -2.5 }}>
            {ratingData.average}
          </Typography>
          <Box sx={{ mt: 1, mb: 2 }}>
            <StarRating rating={Math.round(ratingData.average)} />
          </Box>
        </Grid>

        {/* Cột thanh phân bố */}
        <Grid item xs={12} sm={9} sx={{ pl: { sm: 3 } }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {ratingData.distribution
              .slice()
              .reverse()
              .map((item) => (
                <RatingBar
                  key={item.stars}
                  value={item.stars}
                  total={ratingData.total}
                  count={item.count}
                />
              ))}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RatingOverview;
