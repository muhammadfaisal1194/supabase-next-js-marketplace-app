/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { supabase } from "@/utils/supabase";
import { useState, useEffect } from "react";
import styles from "@/styles/Create.module.css";
import { useRouter } from "next/navigation";

const Create = () => {
  const initialState = {
    title: "",
    loads: "",
    reps: "",
  };

  const router = useRouter();
  const [workoutData, setWorkoutData] = useState(initialState);
  const [user, setUser] = useState<any>(null);

  const { title, loads, reps } = workoutData;

  useEffect(() => {
    // Fetch the current session and set the user
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user);
    };

    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkoutData({ ...workoutData, [e.target.name]: e.target.value });
  };

  const createWorkout = async () => {
    if (!user) {
      alert("No user logged in!");
      return;
    }

    const { data, error } = await supabase
      .from("workouts")
      .insert({
        title,
        loads,
        reps,
        user_id: user.id,
      })
      .single();

    if (error) {
      alert(error.message);
    } else {
      alert("Workout created successfully");
      setWorkoutData(initialState);
      router.push("/");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <p className={styles.title}>Create a New Workout</p>
        <label className={styles.label}>Title:</label>
        <input
          type="text"
          name="title"
          value={title}
          onChange={handleChange}
          className={styles.input}
          placeholder="Enter a title"
        />
        <label className={styles.label}>Load (kg):</label>
        <input
          type="text"
          name="loads"
          value={loads}
          onChange={handleChange}
          className={styles.input}
          placeholder="Enter weight load"
        />
        <label className={styles.label}>Reps:</label>
        <input
          type="text"
          name="reps"
          value={reps}
          onChange={handleChange}
          className={styles.input}
          placeholder="Enter number of reps"
        />

        <button className={styles.button} onClick={createWorkout}>
          Create Workout
        </button>
      </div>
    </div>
  );
};

export default Create;
