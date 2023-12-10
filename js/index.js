/*///////////////////////////////////////////////////////////////////////
                     LES VARIABLES DU QUIZ
///////////////////////////////////////////////////////////////////////*/

/*************************
resultat du quiz
**************************/ 
let sectionResultat;
// Nombre de bonnes réponses 
let nombreBonnesReponses = 0;

/*************************
Barre d'avancement du quiz
**************************/ 
let laBarre = document.querySelector(".avancement");
// Largeur de la barre à tout moment
let largeurBarre = 0;
// la progression dans les questions et le nombre total de questions)
let progressionBarre = 0;

/*************************
afffichage du quiz
**************************/ 
// Zone d'affichage du quiz
let zoneQuiz = document.querySelector(".quiz");
// Section contenant une question du quiz
let sectionQuestion = document.querySelector("section");
//sa position sur l'axe des Y
let positionY = 100;

// Conteneurs des titres, des drapeaux, des questions et des choix de réponse
let titreQuestion = document.querySelector(".question");
let drapeauQuestion = document.querySelector(".drapeau");
let lesChoixDeReponses = document.querySelector(".les-choix-de-reponse");

// Numéro de la question courante
let noQuestion = 0; 

/*********************************
afffichage animation titre intro
*********************************/ 
let titreIntro = document.querySelector(".anim-titre-intro");

/*************************
afffichage du fin du quiz
**************************/ 
// Zone de fin du quiz
let zoneFin = document.querySelector(".fin");
// Bouton servant à recommencer le quiz
let btnRecommencer = document.querySelector('main.fin .btn-recommencer');




/*///////////////////////////////////////////////////////////////////////
                            ÉVÉNEMENTS
///////////////////////////////////////////////////////////////////////*/
// Gérer la fin de l'animation d'intro
titreIntro.addEventListener("animationend", afficherConsigneDebutDuJeu);

// Gestion du bouton de redémarrage du quiz quand le quiz fini
btnRecommencer.addEventListener('click', recommencer);

/*///////////////////////////////////////////////////////////////////////
                            LES FONCTIONS
///////////////////////////////////////////////////////////////////////*/

/**
 * Afficher les consignes pour débuter le jeu
 * 
 * @param {Event} event : objet AnimationEvent de l'événement distribué 
 */
function afficherConsigneDebutDuJeu(event) {
    //On affiche la consigne si c'est la fin de l'animation: ombre-titre
    if (event.animationName == "ombre-titre") {
        //On affiche un message dans le pied de page
        let piedDePage = document.querySelector("footer");
        piedDePage.innerHTML = "<h1>Cliquer sur l'écran pour commencer un quiz sur les drapeau!</h1>";

        //enlever le flou du pied page
        piedDePage.style.filter= "blur(0)";
        //remettre l'opacite a 1
        piedDePage.style.opacity= "1";

        //On met un écouteur sur la fenêtre pour enlever l'intro et commencer le quiz
        window.addEventListener("click", debuterLeQuiz);
    }
}

/**
 * Enlever les éléments de l'intro 
 * débuter le quiz
 * 
 */
function debuterLeQuiz() {
    //on selection l'element avec l'intro
    let intro = document.querySelector("main.intro");
    //On enlève le conteneur de l'intro
    intro.parentNode.removeChild(intro);

    //On enlève l'écouteur qui gère le début du quiz
    window.removeEventListener("click", debuterLeQuiz);

    //On met le conteneur du quiz visible
    zoneQuiz.style.display = "flex";

    //On affiche la première question
    afficherQuestion();
}


/**
 * Afficher la question courante
 * 
 */
function afficherQuestion() {
    // récupérer l'objet de la question en cours dans le tableau des questions
    let objetQuestion = lesQuestions[noQuestion];
    
    // affecter le texte dans le titre de la question
    titreQuestion.innerText = objetQuestion.titre;

    // afficher les balises des choix de réponse
    lesChoixDeReponses.innerHTML = "";

    //afficher les drapeaux
    drapeauQuestion.innerHTML = `<img src= ${objetQuestion.image}>`;

    let unChoix;
    for (let i = 0; i < objetQuestion.choix.length; i++) {
		//On crée la balise et on y affecte une classe CSS
        unChoix = document.createElement("div");
        unChoix.classList.add("choix");
        //On intègre la valeur du choix de réponse
        unChoix.innerText = objetQuestion.choix[i];

        //On affecte dynamiquement l'index de chaque choix
        unChoix.indexChoix = i;

        //On met un écouteur pour vérifier la réponse choisie
        unChoix.addEventListener("mousedown", verifierReponse);

        //Enfin on affiche ce choix
        lesChoixDeReponses.appendChild(unChoix);
    }

    // Modifier la valeur de la position de la section sur l'axe des Y
    // pour son animation
    positionY = 100;

    //Partir la première requête pour l'animation de la section
    requestAnimationFrame(animerSection);

    // Fixer la largeur cible de la barre d'avancement (en proportion du nombre
    // de questions disponibles, et du numéro de la question à venir)
    progressionBarre = (noQuestion + 1) / lesQuestions.length * 100;

    //démarrer l'animation de la  barre d'avancement
    requestAnimationFrame(animerlaBarre);
        
}

