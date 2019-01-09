// AdminConfig
AdminConfig = {
  name: 'EnergyMaster',
  adminEmails: ['490842289@qq.com'],
  collections: { },
  skin: 'blue-light',
};

// AdminDashboard Sidebar
AdminDashboard.addSidebarItem('设备管理', {
  icon: 'cube',
  urls: [
    { title: '设备列表', url: AdminDashboard.path('/deviceList') },
    { title: '固件更新', url: AdminDashboard.path('/deviceUpdate') }
  ]
});

AdminDashboard.addSidebarItem('电能信息展示', {
  icon: 'cube',
  urls: [
    { title: '电能信息', url: AdminDashboard.path('/energymessage') },
  ]
});
