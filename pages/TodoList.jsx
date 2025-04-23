import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FAB, Portal, Modal, TextInput, Button } from "react-native-paper";

export default function TodoList() {
  const [visible, setVisible] = React.useState(false);
  const [data, setData] = useState([{ id: 1, name: "Item 1" }]);
  const [currentItem, setCurrentItem] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.name}</Text>
      <Button
        mode="contained-tonal"
        onPress={() => editItem(item)}
        style={styles.optionButton}
      >
        Edit
      </Button>
    </View>
  );
  const addItem = () => {
    setCurrentItem(null);
    setInputValue("");
    setVisible(true);
  };

  const saveItem = () => {
    if (currentItem) {
      // Edit existing item
      setData((prevData) =>
        prevData.map((item) =>
          item.id === currentItem.id ? { ...item, name: inputValue } : item
        )
      );
    } else {
      // Add new item
      const newItem = {
        id: data.length + 1,
        name: inputValue
      };
      setData((prevData) => [...prevData, newItem]);
    }
    setVisible(false);
  };

  const editItem = (item) => {
    setCurrentItem(item);
    setInputValue(item.name);
    setVisible(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
        />
        <FAB style={styles.fab} icon="plus" color="white" onPress={addItem} />
      </View>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          animationType="slide"
          contentContainerStyle={styles.bottomSheetStyle}
          onRequestClose={() => setVisible(false)}
        >
          <TextInput
            style={styles.input}
            placeholder="Enter TODO item"
            value={inputValue}
            onChangeText={setInputValue}
          />
          <View
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          >
            <Button
              mode="outlined"
              onPress={saveItem}
              style={styles.optionButton}
            >
              Save
            </Button>

            <Button
              mode="outlined"
              onPress={() => setVisible(false)}
              style={styles.optionButton}
            >
              Cancel
            </Button>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 12,
    backgroundColor: "#ddd",
    borderRadius: 5
  },
  fab: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#6200ee"
  },
  optionButton: {
    marginVertical: 5
  },
  bottomSheetStyle: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0
  },
  input: {
    width: "80%",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
    marginBottom: 10
  }
});
