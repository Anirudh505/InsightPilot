export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    LOGOUT: '/auth/logout'
  },
  WORKSPACES: {
    BASE: '/workspaces',
  },
  PROJECTS: {
    BASE: (workspaceId) => `/workspaces/${workspaceId}/projects`,
    DETAIL: (projectId) => `/projects/${projectId}`
  }
};
