import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, FlatList, TouchableOpacity } from 'react-native';

interface SearchResult {
  id: number;
  title: string;
  by: string;
}

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const searchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate search by fetching top stories and filtering
        const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        const storyIds = await response.json();
        
        // Get first 20 stories for search
        const storyPromises = storyIds.slice(0, 20).map((id: number) =>
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
        );
        
        const stories = await Promise.all(storyPromises);
        const filteredResults = stories.filter((story: any) => 
          story && story.title && story.title.toLowerCase().includes(query.toLowerCase())
        );
        
        setResults(filteredResults);
      } catch (err) {
        setError('Error fetching results');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchPosts, 300); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [query]);

  const renderResult = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.title}</Text>
      <Text style={{ fontSize: 14, color: '#666' }}>by {item.by}</Text>
    </TouchableOpacity>
  );

  return (
    <View testID="search-component" style={{ flex: 1 }}>
      <TextInput 
        placeholder="Search..." 
        testID="search-input"
        value={query}
        onChangeText={setQuery}
        style={{ 
          borderWidth: 1, 
          borderColor: '#ccc', 
          padding: 12, 
          margin: 16, 
          borderRadius: 8 
        }}
      />
      
      {loading && <Text style={{ textAlign: 'center', padding: 16 }}>Searching...</Text>}
      
      {error && <Text style={{ textAlign: 'center', padding: 16, color: 'red' }}>{error}</Text>}
      
      {!loading && !error && query.trim() !== '' && results.length === 0 && (
        <Text style={{ textAlign: 'center', padding: 16 }}>No results found</Text>
      )}
      
      {results.length > 0 && (
        <FlatList
          data={results}
          renderItem={renderResult}
          keyExtractor={(item) => item.id.toString()}
          style={{ flex: 1 }}
        />
      )}
    </View>
  );
}
