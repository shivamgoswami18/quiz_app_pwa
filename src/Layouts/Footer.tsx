import { commonLabel } from "Components/constants/common";
import { Col, Container, Row } from "reactstrap";

const Footer = () => {
  return (
    <footer className="footer">
      <Container fluid>
        <Row>
          <Col sm={6}>
            &copy; {new Date().getFullYear()} {commonLabel.ShivInfotech}
          </Col>
          <Col sm={6}>
            <div className="text-sm-end d-none d-sm-block"></div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
