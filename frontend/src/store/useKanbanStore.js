import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addDays } from 'date-fns';

// Initial dummy data
const initialData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Design landing page mockup', priority: 'high', dueDate: addDays(new Date(), 2), assignees: ['https://i.pravatar.cc/150?u=sarah'] },
    'task-2': { id: 'task-2', content: 'Set up Prisma schema', priority: 'medium', dueDate: addDays(new Date(), 5), assignees: ['https://i.pravatar.cc/150?u=marcus'] },
    'task-3': { id: 'task-3', content: 'Implement Socket.io for chat', priority: 'low', dueDate: addDays(new Date(), 10), assignees: ['https://i.pravatar.cc/150?u=david'] },
    'task-4': { id: 'task-4', content: 'Write end-to-end tests', priority: 'high', dueDate: new Date(), assignees: ['https://i.pravatar.cc/150?u=elena', 'https://i.pravatar.cc/150?u=sarah'] },
    'task-5': { id: 'task-5', content: 'Deploy to staging', priority: 'medium', dueDate: addDays(new Date(), 1), assignees: [] },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'Todo',
      taskIds: ['task-1', 'task-2'],
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: ['task-3'],
    },
    'column-3': {
      id: 'column-3',
      title: 'Review',
      taskIds: ['task-4'],
    },
    'column-4': {
      id: 'column-4',
      title: 'Completed',
      taskIds: ['task-5'],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3', 'column-4'],
};

const useKanbanStore = create(
  persist(
    (set) => ({
      ...initialData,
      setColumnTitle: (columnId, newTitle) =>
        set((state) => ({
          columns: {
            ...state.columns,
            [columnId]: {
              ...state.columns[columnId],
              title: newTitle,
            },
          },
        })),
      onDragEnd: (result) =>
        set((state) => {
          const { destination, source, draggableId, type } = result;

          if (!destination) {
            return state;
          }

          if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
          ) {
            return state;
          }

          // Handle column drag
          if (type === 'column') {
            const newColumnOrder = Array.from(state.columnOrder);
            newColumnOrder.splice(source.index, 1);
            newColumnOrder.splice(destination.index, 0, draggableId);

            return {
              ...state,
              columnOrder: newColumnOrder,
            };
          }

          // Handle task drag
          const startColumn = state.columns[source.droppableId];
          const finishColumn = state.columns[destination.droppableId];

          // Moving within the same column
          if (startColumn === finishColumn) {
            const newTaskIds = Array.from(startColumn.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);

            const newColumn = {
              ...startColumn,
              taskIds: newTaskIds,
            };

            return {
              ...state,
              columns: {
                ...state.columns,
                [newColumn.id]: newColumn,
              },
            };
          }

          // Moving from one column to another
          const startTaskIds = Array.from(startColumn.taskIds);
          startTaskIds.splice(source.index, 1);
          const newStartColumn = {
            ...startColumn,
            taskIds: startTaskIds,
          };

          const finishTaskIds = Array.from(finishColumn.taskIds);
          finishTaskIds.splice(destination.index, 0, draggableId);
          const newFinishColumn = {
            ...finishColumn,
            taskIds: finishTaskIds,
          };

          return {
            ...state,
            columns: {
              ...state.columns,
              [newStartColumn.id]: newStartColumn,
              [newFinishColumn.id]: newFinishColumn,
            },
          };
        }),
    }),
    {
      name: 'kanban-storage',
    }
  )
);

export default useKanbanStore;
