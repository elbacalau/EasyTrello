import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  searchQuery: string;
  sortColumn: string;
  sortDirection: "asc" | "desc";
  selectedStatus: string[];
  selectedPriority: string[];
  selectedAssignee: string[];
  selectedBoard: string;
}

const initialState: FilterState = {
  searchQuery: "",
  sortColumn: "dueDate",
  sortDirection: "asc",
  selectedStatus: [],
  selectedPriority: [],
  selectedAssignee: [],
  selectedBoard: "_todos_",
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortColumn: (state, action: PayloadAction<string>) => {
      state.sortColumn = action.payload;
    },
    setSortDirection: (state, action: PayloadAction<"asc" | "desc">) => {
      state.sortDirection = action.payload;
    },
    setSelectedStatus: (state, action: PayloadAction<string[]>) => {
      state.selectedStatus = action.payload;
    },
    setSelectedPriority: (state, action: PayloadAction<string[]>) => {
      state.selectedPriority = action.payload;
    },
    setSelectedAssignee: (state, action: PayloadAction<string[]>) => {
      state.selectedAssignee = action.payload;
    },
    setSelectedBoard: (state, action: PayloadAction<string>) => {
      state.selectedBoard = action.payload;
    },
    resetFilters: (state) => {
      return initialState;
    },
  },
});

export const {
  setSearchQuery,
  setSortColumn,
  setSortDirection,
  setSelectedStatus,
  setSelectedPriority,
  setSelectedAssignee,
  setSelectedBoard,
  resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer; 