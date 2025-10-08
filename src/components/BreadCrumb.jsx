import { Link } from "react-router-dom";

//usage
{/* <BreadCrumb  subLabel="Tasks" pageTitle="Task List" subUrl="/tasks" /> */ }

const BreadCrumb = ({ subUrl, subLabel, pageTitle }) => {
    return (
        <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item text-pri">
                                <Link className="text-primary" to="/">Home</Link>
                            </li>
                            <li className="breadcrumb-item">
                                <span to={subUrl}>{subLabel}</span>
                            </li>
                            {pageTitle &&
                                <li className="breadcrumb-item" aria-current="page">
                                    {pageTitle}
                                </li>
                            }
                        </ul>
                    </div>
                    {/* <div className="col-md-12">
                        <div className="page-header-title">
                            <h2 className="mb-0">{pageTitle?pageTitle:subLabel}</h2>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default BreadCrumb;
