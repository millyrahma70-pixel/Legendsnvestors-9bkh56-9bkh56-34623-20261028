import { Navigate } from 'react-router-dom';

// Compatibility entry point: administrators and members now use the same login page.
export default function AdminLoginPage() {
  return <Navigate to="/login" replace />;
}

