const input = document.querySelector('.input_search');
const searchResults = document.querySelector('.container');
const infoContainer = document.querySelector('.infoContainer');

// Создание блока с информацией по выбранному репозиторию
function createInfoBlock (e){
  document.querySelectorAll('.search_result').forEach(element => element.remove());
  document.querySelector('.input_search').value = '';
  let infoBlock = document.createElement('div');
  infoBlock.classList.add('info');
  infoBlock.innerText = `Name: ${e.target.dataset.name}
                  Owner: ${e.target.dataset.owner}
                  Stars: ${e.target.dataset.stars}`;
  infoBlock.insertAdjacentHTML('beforeend', '<button class="buttonClose"></button>');
  infoContainer.appendChild(infoBlock);
}

// Функция отправки и обработки запроса на сервер
function queryResult(){
setTimeout(async()=>{
  try {
    let value = document.querySelector('.input_search').value;
      if (value == '' || value == ' ') {
        document.querySelectorAll('.search_result').forEach(element => {element.remove()});
        return;
      }
    let format = new RegExp(`^${value}`, 'i');
    let response = await fetch(`https://api.github.com/search/repositories?q=${value}`);
    document.querySelectorAll('.search_result').forEach(element => {element.remove()});
    let json = await response.json();
    let count = 0;
      for (let i = 0; i < json.items.length; i++) {
        if (json.items[i].name.match(format) && count < 5) {
          count++;
          let partSearchResult = document.createElement('li');
          partSearchResult.classList.add('search_result');
          partSearchResult.textContent = json.items[i].name;
          partSearchResult.dataset.name = json.items[i].name;
          partSearchResult.dataset.owner = json.items[i].owner.login;
          partSearchResult.dataset.stars = json.items[i].stargazers_count;
          searchResults.appendChild(partSearchResult);
          
          partSearchResult.addEventListener('click', createInfoBlock);   
        } 
      } 
    } catch(error) {
      console.log(`${error.name}: ${error.message}`);
    }
}, 400)
}

 // Обработка события "удалить информационный блок" 
  infoContainer.addEventListener('click', (e)=>{
    let tag = e.target;
    if (tag.tagName != 'BUTTON') {
        return
    }
     tag.parentElement.remove();
  }, true)

  input.addEventListener('keydown', queryResult);

