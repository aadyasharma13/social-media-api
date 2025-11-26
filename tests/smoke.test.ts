import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';

const api = () => request(app);

async function runSmokeTests(): Promise<void> {
  const unique = Date.now();
  const email = `smoke-user-${unique}@example.com`;
  const username = `smoke${unique}`;
  const password = 'Passw0rd!';

  // Register user
  const registerRes = await api()
    .post('/api/users')
    .send({
      user: {
        username,
        email,
        password
      }
    });

  assert.equal(registerRes.status, 201, `Expected 201 for register, received ${registerRes.status}`);
  assert.equal(registerRes.body?.success, true, 'Register response should be success');
  const registeredUser = registerRes.body?.data?.user;
  assert.ok(registeredUser?.token, 'Register response should include token');

  // Login user
  const loginRes = await api()
    .post('/api/users/login')
    .send({
      user: {
        email,
        password
      }
    });

  assert.equal(loginRes.status, 200, `Expected 200 for login, received ${loginRes.status}`);
  const token: string | undefined = loginRes.body?.data?.user?.token;
  assert.ok(token, 'Login response missing token');

  // Create post
  const postContent = `Smoke test post ${unique}`;
  const createPostRes = await api()
    .post('/api/posts')
    .set('Authorization', `Token ${token}`)
    .send({
      post: {
        content: postContent,
        imageUrl: null
      }
    });

  assert.equal(createPostRes.status, 201, `Expected 201 for create post, received ${createPostRes.status}`);
  const createdPost = createPostRes.body?.data?.post;
  assert.ok(createdPost?._id, 'Create post response missing post id');

  // List posts
  const listPostsRes = await api().get('/api/posts');
  assert.equal(listPostsRes.status, 200, `Expected 200 for posts list, received ${listPostsRes.status}`);
  const posts = listPostsRes.body?.data?.posts;
  assert.ok(Array.isArray(posts), 'Posts list should include an array of posts');
  assert.ok(posts.length >= 1, 'Posts list should contain at least one post');

  // Create comment
  const commentRes = await api()
    .post(`/api/posts/${createdPost._id}/comments`)
    .set('Authorization', `Token ${token}`)
    .send({
      comment: {
        content: 'Nice post from smoke test'
      }
    });

  assert.equal(commentRes.status, 201, `Expected 201 for comment creation, received ${commentRes.status}`);
  assert.ok(commentRes.body?.data?.comment, 'Comment response should include comment data');

  // Notifications list (should succeed even if empty)
  const notificationsRes = await api()
    .get('/api/notifications')
    .set('Authorization', `Token ${token}`);

  assert.equal(notificationsRes.status, 200, `Expected 200 for notifications, received ${notificationsRes.status}`);
  assert.equal(notificationsRes.body?.success, true, 'Notifications response should be success');
}

runSmokeTests()
  .then(() => {
    console.log('Smoke tests passed ✅');
  })
  .catch((error) => {
    console.error('Smoke tests failed ❌');
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });
