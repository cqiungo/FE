import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Flex,
  Typography,
  Card,
  Divider,
} from "antd";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/api/auth.api";
import { Link } from "react-router-dom";

const { Text } = Typography;

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    console.log(values)
    const user = await authApi.register(values)
    console.log(user)
    navigate("/dashboard"); 
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
            name="name"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your username"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your Email!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your email"
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


          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              size="large"
              style={{ borderRadius: 8 }}
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        <Divider plain>or</Divider>

        <Flex justify="center">
          <Text>
            Already have an account?{" "}
            <Link to={{
                    pathname: "/login",
                }}
                style={{ fontWeight: 500 }}>
              Login
            </Link>
          </Text>
        </Flex>
      </Card>
    </Flex>
  );
};

export default SignUp;
