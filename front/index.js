import styles from "./styles/style.scss";
import phoneBook from "./images/background.jpeg";
import axios from "axios";
const baseUrl = "/";


async function openContactInfo(event){
  const id = event.target.dataset.id

  const response = await axios.get(`${baseUrl}api/persons/${id}`)
  alert(JSON.stringify(response.data));
}
async function renderPhoneBook(persons) {
  const phoneBook = document.getElementById("phoneBook");
  removeChildren(phoneBook);
  try {
    for (let person of persons) {
// rightdiv build
      const callIcon = createElement("i", [], ["fas fa-phone"]);
      // <i class="fas fa-info-circle" id="info" data-container="body" data-toggle="popover" data-placement="right">
      const deleteIcon = createElement("i", [], ["fas fa-minus-circle"]);
      const callBtn = createElement("button", [callIcon], ["button-call"],{"data-toggle":"modal", "data-target":"#callPersonModal","data-number":`${person.number}`, "data-name":`${person.name}`},
      {"click":onCallClick});
      const info =createElement("i",[],["fas","fa-info-circle"],{"data-container":"body", "data-toggle":"popover" , "data-id":`${person._id}`},{"click":openContactInfo})
      const deleteBtn = createElement("button",[deleteIcon],["button-delete"],{"data-id":person._id},{"click":deletePhone});
      const rightDiv = createElement("div", [callBtn, deleteBtn, info],[]);
    //   left div build
      const span = createElement("span", [person.number],[]);
      const a = createElement("a", [person.name, span],);
      const leftDiv = createElement("div", [a]);
      const li = createElement("li", [leftDiv,rightDiv], [], {id: `index-${person.name[0].toUpperCase()}`}, {});
      phoneBook.append(li);
    }
  } catch (error) {}

  document.querySelector('.info-div').textContent = await getPhoneBookInfo();
}

function sortArray(array){
  array.sort(function(a, b){
    if(a.name.toLowerCase()< b.name.toLowerCase()) { return -1; }
    if(a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
    return 0;
  })
}

async function getDataBase() {
  const response = await axios.get(`${baseUrl}api/persons`);
  const persons = response.data;
  sortArray(persons)
  // sort by alphabetic order
  renderPhoneBook(persons);
  return persons;
}
getDataBase();

async function deletePhone(event) {
    event.target.closest("LI").remove();
    const id = event.target.closest('BUTTON').dataset.id;
    await axios.delete(`${baseUrl}api/persons/${id}`);
    document.querySelector('.info-div').textContent = await getPhoneBookInfo();
}
  
function createElement(
  tagName,
  children = [],
  classes = [],
  attributes = {},
  eventListeners = {}
) {
  const element = document.createElement(tagName);
  for (const child of children) element.append(child);
  element.classList = classes.join(" ");
  for (const attr in attributes) element.setAttribute(attr, attributes[attr]);
  for (const event in eventListeners)
    element.addEventListener(event, eventListeners[event]);
  return element;
}

function onCallClick(event) {
  if(event.target.tagName==="I" && event.target.parentElement
  .classList.contains("button-call")){
    document.querySelector("#callPersonTitle").textContent = event.target.parentElement
    .dataset.name;
    document.querySelector("#callPersonBody").textContent = `Calling number ${event.target.parentElement
      .dataset.number}`;
  
  } else if(event.target.classList.contains("button-call")){
    document.querySelector("#callPersonTitle").textContent = event.target.dataset.name;
    document.querySelector("#callPersonBody").textContent = `Calling number ${event.target.dataset.number}`;
  }else{
    return;
  }
 
}

document.getElementById('search').addEventListener('keyup', searchHandler) 
async function searchHandler(e) {
  if(document.activeElement.id !== "search") return;
    const searchInput = document.activeElement;
    const query = searchInput.value;

    const persons = await filterLists(query.toLowerCase());
    renderPhoneBook(persons);
}

async function filterLists(query) {
  const persons = await getDataBase();
  const filteredPersons = [];
  for(const person of persons) {
      const name = person.name.toLowerCase();
      if(name.indexOf(query) !== -1){
        filteredPersons.push(person);
      } 
  }
  return filteredPersons;
}

function removeChildren(elem) {
  while(elem.firstElementChild) elem.removeChild(elem.firstElementChild)
}

// info
document.getElementById('info1').addEventListener('mouseover', mouseoverInfoHandler);
async function mouseoverInfoHandler(e) {
    const infoDiv = document.querySelector('.info-div');
    infoDiv.classList.remove("display-none");
    const left = e.pageX;
    const top = e.pageY;
    const divHeight = infoDiv.offsetHeight;
    infoDiv.style.left = left - 100 + "px";
    infoDiv.style.top = top - (divHeight / 2) - 40 + "px";
    e.target.addEventListener('mouseout', mouseoutInfoHandler);
}
function mouseoutInfoHandler(e) {
  const infoDiv = document.querySelector(".info-div");
  infoDiv.classList.add("display-none");
  e.target.removeEventListener('mouseout', mouseoutInfoHandler);
}
async function getPhoneBookInfo() {
  const response = await axios.get(`${baseUrl}info`);
  return response.data;
}