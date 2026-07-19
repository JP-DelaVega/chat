import { createSlice } from "@reduxjs/toolkit";

// Map your sidebar labels to your actual backend MongoDB database names
const DB_MAPPING = {
  "ABOUT ME": "AboutMe_chunks",
  "LEAGUE LORE": "LeagueLore_chunks",
  STRAVA: "MyStravaActivities_chunks",
  "MATCH HISTORY": "lol_stats",
};

const initialState = {
  // Default to "AboutMe_chunks" (matches the active: true item)
  currentDb: "AboutMe_chunks",
};

export const dbSlice = createSlice({
  name: "database",
  initialState,
  reducers: {
    setDbNameByLabel: (state, action) => {
      const label = action.payload;
      // Get the corresponding DB name, fallback to a default if not found
      state.currentDb = DB_MAPPING[label] || "AboutMe_chunks";
    },
    // Backup: allow setting a database name directly
    setDirectDbName: (state, action) => {
      state.currentDb = action.payload;
    },
  },
});

export const { setDbNameByLabel, setDirectDbName } = dbSlice.actions;
export default dbSlice.reducer;
