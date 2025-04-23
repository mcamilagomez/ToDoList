import TodoList from "./pages/TodoList";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <TodoList />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
