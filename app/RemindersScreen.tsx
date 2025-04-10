
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import  supabase  from '../lib/supabase'; // Make sure this path is correct
import { router } from 'expo-router';

interface Reminder {
  date: string;
  task: string;
}

export default function CalendarScreen() {
  const [markedDates, setMarkedDates] = useState<Record<string, { marked: boolean; dotColor: string; selected?: boolean; selectedColor?: string; task?: string; date?: string }>>({});
  const [loading, setLoading] = useState(true);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImportantDates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if supabase client is initialized
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) throw authError;
      if (!user) throw new Error('No authenticated user');

      const { data, error: queryError } = await supabase
        .from('date')
        .select('date, task')
        .eq('user_id', user.id);

      if (queryError) throw queryError;

      const marks: any = {};
      data?.forEach((item) => {
        try {
          const formattedDate = new Date(item.date).toISOString().split('T')[0];
          marks[formattedDate] = { 
            marked: true,
            dotColor: 'red',
            selected: true,
            selectedColor: '#3b82f6',
            task: item.task,
            date: item.date
          };
        } catch (e) {
          console.error('Error formatting date:', item.date, e);
        }
      });
      setMarkedDates(marks);
    } catch (err) {
      console.error('Error fetching dates:', err);
      setError(err instanceof Error ? err.message : 'Failed to load reminders');
    } finally {
      setLoading(false);
    }
  };

  const handleDayPress = (day: any) => {
    const dateInfo = markedDates[day.dateString] as { task?: string; date?: string } | undefined;
    if (dateInfo) {
      setSelectedReminder({
        date: day.dateString,
        task: dateInfo.task || ''
      });
      setModalVisible(true);
    }
  };

  useEffect(() => {
    fetchImportantDates();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Retry" onPress={fetchImportantDates} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Calendar 
        markedDates={markedDates}
        onDayPress={handleDayPress}
        theme={{
          selectedDayBackgroundColor: '#3b82f6',
          todayTextColor: '#3b82f6',
          arrowColor: '#3b82f6',
        }}
      />
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reminder</Text>
            <Text style={styles.modalDate}>
              {selectedReminder?.date}
            </Text>
            <Text style={styles.modalTask}>
              {selectedReminder?.task}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.buttonContainer}>
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
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 20,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonSpacer: {
    width: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDate: {
    fontSize: 16,
    color: '#3b82f6',
    marginBottom: 15,
  },
  modalTask: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#3b82f6',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
