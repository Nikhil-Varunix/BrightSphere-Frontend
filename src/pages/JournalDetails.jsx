import React from "react";
import { Link } from "react-router-dom";
import BreadCrumb from "../components/BreadCrumb";

export default function JournalPage() {
  return (
    <>
     <div className="d-flex justify-content-between align-items-center mb-4">
                  <BreadCrumb subLabel="Journal Details"/>
                   <div className="d-flex align-items-start gap-2 flex-wrap">
                          <Link to="/journals" className="btn btn-primary d-flex align-items-center">
                    <i className="ti ti-arrow-left f-24"></i> Back to Journals
                    </Link>
                         </div>
    </div>
    <div className="container">
      {/* Journal Header with Image */}
      <div className="row align-items-center ">
        <div className="col-md-8">
          <h1 className="fw-bold">Journal of Earth And Environmental Science</h1>
          <p className="text-muted fs-5">
            Exploring Nature, Sustaining the Future
          </p>
        </div>
        <div className="col-md-4 text-center">
          <img
            src="/assets/images/pages/journal-1.png"
            alt="Journal Cover"
            className="img-fluid shadow-sm"
          />
        </div>
      </div>

      {/* Journal Description */}
      <div className="mb-5">
        <h3 className="mb-3">
          <i className="ti ti-info-circle text-warning me-2"></i>About the Journal
        </h3>
        <p className="lead">
          The Journal of Earth and Environmental Science is an international,
          peer-reviewed platform dedicated to advancing knowledge and research
          in the fields of Earth sciences and environmental studies. The journal
          aims to publish original research, reviews, case studies, and
          technical communications that address the scientific understanding of
          the Earth’s structure, processes, natural resources, and the complex
          interactions between humans and the environment.
        </p>
      </div>

      {/* Editorial Board */}
      <div className="mb-5">
        <h3 className="mb-4">
          <i className="ti ti-users text-primary me-2"></i>Editorial Board
        </h3>

        <div className="row g-4">
          {/* Editor 1 */}
          <div className="col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="fw-bold mb-1">Sandro Gelsomino</h5>
                <p className="mb-1">Professor of Cardiac Surgery</p>
                <p className="mb-1">
                  Head of Cardiothoracic Surgery Research Program
                </p>
                <p className="mb-1">University of Maastricht, CARIM</p>
                <p className="mb-1">Maastricht, Netherlands</p>
              </div>
            </div>
          </div>

          {/* Editor 2 */}
          <div className="col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="fw-bold mb-1">Vikas Kumar</h5>
                <p className="mb-1">Postdoctoral-Visiting Fellow</p>
                <p className="mb-1">Laboratory of Cardiovascular Science (LCS)</p>
                <p className="mb-1">NIH-National Institute on Aging</p>
                <p className="mb-1">
                  251 Bayview Blvd., Suite 100, Baltimore, USA
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div className="container mt-4">
        <h3 className="mb-4">
          <i className="ti ti-file-text text-success me-2"></i>Articles
        </h3>

        <div className="row g-4">
          {/* Article Card 1 */}
          <div className="col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="fw-bold mb-1">
                  Go Green, Green Innovation for Global
                </h5>
                <p className="mb-1 text-muted">
                  By: <span className="fw-semibold">Pravinaben Mangubhai Gamit</span> | Dec 25
                </p>
                <p className="text-muted small">
                  “LIVE GREEN THINK GREEN LOVE GREEN” Let’s go green together. 
                  “A meter of green is greener than a centimetre.” I am in love 
                  with this green Earth – Charles Lamb. Nowadays, Go Green has 
                  become an initiative protecting the natural resources for the 
                  next generation...
                </p>

                <div className="d-flex justify-content-between align-items-center">
                  <span>
                    <i className="ti ti-download text-danger me-1"></i>200
                  </span>
                  <span>
                    <i className="ti ti-eye text-primary me-1"></i>980
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Article Card 2 */}
          <div className="col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="fw-bold mb-1">Another Inspiring Article</h5>
                <p className="mb-1 text-muted">
                  By: <span className="fw-semibold">John Doe</span> | Dec 20
                </p>
                <p className="text-muted small">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                  Proin varius risus a felis aliquet, vitae vulputate lorem gravida...
                </p>

                <div className="d-flex justify-content-between align-items-center">
                  <span>
                    <i className="ti ti-download text-danger me-1"></i>120
                  </span>
                  <span>
                    <i className="ti ti-eye text-primary me-1"></i>450
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
