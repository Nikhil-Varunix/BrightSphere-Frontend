import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Home from "./pages/dashboard/Home"
import Header from './components/Header'
import Footer from './components/Footer'

import CreateUser from './components/CreateUser'
// import UpdateUser from './components/UpdateUser'


// articles
import Articles from './pages/Articles'
import CreateArticle from './components/CreateArticle'
import UpdateArticle from './components/UpdateArticle'
import ArticleDetails from './components/ArticleDetails'

// journal
import Journals from './pages/Journals'
import CreateJournal from './components/CreateJournal'
import UpdateJournal from './components/UpdateJournal'
import JournalDetails from './pages/JournalDetails'
// import UpdateJournal from './components/UpdateJournal'


// admin
import EditorDetails from './pages/admin/EditorDetails'
import Editorials from './pages/admin/Editorials'
import CreateEditors from './pages/admin/CreateEditors'
import UpdateEditors from './pages/admin/UpdateEditors'
import Permissions from './pages/admin/Permissions'
import Departments from './pages/admin/Departments'
import Designations  from './pages/admin/Designations'
import Volume  from './pages/admin/Volume'
import Issues  from './pages/admin/Issues'
import Products from './pages/admin/Products'
import ProductsType from './pages/admin/ProductsType'
import Variants from './pages/admin/Variants'
import TAT from './pages/admin/TAT'
import ShiftTime from './pages/admin/ShiftTime'
import AddProduct from './pages/admin/AddProduct'
import ProductDetails from './pages/admin/ProductDetails'
import Categories from './pages/admin/Categories'
import SubCategories from './pages/admin/SubCategories'
import OfficeTimingsAndHolidays from './pages/admin/OfficeTimingsAndHolidays'
import RoleBasedPermissions from './pages/admin/RoleBasedPermissions'
import Services from './pages/admin/Services';

// tasts
import DashboardTask from './pages/tasks/DashboardTask'
import DetailsTask from './pages/tasks/DetailsTask'
import TATEffectedDetails from './pages/tasks/TATEffectedDetails'
import TaskManagment from './pages/tasks/TaskManagment'
import UserSpecificTasks from './pages/tasks/UserSpecificTasks'
import SLAReport from './pages/tasks/SLAReport'
import UserTaskHistory from './pages/tasks/UserTaskHistory'
import OldAssignDetails from './pages/tasks/OldAssignDetails'
import TateAffected from './pages/tasks/TateAffected'
import TaskUpload from './pages/tasks/TaskUpload'

import Users from './pages/users/Users'
import ApprovalWorkflow from './pages/users/ApprovalWorkflow'
import DetailsUser from './pages/users/DetailsUser'
// import ListUser from './pages/users/ListUser';

import ListAttendance from './pages/attendance/ListAttendance';
import RegularizationAttendance from './pages/attendance/RegularizationAttendance';
// import ReportsAttendance from './pages/attendance/ReportsAttendance';
import ShiftPlanning from './pages/attendance/ShiftPlanning';
// import Logs from './pages/Logs';
import UserTracking from './pages/logs/UserTracking';
import TimeStamps from './pages/logs/TimeStamps';


// Location Insights pages
import LiveMap from "./pages/LocationInsights/LiveMap";
import TaskPins from "./pages/LocationInsights/TaskPins";
import RouteView from "./pages/LocationInsights/RouteView";
import GeoFencing from "./pages/LocationInsights/GeoFencing";
import ZonePerformance from "./pages/LocationInsights/ZonePerformance";

// Form Builder pages
import FormList from './pages/FormBuilder/FormList'
import FormCreate from './pages/FormBuilder/FormCreate';
import SharedForm from './pages/FormBuilder/SharedForm';
import FormSubmissions from './pages/FormBuilder/FormSubmissions';

// Organization module imports
import Organization from "./pages/organization/Organization";

// campaigning module imports
import CampaignCreation from "./pages/campaigning/CampaignCreation";
import Create from "./pages/campaigning/Create";
import CustomerInteraction from "./pages/campaigning/CustomerInteraction";
// Customers module imports
import Customers from "./pages/customer/Customers";

