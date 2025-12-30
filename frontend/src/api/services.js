import axiosInstance from "./axios";

// ==================== AUTH SERVICES ====================

export const authService = {
  // Đăng nhập
  login: async (username, password) => {
    const response = await axiosInstance.post("/auth/token/", {
      username,
      password,
    });

    // Lưu tokens
    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);

    return response.data;
  },

  // Đăng xuất
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        await axiosInstance.post("/auth/logout/", {
          refresh: refreshToken,
        });
      }
    } finally {
      localStorage.clear();
      window.location.href = "/login";
    }
  },

  // Lấy thông tin user hiện tại
  getMe: async () => {
    const response = await axiosInstance.get("users/me/");
    return response.data;
  },

  // Đổi mật khẩu
  changePassword: async (oldPassword, newPassword) => {
    const response = await axiosInstance.post("/users/change-password/", {
      old_password: oldPassword,
      new_password: newPassword,
    });
    return response.data;
  },
};

// ==================== RESIDENTS SERVICES ====================

export const residentsService = {
  // Lấy danh sách căn hộ
  getApartments: async (filters = {}) => {
    const response = await axiosInstance.get("/apartments/", {
      params: filters,
    });
    return response.data;
  },

  // Thống kê căn hộ tổng quan
  getApartmentStats: async () => {
    const response = await axiosInstance.get("/apartments/thongke/");
    return response.data;
  },

  // Chi tiết căn hộ
  getApartmentDetail: async (id) => {
    const response = await axiosInstance.get(`/apartments/${id}/`);
    return response.data;
  },

  // Thành viên và thống kê chi tiết trong 1 căn hộ
  getApartmentMembers: async (id) => {
    const response = await axiosInstance.get(`/apartments/${id}/detail/`);
    return response.data;
  },

  // Lịch sử căn hộ
  getApartmentHistory: async (id) => {
    const response = await axiosInstance.get(`/apartments/${id}/history/`);
    return response.data;
  },

  // Thêm căn hộ mới
  createApartment: async (data) => {
    const response = await axiosInstance.post("/apartments/", data);
    return response.data;
  },

  // Lấy danh sách cư dân
  getResidents: async (filters = {}) => {
    const response = await axiosInstance.get("/residents/", {
      params: filters,
    });
    return response.data;
  },

  // Chi tiết cư dân
  getResidentDetail: async (id) => {
    const response = await axiosInstance.get(`/residents/${id}/`);
    return response.data;
  },

  // Tạo cư dân mới
  createResident: async (data) => {
    const response = await axiosInstance.post("/residents/", data);
    return response.data;
  },

  // Cập nhật cư dân
  updateResident: async (id, data) => {
    const response = await axiosInstance.patch(`/residents/${id}/`, data);
    return response.data;
  },

  // Move-in (chuyển đến)
  moveIn: async (id, apartmentId, isOwner = false) => {
    const response = await axiosInstance.post(`/residents/${id}/move-in/`, {
      apartment_id: apartmentId,
      la_chu_ho: isOwner,
    });
    return response.data;
  },

  // Move-out (chuyển đi)
  moveOut: async (id) => {
    const response = await axiosInstance.post(`/residents/${id}/move-out/`);
    return response.data;
  },

  // Lấy danh sách biến động (History)
  getHistory: async (filters = {}) => {
    const response = await axiosInstance.get("/history/", {
      params: filters,
    });
    return response.data;
  },
};

// ==================== FINANCE SERVICES ====================

