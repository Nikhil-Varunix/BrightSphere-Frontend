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
import CreateJournal2 from './components/CreateJournal2'
import UpdateJournal from './components/UpdateJournal'
import JournalDetails from './pages/JournalDetails'
// import UpdateJournal from './components/UpdateJournal'


// admin
import EditorDetails from './pages/admin/EditorDetails'
import Editorials from './pages/admin/Editorials'
import CreateEditors from './pages/admin/CreateEditors'
import UpdateEditors from './pages/admin/UpdateEditors'
import Permissions from './pages/admin/Permissions'
import Designations  from './pages/admin/Designations'
import Volume  from './pages/admin/Volume'
import Issues  from './pages/admin/Issues'

import Users from './pages/users/Users'
import UserTracking from './pages/logs/UserTracking';
import TimeStamps from './pages/logs/TimeStamps';


import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
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
            <Route path="/journals/create-journal-2" element={<CreateJournal2 />} />

            {/* Admin Routes Start  */}
            <Route path="/admin/editors" element={<Editorials />} />
            <Route path="/admin/editors/create-editor" element={<CreateEditors />} />
            <Route path="/admin/editors/update-editor/:id" element={<UpdateEditors />} />
            <Route path="/admin/editors/editor-details/:id" element={<EditorDetails />} />
            <Route path="/admin/permissions" element={<Permissions />} />
            <Route path="/admin/designations" element={<Designations />} />
            <Route path="/admin/volume" element={<Volume />} />
            <Route path="/admin/issues" element={<Issues />} />

            {/* User Routes Start  */}
            <Route path="/users" element={<Users />} />
             <Route path="/users/update-user/:id" element={<UpdateUser />} />
            {/* <Route path="/users/list" element={<ListUser />} /> */}
            {/* User Routes END */}


            {/* Logs Start */}
            {/* <Route path="/logs" element={<Logs />} /> */}
            <Route path="/logs/user-tracking" element={<UserTracking />} />
            <Route path="/logs/time-stamps" element={<TimeStamps />} /> 
            {/* Logs END */}

          </Routes>
        </div>
      </div>

      {!["/login", "/register"].includes(location.pathname) && <Footer />}

    </>
  )
}

export default App;