<template>
  <!-- <div
    class="bg-red-500 h-64 font-serif flex flex-col justify-center items-center"
  >
    <div v-for="item in todos" :key="item.id" class="mb-2">
      <div :class="{ 'line-through': item.complete }">{{ item.title }}</div>
      <div>
        <input type="checkbox" v-model="item.complete" @change="updateTodo(item)" />
      </div>
    </div>
    <input type="text" v-model="text" placeholder="Add a new todo" />
    <button @click="submit">Click add</button>
  </div> -->
  <div class="h-screen w-full bg-purple-400 grid justify-items-center p-28">
    <div class="bg-white w-1/2 rounded-lg px-10">
      <div class="grid mt-5">
        <div class="flex justify-between w-full">
          <input
            v-model="title"
            class="border-2 py-2 px-3 w-full rounded-lg border-blue-300"
            placeholder="Enter todo title"
          />
          <button
            @click="addNewTodo"
            class="bg-blue-500 flex justify-center ml-5 text-white rounded-md text-3xl w-32 hover:bg-blue-700 duration-300"
          >
            <div>+</div>
          </button>
        </div>
      </div>
      <div v-if="!title" class="text-red-500">It can't be empty</div>
      <div class=" w-full mt-10">
        <input
          type="text"
          v-model="search"
          placeholder="Search todos"
          class="border-2 py-2 px-3 w-full rounded-lg border-blue-300 mb-5"
        />
      </div>
      <div class="w-full h-96 overflow-y-auto py-5 mt-10 bg-gray-300 px-5 rounded">
        <div
          v-for="item in filteredTodos"
          :key="item.id"
          class="mt-4 grid h-16"
        >
          <div
            class="flex items-center justify-between px-5 rounded-lg bg-white shadow-md border"
          >
            <div
              :class="{
                'line-through text-red-500 duration-300': item.complete,
              }"
            >
              <template v-if="editId === item.id">
                <input
                  v-model="editTitle"
                  class="border-2 py-2 px-3 rounded-lg border-blue-300"
                  placeholder="Edit todo title"
                />
                <button
                  @click="updateTodo(item, editTitle)"
                  class="bg-green-500 px-5 py-2 text-white rounded-sm ml-2"
                >
                  Save
                </button>
              </template>
              <template v-else>
                {{ item.title }}
              </template>
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <label class="flex items-center cursor-pointer relative">
                  <input
                    v-model="item.complete"
                    @change="complete(item)"
                    type="checkbox"
                    class="peer h-6 w-6 cursor-pointer transition-all appearance-none rounded-full bg-slate-100 shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800"
                    id="check-custom-style"
                  />
                  <span
                    class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-3.5 w-3.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      stroke="currentColor"
                      stroke-width="1"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </span>
                </label>
                <button
                  class="px-5 py-2 bg-red-400 text-white rounded-sm"
                  @click="deleteTodo(item)"
                >
                  Delete
                </button>
                <button
                  class="bg-green-500 px-5 py-2 text-white rounded-sm"
                  @click="editTodo(item)"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import db from "./src/firebase/config";

interface Todo {
  id?: string;
  title: string;
  complete: boolean;
}

const title = ref("");
const todos = ref<Todo[]>([]);
const search = ref("");
const addNewTodo = async () => {
  const todo: Todo = {
    title: title.value,
    complete: false,
  };

  try {
    if (title.value === "") {
      return ;
    }
    await addDoc(collection(db, "todo"), todo);
  } catch (error) {
    console.error("Error adding todo:", error);
  }
};

const getData = () => {
  onSnapshot(collection(db, "todo"), (querySnapshot) => {
    const listTodo: Todo[] = [];
    querySnapshot.forEach((doc) => {
      const todo = {
        id: doc.id,
        title: doc.data().title,
        complete: doc.data().complete,
      };
      listTodo.push(todo);
    });
    todos.value = listTodo;
  });
};

const complete = async (item: Todo) => {
  if (item.id) {
    const todoRef = doc(db, "todo", item.id);
    try {
      await updateDoc(todoRef, { complete: item.complete });
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  }
};

const deleteTodo = async (item: Todo) => {
  if (item.id) {
    const todoRef = doc(db, "todo", item.id);
    try {
      await deleteDoc(todoRef);
      console.log("Todo deleted successfully");
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  } else {
    console.warn("Todo item does not have an id");
  }
};

const editId = ref<string | null>(null);
const editTitle = ref<string>("");

const editTodo = (item: Todo) => {
  editId.value = item.id || null;
  editTitle.value = item.title;
};

const updateTodo = async (item: Todo, newTitle: string) => {
  if (item.id) {
    if(newTitle === ""){
      return;
    }
    const todoRef = doc(db, "todo", item.id);
    try {
      await updateDoc(todoRef, { title: newTitle });
      editId.value = null;
      editTitle.value = "";
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  }
};

const filteredTodos = computed(() => {
  return todos.value.filter((todo) =>
    todo.title.toLowerCase().includes(search.value.toLowerCase())
  );
});

onMounted(() => {
  getData();
});
</script>

<style scoped>
.line-through {
  text-decoration: line-through;
}
</style>
