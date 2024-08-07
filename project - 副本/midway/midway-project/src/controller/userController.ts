import { Provide, Inject, Controller, Post, Body, Get, Headers, Query} from '@midwayjs/decorator';
import { UserService } from '../service/userService';
import { CircleService, Circle, Post as CirclePost, Comment } from '../service/circleService';



@Provide()
@Controller('/api/user')
export class UserController {
  @Inject()
  userService: UserService;

  @Inject()
  circleService: CircleService;

  @Post('/login')
  async login(@Body() body) {
    const { username, password } = body;
    try {
      const result = await this.userService.login(username, password);
      return { success: true, ...result };
    } catch (error) {
      return { success: false, message: 'Password incorrect' };
    }
  }

  @Post('/createCircle')
  async createCircle(@Body() body, @Headers() headers): Promise<{ success: boolean; circle?: Circle; message?: string }> {
    const token = headers['authorization']?.split(' ')[1];
    const user = this.userService.verifyToken(token);
    if (!user) {
      return { success: false, message: 'Invalid token' };
    }
    const { name } = body;
    const circle = await this.circleService.createCircle(name, user.username);
    return { success: true, circle };
  }

  @Get('/circles')
  async getCircles(@Headers() headers): Promise<{ success: boolean; circles?: Circle[]; message?: string }> {
    const token = headers['authorization']?.split(' ')[1];
    const user = this.userService.verifyToken(token);
    if (!user) {
      return { success: false, message: 'Invalid token' };
    }
    const circles = await this.circleService.getCircles();
    return { success: true, circles };
  }

  @Get('/circle')
  async getCircle(@Query('name') name: string, @Headers() headers): Promise<{ success: boolean; circle?: Circle; message?: string }> {
    const token = headers['authorization']?.split(' ')[1];
    const user = this.userService.verifyToken(token);
    if (!user) {
      return { success: false, message: 'Invalid token' };
    }
    const circle = await this.circleService.getCircle(name);
    if (circle) {
      return { success: true, circle };
    } else {
      return { success: false, message: 'Circle not found' };
    }
  }

  @Post('/addPost')
  async addPost(@Body() body, @Headers() headers): Promise<{ success: boolean; circle?: Circle; message?: string }> {
    const token = headers['authorization']?.split(' ')[1];
    const user = this.userService.verifyToken(token);
    if (!user) {
      return { success: false, message: 'Invalid token' };
    }
    const { circleName, content } = body;
    const post: CirclePost = {
      content,
      author: user.username,
      timestamp: new Date().toISOString()
    };
    const circle = await this.circleService.addPostToCircle(circleName, post);
    if (circle) {
      return { success: true, circle };
    } else {
      return { success: false, message: 'Circle not found' };
    }
  }
  @Post('/addComment')
  async addComment(@Body() body, @Headers() headers): Promise<{ success: boolean; circle?: Circle; message?: string }> {
    const token = headers['authorization']?.split(' ')[1];
    const user = this.userService.verifyToken(token);
    if (!user) {
      return { success: false, message: 'Invalid token' };
    }
    const { circleName, postIndex, content } = body;
    const comment: Comment = {
      content,
      author: user.username,
      timestamp: new Date().toISOString()
    };
    const circle = await this.circleService.addCommentToPost(circleName, postIndex, comment);
    if (circle) {
      return { success: true, circle };
    } else {
      return { success: false, message: 'Post not found' };
    }
  }
  @Post('/likePost')
async likePost(@Body() body, @Headers() headers): Promise<{ success: boolean; circle?: Circle; message?: string }> {
  const token = headers['authorization']?.split(' ')[1];
  const user = this.userService.verifyToken(token);
  if (!user) {
    return { success: false, message: 'Invalid token' };
  }
  const { circleName, postIndex } = body;
  const circle = await this.circleService.likePost(circleName, postIndex, user.username);
  if (circle) {
    return { success: true, circle };
  } else {
    return { success: false, message: 'Circle not found' };
  }
}
@Post('/likeComment')
async likeComment(@Body() body, @Headers() headers): Promise<{ success: boolean; circle?: Circle; message?: string }> {
  const token = headers['authorization']?.split(' ')[1];
  const user = this.userService.verifyToken(token);
  if (!user) {
    return { success: false, message: 'Invalid token' };
  }
  const { circleName, postIndex, commentIndex } = body;
  const circle = await this.circleService.likeComment(circleName, postIndex, commentIndex, user.username);
  if (circle) {
    return { success: true, circle };
  } else {
    return { success: false, message: 'Circle not found' };
  }
}

  @Get('/userPostCounts')
async getUserPostCounts(): Promise<{ success: boolean; userPostCounts?: { username: string; postCount: number }[] }> {
  const userPostCounts = await this.circleService.getUserPostCounts();
  return { success: true, userPostCounts };
}


}
