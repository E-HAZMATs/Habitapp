export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T | null;
  errors?: any;
  timestamp: string;
}

export interface ApiError {
  error: {
    // CHECK: errors prop is usless?
    success: false;
    message: string;
    timestamp: string;
  };
  status: number;
  message: string;
}
