import { useState } from 'react';
import { API_BASE_URL, generateGuid } from '../config/apiConfig';
import { WORKFLOW_CODES, CODE_RESULT } from '../config/workflowConfig';

/**
 * Custom hook for managing task creation and workflow selection
 */
export const useTaskManager = (setTasks) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingTask, setPendingTask] = useState(null);
    const [selectedSource, setSelectedSource] = useState(null);
    const [isWorkflowSelectorOpen, setIsWorkflowSelectorOpen] = useState(false);

    const openWorkflowModal = (from, to) => {
        const fromStation = from.stationName;
        const toStation = to.stationName;
        const workflowName = `${fromStation} >>> ${toStation}`;
        const workflowCode = WORKFLOW_CODES[workflowName] || "UNKNOWN";

        setPendingTask({ from, to, workflowName, workflowCode });
        setIsModalOpen(true);
    };

    const handleWorkflowSelect = (from, to) => {
        setIsWorkflowSelectorOpen(false);
        openWorkflowModal(from, to);
    };

    const handleCancelWorkflowSelector = () => {
        setIsWorkflowSelectorOpen(false);
        setSelectedSource(null);
    };

    const handleCancelSelection = () => {
        setSelectedSource(null);
    };

    const confirmTask = async () => {
        if (!pendingTask) return;

        if (pendingTask.workflowCode === "UNKNOWN") {
            alert(`No workflow mapping for ${pendingTask.workflowName}`);
            return;
        }

        const payload = {
            header: {
                requestId: generateGuid(),
                channelId: "EA-interface",
                clientCode: "MEKTEC",
                language: "en_us"
            },
            body: {
                msgType: "WorkflowStartMsg",
                workflowCode: pendingTask.workflowCode,
                taskCode: "",
                locationCode: pendingTask?.from.raw.locationCode
            }
        };

        try {
            const res = await fetch(API_BASE_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                throw new Error(`Workflow API Error: ${res.status}`);
            }

            const result = await res.json();
            const resultCode = result?.header?.code ?? "-1";

            const resultMeta = CODE_RESULT[resultCode] || {
                level: "error",
                title: "Unknown Error",
                message: result?.header?.msg || "ไม่ทราบสาเหตุ",
                action: "SUPPORT_ALERT"
            };

            if (resultCode !== "0") {
                alert(`❗ ${resultMeta.title}\n${resultMeta.message}`);
                return;
            }

            alert(`✅ เริ่มงานสำเร็จ \nTask Code: ${result?.body?.taskCode || 'New Task'}`);

            const newTask = {
                id: result?.body?.taskCode || `T${Date.now()}`,
                fromId: pendingTask.from.id,
                toId: pendingTask.to.id,
                status: "PENDING",
                floorId: pendingTask.to.floorId,
                workflowCode: pendingTask.workflowCode
            };

            setTasks(prev => [...prev, newTask]);
            setIsModalOpen(false);
            setPendingTask(null);
            setSelectedSource(null);

        } catch (err) {
            console.error("❌ Failed to start workflow:", err);
            alert("Failed to start task");
        }
    };

    const cancelTaskCreation = () => {
        setIsModalOpen(false);
        setPendingTask(null);
        setSelectedSource(null);
    };

    return {
        isModalOpen,
        pendingTask,
        selectedSource,
        isWorkflowSelectorOpen,
        setSelectedSource,
        setIsWorkflowSelectorOpen,
        openWorkflowModal,
        handleWorkflowSelect,
        handleCancelWorkflowSelector,
        handleCancelSelection,
        confirmTask,
        cancelTaskCreation
    };
};
