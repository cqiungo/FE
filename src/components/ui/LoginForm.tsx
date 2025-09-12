import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Flex,
  Typography,
  Card,
  Divider,
  message,
} from "antd";
import { Link } from "react-router-dom";
// import { useLogin } from "../hooks/useAuth";

const { Title, Text } = Typography;

const Login: React.FC = () => {
//   const loginMutation = useLogin();

  const onFinish = (values: any) => {
    console.log(values)
  };

  return (
    <Flex
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f4ff, #e0e7ff)",
        padding: "1rem",
      }}
      justify="center"
      align="center"
    >
      <Card
        style={{
          width: 380,
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        }}
      >

        <Form
          name="login"
          initialValues={{ remember: true }}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your username"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
              size="large"
            />
          </Form.Item>

          <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a href="">Forgot password?</a>
          </Flex>

          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              size="large"
              style={{ borderRadius: 8 }}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>

        <Divider plain>or</Divider>

        <Flex justify="center">
          <Text>
            Don’t have an account?{" "}
            <Link to={{
                    pathname: "/register",
                }}
                style={{ fontWeight: 500 }}>
              Register now
            </Link>
          </Text>
        </Flex>
      </Card>
    </Flex>
  );
};

export default Login;
