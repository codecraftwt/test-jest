import React, { useState, useEffect, Fragment } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

interface PostDetailProps {
  postId: number;
}

interface Post {
  id: number;
  title: string;
  by: string;
  content?: string;
}

interface Comment {
  id: number;
  text: string;
  by: string;
}

export default function PostDetail({ postId }: PostDetailProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${postId}.json`);
        const postData = await response.json();
        setPost(postData);
        
        // Fetch comments if they exist
        if (postData.kids && postData.kids.length > 0) {
          const commentPromises = postData.kids.slice(0, 10).map((id: number) => 
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
          );
          const commentData = await Promise.all(commentPromises);
          setComments(commentData.filter(comment => comment && !comment.deleted));
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const refreshComments = async () => {
    if (!post?.kids) return;
    
    try {
      const commentPromises = post.kids.slice(0, 10).map((id: number) => 
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
      );
      const commentData = await Promise.all(commentPromises);
      setComments(commentData.filter(comment => comment && !comment.deleted));
    } catch (error) {
      console.error('Error refreshing comments:', error);
    }
  };

  if (loading) {
    return (
      <View testID="post-detail">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!post) {
    return (
      <View testID="post-detail">
        <Text>Post not found</Text>
      </View>
    );
  }

  return (
    <ScrollView testID="post-detail">
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
          {post.title}
        </Text>
        <Text style={{ fontSize: 16, marginBottom: 16 }}>
          by {post.by}
        </Text>
        
        {post.content && (
          <Text style={{ fontSize: 16, lineHeight: 24, marginBottom: 16 }}>
            {post.content}
          </Text>
        )}

        <TouchableOpacity 
          testID="refresh-comments"
          onPress={refreshComments}
          style={{ 
            backgroundColor: '#007AFF', 
            padding: 12, 
            borderRadius: 8, 
            marginBottom: 16 
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>Refresh Comments</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
          Comments ({comments.length})
        </Text>

        {comments.length === 0 ? (
          <Text>No comments available</Text>
        ) : (
          comments.map((comment) => (
            <View key={comment.id} style={{ marginBottom: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 4 }}>
                {comment.by}
              </Text>
              <Text style={{ fontSize: 16 }}>
                {comment.text}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
