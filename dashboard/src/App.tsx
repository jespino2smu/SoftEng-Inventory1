import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Layout from './components/Layout';

import { InventoryTracingPage } from './pages/InventoryTracingPage';
import { DashboardPage } from './pages/DashboardPage';
import NotificationPage from './test/NotificationPage'
import DropdownTextField from './components/DropdownTextField';

import api from './api/api'

// import AuthPage from './pages/AuthPage';
// import SignupPage from './pages/SignupPage';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './pages/ProtectedRoute';

import CreateNotification from './test/CreateNotification';

//import StockMovementPage from './pages/StockMovementPage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
  },
});

const App: React.FC = () => {
  //const [visibleLayout, setVisibleLayout] = useState<boolean>(false);

  useEffect(() =>  {
    testT();
  }, []);


  async function testT() {
    try {
      //const result: any = await api.post("/test", {})

      // let printString = "";
      //   Object.keys(result).forEach(key1 => {
      //       console.log(`    ${key1}: ${result[key1]}`);
      //       printString +=`{\n`;

      //       Object.keys(result[key1]).forEach(key2 => {
      //          printString +=`    [${key2}]: ${result[key1][key2]}\n`;
      //       })
      //       printString +=`}\n`;
      //   });
      //   alert(printString);

      //setData(result);
    } catch (error) {
      alert(error);
    }
  }


  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline kicks off MUI's CSS reset for consistent rendering across browsers */}
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Auth Routes (No Sidebar/TopNav) */}
          <Route path="/login" element={<AuthPage type="Login" />} />
          <Route path="/signup" element={<AuthPage type="Signup" />} />
          {/* <Route path="/signup" element={<SignupPage />} /> */}





          {/* Test */}
          {/* <Route path="/drop-text" element={<DropdownTextField />} /> */}
          {/* <Route path="/test" element={<LogTest />} /> */}
          {/* <Route path="/movement" element={<StockMovementPage />} /> */}
          <Route path="/notif" element={<NotificationPage />} />
          <Route path="/alert" element={<CreateNotification />} />




          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout><DashboardPage/></Layout>} />
            <Route path="/notifications" element={<Layout><NotificationPage /> </Layout>} />
            <Route path="/tracing" element={<Layout><InventoryTracingPage /></Layout>} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;