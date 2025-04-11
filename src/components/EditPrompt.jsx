import React from 'react'

const EditPrompt = ({task}) => {
  return (
    <div
      className={`addNote absolute rounded-2xl bg-white text-black p-5 w-[50dvw] h-[60dvh]`}
      style={{ zIndex: 50, top: '0%', left: '50%', transform: 'translate(-50%, 50%)' }}
    >
      <form className="z-50">
        <div className="flex items-center gap-x-3">
          <label htmlFor="title" className="text-lg">
            Title:{' '}
          </label>
          <input
            type="text"
            name="title"
            value={task.title}
            className="border-2 border-black rounded-md px-2 py-1 w-full"
            onChange={(e) => changeHandler(e)}
          />
        </div>
        <div className="flex items-center gap-x-3 my-3">
          <label htmlFor="type">Select Type:</label>
          <select
            name="type"
            id="type"
            className="px-4 py-2 border-2 border-black rounded-md"
            value={task.type}
            onChange={(e) => changeHandler(e)}
          >
            <option value="Personal">Personal</option>
            <option value="Business">Business</option>
            <option value="Others">Others</option>
          </select>
        </div>
        <div className="flex flex-col gap-y-3">
          <label htmlFor="note">Note:</label>
          <textarea
            name="note"
            id="note"
            className="p-3 border-2 border-black rounded-lg h-[30dvh]"
            value={task.note}
            onChange={(e) => changeHandler(e)}
          ></textarea>
        </div>
        <div className="flex w-full justify-end my-2 gap-x-3">
          <button
            className="px-6 py-2 bg-red-500 text-white rounded-lg cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setAddTaskMode(false);
              setNewTask({
                title: '',
                type: 'Personal',
                note: '',
                createdAt: '',
                completed: false,
              });
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg cursor-pointer"
            onClick={(e) => addNote(e)}
          >
            Edit Task
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditPrompt