import Notice from "../models/notification.js";
import Task from "../models/task.js";
import User from "../models/user.js";

export const createTask = async(req, res) => {
    try {
        const { userId } = req.user;
        const { title, team, stage, date, priority } = req.body;

        // Validate required fields
        if (!title || !team || !stage || !date || !priority) {
            return res.status(400).json({
                status: false,
                message: "Missing required fields",
            });
        }

        // Fetch and validate users
        const assignedUsers = await User.find({
            _id: { $in: team },
        }).select("_id name email");

        if (assignedUsers.length === 0) {
            return res.status(400).json({
                status: false,
                message: "No valid users found. Please select valid team members.",
            });
        }

        // Ensure all requested team members exist
        if (assignedUsers.length !== team.length) {
            return res.status(400).json({
                status: false,
                message: "Some selected users are invalid.",
            });
        }

        // Prepare task activity message
        let text = `New task has been assigned to ${assignedUsers[0].name}`;
        if (assignedUsers.length > 1) {
            text += ` and ${assignedUsers.length - 1} others.`;
        }
        text += ` Priority: ${priority}. Due Date: ${new Date(date).toDateString()}.`;

        const activity = {
            type: "assigned",
            activity: text,
            by: userId,
        };

        // Create the task
        const task = await Task.create({
            title,
            team: assignedUsers.map((user) => user._id), // Store only user IDs
            stage: stage.toLowerCase(),
            date,
            priority: priority.toLowerCase(),
            activities: [activity],
        });

        // Create notice for assigned team members
        await Notice.create({
            team: assignedUsers.map((user) => user._id),
            text,
            task: task._id,
        });

        res.status(200).json({
            status: true,
            task,
            message: "Task created successfully.",
        });
    } catch (error) {
        console.error("Error in createTask:", error);
        res.status(500).json({
            status: false,
            message: "Internal server error. Failed to create task.",
        });
    }
};

export const getAllTasks = async(req, res) => {
    try {
        // Fetch all tasks and populate the team field with user details
        const tasks = await Task.find()
            .populate("team", "_id name email") // Populate team members with ID, name, and email
            .sort({ createdAt: -1 }); // Sort by most recent

        res.status(200).json({
            status: true,
            tasks,
            message: "All tasks fetched successfully.",
        });
    } catch (error) {
        console.error("Error in getAllTasks:", error);
        res.status(500).json({
            status: false,
            message: "Internal server error. Failed to fetch tasks.",
        });
    }
};


export const duplicateTask = async(req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findById(id);

        const newTask = await Task.create({
            ...task,
            title: task.title + " - Duplicate",
        });

        newTask.team = task.team;
        newTask.subTasks = task.subTasks;
        newTask.assets = task.assets;
        newTask.priority = task.priority;
        newTask.stage = task.stage;

        await newTask.save();

        //alert users of the task
        let text = "New task has been assigned to you";
        if (task.team.length > 1) {
            text = text + ` and ${task.team.length - 1} others.`;
        }

        text =
            text +
            ` The task priority is set a ${
        task.priority
      } priority, so check and act accordingly. The task date is ${task.date.toDateString()}. Thank you!!!`;

        await Notice.create({
            team: task.team,
            text,
            task: newTask._id,
        });

        res
            .status(200)
            .json({ status: true, message: "Task duplicated successfully." });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const postTaskActivity = async(req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.user;
        const { type, activity } = req.body;

        const task = await Task.findById(id);

        const data = {
            type,
            activity,
            by: userId,
        };

        task.activities.push(data);

        await task.save();

        res
            .status(200)
            .json({ status: true, message: "Activity posted successfully." });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const dashboardStatistics = async(req, res) => {
    try {
        const { userId, isAdmin } = req.user;

        const allTasks = isAdmin ?
            await Task.find({
                isTrashed: false,
            })
            .populate({
                path: "team",
                select: "name role title email",
            })
            .sort({ _id: -1 }) :
            await Task.find({
                isTrashed: false,
                team: { $all: [userId] },
            })
            .populate({
                path: "team",
                select: "name role title email",
            })
            .sort({ _id: -1 });

        const users = await User.find({ isActive: true })
            .select("name title role isAdmin createdAt")
            .limit(10)
            .sort({ _id: -1 });

        //   group task by stage and calculate counts
        const groupTaskks = allTasks.reduce((result, task) => {
            const stage = task.stage;

            if (!result[stage]) {
                result[stage] = 1;
            } else {
                result[stage] += 1;
            }

            return result;
        }, {});

        // Group tasks by priority
        const groupData = Object.entries(
            allTasks.reduce((result, task) => {
                const { priority } = task;

                result[priority] = (result[priority] || 0) + 1;
                return result;
            }, {})
        ).map(([name, total]) => ({ name, total }));

        // calculate total tasks
        const totalTasks = allTasks.length;
        const last10Task = allTasks.slice(0, 10);

        const summary = {
            totalTasks,
            last10Task,
            users: isAdmin ? users : [],
            tasks: groupTaskks,
            graphData: groupData,
        };

        res.status(200).json({
            status: true,
            message: "Successfully",
            ...summary,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const getTasks = async(req, res) => {
    try {
        const { stage, isTrashed } = req.query;

        let query = { isTrashed: isTrashed ? true : false };

        if (stage) {
            query.stage = stage;
        }

        let queryResult = Task.find(query)
            .populate({
                path: "team",
                select: "name title email",
            })
            .sort({ _id: -1 });

        const tasks = await queryResult;

        res.status(200).json({
            status: true,
            tasks,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const getTask = async(req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findById(id)
            .populate({
                path: "team",
                select: "name title role email",
            })
            .populate({
                path: "activities.by",
                select: "name",
            });

        res.status(200).json({
            status: true,
            task,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const createSubTask = async(req, res) => {
    try {
        const { title, tag, date } = req.body;

        const { id } = req.params;

        const newSubTask = {
            title,
            date,
            tag,
        };

        const task = await Task.findById(id);

        task.subTasks.push(newSubTask);

        await task.save();

        res
            .status(200)
            .json({ status: true, message: "SubTask added successfully." });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const updateTask = async(req, res) => {
    try {
        const { id } = req.params;
        const { title, date, team, stage, priority, assets } = req.body;

        const task = await Task.findById(id);

        task.title = title;
        task.date = date;
        task.priority = priority.toLowerCase();
        task.assets = assets;
        task.stage = stage.toLowerCase();
        task.team = team;

        await task.save();

        res
            .status(200)
            .json({ status: true, message: "Task duplicated successfully." });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const trashTask = async(req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findById(id);

        task.isTrashed = true;

        await task.save();

        res.status(200).json({
            status: true,
            message: `Task trashed successfully.`,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const deleteRestoreTask = async(req, res) => {
    try {
        const { id } = req.params;
        const { actionType } = req.query;

        if (actionType === "delete") {
            await Task.findByIdAndDelete(id);
        } else if (actionType === "deleteAll") {
            await Task.deleteMany({ isTrashed: true });
        } else if (actionType === "restore") {
            const resp = await Task.findById(id);

            resp.isTrashed = false;
            resp.save();
        } else if (actionType === "restoreAll") {
            await Task.updateMany({ isTrashed: true }, { $set: { isTrashed: false } });
        }

        res.status(200).json({
            status: true,
            message: `Operation performed successfully.`,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
    }
};