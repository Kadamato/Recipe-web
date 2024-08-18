import moment from "moment";

export const formatTime = (createdAt: Date) => {
  return moment(createdAt).fromNow();
};
