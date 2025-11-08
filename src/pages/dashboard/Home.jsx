import { useEffect, useState } from 'react';
import axios from 'axios';
import BreadCrumb from '../../components/BreadCrumb';

const API_URL = import.meta.env.VITE_API_URL;

const Home = () => {
  const [stats, setStats] = useState({});

  const token = localStorage.getItem('authToken');

  // 🔹 Fetch dashboard stats from API
  const fetchDashboardStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data.data;
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <>
      <BreadCrumb subUrl="/" subLabel="Dashboard" />

      <div className="d-flex align-items-center justify-content-between mb-4">
        <h4 className="fw-semibold text-dark mb-0">Statistics</h4>
      </div>

      <div className="row g-4">
        {/* Total Journals */}
        <div className="col-md-6 col-lg-3">
          <div className="card statistics-card-1">
            <div className="card-body">
              <img
                src="/assets/images/widget/img-status-1.svg"
                alt="bg"
                className="img-fluid img-bg"
              />
              <div className="d-flex align-items-center">
                <div className="avtar bg-brand-color-1 text-white me-3">
                  <i className="ti ti-book f-26"></i>
                </div>
                <div>
                  <p className="text-muted mb-0">Journals</p>
                  <h2 className="mb-0 f-w-500">{stats.totalJournals || 0}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Volumes */}
        <div className="col-md-6 col-lg-3">
          <div className="card statistics-card-1">
            <div className="card-body">
              <img
                src="/assets/images/widget/img-status-2.svg"
                alt="bg"
                className="img-fluid img-bg"
              />
              <div className="d-flex align-items-center">
                <div className="avtar bg-brand-color-2 text-white me-3">
                  <i className="ti ti-stack f-26"></i>
                </div>
                <div>
                  <p className="text-muted mb-0">Volumes</p>
                  <h2 className="mb-0 f-w-500">{stats.totalVolumes || 0}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Issues */}
        <div className="col-md-6 col-lg-3">
          <div className="card statistics-card-1">
            <div className="card-body">
              <img
                src="/assets/images/widget/img-status-3.svg"
                alt="bg"
                className="img-fluid img-bg"
              />
              <div className="d-flex align-items-center">
                <div className="avtar bg-brand-color-3 text-white me-3">
                  <i className="ti ti-file-text f-26"></i>
                </div>
                <div>
                  <p className="text-muted mb-0">Issues</p>
                  <h2 className="mb-0 f-w-500">{stats.totalIssues || 0}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

         {/* Total Articles */}
        <div className="col-md-6 col-lg-3">
          <div className="card statistics-card-1">
            <div className="card-body">
              <img
                src="/assets/images/widget/img-status-1.svg"
                alt="bg"
                className="img-fluid img-bg"
              />
              <div className="d-flex align-items-center">
                <div className="avtar bg-brand-color-1 text-white me-3">
                  <i className="ti ti-article f-26"></i>
                </div>
                <div>
                  <p className="text-muted mb-0">Articles</p>
                  <h2 className="mb-0 f-w-500">{stats.totalArticles || 0}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECOND ROW */}
      <div className="d-flex align-items-center justify-content-between my-4">
        <h4 className="fw-semibold text-dark mb-0">
          Performance Overview
        </h4>
      </div>

      <div className="row g-4">
       

        {/* Total Views */}
        <div className="col-md-6 col-lg-4">
          <div className="card statistics-card-1">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="avtar bg-brand-color-2 text-white me-3">
                  <i className="ti ti-eye f-26"></i>
                </div>
                <div>
                  <p className="text-muted mb-0">Views</p>
                  <h2 className="mb-0 f-w-500">{stats.totalViews || 0}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Downloads */}
        <div className="col-md-6 col-lg-4">
          <div className="card statistics-card-1">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="avtar bg-brand-color-3 text-white me-3">
                  <i className="ti ti-download f-26"></i>
                </div>
                <div>
                  <p className="text-muted mb-0">Downloads</p>
                  <h2 className="mb-0 f-w-500">{stats.totalDownloads || 0}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Today Submissions */}
        <div className="col-md-6 col-lg-4">
          <div className="card statistics-card-1">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="avtar bg-brand-color-2 text-white me-3">
                  <i className="ti ti-upload f-26"></i>
                </div>
                <div>
                  <p className="text-muted mb-0">Submissions</p>
                  <h2 className="mb-0 f-w-500">{stats.totalSubmissions || 0}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
