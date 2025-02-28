import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { SCREENS } from '../components/constants/routes';
const INTRO_SHOWN_KEY = 'intro_shown';
export const PROJECT_SHOW = 'projectShow';

export const validLength = (data: any) => {
  return data?.length > 0;
};

export const getInitialScreen = (role: string | undefined) => {
  switch (role) {
    case 'team_member':
      return SCREENS.USER_STACK;
    case 'admin':
      return SCREENS.USER_STACK;
    case 'manager':
      return SCREENS.USER_STACK;
    default:
      return SCREENS.INTRO;
  }
};

export const dataStore = async (
  action: 'getItem' | 'setItem' | 'removeItem',
  key: string,
  value?: string,
) => {
  return action === 'setItem'
    ? await AsyncStorage[action](key, value as string)
    : await AsyncStorage[action](key);
};

export const setIntroShown = async () => {
  try {
    await AsyncStorage.setItem(INTRO_SHOWN_KEY, 'true');
  } catch (error) {
    console.error('Error getting intro shown status', error);
    return false;
  }
};
export const isIntroShown = async () => {
  try {
    const introValue = await AsyncStorage.getItem(INTRO_SHOWN_KEY);
    return introValue === 'true';
  } catch (error) {
    console.error('Error getting project status', error);
    return false;
  }
};

export const setProjectShown = async () => {
  try {
    await AsyncStorage.setItem(PROJECT_SHOW, 'true');
  } catch (error) {
    console.error('Error setting intro shown status', error);
  }
};

export const isProjectShown = async () => {
  try {
    const projectValue = await AsyncStorage.getItem(PROJECT_SHOW);
    return projectValue === 'true';
  } catch (error) {
    console.error('Error getting project status', error);
    return false;
  }
};

export const validateField = (field, value) => {
  let error = '';

  switch (field) {
    case 'firstName':
      if (!value) {
        error = 'First Name is required';
      }
      break;
    case 'lastName':
      if (!value) {
        error = 'Last Name is required';
      }
      break;
    case 'email':
      if (!value) {
        error = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        error = 'Please enter a valid email';
      }
      break;
    case 'password':
      if (!value) {
        error = 'Password is required';
      } else if (value.length < 6) {
        error = 'Password must be at least 6 characters long';
      } else if (
        !/[A-Z]/.test(value) ||
        !/\d/.test(value) ||
        !/[!@#$%^&*(),.?":{}|<>]/.test(value)
      ) {
        error =
          'Password must contain at least one uppercase letter, one number, and one special character';
      }
      break;
    case 'organizationName':
      if (!value) {
        error = 'Organization Name is required';
      }
      break;
    case 'otp':
      if (!value) return 'OTP is required';
      const otpRegex = /^\d{6}$/;
      if (!otpRegex.test(value)) return 'OTP must be a 6-digit number';
      return '';
    default:
      break;
  }

  return error;
};

export const truncateText = (
  text: string | undefined,
  limit: number,
): string => {
  if (!text) return '';
  return text.length > limit ? text.slice(0, limit) + '...' : text;
};

export const getInitials = (name: string): string => {
  return name
    ?.split(' ')
    ?.filter(word => word.length > 0)
    ?.slice(0, 2)
    ?.map(word => word.charAt(0).toUpperCase())
    ?.join('');
};
export const formateTime = (createdAt: any) => {
  const now = moment();
  const createdMoment = moment(createdAt);
  const diffInMinutes = now.diff(createdMoment, 'minutes');
  const diffInHours = now.diff(createdMoment, 'hours');

  if (diffInMinutes < 1) {
    return 'just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours > 1 ? 'hours' : 'hour'} ago`;
  } else {
    return createdMoment.format('DD MMMM YYYY');
  }
};

export const formatType = (type: string = ''): string => {
  return type.replace(/_/g, ' ');
};

export const generateEmail = () => {
  let email = `testi11${Math.floor(Math.random() * 50)}@gmail.com`;
  return email;
};

export const getMaxFileSize = (planName: string) => {
  if (planName === 'free-trial') {
    return 5 * 1024 * 1024;
  } else {
    return 250 * 1024 * 1024;
  }
};


export const API_URL = 'https://shopper-ecommerce.myshopify.com/api/2025-01/graphql.json';
export const ACCESS_TOKEN = "4bd135aed7c24e3a73afe9667ab059fd";