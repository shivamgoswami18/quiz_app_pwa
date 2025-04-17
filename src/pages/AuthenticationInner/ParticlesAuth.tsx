import withRouter from "Components/Common/withRouter";
import { commonLabel } from "Components/constants/common";

const ParticlesAuth = ({ children }: any) => {
  return (
    <div className="auth-page-wrapper pt-5">
      {children}
      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="text-center">
                <p className="mb-0 text-muted">
                  &copy; {new Date().getFullYear()} {commonLabel.ShivInfotech}
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default withRouter(ParticlesAuth);
