// components/RatingBar.jsx
const RatingBar = ({ value, total, count }) => {
  const percent = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="flex items-center my-1">
      <div className="w-12 text-sm text-gray-700">{value} sao</div>
      <div className="flex-1 bg-gray-200 h-2 rounded-full mx-2">
        <div
          className="bg-orange-400 h-2 rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="w-16 text-sm text-gray-700 text-right">
        {count} đánh giá
      </div>
    </div>
  );
};

export default RatingBar;
