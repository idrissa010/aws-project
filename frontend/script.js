// URLs des APIs (remplacez-les par celles de votre API Gateway)
const GET_CANDIDATES_URL = 'https://65xirkoute.execute-api.eu-west-3.amazonaws.com/prod/candidats';
const SUBMIT_VOTE_URL = 'https://65xirkoute.execute-api.eu-west-3.amazonaws.com/prod/votes';
const GET_RESULTS_URL = 'https://65xirkoute.execute-api.eu-west-3.amazonaws.com/prod/results';

// Récupérer les candidats et les afficher
async function loadCandidates() {
  try {
    const response = await fetch(GET_CANDIDATES_URL);
    const data = await response.json();  // La réponse est un objet avec 'statusCode' et 'body'

    // Nous extrayons le contenu de la clé "body" (qui est une chaîne JSON) et la convertissons en tableau
    const candidates = JSON.parse(data.body);

    const candidatesList = document.getElementById('candidates-list');

    candidatesList.innerHTML = ''; // Réinitialiser la liste
    candidates.forEach(candidate => {
      const div = document.createElement('div');
      div.className = 'candidate';

      // Vérification des noms des clés pour chaque candidat (par exemple "Name" ou "nom")
      const candidateName = candidate.Name;  // Utilisez "Name" ou "nom" en fonction de l'objet
      const candidateDescription = candidate.Description; // De même pour la description

      div.innerHTML = `
        <p><strong>${candidateName}</strong></p>
        <p>${candidateDescription}</p>
        <button onclick="voteForCandidate('${candidate.id_candidat}')">Voter</button>
      `;
      candidatesList.appendChild(div);
    });
  } catch (error) {
    console.error('Erreur lors du chargement des candidats:', error);
  }
}

// Envoyer un vote pour un candidat
async function voteForCandidate(idCandidat) {
    const payload = {
      id_candidat: idCandidat,
      timestamp: new Date().toISOString()
    };
  
    // Encapsuler le JSON dans une chaîne pour correspondre à l'attente de l'API
    const bodyPayload = JSON.stringify({ body: JSON.stringify(payload) });
  
    console.log('Payload envoyé :', bodyPayload); // Log pour vérifier la structure
  
    try {
      const response = await fetch(SUBMIT_VOTE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: bodyPayload
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Réponse de l\'API:', result);
        document.getElementById('result').textContent = 'Vote enregistré avec succès !';
      } else {
        const error = await response.json();
        console.error('Erreur API:', error);
        document.getElementById('result').textContent = `Erreur: ${error.message}`;
      }
    } catch (error) {
      console.error('Erreur lors de l’envoi du vote:', error);
      document.getElementById('result').textContent = 'Erreur lors de l’envoi du vote.';
    }
  }
  
// URL pour récupérer les résultats des votes


// Fonction pour charger et afficher les résultats des votes
async function loadResults() {
  try {
    const response = await fetch(GET_RESULTS_URL);
    const data = await response.json();  // La réponse est un objet avec 'statusCode' et 'body'

    // Si la réponse contient une clé "body", extrayez son contenu
    const results = Array.isArray(data) ? data : JSON.parse(data.body);

    const resultsDiv = document.getElementById('vote-results');
    resultsDiv.innerHTML = '<h2>Résultats des votes :</h2>';

    results.forEach(result => {
      const div = document.createElement('div');
      div.className = 'result';
      div.innerHTML = `
        <p>Candidat ID: ${result.id_candidat} - Votes: ${result.votes}</p>
      `;
      resultsDiv.appendChild(div);
    });
  } catch (error) {
    console.error('Erreur lors du chargement des résultats:', error);
    document.getElementById('vote-results').textContent = 'Erreur lors du chargement des résultats.';
  }
}

  
// Charger les candidats au démarrage
loadCandidates();