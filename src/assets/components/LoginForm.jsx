import React from "react";
import { Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import "../../App.css";

const LoginForm = ({ email, password, error, setEmail, setPassword, handleSubmit }) => {
  const { t } = useTranslation();

  return (
    <Row className="w-100 justify-content-center">
      <Col md={6} lg={5} xl={4}>
        <Card className="p-4 shadow-lg">
          <Card.Body>
            <h3 className="text-center mb-4">{t('login.titulo')}</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="emailUsuario">
                <Form.Label>{t('login.email')}</Form.Label>
                <Form.Control
                  type="email"
                  placeholder={t('login.placeholderEmail')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="contraseñaUsuario">
                <Form.Label>{t('login.password')}</Form.Label>
                <Form.Control
                  type="password"
                  placeholder={t('login.placeholderPassword')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                {t('login.boton')}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginForm;