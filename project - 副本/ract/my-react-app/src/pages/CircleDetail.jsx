import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Layout, List, Avatar, Input, Button, Typography, Card, Upload } from 'antd';
import { UserOutlined, MessageOutlined, SendOutlined, UploadOutlined, LikeOutlined, LikeFilled } from '@ant-design/icons';
import './CircleDetail.css'; // 引入自定义样式文件

const { Content } = Layout;
const { TextArea } = Input;
const { Title } = Typography;

const CircleDetail = () => {
  const { name } = useParams();
  const [circle, setCircle] = useState({ name: '', posts: [] });
  const [postContent, setPostContent] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    async function fetchCircle() {
      try {
        const response = await axios.get('/api/user/circle', {
          params: { name },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.data.success) {
          setCircle(response.data.circle || { name: '', posts: [] });
        }
      } catch (error) {
        console.error('Error fetching circle:', error);
      }
    }
    fetchCircle();
  }, [name]);

  const handlePostSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/user/addPost', {
        circleName: name,
        content: postContent
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.success) {
        setCircle(response.data.circle);
        setPostContent('');
        setFileList([]);
      }
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/user/addComment', {
        circleName: name,
        postIndex: selectedPostIndex,
        content: commentContent
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.success) {
        setCircle(response.data.circle);
        setCommentContent('');
        setSelectedPostIndex(null);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleLikePost = (postIndex) => {
    const newPosts = [...circle.posts];
    if (newPosts[postIndex].liked) {
      newPosts[postIndex].likes -= 1;
      newPosts[postIndex].liked = false;
    } else {
      newPosts[postIndex].likes = (newPosts[postIndex].likes || 0) + 1;
      newPosts[postIndex].liked = true;
    }
    setCircle({ ...circle, posts: newPosts });
  };

  const handleLikeComment = (postIndex, commentIndex) => {
    const newPosts = [...circle.posts];
    const comments = newPosts[postIndex].comments;
    if (comments[commentIndex].liked) {
      comments[commentIndex].likes -= 1;
      comments[commentIndex].liked = false;
    } else {
      comments[commentIndex].likes = (comments[commentIndex].likes || 0) + 1;
      comments[commentIndex].liked = true;
    }
    newPosts[postIndex].comments = comments;
    setCircle({ ...circle, posts: newPosts });
  };

  return (
    <Layout className="layout">
      <Content className="content1">
        <h1>{circle.name}</h1>
    
        <div className="post-container">
          <Title level={3}>Posts:</Title>
          <List
            itemLayout="vertical"
            dataSource={circle.posts}
            renderItem={(post, index) => (
              <Card className="post-card" key={index}>
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={<span>{post.author}</span>}
                    description={<span>{new Date(post.timestamp).toLocaleString()}</span>}
                  />
                  <p>{post.content}</p>
                  <div>
                    <Button
                      type="link"
                      icon={post.liked ? <LikeFilled /> : <LikeOutlined />}
                      onClick={() => handleLikePost(index)}
                    >
                      {post.likes || 0}
                    </Button>
                  </div>
                  <List
                    className="comment-list"
                    itemLayout="horizontal"
                    dataSource={post.comments}
                    renderItem={(comment, cIndex) => (
                      <List.Item key={cIndex}>
                        <List.Item.Meta
                          avatar={<Avatar icon={<UserOutlined />} />}
                          title={comment.author}
                          description={<span>{comment.content} <em>{new Date(comment.timestamp).toLocaleString()}</em></span>}
                        />
                        <Button
                          type="link"
                          icon={comment.liked ? <LikeFilled /> : <LikeOutlined />}
                          onClick={() => handleLikeComment(index, cIndex)}
                        >
                          {comment.likes || 0}
                        </Button>
                      </List.Item>
                    )}
                  />
                  <Button
                    type="link"
                    icon={<MessageOutlined />}
                    onClick={() => setSelectedPostIndex(index)}
                  >
                    Comment
                  </Button>
                  {selectedPostIndex === index && (
                    <form onSubmit={handleCommentSubmit} className="comment-form">
                      <TextArea
                        rows={2}
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="Write a comment..."
                        required
                      />
                      <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SendOutlined />}
                        style={{ marginTop: '8px' }}
                      >
                        Submit Comment
                      </Button>
                    </form>
                  )}
                </List.Item>
              </Card>
            )}
          />
        </div>
        <div className="post-form-container">
          <Title level={3}>Write a Post</Title>
          <form onSubmit={handlePostSubmit}>
            <TextArea
              rows={4}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Write a post..."
              required
            />
            <Upload
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false} // 不上传文件
              listType="picture"
            >
              <Button icon={<UploadOutlined />} style={{ marginTop: '8px' }}>
                Select Image
              </Button>
            </Upload>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              style={{ marginTop: '8px' }}
            >
              Post
            </Button>
          </form>
        </div>
      </Content>
    </Layout>
  );
};

export default CircleDetail;
