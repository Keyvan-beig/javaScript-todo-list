const inputValue = document.getElementById("taskName");
const olList = document.querySelector(".task-list > ol");
const filterItem = document.querySelectorAll(".filter_item");
const deleteAllButton = document.getElementById("deleteAll");

const addToStorage = (item) => {

    const _json = JSON.stringify(item);
    localStorage.setItem("taskList", _json)

}

let taskList = localStorage.getItem("taskList");

taskList = taskList ? JSON.parse(taskList) : [];

const listAdd = (arrayName, taskName) => {

    const task = { name: taskName, type: "Pending" }

    arrayName.push(task)
}

function FormatTask(listName, taskName, isCheck, id) {

    const inputElement = document.createElement("input");
    inputElement.type = "checkbox";
    inputElement.checked = isCheck === "Completed" ? "checked" : ""

    const pElement = document.createElement("p");
    pElement.textContent = taskName.trim()
    pElement.style.textDecoration = isCheck === "Completed" ? "line-through" : ""

    const div_1 = document.createElement("div");

    div_1.appendChild(inputElement);
    div_1.appendChild(pElement);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    const editeButton = document.createElement("button");
    editeButton.textContent = "Edite";

    const divButtons = document.createElement("div");
    divButtons.classList.add("disp-none");

    divButtons.appendChild(deleteButton);
    divButtons.appendChild(editeButton);

    const pTag = document.createElement("p");
    pTag.textContent = "...";

    const div_2 = document.createElement("div");
    div_2.classList.add("dialog-box");

    div_2.appendChild(pTag);
    div_2.appendChild(divButtons);

    const liTag = document.createElement("li");
    liTag.id = id

    liTag.appendChild(div_1);
    liTag.appendChild(div_2);

    olList.appendChild(liTag);

    deleteButton.addEventListener("click", () => {

        listName.splice(parseInt(liTag.id), 1);

        olList.removeChild(liTag);

        olList.innerHTML = ""

        showTasksList(listName)

        addToStorage(listName)
    });

    editeButton.addEventListener("click", () => {

        inputValue.value = pElement.innerText;

        inputValue.removeEventListener("keyup", addTask);

        inputValue.addEventListener("keyup", editeTask);

        inputValue.focus();

        function editeTask(e) {

            if (e.key === "Enter" && inputValue.value) {

                pElement.innerText = inputValue.value

                inputValue.removeEventListener("keyup", editeTask);

                inputValue.addEventListener("keyup", addTask);

                listName[liTag.id].name = inputValue.value.trim()

                inputValue.value = "";

                addToStorage(listName)

            }
        }
    })

    inputElement.addEventListener("change", () => {

        if (inputElement.checked) {

            listName[liTag.id].type = "Completed";
            pElement.style.textDecoration = "line-through";

        } else {

            listName[liTag.id].type = "Pending";
            pElement.style.textDecoration = "";

        }

        addToStorage(listName)
    })

    pTag.addEventListener("click", () => {

        const dialogDivs = olList.querySelectorAll(".dialog-box > div");
        const checkIsOpen = divButtons.classList.contains("disp-none");

        dialogDivs.forEach((item) => {
            item.classList.add("disp-none")
        })

        if (checkIsOpen) {
            divButtons.classList.remove("disp-none")
        } else {
            divButtons.classList.add("disp-none")
        }
    })
    
}

function showTasksList(listName) {

    let itemType;

    olList.innerHTML = taskList.length === 0 ? "<p>no tasks</p>" : ""
    
    listName.forEach((_item, id) => {

        filterItem.forEach((item) => {

            if (item.classList.contains("select")) {

                itemType = item.textContent;
            }
        })

        if (itemType === "All") {

            FormatTask(taskList, _item.name, _item.type, id)
        }
        else if (_item.type === itemType) {

            FormatTask(taskList, _item.name, _item.type, id)
        }

    })

}

showTasksList(taskList)

inputValue.addEventListener("keyup", addTask);

function addTask(e) {
    if (e.key == "Enter" && inputValue.value) {

        listAdd(taskList, inputValue.value.trim());

        olList.innerHTML = ""

        showTasksList(taskList)

        inputValue.value = ""

        addToStorage(taskList);

    }
}

filterItem.forEach((_item) => {

    _item.addEventListener("click", () => {

        filterItem.forEach((item) => {

            item.classList.remove("select");

        })

        _item.classList.add("select");

        olList.innerHTML = ""

        showTasksList(taskList)

    })

})

deleteAllButton.addEventListener("click", () => {

    olList.innerHTML = ''

    taskList.splice(0, taskList.length)

    olList.innerHTML = "<p>no tasks</p>"

    addToStorage(taskList)

});