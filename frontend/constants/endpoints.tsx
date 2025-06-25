const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiEndpoints = {
 
  usersList:'/users-list',
  addUser:'/add-user',
  appsList:'/apps-list',
  addApp:'/add-app',
  toggleAppStatus:'/toggle-status',
  deleteApp:'/delete',
  updateApp:'/update',
  toggleUserStatus:'/toggle-user-status',
  deleteUser:'/delete-user',
  updateUser:'/update-user',
  login:`/login`,
  // userAppsList:'/user-apps/list',
  userApps:'/user-apps'


  } as const;

type Endpoint = keyof typeof apiEndpoints;

const getApiUrl = (endpoint: Endpoint): string => {
  return `${API_BASE_URL}${apiEndpoints[endpoint]}`;
};

export default getApiUrl;
