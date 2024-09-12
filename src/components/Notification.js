import '../common/antd_override.css'
import { notification } from 'antd';

const openNotification = (type, title, message) => {
  //type: 'success', 'info', 'warning', 'error'
  notification[type]({
    message: title,
    description: message,
    duration: 3,
  });
};

export { openNotification };