export async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrer: 'no-referrer',
    body: JSON.stringify(data),
  });

  return await response.text(); // parses JSON response into native JavaScript objects 
}

export async function getAuthenticatedData(url = '', bearer) {
  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bearer}`
    },
    redirect: 'follow',
    referrer: 'no-referrer'
  });

  return await response.text();
}

export async function postAuthenticatedData(url = '', data = {}, bearer) {
  const response = await fetch(url, {
    method: 'POST',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bearer}`
    },
    redirect: 'follow',
    referrer: 'no-referrer',
    body: JSON.stringify(data)
  });

  return await response.text();
}