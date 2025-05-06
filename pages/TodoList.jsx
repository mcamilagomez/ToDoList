import React, { useContext, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Keyboard
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FAB,
  Portal,
  Modal,
  TextInput,
  Button,
  Appbar,
  ActivityIndicator
} from "react-native-paper";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { MaterialIcons } from '@expo/vector-icons';
import { TodoContext } from "../context/Provider";

export default function TodoList() {
  const { todos, loading, createTodo, updateTodo, deleteTodo } = useContext(TodoContext);

  const [visible, setVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const openAddModal = () => {
    setCurrentItem(null);
    setInputValue("");
    setVisible(true);
  };

  const openEditModal = (item) => {
    setCurrentItem(item);
    setInputValue(item.name);
    setVisible(true);
  };

  const handleSave = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    if (currentItem) {
      await updateTodo({ ...currentItem, name: trimmed });
    } else {
      await createTodo({ name: trimmed });
    }

    setVisible(false);
    setCurrentItem(null);
    setInputValue("");
  };

  const handleDelete = async (id) => {
    await deleteTodo(id);
  };

  const renderItem = ({ item }) => {
    const renderRightActions = () => (
      <TouchableOpacity 
        style={styles.deleteContainer}
        onPress={() => handleDelete(item.id)}
      >
        <MaterialIcons name="delete" size={24} color="white" />
      </TouchableOpacity>
    );

    return (
      <Swipeable
        friction={2}
        overshootRight={false}
        renderRightActions={renderRightActions}
        rightThreshold={40}
      >
        <View style={styles.itemContainer}>
          <Text style={styles.itemText}>{item.name}</Text>
          <TouchableOpacity 
            onPress={() => openEditModal(item)}
            style={styles.editButton}
          >
            <MaterialIcons name="edit" size={20} color="#4A90E2" />
          </TouchableOpacity>
        </View>
      </Swipeable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Lista de Tareas</Text>
        <Text style={styles.subtitle}>Bienvenido</Text>
      </View>

      {loading ? (
        <ActivityIndicator 
          animating 
          size="large" 
          color="#4A90E2" 
          style={styles.loader} 
        />
      ) : (
        <FlatList
          data={todos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="assignment" size={50} color="#D3D3D3" />
              <Text style={styles.emptyText}>No hay tareas pendientes</Text>
            </View>
          }
        />
      )}

      <FAB 
        style={styles.fab} 
        icon="plus"
        color="white"
        onPress={openAddModal}
        theme={{ colors: { accent: '#4A90E2' } }}
      />

      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {currentItem ? 'Editar Tarea' : 'Nueva Tarea'}
            </Text>
            <TextInput
              label="¿Qué necesitas hacer?"
              mode="flat"
              value={inputValue}
              onChangeText={setInputValue}
              onSubmitEditing={handleSave}
              style={styles.input}
              theme={{ colors: { primary: '#4A90E2' } }}
            />
            <View style={styles.buttonGroup}>
              <Button
                mode="contained"
                onPress={handleSave}
                style={styles.saveButton}
                labelStyle={styles.buttonLabel}
              >
                {currentItem ? 'Actualizar' : 'Agregar'}
              </Button>
              <Button
                mode="outlined"
                onPress={() => setVisible(false)}
                style={styles.cancelButton}
                labelStyle={styles.cancelButtonLabel}
              >
                Cancelar
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#2C3E50',
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginTop: 5,
  },
  loader: {
    marginTop: 50,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: '#95A5A6',
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    marginHorizontal: 15,
    marginVertical: 6,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    color: '#34495E',
    flex: 1,
  },
  editButton: {
    padding: 8,
    marginLeft: 10,
  },
  deleteContainer: {
    backgroundColor: '#E74C3C',
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
    marginRight: 15,
    borderRadius: 10,
  },
  fab: {
    position: 'absolute',
    margin: 20,
    right: 0,
    bottom: 0,
    backgroundColor: '#4A90E2',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 0,
    margin: 20,
    borderRadius: 15,
  },
  modalContent: {
    padding: 25,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    marginBottom: 25,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    height: 45,
    justifyContent: 'center',
  },
  cancelButton: {
    flex: 1,
    marginLeft: 10,
    borderColor: '#4A90E2',
    borderRadius: 8,
    height: 45,
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: 'white',
  },
  cancelButtonLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#4A90E2',
  },
});