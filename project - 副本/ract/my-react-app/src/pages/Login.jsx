import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Layout, Input, Button, Typography, message as antMessage } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './Login.css'; // 引入自定义样式文件

const { Content } = Layout;
const { Title, Text } = Typography;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/user/login', { username, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        antMessage.success(`Welcome, ${response.data.username}`);
        navigate('/circles'); // 使用 useNavigate 进行导航
      } else {
        antMessage.error('Password incorrect');
      }
    } catch (error) {
      antMessage.error('Login failed');
    }
  };

  return (
    <Layout className="layout2">
      <Content className="content2">
        <div className="login-container">
          <Title level={2}>Login</Title>
          <Input
            size="large"
            placeholder="Username"
            prefix={<UserOutlined />}
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ marginBottom: '16px' }}
          />
          <Input.Password
            size="large"
            placeholder="Password"
            prefix={<LockOutlined />}
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ marginBottom: '16px' }}
          />
          <Button type="primary" size="large" onClick={handleLogin} block>
            Login
          </Button>
          <Text type="secondary" className="remark-text">内置了五名用户：
            <Text code>user1</Text>, <Text code>user2</Text>, <Text code>user3</Text>, <Text code>user4</Text>, <Text code>user5</Text>
            ，密码均为 <Text code>123456</Text>

          </Text>
        </div>
      </Content>
    </Layout>
  );
};

export default Login;
