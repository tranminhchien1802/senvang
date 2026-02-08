// Utility functions for managing posts data
const POSTS_STORAGE_KEY = 'websitePosts';

// Initialize default posts if none exist
const initializeDefaultPosts = () => {
  const defaultPosts = [
    {
      id: '1',
      title: 'Hướng dẫn thành lập doanh nghiệp năm 2024',
      excerpt: 'Bộ luật hướng dẫn chi tiết các bước thành lập doanh nghiệp theo quy định mới nhất',
      content: 'Nội dung đầy đủ của bài viết...',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=400&fit=crop',
      date: new Date().toISOString(),
      author: 'Admin',
      slug: 'huong-dan-thanh-lap-doanh-nghiep-2024',
      featured: true
    },
    {
      id: '2',
      title: 'Các loại hình doanh nghiệp phổ biến tại Việt Nam',
      excerpt: 'So sánh các loại hình doanh nghiệp phổ biến và ưu nhược điểm của từng loại',
      content: 'Nội dung đầy đủ của bài viết...',
      image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop',
      date: new Date(Date.now() - 86400000).toISOString(), // yesterday
      author: 'Admin',
      slug: 'cac-loai-hinh-doanh-nghiep-pho-bien',
      featured: false
    }
  ];
  
  localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(defaultPosts));
  return defaultPosts;
};

// Get all posts
export const getAllPosts = () => {
  try {
    const postsData = localStorage.getItem(POSTS_STORAGE_KEY);
    if (!postsData) {
      return initializeDefaultPosts();
    }
    
    let posts = JSON.parse(postsData);
    
    // If no posts exist, initialize with defaults
    if (!posts || posts.length === 0) {
      return initializeDefaultPosts();
    }
    
    return posts;
  } catch (error) {
    console.error('Error reading posts from localStorage:', error);
    return initializeDefaultPosts();
  }
};

// Get a single post by ID
export const getPostById = (id) => {
  const posts = getAllPosts();
  return posts.find(post => post.id === id);
};

// Add a new post
export const addPost = (postData) => {
  try {
    const posts = getAllPosts();
    const newPost = {
      ...postData,
      id: Date.now().toString(), // Generate unique ID
      date: new Date().toISOString(),
      featured: postData.featured || false, // Add featured property
      slug: postData.title.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
    };

    posts.unshift(newPost); // Add to the beginning to show as newest
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));

    return newPost;
  } catch (error) {
    console.error('Error adding post:', error);
    throw error;
  }
};

// Update an existing post
export const updatePost = (postId, postData) => {
  try {
    const posts = getAllPosts();
    const postIndex = posts.findIndex(post => post.id === postId);
    
    if (postIndex === -1) {
      throw new Error(`Post with ID ${postId} not found`);
    }
    
    const updatedPost = {
      ...postData,
      id: postId,
      date: posts[postIndex].date, // Keep original date
      slug: postData.title.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
    };
    
    posts[postIndex] = updatedPost;
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
    
    return updatedPost;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

// Delete a post
export const deletePost = (postId) => {
  try {
    const posts = getAllPosts();
    const filteredPosts = posts.filter(post => post.id !== postId);
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(filteredPosts));
    
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

// Get featured posts
export const getFeaturedPosts = () => {
  const posts = getAllPosts();
  return posts.filter(post => post.featured).slice(0, 3);
};

// Get latest posts
export const getLatestPosts = (limit = 6) => {
  const posts = getAllPosts();
  return posts.slice(0, limit);
};