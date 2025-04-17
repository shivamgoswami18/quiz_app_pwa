import React from "react";

type StatCardProps = {
  icon: string;
  title: string;
  value: string | number;
};

const StatCard: React.FC<StatCardProps> = ({ icon, title, value }) => {
  return (
    <div className="col-lg-4 col-md-6 w-100">
      <div className="card rounded-pill card-animate">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="avatar-sm flex-shrink-0">
              <span className="avatar-title bg-light text-primary rounded-circle shadow fs-3">
                <i className={`mdi ${icon} align-middle`}></i>
              </span>
            </div>
            <div className="flex-grow-1 ms-3">
              <p className="text-uppercase fw-semibold fs-12 text-muted mb-1">
                {title}
              </p>
              <h4 className="mb-0">
                <span className="counter-value" data-target={value}>
                  {value}
                </span>
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
