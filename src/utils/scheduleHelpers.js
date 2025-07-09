export function getScheduleById(schedules, scheduleId) {
  if (!schedules || !scheduleId) return null;
  const id = typeof scheduleId === "object" ? scheduleId._id : scheduleId;
  return schedules.find(
    (sch) =>
      sch._id === id || // so sánh với _id của YachtSchedule
      sch.scheduleId?._id === id // so sánh với _id của Schedule
  );
}