/**
 * Animer la barre d'avancement
 */
 function animerlaBarre() {
    // Modifier la largeur de la barre d'avancement en l'augmentant de 1vw à 
    // chaque appel de cette fonction 
    largeurBarre++;
    laBarre.style.width = largeurBarre +"vw";

    // Si la largeur cible n'est pas encore atteinte
    if(progressionBarre>largeurBarre){
        // faire une autre requête d'animation 
        requestAnimationFrame(animerlaBarre);
    }
    
}


/**
 * Animer l'arrivée de la section contenant la question
 */
function animerSection() {
    //On décrémente la position de 2 (vw)
    positionY -= 2;
    sectionQuestion.style.transform = `translateY(${positionY}vw)`;

    //si la position n'est pas atteinte
    if (positionY > 0) {
        //On part une autre requête d'animation 
        requestAnimationFrame(animerSection);
    }
}

/**
 * Vérifier la réponse cliquée et gerer le passage à la prochaine question.
 * 
 * @param {object} event Informations sur l'événement MouseEvent distribué
 */
function verifierReponse(event) {
    lesChoixDeReponses.classList.toggle('desactiver');

    // Capturer la bonne réponse
    let laBonneReponse = lesQuestions[noQuestion].bonneReponse
    // Capturer la réponse choisie
    reponseChoisie = event.target.indexChoix;

    // Si la bonne reponse est choisie
    if (laBonneReponse == reponseChoisie) {
        // Incrémenter le nombre de bonnes réponses
        nombreBonnesReponses++;
        // Lui associer la classe css d'une bonnes réponse
        event.target.classList.add("reponse-succes");
    }
    // Sinon
    else{
        // Lui associer la classe css d'une mauvaise réponse
        event.target.classList.add("reponse-echec");
    }

    // passer la prochaine question lorsque l'animation de la réponse cliquée 
    // est terminée
    event.target.addEventListener("animationend", gererProchaineQuestion);

}

/**
 * Fonction permettant de gérer l'affichage de la prochaine question
 * 
 */
function gererProchaineQuestion(event) {
    // On réactive les clics sur les choix de réponse
    lesChoixDeReponses.classList.toggle('desactiver');

    // On incrémente noQuestion pour la  prochaine question à afficher
    noQuestion++;

    //S'il reste une question on l'affiche
    if (noQuestion < lesQuestions.length) {
        afficherQuestion();
    //sinon c'est la fin du quiz
    } else {
        afficherFinQuiz();
    }
}

/**
 *Fonction pour afficher l'interface de la fin du quiz
 * 
 */
function afficherFinQuiz() {
    let meilleurScore = localStorage.getItem("meilleurScoreJeu") || nombreBonnesReponses;
    // Retirer la zone du quiz de l'affichage
    zoneQuiz.style.display = "none";

    // Créer la section qui contiendra le résultat
    sectionResultat = document.createElement('section');

    // Ajoutez dans la section du resultat le texte correspondant au score obtenu, 
    sectionResultat.innerText= "Votre score : "+ nombreBonnesReponses + "/8"+
    "\n Votre meilleur score : "+ meilleurScore + "/8";

    // associer la classe CSS résultat, pour le format et l'animation adéquat
    sectionResultat.classList.add("resultat");

    // insérer la section resultat et record à l'emplacement adéquat dans
    //la zone de la fin
    zoneFin.appendChild(sectionResultat);

    // Remettre dans l'affichage la zone de "fin du quiz"
    zoneFin.style.display = "flex";

    // Le bouton "recommencer" est affiché à la fin de l'animation du résultat du quiz
    sectionResultat.addEventListener('animationend', afficherBtnRecommencerModiferLaFin);

    //Enregistrement du meilleur score
    meilleurScore = Math.max(meilleurScore, nombreBonnesReponses);
    localStorage.setItem("meilleurScoreJeu", meilleurScore);
}

/**
 * Afficher le bouton recommencer
 */
function afficherBtnRecommencerModiferLaFin() {
    // mettre l'opacité du bouton "recommencer" à 1
    btnRecommencer.style.opacity = '1';

    // changer la couleur de l'arriere plan et enlever le flou
    zoneFin.style.backgroundColor = "#004a32";
    zoneFin.style.filter = "blur(0)";
}



/**
 * Redémarrer le quiz (sans l'intro) en réinitialisant l'état 
 * du quiz.
 */
 function recommencer() {
    // Remettre les variables numériques du quiz à leurs valeurs initiales
    nombreBonnesReponses= 0;
    largeurBarre = 0;
    largeurCibleBarre = 0;
    positionY = 100;
    noQuestion = 0; 
    // Retirer du DOM la section contenant le résultat 
    sectionResultat.remove();
    // Remettre l'opacité du bouton "recommencer" à 0
    btnRecommencer.style.opacity = '0';
    // On réaffiche le conteneur de la zone du quiz
    zoneQuiz.style.display = "flex";
    // Et on retire la zone de "fin du quiz" de l'affichage
    zoneFin.style.display = "none";
    // Finalement, on peut afficher la première question
    afficherQuestion();
}
