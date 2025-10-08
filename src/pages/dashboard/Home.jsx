import BreadCrumb from '../../components/BreadCrumb'
import { useEffect } from 'react';
import { Link } from "react-router-dom";
const Home = () => {

  return (
    <>
      <BreadCrumb  subUrl="/" />
      <div className="row">
      
         {/* -------------tasks end---------- */}
         <div className="d-flex align-items-center justify-content-between mb-4">
           <h4 className="fw-semibold text-dark mb-0">Total Views & Downloads</h4>
        </div>
        <div className="row mb-4 g-4">
  {/* Total Articles */}
  <div className="col-lg-3 col-md-6 col-sm-12">
    <div className="card h-100 border-0 shadow rounded-3 text-center">
      <div className="card-body p-4">
        <div className="d-inline-flex align-items-center justify-content-center bg-light-primary text-white rounded-circle mb-3" style={{ width: "60px", height: "60px" }}>
          <i className="ti ti-news fs-2"></i> 
        </div>
        <h6 className="text-muted mb-1">Total Articles</h6>
        <h4 className="fw-bold mb-0">12</h4>
      </div>
    </div>
  </div>

  {/* Total Views */}
  <div className="col-lg-3 col-md-6 col-sm-12">
    <div className="card h-100 border-0 shadow rounded-3 text-center">
      <div className="card-body p-4">
        <div className="d-inline-flex align-items-center justify-content-center bg-light-success text-white rounded-circle mb-3" style={{ width: "60px", height: "60px" }}>
          <i className="ti ti-eye f-18"></i>
        </div>
        <h6 className="text-muted mb-1">Total Views</h6>
        <h4 className="fw-bold mb-0">3,450</h4>
      </div>
    </div>
  </div>

  {/* Total Downloads */}
  <div className="col-lg-3 col-md-6 col-sm-12">
    <div className="card h-100 border-0 shadow rounded-3 text-center">
      <div className="card-body p-4">
        <div className="d-inline-flex align-items-center justify-content-center bg-light-warning text-white rounded-circle mb-3" style={{ width: "60px", height: "60px" }}>
          <i className="ti ti-download f-18"></i>
        </div>
        <h6 className="text-muted mb-1">Total Downloads</h6>
        <h4 className="fw-bold mb-0">980</h4>
      </div>
    </div>
  </div>

  {/* Today Submissions */}
  <div className="col-lg-3 col-md-6 col-sm-12">
    <div className="card h-100 border-0 shadow rounded-3 text-center">
      <div className="card-body p-4">
        <div className="d-inline-flex align-items-center justify-content-center bg-light-info text-white rounded-circle mb-3" style={{ width: "60px", height: "60px" }}>
          <i className="ti ti-upload f-18"></i>
        </div>
        <h6 className="text-muted mb-1">Today Submissions</h6>
        <h4 className="fw-bold mb-0">5</h4>
      </div>
    </div>
  </div>
</div>



      </div>
    </>
  )
}

export default Home;