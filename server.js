import app from './app.js';

import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/users/user.routes.js';
import financialRoutes from './modules/financials/financial.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';

import { errorHandler } from './shared/middlewares/error.middleware.js';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/financials', financialRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(errorHandler)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});