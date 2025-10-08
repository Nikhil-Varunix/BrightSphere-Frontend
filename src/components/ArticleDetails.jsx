import React from "react";
import { Link } from "react-router-dom";
import BreadCrumb from "../components/BreadCrumb";

export default function ArticleDetails() {
  return (
    <>
     <div className="d-flex justify-content-between align-items-center mb-4">
                  <BreadCrumb subLabel="Article Details"/>
                   <div className="d-flex align-items-start gap-2 flex-wrap">
                          <Link to="/articles" className="btn btn-primary d-flex align-items-center">
                    <i className="ti ti-arrow-left f-24"></i> Back to Articles
                    </Link>
                         </div>
    </div>
    <div className="container my-5">
      {/* Cover Image */}
      <div className="mb-4">
        <img
          src="/assets/images/pages/card-1.png"
          alt="Article Cover"
          className="img-fluid w-100 rounded shadow-sm"
          style={{ maxHeight: "200px", objectFit: "cover" }}
        />
      </div>

      {/* Title & Metadata */}
      <div className="mb-4 text-start">
        <h2 className="fw-bold mb-3">
          Go Green, Green Innovation for Global
        </h2>
        <p className="text-muted mb-2 fs-5">
          By <span className="fw-semibold">Pravinaben Mangubhai Gamit</span>
        </p>

       <div className="mt-4">

  {/* Article Type */}
  <p className="mb-2 text-muted">
    <i className="ti ti-file-description text-success me-2"></i>
    Article type: <span className="fw-semibold">Research</span>
  </p>

  {/* Journal */}
  <p className="mb-2 text-muted">
    <i className="ti ti-book text-primary me-2"></i>
    Journal: <span className="fw-semibold">Life and Environmental Science</span>
  </p>

  {/* Published Date */}
  <p className="mb-0 text-muted">
    <i className="ti ti-calendar text-danger me-2"></i>
    Published: <span className="fw-semibold">12th December 25</span>
  </p>
</div>

      </div>

      {/* Stats */}
      <div className="d-flex justify-content-start gap-5 mb-5">
  <div className="d-flex align-items-center gap-2">
    <i className="ti ti-eye text-primary fs-4"></i>
    <span className="fw-semibold">980 </span>
  </div>
  <div className="d-flex align-items-center gap-2">
    <i className="ti ti-download text-danger fs-4"></i>
    <span className="fw-semibold">200 </span>
  </div>
</div>


      {/* Abstract */}
      <div className="card shadow-sm border-0 p-4">
        <h4 className="fw-bold mb-3 text-success">
          <i className="ti ti-align-left me-2"></i>Abstract
        </h4>
        <p className="text-muted lh-lg" style={{ textAlign: "justify" }}>
          “LIVE GREEN THINK GREEN LOVE GREEN” Let’s go green together. “A meter of green is
          greener than a centimetre” I am in love with this green Earth – Charles Lamb.
          Nowadays, Go Green has become an initiative protecting the natural resources for the
          next generation and protects human health through environmental management and
          implementation of green ways of life. And live in a eco-friendlier way.
        </p>
        <p className="text-muted lh-lg" style={{ textAlign: "justify" }}>
          I love so much greenery and that why my favourite colour is green from childhood.
          Greenery change my thoughts of life and my life–style, so I choose this topic go
          green for global, because when I see the greenery my mood is definitely smile in my
          face and I will be very happy in my inner life. Many people said that “Our inner
          happiness glow our external body and face.
        </p>
        <p className="text-muted lh-lg" style={{ textAlign: "justify" }}>
          Go green is imperative to realize that there is only one Earth and nurturing a
          symbolic relationship with nature will ensure long-term sustainability leading to
          enhance people value.
        </p>
      </div>
    </div>
    </>
  );
}
