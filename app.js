//Event listener on remove button for each element
var removeElements = document.getElementsByClassName('container__elements__button');
  for (var i = 0; i < removeElements.length; i++) {
      var button = removeElements[i]
      button.addEventListener('click', removeElement)
  }

function removeElement(event){
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove();
}

//Event listener on add button for each container
var addElements = document.getElementsByClassName("container__add");
  for(var i=0;i<addElements.length;i++)
  {
    var button = addElements[i];
    button.addEventListener('click',addElement);
  }

//Function to add event listener on elements for drag
function addDragEventListener(element){

    element.addEventListener('dragstart',()=>{
        element.classList.add("drag-active");
    })

    element.addEventListener('dragend',()=>{
        element.classList.remove("drag-active");
    })

}

//Callback function to add elements onto the containers
function addElement(event){
    var buttonClicked = event.target;

    var containerElement = document.createElement('div');
    containerElement.classList.add('container__elements');
    containerElement.draggable='true';

    var containerContent = `
    <textarea class="container__elements__textbox"type="text" placeholder="Enter text here"></textarea>
    <button class="container__elements__button">X</button>
    `
    containerElement.innerHTML = containerContent;
    containerElement.getElementsByClassName("container__elements__button")[0].addEventListener('click',removeElement);
    addDragEventListener(containerElement);

    buttonClicked.parentElement.append(containerElement);
}

//Adding drag event listener on all container elements
var containerElementsAll = document.getElementsByClassName("container__elements");
  for(let i=0;i<containerElementsAll.length;i++)
  {
    addDragEventListener(containerElementsAll[i]);
  }

//Adding drag over listener on containers - to know when element is dragged over a container
var containerAll = document.getElementsByClassName("container");
 for(let i=0;i<containerAll.length;i++)
 {
  containerAll[i].addEventListener('dragover',event =>{

    //By default dropping an element is disabled and also when dropped cursor stays put
    event.preventDefault();
    
    //Function to get element after the cursor, when dragging elements
    const afterElement = getElementAfterCursor(containerAll[i], event.clientY)
    //Function to get the element being dragged 
    const dragActiveElement = document.getElementsByClassName("drag-active")[0];
    
    //If element after the dragged element is null, means dragging element is at the end of the list - hence, append()
    if (afterElement == null) {
        containerAll[i].append(dragActiveElement);
    }
    //after element not null, to insert drag element before the after element 
    else{
        containerAll[i].insertBefore(dragActiveElement, afterElement)
    }
  });
 }


function getElementAfterCursor(container, y) {

  const containerElements = [...container.querySelectorAll('.container__elements:not(.drag-active)')];
  // Destructuring to get result as an array, query selecting all elements in the container except the dragging element

  // .reduce() is used to return the element after the dragging eleemnt which is closest to it
  return containerElements.reduce((closest, child) => {
    //closest is the return value from reduce and child is each element in the containerEleemnts array, the callback function is applied on
    
    //Function gets the dimensions of the container element
    const box = child.getBoundingClientRect()

    //Difference between the cursorY point and the centre point of the container element
    const offset = y - box.top - box.height / 2

    //Retrun new offset value if it is closer to 0 than the previous offset value
    //More the offset closer to 0, offset between cursor & element is more less
    //-ve value offset is for elements after the drag element/cursor point
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child }
    } else {
      return closest
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element
  //Setting the initial value of offset to as max negative number possible, to keep the offset maximum
}