export const financeService = {
  // Lấy danh mục phí
  getFeeCategories: async () => {
    const response = await axiosInstance.get("/fees/");
    return response.data;
  },

  // Tạo/Cập nhật danh mục phí
  createFeeCategory: async (data) => {
    const response = await axiosInstance.post("/fees/", data);
    return response.data;
  },

  updateFeeCategory: async (id, data) => {
    const response = await axiosInstance.patch(`/fees/${id}/`, data);
    return response.data;
  },

  deleteFeeCategory: async (id) => {
    const response = await axiosInstance.delete(`/fees/${id}/`);
    return response.data;
  },

  // Lấy chỉ số điện nước
  getUtilityReadings: async (filters = {}) => {
    const response = await axiosInstance.get("/utilities/", {
      params: filters,
    });
    return response.data;
  },

  // Nhập chỉ số điện nước (batch)
  batchUploadReadings: async (readings) => {
    const response = await axiosInstance.post(
      "/utility-readings/batch/",
      readings
    );
    return response.data;
  },

  // Lấy danh sách hóa đơn
  getInvoices: async (filters = {}) => {
    const response = await axiosInstance.get("/invoices/", { params: filters });
    return response.data;
  },

  // Chi tiết hóa đơn
  getInvoiceDetail: async (id) => {
    const response = await axiosInstance.get(`/invoices/${id}/`);
    return response.data;
  },

  // Tạo hóa đơn hàng loạt
  batchGenerateInvoices: async (month, year) => {
    const response = await axiosInstance.post("/invoices/generate/", {
      thang: month,
      nam: year,
    });
    return response.data;
  },

  // Xác nhận thanh toán
  confirmPayment: async (id) => {
    const response = await axiosInstance.post(
      `/invoices/${id}/confirm-payment/`
    );
    return response.data;
  },

  // Báo cáo doanh thu
  getMonthlyRevenue: async (year) => {
    const response = await axiosInstance.get("/revenue-stats/", {
      params: { year },
    });
    return response.data;
  },

  // Đóng góp
  getContributions: async () => {
    const response = await axiosInstance.get("/fundraising-drives/");
    return response.data;
  },

  createContribution: async (data) => {
    const response = await axiosInstance.post("/fundraising-drives/", data);
    return response.data;
  },

  updateContribution: async (id, data) => {
    const response = await axiosInstance.patch(
      `/fundraising-drives/${id}/`,
      data
    );
    return response.data;
  },

  deleteContribution: async (id) => {
    const response = await axiosInstance.delete(`/fundraising-drives/${id}/`);
    return response.data;
  },
};

// ==================== SERVICES (UTILITIES) ====================

export const utilitiesService = {
  // Quản lý xe
  getVehicles: async () => {
    const response = await axiosInstance.get("/vehicles/");
    return response.data;
  },

  createVehicle: async (data) => {
    const response = await axiosInstance.post("/vehicles/", data);
    return response.data;
  },

  deleteVehicle: async (id) => {
    const response = await axiosInstance.delete(`/vehicles/${id}/`);
    return response.data;
  },

  // Yêu cầu hỗ trợ (Tickets)
  getSupportTickets: async () => {
    const response = await axiosInstance.get("/support-tickets/");
    return response.data;
  },

  createSupportTicket: async (data) => {
    const response = await axiosInstance.post("/support-tickets/", data);
    return response.data;
  },

  updateSupportTicket: async (id, data) => {
    const response = await axiosInstance.patch(`/support-tickets/${id}/`, data);
    return response.data;
  },

  // Tin tức
  getNews: async () => {
    const response = await axiosInstance.get("/news/");
    return response.data;
  },

  createNews: async (data) => {
    const response = await axiosInstance.post("/news/", data);
    return response.data;
  },
};

// ==================== DASHBOARD SERVICES ====================

// TẠM THỜI COMMENT VÌ BACKEND CHƯA CÓ MODULE DASHBOARD VÀ NOTIFICATIONS NÀY
export const dashboardService = {
  // Dashboard Manager
  getManagerDashboard: async () => {
    // const response = await axiosInstance.get('/v1/dashboard/manager');
    // return response.data;
    return { message: "Module dashboard đang phát triển" };
  },

  // Dashboard Resident
  getResidentDashboard: async () => {
    // const response = await axiosInstance.get('/v1/dashboard/resident');
    // return response.data;
    return { message: "Module dashboard đang phát triển" };
  },

  // Gửi thông báo
  sendNotification: async (data) => {
    // const response = await axiosInstance.post('/v1/notifications/send', data);
    // return response.data;
    return { message: "Module thông báo đang phát triển" };
  },

  // Audit logs
  getAuditLogs: async () => {
    // const response = await axiosInstance.get('/v1/audit-logs/');
    // return response.data;
    return [];
  },
};
