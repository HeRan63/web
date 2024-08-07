import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Input, Button, List, Avatar, message as antMessage } from 'antd';
import { UserOutlined, PlusOutlined, LogoutOutlined } from '@ant-design/icons';
import './Circles.css'; // 引入自定义样式文件

const { Header, Content, Sider } = Layout;

const Circles = () => {
  const [circles, setCircles] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [userPostCounts, setUserPostCounts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCircles = async () => {
      try {
        const response = await axios.get('/api/user/circles', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.data.success) {
          setCircles(response.data.circles);
        } else {
          setMessage('Failed to fetch circles');
        }
      } catch (error) {
        setMessage('Failed to fetch circles');
      }
    };
    fetchCircles();
  }, []);

  useEffect(() => {
    const fetchUserPostCounts = async () => {
      try {
        const response = await axios.get('/api/user/userPostCounts', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.data.success) {
          setUserPostCounts(response.data.userPostCounts);
        }
      } catch (error) {
        console.error('Failed to fetch user post counts', error);
      }
    };
    fetchUserPostCounts();
  }, []);

  const handleCreateCircle = async () => {
    try {
      const response = await axios.post('/api/user/createCircle', { name }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.success) {
        setCircles([...circles, response.data.circle]);
        setName('');
        setMessage('Circle created successfully');
      } else {
        setMessage('Failed to create circle');
        antMessage.error('Failed to create circle');
      }
    } catch (error) {
      setMessage('Failed to create circle');
      antMessage.error('Failed to create circle');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh', width: '100%' }}>
      <Header className="header">
        <div className="header-buttons">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New circle name"
            style={{ marginRight: '8px', width: '200px' }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateCircle}>
            Create Circle
          </Button>
        </div>
        <Button icon={<LogoutOutlined />} onClick={handleLogout}>
          Logout
        </Button>
      </Header>
      <Layout>
        <Content className="content">
          <div className="circle-list">
            <h1>Interest Circles</h1>
            <Menu mode="inline"  style={{ height: '100%', borderRight: 0 }}>
              {circles.map((circle, index) => (
                <Menu.Item key={index} className="circle-menu-item">
                  <Link to={`/circle/${circle.name}`}>{circle.name} (Created by {circle.creator})</Link>
                </Menu.Item>
              ))}
            </Menu>
            <p>{message}</p>
          </div>
          <Sider width={250} className="sider">
            <div className="sider-content">
              <h2>User Post Counts</h2>
              <List
                itemLayout="horizontal"
                dataSource={userPostCounts}
                renderItem={user => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={user.username}
                      description={`${user.postCount} posts`}
                    />
                  </List.Item>
                )}
              />
            </div>
          </Sider>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Circles;
