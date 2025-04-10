import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { router } from 'expo-router';
import supabase from '../lib/supabase';
import { BlurView } from 'expo-blur'; // Import BlurView

interface Task {
  id: number;
  task: string;
  user_id: string;
  created_at: string;
}

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null); // Track the task being edited
  const [editedText, setEditedText] = useState<string>(''); // Track the new text for the task
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal for loading

  const loadTasks = async () => {
    setLoading(true);
    setIsModalVisible(true); // Show loading modal
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('task')
        .select('*');
      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
      setIsModalVisible(false); // Hide loading modal
    }
  };

  const handleAdd = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setIsModalVisible(true); // Show loading modal
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');
      let obj = { task: text.trim(), user_id: user.id };
      const { data, error } = await supabase
        .from('task')
        .insert([obj]);

      if (error) {
        console.error('Error:', error);
        throw error;
      }
      setText('');
      await loadTasks();
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Failed to add task');
    } finally {
      setLoading(false);
      setIsModalVisible(false); // Hide loading modal
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    setIsModalVisible(true); // Show loading modal
    try {
      const { error } = await supabase
        .from('task')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task');
    } finally {
      setLoading(false);
      setIsModalVisible(false); // Hide loading modal
    }
  };

  const handleEditPress = (task: Task) => {
    setEditingTask(task);
    setEditedText(task.task); // Populate with current task name
  };

  const handleConfirmEdit = async () => {
    if (editedText.trim()) {
      setLoading(true);
      setIsModalVisible(true); // Show loading modal
      try {
        const { error } = await supabase
          .from('task')
          .update({ task: editedText })
          .eq('id', editingTask?.id);

        if (error) throw error;
        await loadTasks(); // Refresh tasks
        setEditingTask(null); // Close the edit mode
        setEditedText('');
      } catch (err) {
        console.error('Error updating task:', err);
        setError('Failed to update task');
      } finally {
        setLoading(false);
        setIsModalVisible(false); // Hide loading modal
      }
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  if (loading && tasks.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Tasks</Text>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter new task ( enter date in YYYY-MM-DD format )"
          placeholderTextColor="#aaa"
          value={text}
          onChangeText={setText}
          style={styles.input}
          onSubmitEditing={handleAdd}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAdd}
          disabled={loading || !text.trim()}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            {editingTask?.id === item.id ? (
              <View style={styles.editContainer}>
                <TextInput
                  value={editedText}
                  onChangeText={setEditedText}
                  style={styles.input}
                />
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleConfirmEdit}
                  disabled={loading || !editedText.trim()}
                >
                  <Text style={styles.confirmButtonText}>OK</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.taskText}>{item.task}</Text>
            )}
            
            <View style={styles.buttonGroup}>
              {editingTask?.id !== item.id && (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditPress(item)}
                  disabled={loading}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
                disabled={loading}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks yet. Add one above!</Text>
        }
      />

      <View style={styles.navButtons}>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          color="#666"
        />
        <View style={styles.buttonSpacer} />
        
      </View>

      {/* Loading modal with blur effect */}
      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <BlurView style={styles.modal} intensity={100} tint="light">
          <ActivityIndicator size="large" color="#fff" />
        </BlurView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  taskText: {
    fontSize: 16,
    flex: 1,
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#f0ad4e',
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    padding: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 15,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  buttonSpacer: {
    width: 10,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,  // Ensure the container takes the full width
  },
  input: {
    flex: 1,  // Ensure input takes the full width of its container
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: '#3b82f6',
    padding: 10,
    borderRadius: 5,
    marginRight: 10
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
