import React from "react";
import {
  MdAdminPanelSettings,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { Pencil } from "lucide-react";
import { FaNewspaper, FaUsers } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import moment from "moment";
import { summary } from "../assets/data";
import clsx from "clsx";
import { Chart } from "../components/Chart";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, getInitials } from "../utils";
import UserInfo from "../components/UserInfo";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';

const TaskTable = ({ tasks }) => {
  const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
  };

  
  const TableHeader = () => (
    <thead className="border-b border-gray-300">
      <tr className="text-gray-700 text-left">
        <th className="py-2">Task Title</th>
        <th className="py-2">Priority</th>
        <th className="py-2">Team</th>
        <th className="py-2 hidden md:block">Created At</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="py-2">
        <div className="flex items-center gap-2">
          <div
            className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage])}
          />

          <p className="text-base text-gray-700">{task.title}</p>
        </div>
      </td>

      <td className="py-2">
        <div className="flex gap-1 items-center">
          <span className={clsx("text-lg", PRIOTITYSTYELS[task.priority])}>
            {ICONS[task.priority]}
          </span>
          <span className="capitalize text-gray-700">{task.priority}</span>
        </div>
      </td>

      <td className="py-2">
        <div className="flex">
          {task.team.map((m, index) => (
            <div
              key={index}
              className={clsx(
                "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                BGS[index % BGS.length]
              )}
            >
              <UserInfo user={m} />
            </div>
          ))}
        </div>
      </td>
      <td className="py-2 hidden md:block">
        <span className="text-base text-gray-600">
          {moment(task?.date).fromNow()}
        </span>
      </td>
    </tr>
  );
  return (
    <>
      <div className="w-full bg-white px-4 pt-4 pb-4 shadow-md rounded">
        <h4 className="text-xl text-gray-700 font-semibold mb-4">Recent Tasks</h4>
        <table className="w-full">
          <TableHeader />
          <tbody>
            {tasks?.map((task, id) => (
              <TableRow key={id} task={task} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

const Dashboard = () => {
  const totals = summary.tasks;

  // Extract priority counts from the tasks
  const calculatePriorityCounts = () => {
    const priorityCounts = { high: 0, medium: 0, low: 0 };
    
    // Check if summary.last10Task exists and is an array
    if (Array.isArray(summary.last10Task)) {
      summary.last10Task.forEach(task => {
        if (task.priority && priorityCounts.hasOwnProperty(task.priority)) {
          priorityCounts[task.priority]++;
        }
      });
    }
    
    return priorityCounts;
  };

  const priorityCounts = calculatePriorityCounts();

  const stats = [
    {
      _id: "1",
      label: "TOTAL TASK",
      total: summary?.totalTasks || 0,
      icon: <FaNewspaper />,
      bg: "bg-blue-600",
    },
    {
      _id: "2",
      label: "COMPLETED TASK",
      total: totals["completed"] || 0,
      icon: <MdAdminPanelSettings />,
      bg: "bg-green-600",
    },
    {
      _id: "3",
      label: "TASK IN PROGRESS",
      total: totals["in progress"] || 0,
      icon: <Pencil />,
      bg: "bg-yellow-500",
    },
    {
      _id: "4",
      label: "TODOS",
      total: totals["todo"] || 0,
      icon: <FaArrowsToDot />,
      bg: "bg-red-500",
    },
  ];

  // Prepare data for additional charts
  const priorityData = [
    { name: 'High', value: priorityCounts.high || summary.priorityCount?.high || 15 },
    { name: 'Medium', value: priorityCounts.medium || summary.priorityCount?.medium || 25 },
    { name: 'Low', value: priorityCounts.low || summary.priorityCount?.low || 10 },
  ];

  // Prepare stage-based data for tasks
  const stageData = [
    { name: 'Todo', value: totals["todo"] || 12 },
    { name: 'In Progress', value: totals["in progress"] || 8 },
    { name: 'Completed', value: totals["completed"] || 20 },
  ];

  const teamPerformanceData = [
    { name: 'Team A', completed: 20, inProgress: 10, todo: 5 },
    { name: 'Team B', completed: 15, inProgress: 8, todo: 12 },
    { name: 'Team C', completed: 25, inProgress: 5, todo: 3 },
  ];

  const weeklyProgressData = [
    { name: 'Week 1', tasks: 18 },
    { name: 'Week 2', tasks: 24 },
    { name: 'Week 3', tasks: 30 },
    { name: 'Week 4', tasks: 26 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const PRIORITY_COLORS = {
    high: '#FF4842',    // Red for high priority
    medium: '#FFC107',  // Yellow for medium priority
    low: '#00AB55'      // Green for low priority
  };

  const Card = ({ label, count, bg, icon }) => {
    return (
      <div className="w-full h-32 bg-white p-5 shadow-md rounded-md flex items-center justify-between">
        <div className="h-full flex flex-1 flex-col justify-between">
          <p className="text-base text-gray-600">{label}</p>
          <span className="text-2xl font-semibold text-gray-800">{count}</span>
          <span className="text-sm text-gray-500">110 last month</span>
        </div>

        <div
          className={clsx(
            "w-10 h-10 rounded-full flex items-center justify-center text-white",
            bg
          )}
        >
          {icon}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full py-4 bg-[#f3f4f6]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {stats.map(({ icon, bg, label, total }, index) => (
          <Card key={index} icon={icon} bg={bg} label={label} count={total} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-8">
        {/* First Chart: Priority Distribution */}
        <div className="w-full bg-white p-6 rounded shadow-sm">
          <h4 className="text-xl text-gray-700 font-semibold mb-4">
            Task Priority Distribution
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
              >
                {priorityData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.name.toLowerCase() === 'high' 
                      ? PRIORITY_COLORS.high 
                      : entry.name.toLowerCase() === 'medium'
                        ? PRIORITY_COLORS.medium
                        : PRIORITY_COLORS.low} 
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} tasks`, `${name} Priority`]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Second Chart: Task Status Distribution */}
        <div className="w-full bg-white p-6 rounded shadow-sm">
          <h4 className="text-xl text-gray-700 font-semibold mb-4">
            Task Status Distribution
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stageData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
              >
                <Cell fill="#FF8042" /> {/* Todo */}
                <Cell fill="#FFBB28" /> {/* In Progress */}
                <Cell fill="#00C49F" /> {/* Completed */}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} tasks`, name]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-8">
        {/* Third Chart: Team Performance */}
        <div className="w-full bg-white p-6 rounded shadow-sm">
          <h4 className="text-xl text-gray-700 font-semibold mb-4">
            Team Performance
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={teamPerformanceData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#4CAF50" />
              <Bar dataKey="inProgress" fill="#2196F3" />
              <Bar dataKey="todo" fill="#F44336" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Fourth Chart: Weekly Progress */}
        <div className="w-full bg-white p-6 rounded shadow-sm">
          <h4 className="text-xl text-gray-700 font-semibold mb-4">
            Weekly Progress
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={weeklyProgressData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="tasks" stroke="#3F51B5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="w-full py-8">
        {/* Recent Tasks Table */}
        <TaskTable tasks={summary.last10Task} />
      </div>
    </div>
  );
};

export default Dashboard;