const astrosUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');

async function getJson(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    throw error;
  }
}

// Handle all fetch requests
async function getPeopleInSpace(url) {
  const peopleJson = await getJson(url);

  const profiles = peopleJson.people.map(async person => {
    const craft = person.craft;
    const profileJson = await getJson(wikiUrl + person.name);
    return {
      ...profileJson,
      craft
    }
  });

  return Promise.all(profiles);
}

// Generate the markup for each profile
function generateHTML(data) {
  data.map( person => {
    const section = document.createElement('section');
    peopleList.appendChild(section);
    const src = person.thumbnail ? person.thumbnail.source : 'img/profile.jpg';
    section.innerHTML = `
      <img src=${src}>
      <span>${person.craft}</span>
      <h2>${person.title}</h2>
      <p>${person.description}</p>
      <p>${person.extract}</p>
    `;
  });
}

btn.addEventListener('click', async (event) => {
  event.target.textContent = "Loading...";
  getPeopleInSpace(astrosUrl)
    .then(generateHTML)
    .catch(e => {
      peopleList.innerHTML = '<h3>Something went wrong!</h3>';
      console.error(e);
    })
    .finally(() => event.target.remove());
});