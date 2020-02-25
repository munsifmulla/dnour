
var variables = {
  APP_PATH: document.querySelector('.app-path').value,
  API_BASE: document.querySelector('.project-path').value
};

var urls = {
  list: variables.API_BASE + 'api/list-log',
  search: variables.API_BASE + 'api/find-log',
  create: variables.API_BASE + 'api/create-log',
  registerUser: variables.API_BASE + 'api-user/register',
  loginUser: variables.API_BASE + 'api-user/login',
  collection: {
    create: variables.API_BASE + 'api/collection/add',
  }
};

var fn = {
  //valiating forms
  validateForm: (form) => {
    const voidTypes = ['button', 'submit'];
    const error = document.createElement('span', { class: 'error' });
    let valid = false;
    let regexer = {
      email: /\S+@\S+\.\S+/
    }

    for (var i = 0; i < form.length; i++) {
      if (!voidTypes.includes(form[i].type)) {
        let validations = JSON.parse(form[i].dataset.validations);
        let errors = JSON.parse(form[i].dataset.errors);
        let addError = (elem, errorMsg) => {
          let errorText = document.createTextNode(errorMsg);
          error.appendChild(errorText);
          (elem.nextSibling === null) ? elem.parentElement.appendChild(error) : elem.nextSibling.innerHTML = errorMsg;
          elem.parentElement.classList.add("error");
        }
        let regex = new RegExp(validations.regex);
        if (validations && validations.required) {
          if (form[i].value === "") { //Check for null value
            addError(form[i], errors.required);
            valid = false;
            return false;
          } else if (validations.regex && !regexer[validations.regex].test(form[i].value)) { //Check for valid email id
            addError(form[i], errors.regex);
            valid = false;
            return false;
          } else {
            form[i].parentElement.classList.remove("error");
            valid = true;
          }
        }
      }
    }

    return valid;
  },

  //Getting form data
  serializeForm: (form, code) => {
    let formObj = {};
    let voidTypes = ['button', 'submit']
    for (var i = 0; i < form.length; i++) {
      if (form[i].name !== "" && !voidTypes.includes(form[i].type)) {
        formObj[form[i].name] = form[i].value;
      }
      if (code) {
        formObj.code = code;
      }
    }
    return formObj;
  },

  //Get and Post methods
  get: (url, useAccessToken) => {
    var accessToken = localStorage.getItem("access-token");
    return fetch(url, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        'Access-token': useAccessToken ? accessToken : '',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // no-referrer, *client
    })
      .then(response => response.json())
  },

  post: (url, body, useAccessToken) => {
    var accessToken = localStorage.getItem("access-token");
    return fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        'Access-token': useAccessToken ? accessToken : '',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(body), // body data type must match "Content-Type" header
    })
      .then(response => response.json())
  },
  //Get and Post methods

  //Notifications
  notification: (type, title, message, time) => {
    var notif = document.querySelector('.notification');
    notif.setAttribute("class", "notification");

    notif.innerHTML = "";
    var heading_elem = document.createElement("h4");
    var message_elem = document.createElement("p");
    var heading_content = document.createTextNode(title);
    var message_content = document.createTextNode(message);
    heading_elem.appendChild(heading_content);
    message_elem.appendChild(message_content);

    notif.appendChild(heading_elem);
    notif.appendChild(message_elem);

    notif.classList.add(type);

    notif.addEventListener('click', (e) => {
      e.currentTarget.setAttribute("class", "notification");
    });

    setTimeout(() => {
      notif.setAttribute("class", "notification");
    }, time);

  },

  //API Functions
  searchLogs: () => {
    var elem = document.querySelector('.search-challenge');
    var list = document.querySelector('.challenge-list-container');
    elem.addEventListener('keyup', (e) => {
      fn.post(urls.search, { name: e.target.value }, true)
        .then((response) => {
          list.innerHTML = '';
          response.data.map(item => {
            let listItem = document.createElement('LI');
            let anchor = document.createElement('A');
            let listContent = document.createTextNode(item.name);
            anchor.setAttribute('href', `/log/${ item._id }`)
            anchor.appendChild(listContent);
            listItem.appendChild(anchor);
            list.append(listItem);
          })
        });
    })
  },

  getLogs: () => {
    var list = document.querySelector('.challenge-list-container');
    fn.get(urls.list, 'GET', {}, true)
      .then((response) => {
        if (response.status === 200) {
          list.innerHTML = '';
          response.data.map(item => {
            let listItem = document.createElement('LI');
            let anc = document.createElement('A');
            let listContent = document.createTextNode(item.name);
            anc.setAttribute('href', `/log/${ item._id }`)
            anc.appendChild(listContent);
            listItem.appendChild(anc);
            list.append(listItem);
          })
        } else {
          alert(response.message);
          window.location.href = "/logout";
        }
      });
  }
}

// fn.getPost(fn.urls.list, 'GET', {});
// fn.searchLogs();