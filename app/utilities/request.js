export function get(url, cb) {
  let req = new XMLHttpRequest();
  req.onreadystatechange = function() { 
    if (req.readyState == 4) {
      if (req.status == 200) {
        cb(null, req.responseText);
      } else {
        cb(req.status, req.responseText);
      }
    }
  }
  req.open('GET', url, true);
  req.send(null);
}

export function jsonp(url, cb){
  let fnName = 'jsonp_'+Math.round(Date.now()+Math.random()*1000001)

  let script = document.createElement('script');
  script.src = url.replace(/=\?(?=&|$)/, '=' + fnName);

  window[fnName] = function(json){
    cb(json);
    document.head.removeChild(script);
    delete window[fnName];
  };

  document.head.appendChild(script);
}

export function post(url, data, cb) {
  let req = new XMLHttpRequest();
  let params = Object.keys(data).map(key => key + '=' + encodeURIComponent(data[key])).join('&');

  req.onreadystatechange = function() { 
    if (req.readyState == 4) {
      if (req.status == 200) {
        cb(null, req.responseText);
      } else {
        cb(req.status, req.responseText);
      }
    }
  }

  req.open('POST', url, true);

  req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  req.setRequestHeader('Content-Length', params.length);

  req.send(params);
}