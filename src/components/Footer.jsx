import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (

    <>
      <footer className="pc-footer">
        <div className="footer-wrapper container-fluid">
          <div className="row">
            <div className="col-sm-6 my-1">
              <p className="m-0">Developed by
                <a href="https://varunix.in/" target="_blank" className="text-primary -bold p-1 ">
                  varunix.in
                </a>
              </p>
            </div>
            <div className="col-sm-6 ms-auto my-1">
              <ul className="list-inline footer-link mb-0 justify-content-sm-end d-flex">
                <li className="list-inline-item">
                  <Link to="/">
                    Home
                  </Link>
                </li>

                <li className="list-inline-item">
                  <a href="https://www.varunix.in/" target="_blank">
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>

  )
}

export default Footer