/* =========================
   DATA
========================= */

let tasks =
    JSON.parse(
        localStorage.getItem("novaTasks")
    ) || [];

let currentFilter = "all";


/* =========================
   ELEMENTS
========================= */

const taskInput =
    document.getElementById("taskInput");

const taskList =
    document.getElementById("taskList");

const emptyState =
    document.getElementById("emptyState");

const totalTasks =
    document.getElementById("totalTasks");

const completedTasks =
    document.getElementById("completedTasks");

const remainingTasks =
    document.getElementById("remainingTasks");

const dateElement =
    document.getElementById("date");

const addTaskButton =
    document.getElementById("addTaskButton");

const filterButtons =
    document.querySelectorAll(".filter-btn");


/* =========================
   DISPLAY TASKS
========================= */

function displayTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;


    /* FILTER */

    if (currentFilter === "active") {

        filteredTasks =
            tasks.filter(
                task => !task.completed
            );
    }


    if (currentFilter === "completed") {

        filteredTasks =
            tasks.filter(
                task => task.completed
            );
    }


    /* CREATE TASK */

    filteredTasks.forEach(task => {

        const li =
            document.createElement("li");


        if (task.completed) {

            li.classList.add("completed");
        }


        /* CHECKBOX */

        const checkbox =
            document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.checked =
            task.completed;


        checkbox.addEventListener(
            "change",
            () => {

                completeTask(task.id);

            }
        );


        /* TASK TEXT */

        const span =
            document.createElement("span");


        /*
         * textContent prevents
         * HTML/script injection.
         */

        span.textContent =
            task.text;


        /* DELETE */

        const deleteButton =
            document.createElement("button");

        deleteButton.className =
            "delete-btn";

        deleteButton.textContent =
            "Delete";


        deleteButton.addEventListener(
            "click",
            () => {

                deleteTask(task.id);

            }
        );


        /* BUILD */

        li.appendChild(checkbox);

        li.appendChild(span);

        li.appendChild(deleteButton);

        taskList.appendChild(li);

    });


    updateEmptyState();

    updateStats();

}


/* =========================
   EMPTY STATE
========================= */

function updateEmptyState() {

    const heading =
        emptyState.querySelector("h4");

    const paragraph =
        emptyState.querySelector("p");


    if (tasks.length === 0) {

        emptyState.style.display =
            "block";

        heading.textContent =
            "Nothing here yet";

        paragraph.textContent =
            "Your list is waiting for something worth accomplishing.";

        return;
    }


    if (currentFilter === "active") {

        if (
            tasks.some(
                task => !task.completed
            )
        ) {

            emptyState.style.display =
                "none";

        } else {

            emptyState.style.display =
                "block";

            heading.textContent =
                "All caught up";

            paragraph.textContent =
                "You have completed everything on your list.";
        }

        return;
    }


    if (currentFilter === "completed") {

        if (
            tasks.some(
                task => task.completed
            )
        ) {

            emptyState.style.display =
                "none";

        } else {

            emptyState.style.display =
                "block";

            heading.textContent =
                "Nothing completed";

            paragraph.textContent =
                "Complete a task and it will appear here.";
        }

        return;
    }


    emptyState.style.display =
        "none";
}


/* =========================
   ADD TASK
========================= */

function addTask() {

    const text =
        taskInput.value.trim();


    if (text === "") {

        taskInput.focus();

        return;
    }


    /* PREVENT DUPLICATE TASKS */

    const duplicateTask =
        tasks.some(
            task =>
                task.text.toLowerCase() ===
                text.toLowerCase()
        );


    if (duplicateTask) {

        alert("This task already exists.");

        taskInput.focus();

        return;
    }


    const newTask = {

        id:
            Date.now() +
            Math.random(),

        text: text,

        completed: false
    };


    tasks.push(newTask);

    saveTasks();


    taskInput.value = "";

    taskInput.focus();


    currentFilter = "all";


    filterButtons.forEach(button => {

        button.classList.remove("active");

        if (
            button.dataset.filter === "all"
        ) {

            button.classList.add("active");

        }

    });


    displayTasks();

}


/* =========================
   COMPLETE TASK
========================= */

function completeTask(id) {

    const task =
        tasks.find(
            task => task.id === id
        );


    if (!task) return;


    task.completed =
        !task.completed;


    saveTasks();

    displayTasks();

}


/* =========================
   DELETE TASK
========================= */

function deleteTask(id) {

    tasks =
        tasks.filter(
            task => task.id !== id
        );


    saveTasks();

    displayTasks();

}


/* =========================
   LOCAL STORAGE
========================= */

function saveTasks() {

    localStorage.setItem(
        "novaTasks",
        JSON.stringify(tasks)
    );

}


/* =========================
   STATISTICS
========================= */

function updateStats() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const remaining =
        total - completed;


    totalTasks.textContent =
        total;

    completedTasks.textContent =
        completed;

    remainingTasks.textContent =
        remaining;

}


/* =========================
   FILTERS
========================= */

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            filterButtons.forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });


            button.classList.add(
                "active"
            );


            currentFilter =
                button.dataset.filter;


            displayTasks();

        }
    );

});


/* =========================
   ENTER KEY
========================= */

taskInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            event.preventDefault();

            addTask();

        }

    }
);


/* =========================
   ADD BUTTON
========================= */

addTaskButton.addEventListener(
    "click",
    addTask
);


/* =========================
   DATE
========================= */

function showDate() {

    const today =
        new Date();


    const options = {

        weekday: "long",

        month: "long",

        day: "numeric"

    };


    dateElement.textContent =
        today.toLocaleDateString(
            "en-US",
            options
        );

}


/* =========================
   START
========================= */

showDate();

displayTasks();