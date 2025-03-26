import React, { useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import UserList from "./UserList";
import SelectList from "../SelectList";
import Button from "../Button";
import axios from "axios";

const LISTS = ["INITIAL STAGE", "IN PROGRESS"];
const PRIORITY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const AddTask = ({ open, setOpen }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [team, setTeam] = useState([]);
  const [stage, setStage] = useState(LISTS[0]);
  const [priority, setPriority] = useState(PRIORITY[2]);

  const submitHandler = async (data) => {
    try {
      const token = localStorage.getItem("token");

      // Extract valid user IDs
      const teamIds = team.map((user) => user._id).filter(Boolean);

      if (teamIds.length === 0) {
        alert("Please select at least one team member");
        return;
      }

      // Create JSON payload
      const payload = {
        title: data.title,
        stage: stage.toLowerCase(),
        date: data.date,
        priority: priority.toLowerCase(),
        team: teamIds,
      };

      const response = await axios.post(
        "http://localhost:8800/api/task/create",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.status) {
        alert("Task created successfully!");
        setOpen(false);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <ModalWrapper open={ open } setOpen={ setOpen }>
      <form onSubmit={ handleSubmit(submitHandler) }>
        <Dialog.Title className="text-base font-bold leading-6 text-gray-900 mb-4">
          ADD TASK
        </Dialog.Title>

        <div className="mt-2 flex flex-col gap-6">
          {/* Task Title */ }
          <Textbox
            placeholder="Task Title"
            type="text"
            name="title"
            label="Task Title"
            className="w-full rounded"
            register={ register("title", { required: "Title is required" }) }
            error={ errors.title?.message }
          />

          {/* Team Selection */ }
          <UserList setTeam={ setTeam } team={ team } />

          {/* Task Stage & Deadline */ }
          <div className="flex gap-4">
            <SelectList label="Task Stage" lists={ LISTS } selected={ stage } setSelected={ setStage } />

            <Textbox
              placeholder="Date"
              type="date"
              name="date"
              label="Deadline Date"
              className="w-full rounded"
              register={ register("date", { required: "Date is required!" }) }
              error={ errors.date?.message }
            />
          </div>

          {/* Priority Level */ }
          <SelectList label="Priority Level" lists={ PRIORITY } selected={ priority } setSelected={ setPriority } />

          {/* Buttons */ }
          <div className="bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4">
            <Button
              label="Submit"
              type="submit"
              className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
            />
            <Button
              type="button"
              className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
              onClick={ () => setOpen(false) }
              label="Cancel"
            />
          </div>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default AddTask;
