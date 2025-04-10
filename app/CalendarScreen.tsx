import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Button } from 'react-native';
import { router } from 'expo-router';
import  supabase  from '../lib/supabase';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Reminder {
  id: number;
  date: string;
  user_id: string;
  task: string; // Direct text field from date table
}

export default function RemindersScreen() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [taskInput, setTaskInput] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReminders = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('date')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (error) throw error;
      setReminders(data || []);
    } catch (err) {
      console.error('Error loading reminders:', err);
      setError('Failed to load reminders');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!taskInput.trim()) return;
    
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      // Insert directly into date table with task text
      const { error } = await supabase
        .from('date')
        .insert([{
          user_id: user.id,
          date: date.toISOString(),
          task: taskInput.trim() // Using the task text column
        }]);

      if (error) throw error;

      setTaskInput('');
      setDate(new Date());
      await loadReminders();
    } catch (err) {
      console.error('Error adding reminder:', err);
      setError('Failed to add reminder');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('date')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadReminders();
    } catch (err) {
      console.error('Error deleting reminder:', err);
      setError('Failed to delete reminder');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  useEffect(() => {
    loadReminders();
  }, []);

  if (loading && reminders.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reminders</Text>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter task"
          value={taskInput}
          onChangeText={setTaskInput}
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAdd}
          disabled={loading || !taskInput.trim()}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.reminderItem}>
            <View style={styles.reminderContent}>
              <Text style={styles.reminderText}>{item.task}</Text>
              <Text style={styles.reminderDate}>
                {new Date(item.date).toLocaleDateString()}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.id)}
              disabled={loading}
            >
              <Text style={styles.deleteButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No reminders yet. Add one above!</Text>
        }
      />

      <View style={styles.navButtons}>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          color="#666"
        />
      </View>
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
    gap: 10,
  },
  input: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
  },
  dateButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
  },
  addButton: {
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reminderContent: {
    flex: 1,
  },
  reminderText: {
    fontSize: 16,
    fontWeight: '500',
  },
  reminderDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 18,
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
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});