// Account module imports
import CustomerMaster from './pages/accounts/CustomerMaster';
import Invoices from './pages/accounts/Invoices';
import CustomerStatements from './pages/accounts/CustomerStatements';
import InvoiceView from './pages/accounts/InvoiceView';
import InvoiceCreate from './pages/accounts/InvoiceCreate';
import InvoiceEdit from './pages/accounts/InvoiceEdit';
import Payments from './pages/accounts/Payments';
import Expenses from './pages/accounts/Expenses';
import PaymentReminders from './pages/accounts/PaymentReminders';
import Payroll from './pages/accounts/Payroll';
import TaxCompliance from './pages/accounts/TaxCompliance';
import OrgBranches from './pages/organization/OrgBranches';
import CreateBranch from './pages/organization/CreateBranch';
import OrgCompanyProfile from './pages/organization/OrgCompanyProfile';
import OrgPolicies from './pages/organization/OrgPolicies';
import OrgDocuments from './pages/organization/OrgDocuments';
import Regions from './pages/organization/Regions';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import HelpDesk from './pages/support/HelpDesk';
import Conversation from './pages/support/Conversation';
import Reports from './pages/reports/Reports';
import UpdateUser from './components/UpdateUser';

function App() {
  const location = useLocation();

    const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    layout_change('dark');
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("authRole");
    if (!token || role !== 'admin') {
      localStorage.clear();
      navigate("/login");
    }
  }, [location.pathname]);

   useEffect(() => {
    // Axios interceptor to handle 401 globally
    const interceptor = axios.interceptors.response.use(
      res => res,
      err => {
        if (err.response?.status === 401) {
          toast.error("Logged in another device.");
          setTimeout(() => {
            localStorage.clear();
            window.location.href = "/login";
          }, 2500);
          return new Promise(() => {}); // hang the promise
        }
        return Promise.reject(err);
      }
    );

    // Cleanup interceptor on unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <>
      {!["/login", "/register"].includes(location.pathname) && <Header />}

      <div className={`${!["/login", "/register"].includes(location.pathname) ? "pc-container" : ""}`}>
        <div className="pc-content">
          <Toaster position="top-center" reverseOrder={false} />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={<Home />} />
             <Route path="user/create-user" element={<CreateUser />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/article/create-article" element={<CreateArticle />} />
            <Route path="/article/update-article/:id" element={<UpdateArticle />} />
            <Route path="/articles/article-details/:id" element={<ArticleDetails />} />
            <Route path="/journal/update-journal/:id" element={<UpdateJournal />} />
             <Route path="/journal/Journal-details/:id" element={<JournalDetails />} />
            <Route path="/journals" element={<Journals />} />
            <Route path="/journals/create-journal" element={<CreateJournal />} />

            {/* Admin Routes Start  */}
            <Route path="/admin/editors" element={<Editorials />} />
            <Route path="/admin/editors/create-editor" element={<CreateEditors />} />
            <Route path="/admin/editors/update-editor/:id" element={<UpdateEditors />} />
            <Route path="/admin/editors/editor-details/:id" element={<EditorDetails />} />
            <Route path="/admin/permissions" element={<Permissions />} />
            <Route path="/admin/departments" element={<Departments />} />
            <Route path="/admin/designations" element={<Designations />} />
            <Route path="/admin/volume" element={<Volume />} />
            <Route path="/admin/issues" element={<Issues />} />
            <Route path="/admin/products" element={<Products />} />
            <Route path="/admin/tat" element={< TAT/>} />
            <Route path="/admin/shift-time" element={< ShiftTime/>} />
            <Route path="/admin/productdetails/:id" element={< ProductDetails/>} />
            <Route path="/admin/categories" element={< Categories/>} />
            <Route path="/admin/sub-categories" element={< SubCategories/>} />
            <Route path="/admin/products-type" element={< ProductsType/>} />
            <Route path="/admin/variants" element={< Variants/>} />
            <Route path="/admin/timings-and-holidays" element={< OfficeTimingsAndHolidays/>} />
            <Route path="/admin/role-based-permissions" element={<RoleBasedPermissions />} />
            <Route path="/admin/add-product" element={<AddProduct />} />
            <Route path="/admin/services" element={<Services />} />
            {/* Admin Routes END */}

            {/* Task Routes Start  */}
            <Route path="/tasks" element={<DashboardTask />} />
            <Route path="/tasks/details" element={<DetailsTask />} />
            <Route path="/tasks/tat-effected-details" element={<TATEffectedDetails />} />
            <Route path="/tasks/task-managment" element={<TaskManagment />} />
            <Route path="/tasks/sla-report" element={<SLAReport />} />
            <Route path="/tasks/task-upload" element={<TaskUpload />} />
            <Route path="/tasks/user-task-history" element={<UserTaskHistory />} />
            <Route path="/tasks/user-specific-tasks" element={<UserSpecificTasks />} />
            <Route path="/tasks/old-assign-details" element={<OldAssignDetails />} />
            <Route path="/tate-affected" element={<TateAffected />} />
            {/* Task Routes END */}

            {/* User Routes Start  */}
            <Route path="/users" element={<Users />} />
             <Route path="/users/update-user/:id" element={<UpdateUser />} />
            <Route path="/users/approval-workflow" element={<ApprovalWorkflow />} />
            {/* <Route path="/users/list" element={<ListUser />} /> */}
            <Route path="/users/:id" element={<DetailsUser />} />
            {/* User Routes END */}

            {/* Attendance Routes Start  */}
            <Route path="/attendance" element={<ListAttendance />} />
            <Route path="/attendance/regularization" element={<RegularizationAttendance />} />
            <Route path="/attendance/shift-planning" element={<ShiftPlanning />} />
            {/* <Route path="/attendance/reports" element={<ReportsAttendance />} /> */}
            {/* Attendance Routes END */}

            {/* Location Insights Start*/}
            <Route path="/location-insights/live-map" element={<LiveMap />} />
            <Route path="/location-insights/task-pins" element={<TaskPins />} />
            <Route path="/location-insights/route-view" element={<RouteView />} />
            <Route path="/location-insights/geo-fencing" element={<GeoFencing />} />
            <Route path="/location-insights/zone-performance" element={<ZonePerformance />} />
            {/* LocationInsights Routes END */}

            {/* Form Builder Routes Start */}
            <Route path="/forms" element={<FormList />} />
            <Route path="/forms/create" element={<FormCreate />} />
            <Route path="/forms/share/:formId" element={<SharedForm />} />
            <Route path="/forms/submissions/:formId" element={<FormSubmissions />} />
            {/* Form Builder Routes END*/}

            {/* Help Desk Routes Start */}
            <Route path="/helpdesk" element={<HelpDesk />} />
            <Route path="/helpdesk/conversation/:id" element={<Conversation />} />
            
            {/* Help Desk Routes END*/}

            {/* Reports Routes Start */}
            <Route path="/reports" element={<Reports />} />
            {/* Reports Routes END*/}

            {/* Organization Start */}
            <Route path="/organization/profile" element={<OrgCompanyProfile />} />
            <Route path="/organization/branches" element={<OrgBranches />} />
            <Route path="/organization/policies" element={<OrgPolicies />} />
            <Route path="/organization/documents" element={<OrgDocuments />} />
            <Route path="/organization/regions" element={<Regions />} />
            <Route path="/organization/branches/create" element={<CreateBranch />} />
            {/* Organization END */}

            {/* campaigning module imports  */}
            <Route path="/campaigning/campaign-creation" element={<CampaignCreation />} />
            <Route path="/campaigning/Create" element={<Create />} />
            <Route path="/campaigning/customer-interaction" element={<CustomerInteraction />} />

            {/* Customers Start */}
            <Route path="/customers" element={<Customers />} />
            {/* Customers END */}

            {/* Logs Start */}
            {/* <Route path="/logs" element={<Logs />} /> */}
            <Route path="/logs/user-tracking" element={<UserTracking />} />
            <Route path="/logs/time-stamps" element={<TimeStamps />} /> 
            {/* Logs END */}

            {/* Accounts Start */}
            <Route path="/accounts/customer-master" element={<CustomerMaster />} />
            <Route path="/accounts/invoices" element={<Invoices />} />
            <Route path="/accounts/customer-statements" element={<CustomerStatements />} />
            <Route path="/accounts/invoice-view" element={<InvoiceView />} />
            <Route path="/accounts/payment-reminders" element={<PaymentReminders />} />
            <Route path="/accounts/invoice-Create" element={<InvoiceCreate />} />
            <Route path="/accounts/invoice-edit" element={<InvoiceEdit />} />
            <Route path="/accounts/payments" element={<Payments />} />
            <Route path="/accounts/expenses" element={<Expenses />} />
            <Route path="/accounts/payroll" element={<Payroll />} />
            <Route path="/accounts/tax-compliance" element={<TaxCompliance />} />
            {/* Accounts END */}

          </Routes>
        </div>
      </div>

      {!["/login", "/register"].includes(location.pathname) && <Footer />}

    </>
  )
}

export default App;