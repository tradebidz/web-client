import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en';

dayjs.extend(relativeTime);
dayjs.locale('en');

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export const formatTimeLeft = (dateString) => {
  const date = dayjs(dateString);
  const now = dayjs();
  const diffHours = date.diff(now, 'hour');

  if (diffHours < 72 && diffHours > 0) {
    return date.fromNow(); 
  }
  return date.format('MM/DD/YYYY HH:mm');
};

export const isNewProduct = (createDate) => {
  return true; 
};
