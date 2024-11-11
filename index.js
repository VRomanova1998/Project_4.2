const input = document.querySelector('.input_search');
const searchResults = document.querySelector('.container');
const infoContainer = document.querySelector('.infoContainer');
const errorMessage = document.querySelector('.error_403');


const debounce = (fn, debounceTime) => {
  let timer;
  return function(){
    clearTimeout(timer);
   timer = setTimeout(()=>{
      fn();
    }, debounceTime)
  }
};

// Функция обработки результата запроса на сервер
async function getResponse(value) {
    const maxRequest = 5;
    let attempt = 0;

    while (attempt < maxRequest) {
        try {
          let response = await fetch(`https://api.github.com/search/repositories?q=${value}`, {
                  headers: {
                    'Authorization': 'token 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'
                }
                });
          if (response.ok) {
            errorMessage.textContent = '';
            return response;
          } else {
          errorMessage.textContent = 'Ошибка. Ждем перед повторной попыткой...';
          console.log('Ошибка. Ждем перед повторной попыткой...');
          await new Promise(resolve => setTimeout(resolve, 3000));
          }
        } catch(err){
          errorMessage.textContent = 'Ошибка. Ждем перед повторной попыткой...';
          console.error('Ошибка во время запроса:', error);
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
attempt++;
    }
}

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
async function queryResult(){
  try {
    let value = document.querySelector('.input_search').value;
      if (value == '' || value == ' ') {
        document.querySelectorAll('.search_result').forEach(element => {element.remove()});
        return;
      }
    let format = new RegExp(`^${value}`, 'i');
    let response = await getResponse(value);
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
      alert('количество запросов слишком большое');
    }

}

 // Обработка события "удалить информационный блок" 
  infoContainer.addEventListener('click', (e)=>{
    let tag = e.target;
    if (tag.tagName != 'BUTTON') {
        return
    }
     tag.parentElement.remove();
  }, true)

  input.addEventListener('keydown', debounce(queryResult, 900));
