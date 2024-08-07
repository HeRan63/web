import { Provide } from '@midwayjs/decorator';
import { promises as fs } from 'fs';
import * as path from 'path';

export interface Comment {
  content: string;
  author: string;
  timestamp: string; // ISO 8601 格式时间戳
  likes?: number; // 点赞数
  liked?: boolean; // 是否已点赞
}

export interface Post {
  content: string;
  author: string;
  timestamp: string; // ISO 8601 格式时间戳
  comments?: Comment[]; // 新增评论数组
  likes?: number; // 点赞数
  liked?: boolean; // 是否已点赞
}


export interface Circle {
  name: string;
  creator: string;
  posts: Post[];
}

const CIRCLES_FILE_PATH = path.join(__dirname, '../../circles.json');

@Provide()
export class CircleService {
  private async loadCircles(): Promise<Circle[]> {
    try {
      const data = await fs.readFile(CIRCLES_FILE_PATH, 'utf8');
      return JSON.parse(data) as Circle[];
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  private async saveCircles(circles: Circle[]): Promise<void> {
    await fs.writeFile(CIRCLES_FILE_PATH, JSON.stringify(circles, null, 2), 'utf8');
  }

  public async createCircle(name: string, creator: string): Promise<Circle> {
    const circles = await this.loadCircles();
    const newCircle: Circle = { name, creator, posts: [] };
    circles.push(newCircle);
    await this.saveCircles(circles);
    return newCircle;
  }

  public async getCircles(): Promise<Circle[]> {
    return this.loadCircles();
  }

  public async getCircle(name: string): Promise<Circle | undefined> {
    const circles = await this.loadCircles();
    return circles.find(circle => circle.name === name);
  }

  public async addPostToCircle(circleName: string, post: Post): Promise<Circle | undefined> {
    const circles = await this.loadCircles();
    const circle = circles.find(circle => circle.name === circleName);
    if (circle) {
      circle.posts.push(post);
      await this.saveCircles(circles);
      return circle;
    }
    return undefined;
  }

  public async addCommentToPost(circleName: string, postIndex: number, comment: Comment): Promise<Circle | undefined> {
    const circles = await this.loadCircles();
    const circle = circles.find(circle => circle.name === circleName);
    if (circle && circle.posts[postIndex]) {
      const post = circle.posts[postIndex];
      if (!post.comments) {
        post.comments = [];
      }
      post.comments.push(comment);
      await this.saveCircles(circles);
      return circle;
    }
    return undefined;
  }
  public async getUserPostCounts(): Promise<{ username: string; postCount: number }[]> {
    const circles = await this.loadCircles();
    const userPostCounts: { [username: string]: number } = {};
  
    circles.forEach(circle => {
      circle.posts.forEach(post => {
        if (userPostCounts[post.author]) {
          userPostCounts[post.author]++;
        } else {
          userPostCounts[post.author] = 1;
        }
      });
    });
  
    return Object.keys(userPostCounts).map(username => ({
      username,
      postCount: userPostCounts[username]
    })).sort((a, b) => b.postCount - a.postCount);
  }
  public async likePost(circleName: string, postIndex: number, username: string): Promise<Circle | undefined> {
    const circles = await this.loadCircles();
    const circle = circles.find(circle => circle.name === circleName);
    if (circle && circle.posts[postIndex]) {
      const post = circle.posts[postIndex];
      post.likes = (post.likes || 0) + 1;
      post.liked = true; // 标记为已点赞
      await this.saveCircles(circles);
      return circle;
    }
    return undefined;
  }

  public async likeComment(circleName: string, postIndex: number, commentIndex: number, username: string): Promise<Circle | undefined> {
    const circles = await this.loadCircles();
    const circle = circles.find(circle => circle.name === circleName);
    if (circle && circle.posts[postIndex] && circle.posts[postIndex].comments[commentIndex]) {
      const comment = circle.posts[postIndex].comments[commentIndex];
      comment.likes = (comment.likes || 0) + 1;
      comment.liked = true; // 标记为已点赞
      await this.saveCircles(circles);
      return circle;
    }
    return undefined;
  }
  
}
